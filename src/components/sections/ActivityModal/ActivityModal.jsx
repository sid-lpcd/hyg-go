import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { v4 as uuidv4 } from "uuid";
import StarIcon from "../../../assets/icons/star-icon.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half-icon.svg?react";
import FullStarIcon from "../../../assets/icons/star-full-icon.svg?react";
import { getAttractionById } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";
import { PeopleControl } from "../../base/PeopleDropdown/PeopleDropdown";
import { getNumbers } from "../../../utils/generalHelpers";
import MapGL from "../../base/MapGL/MapGL";
import { getBasket } from "../../../utils/localStorageHelper";
import "swiper/css";
import "swiper/css/pagination";
import "./ActivityModal.scss";
import { useLocation, useNavigate } from "react-router-dom";

const ActivityModal = ({
  activityId,
  planInfo,
  basketState,
  setBasketState,
  onClose,
  showMap,
}) => {
  const navigate = useNavigate();

  const location = useLocation();
  const locationId = location.pathname.split("/")[2];

  const [activity, setActivity] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [labels, setLabels] = useState([]);
  const [ticketPrices, setTicketPrices] = useState({});
  const [inBasket, setInBasket] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
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
    let tempLabels = [];
    let tempPrices = {};
    let count = {
      people: {},
    };

    for (let price in prices) {
      tempLabels.push(price);
      try {
        tempPrices[price] = getNumbers(prices[price], 0);
      } catch (error) {
        tempPrices[price] = 0;
      }
      const tickets = planInfo.people.hasOwnProperty(price)
        ? planInfo.people[price]
        : 0;
      count.people[price] = tickets;
    }

    setTicketPrices(tempPrices);
    setLabels(tempLabels);
    setTicketCount(count);
  };

  const calcPrice = () => {
    let sumPrice = 0;

    if (!activity?.prices) return;

    for (let price in activity.prices) {
      try {
        sumPrice +=
          getNumbers(activity.prices[price], 0) * ticketCount.people[price];
      } catch (error) {
        sumPrice += 0 * ticketCount.people[price];
      }
    }

    setTotalPrice(sumPrice);
  };
  const activityRender = async () => {
    if (!activityId) return;

    try {
      const response = await getAttractionById(activityId);
      setActivity({ ...response, images: response.images.slice(1, 5) });

      if (!response?.prices) {
        setTicketCount(1);
      } else {
        initialRender(response.prices);
      }
      checkBasket(response);
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

  const handleAddToBasket = () => {
    const basket = getBasket();

    const existingActivity = basket?.activities?.find(
      (item) => item.activity_id === activity.activity_id
    );
    if (existingActivity) {
      existingActivity.ticketCount = ticketCount;
      existingActivity.totalPrice = totalPrice;
      setBasketState(basket);
      setIsUpdated(true);

      setTimeout(() => {
        setIsUpdated(false);
      }, 5000);
      return;
    }

    basket.activities.push({
      ...activity,
      ticketCount,
      totalPrice,
    });

    setBasketState(basket);
    onClose();
  };

  const handleRemoveFromBasket = () => {
    const basket = getBasket();
    basket.activities = basket.activities.filter(
      (item) => item.activity_id !== activity.activity_id
    );
    setBasketState(basket);
  };

  const checkBasket = (activity) => {
    if (basketState) {
      const existingActivity = basketState.activities.find(
        (item) => item.activity_id === activity.activity_id
      );
      if (existingActivity) {
        setTicketCount(existingActivity.ticketCount);
        setTotalPrice(existingActivity.totalPrice);
        setInBasket(true);
      } else {
        setInBasket(false);
      }
    }
  };

  useEffect(() => {
    if (!activity) return;
    checkBasket(activity);
  }, [basketState]);

  useEffect(() => {
    activityRender();
  }, [activityId]);

  useEffect(() => {
    calcPrice(activity?.prices);
  }, [ticketCount]);

  if (!activity || !basketState) {
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

      {activity?.latitude && activity?.longitude && showMap && (
        <div
          className="activity__map"
          onClick={() => {
            onClose();
            navigate(`/create-plan/${locationId}/map?activity=${activityId}`);
          }}
        >
          <MapGL
            initialLocation={[activity?.longitude, activity?.latitude]}
            isResetVisible={true}
            markersList={[activity]}
            isMoveable={false}
          />
        </div>
      )}

      <div
        className={`activity__content${
          !activity?.prices ? " activity__content--hidden" : ""
        }`}
      >
        {activity?.prices && (
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
        {inBasket ? (
          <>
            {isUpdated && (
              <p className="activity__updated">
                Activity was updated successfully
              </p>
            )}
            <div className="activity__in-basket">
              <button
                className="activity__remove-btn"
                onClick={() => handleRemoveFromBasket()}
              >
                Remove
              </button>
              <button
                className="activity__add-btn"
                onClick={() => handleAddToBasket()}
              >
                Update Basket
              </button>
            </div>
          </>
        ) : (
          <button
            className="activity__add-btn"
            onClick={() => handleAddToBasket()}
          >
            Add to Trip
          </button>
        )}
      </div>
    </>
  );
};

export default ActivityModal;
