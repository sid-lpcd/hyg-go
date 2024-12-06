import { useEffect, useState } from "react";
import { getBasket } from "../../../utils/localStorageHelper";
import { getNumbers } from "../../../utils/generalHelpers";
import { v4 as uuidv4 } from "uuid";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import CheckIcon from "../../../assets/icons/check-icon.svg?react";
import StarIcon from "../../../assets/icons/star-icon.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half-icon.svg?react";
import FullStarIcon from "../../../assets/icons/star-full-icon.svg?react";
import "./ActivityCard.scss";

const ActivityCard = ({
  activity,
  openActivity,
  basketState,
  setBasketState,
  cartPage = false,
  openDeleteModal,
}) => {
  const [inBasket, setInBasket] = useState(false);
  function roundHalf(num) {
    return Math.round(num * 2) / 2;
  }
  const renderStars = (rating, maxRating = 5) => {
    const stars = [];
    const roundRating = roundHalf(parseFloat(rating));
    for (let i = 0; i < maxRating; i++) {
      if (i + 0.5 === roundRating) {
        stars.push(
          <div key={uuidv4()}>
            <HalfStarIcon className="activity-card__star-icon" />
          </div>
        );
      } else if (i < roundRating) {
        stars.push(
          <div key={uuidv4()}>
            <FullStarIcon className="activity-card__star-icon activity-card__star-icon--full" />
          </div>
        );
      } else {
        stars.push(
          <div key={uuidv4()}>
            <StarIcon className="activity-card__star-icon activity-card__star-icon--empty" />
          </div>
        );
      }
    }
    return stars;
  };

  const handleRemoveFromBasket = (e, check = false) => {
    e.stopPropagation();
    if (!check) {
      const basket = getBasket();
      basket.activities = basket.activities.filter(
        (item) => item.activity_id !== activity.activity_id
      );
      setBasketState(basket);
    } else {
      console.log("check");
      openDeleteModal(activity);
    }
  };

  const checkBasket = (activity) => {
    if (
      basketState.activities.find(
        (item) => item.activity_id === activity.activity_id
      )
    ) {
      setInBasket(true);
    } else {
      setInBasket(false);
    }
  };

  const getDuration = (activity) => {
    try {
      return getNumbers(activity, 0) + " - " + getNumbers(activity, 1) + " hrs";
    } catch (error) {
      return "Free";
    }
  };

  const getPrice = (activity) => {
    try {
      return "£" + getNumbers(activity, 0) + " - £" + getNumbers(activity, 1);
    } catch (error) {
      return "Free";
    }
  };

  useEffect(() => {
    if (!basketState) return;
    checkBasket(activity);
  }, [basketState]);

  if (!activity) {
    return;
  }

  if (cartPage) {
    return (
      <article
        className="activity-card activity-card--cart"
        onClick={openActivity}
      >
        <img
          src={activity.image_url}
          alt={activity.title}
          className="activity-card__image activity-card__image--cart"
        />
        <div className="activity-card__content activity-card__content--cart">
          <div className="activity-card__box activity-card__box--cart">
            <h3 className="activity-card__title activity-card__title--cart">
              {activity.name?.split("(")[0]}
            </h3>

            {activity?.totalPrice !== 0 && (
              <p className="activity-card__tickets">
                {Object.keys(activity.ticketCount.people).reduce(
                  (acc, value) => acc + activity.ticketCount.people[value],
                  0
                )}{" "}
                tickets
              </p>
            )}
            <p className="activity-card__price-value activity-card__price-value--cart">
              £ {activity?.totalPrice === 0 ? "-" : activity?.totalPrice}
            </p>
          </div>
          <div
            className="activity-card__remove"
            onClick={(e) => handleRemoveFromBasket(e, true)}
          >
            <CloseIcon className="activity-card__remove-icon" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="activity-card" onClick={() => openActivity(activity)}>
      <img
        src={activity.image_url}
        alt={activity.title}
        className="activity-card__image"
      />
      <div className="activity-card__content">
        {inBasket && <CheckIcon className="activity-card__check-icon" />}
        <h3 className="activity-card__title">{activity.name?.split("(")[0]}</h3>
        <p className="activity-card__description">
          {activity.description?.length
            ? activity.description.length > 60
              ? activity.description.substring(0, 60) + "..."
              : activity.description
            : "No description available"}
        </p>
        {/* Add category icon here? */}
        <div className="activity-card__tags">{activity.tags}</div>
        <div className="activity-card__reviews">
          <div className="activity-card__stars">
            {renderStars(activity.reviews_average_rating)}
          </div>
          <p className="activity-card__reviews-count">
            {activity.reviews_total_count}
          </p>
        </div>
        {activity.duration && (
          <p className="activity-card__duration">
            {getDuration(activity.duration)}
          </p>
        )}
        <span className="activity-card__price-value">
          {activity.prices?.adult ? getPrice(activity.prices.adult) : "Free"}
        </span>
        {inBasket ? (
          <button
            className="activity-card__add-btn activity-card__add-btn--remove"
            onClick={(e) => handleRemoveFromBasket(e, false)}
          >
            Remove
          </button>
        ) : (
          <button
            className="activity-card__add-btn"
            onClick={() => openActivity(activity)}
          >
            Add to basket
          </button>
        )}
      </div>
    </article>
  );
};

export default ActivityCard;
