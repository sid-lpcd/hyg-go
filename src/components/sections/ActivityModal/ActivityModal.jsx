import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { v4 as uuidv4 } from "uuid";
import StarIcon from "../../../assets/icons/star-icon.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half-icon.svg?react";
import FullStarIcon from "../../../assets/icons/star-full-icon.svg?react";
import "swiper/css";
import "swiper/css/pagination";
import "./ActivityModal.scss";
import { getAttractionById } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";
import { PeopleControl } from "../../base/PeopleDropdown/PeopleDropdown";
import { getNumbers } from "../../../utils/generalHelpers";
import { se } from "react-day-picker/locale";

const ActivityModal = ({ activityId, planInfo }) => {
  const [activity, setActivity] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [labels, setLabels] = useState([]);
  const [ticketPrices, setTicketPrices] = useState({});

  function roundHalf(num) {
    return Math.round(num * 2) / 2;
  }
  const renderStars = (rating, maxRating = 5) => {
    const stars = [];
    const roundRating = roundHalf(parseFloat(rating));
    for (let i = 0; i < maxRating; i++) {
      if (i < roundRating) {
        stars.push(
          <div key={i}>
            <FullStarIcon className="activity__star-icon activity__star-icon--full" />
          </div>
        );
      } else if (i + 0.5 === roundRating) {
        stars.push(
          <div key={i}>
            <HalfStarIcon className="activity__star-icon" />
          </div>
        );
      } else {
        stars.push(
          <div key={i}>
            <StarIcon className="activity__star-icon" />
          </div>
        );
      }
    }
    return stars;
  };

  const initialRender = (prices) => {
    // let sumPrice = 0;
    let tempLabels = [];
    let tempPrices = {};
    let count = {
      people: {},
    };

    for (let price in prices) {
      tempLabels.push(price);
      tempPrices[price] = getNumbers(prices[price], 0);
      const tickets = planInfo.people.hasOwnProperty(price)
        ? planInfo.people[price]
        : 0;
      count.people[price] = tickets;
      // sumPrice += getNumbers(prices[price], 0) * tickets;
    }

    setTicketPrices(tempPrices);
    setLabels(tempLabels);
    setTicketCount(count);
    // setTotalPrice(sumPrice);
  };

  const calcPrice = () => {
    let sumPrice = 0;

    if (!activity?.prices) return;

    for (let price in activity.prices) {
      sumPrice +=
        getNumbers(activity.prices[price], 0) * ticketCount.people[price];
    }

    setTotalPrice(sumPrice);
  };
  const activityRender = async () => {
    if (!activityId) return;

    try {
      const response = await getAttractionById(activityId);
      setActivity({ ...response, images: response.images.slice(1, 5) });

      if (response?.freeAttraction) {
        setTicketCount(1);
        // setTotalPrice(0);
      } else {
        initialRender(response.prices);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeTicket = (label, val) => {
    setTicketCount({
      ...ticketCount,
      people: {
        ...ticketCount.people,
        [label]: ticketCount.people[label] + val,
      },
    });
  };

  const handleAddToBasket = () => {};

  useEffect(() => {
    activityRender();
  }, [activityId]);

  useEffect(() => {
    calcPrice(activity?.prices);
  }, [ticketCount]);

  if (!activity) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#1e6655"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  return (
    <>
      <article className="activity__header">
        <h2 className="activity__title">{activity.name}</h2>
        <a
          href={activity.attractionUrl}
          className="activity__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Official Page
        </a>
      </article>

      <article className="activity__images">
        <Swiper slidesPerView={1} pagination={true} modules={[Pagination]}>
          {activity.images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image.url}
                alt={`${activity.name} image`}
                className="activity__image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </article>

      <article className="activity__details">
        <h2 className="activity__subtitle">Details</h2>
        {activity.freeAttraction && (
          <p className="activity__info">
            <strong>Free</strong>
          </p>
        )}
        <p className="activity__info">Reviews</p>
        <div className="activity__reviews">
          <div className="activity-card__stars">
            {renderStars(activity?.reviews_average_rating)}
          </div>
          <p className="activity__reviews-count">
            {activity?.reviews_total_count}
          </p>
        </div>
        <p className="activity__info"> Expected Duration </p>
        {activity.duration && (
          <p className="activity__duration">
            {activity.duration
              ?.match(/\d+\.?\d*/g)
              .map(Number)
              .map(Math.floor)[0] +
              " - " +
              activity.duration
                ?.match(/\d+\.?\d*/g)
                .map(Number)
                .map(Math.floor)[1] +
              " hrs"}
          </p>
        )}
        {activity.openingHours && (
          <p className="activity__info">
            <strong>Opening Hours:</strong> {activity?.openingHours}
          </p>
        )}
        <p className="activity__info">
          <strong>Address:</strong>
          {activity.address?.street && `${activity?.address?.street}, `}
          {activity?.address?.city && `${activity?.address?.city}, `}
          {activity?.address?.state && `${activity?.address?.state}, `}
          {activity?.address?.postcode && activity?.address?.postcode}
        </p>
      </article>

      <article className="activity__content">
        <h2 className="activity__subtitle">Introduction</h2>
        <p>{activity?.viatorUniqueContent?.introduction}</p>
        <h3 className="activity__section-title">Overview</h3>
        {activity?.viatorUniqueContent?.overview?.sections?.map(
          (section, index) => (
            <div key={index} className="activity__overview">
              <h4>{section.title}</h4>
              <p>{section.text}</p>
            </div>
          )
        )}
      </article>

      <div className="activity__content"></div>

      <div className="activity__content">
        {!activity.freeAttraction && (
          <div className="activity__basket">
            <h3 className="activity__subtitle">Tickets</h3>
            <div className="activity__ticket-count">
              {labels.map((label) => (
                <PeopleControl
                  key={uuidv4()}
                  label={`${label} Tickets (£${ticketPrices[label]})`}
                  count={ticketCount.people[label]}
                  onChange={(val) => handleChangeTicket(label, val)}
                  min={label === "adult" ? 1 : 0}
                />
              ))}
            </div>
            <p className="activity__total-price">
              Total Price: £{totalPrice.toFixed(2)}
            </p>
          </div>
        )}
        <button
          className="activity__add-btn"
          onClick={() => handleAddToBasket()}
        >
          Add to Trip
        </button>
      </div>
    </>
  );
};

export default ActivityModal;
