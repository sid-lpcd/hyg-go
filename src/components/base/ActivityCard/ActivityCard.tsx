import { useEffect, useState, MouseEvent } from "react";
import { getNumbers } from "../../../utils/generalHelpers";
import { v4 as uuidv4 } from "uuid";
import { useBasket } from "../../../context/BasketContext";
import { Activity, Price } from "../../../types/common/activity";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import CheckIcon from "../../../assets/icons/check-icon.svg?react";
import StarIcon from "../../../assets/icons/star-icon.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half-icon.svg?react";
import FullStarIcon from "../../../assets/icons/star-full-icon.svg?react";
import "./ActivityCard.scss";
import { PlanActivityWithDetails } from "../../../types/common/plan";

interface ActivityCardProps {
  activity: Activity | PlanActivityWithDetails;
  openActivity: (activity?: Activity | PlanActivityWithDetails) => void;
  cartPage?: boolean;
  openDeleteModal?: (activity: Activity | PlanActivityWithDetails) => void;
}

const ActivityCard = ({
  activity,
  openActivity,
  cartPage = false,
  openDeleteModal,
}: ActivityCardProps): JSX.Element | null => {
  const { basketState, removeActivity, hasActivity } = useBasket();
  const [inBasket, setInBasket] = useState<boolean>(false);

  function roundHalf(num: number): number {
    return Math.round(num * 2) / 2;
  }

  const renderStars = (rating: number | undefined, maxRating: number = 5): JSX.Element[] => {
    if (!rating) return [];
    const stars: JSX.Element[] = [];
    const roundRating = roundHalf(rating);
    
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

  const handleRemoveFromBasket = (confirmDeletion: boolean = false): void => {
    if (!confirmDeletion) {
      removeActivity(activity.activityId);
    } else {
      openDeleteModal?.(activity);
    }
  };

  const checkBasket = (activity: Activity): void => {
    setInBasket(hasActivity(activity.activityId));
  };

  const getDuration = (duration: number | undefined): string => {
    if (!duration) return "Duration not available";
    return `~${duration} hr(s)`;
  };

  const getPrice = (price: Price | undefined): string => {
    if (!price) return "Free";
    return `${price.minPrice} - ${price.maxPrice} ${price.currencyCode}`;
  };

  useEffect(() => {
    if (!basketState) return;
    checkBasket(activity);
  }, [basketState, activity]);

  if (!activity) {
    return null;
  }

  if (cartPage) {
    const planActivity = activity as PlanActivityWithDetails;
    return (
      <article
        className="activity-card activity-card--cart"
        onClick={() => openActivity(activity)}
      >
        <img
          src={planActivity.imageUrl}
          alt={planActivity.name}
          className="activity-card__image activity-card__image--cart"
        />
        <div className="activity-card__content activity-card__content--cart">
          <div className="activity-card__box activity-card__box--cart">
            <h3 className="activity-card__title activity-card__title--cart">
              {planActivity.name?.split("(")[0]}
            </h3>

            {planActivity.ticketTotalPrice !== 0 && (
              <p className="activity-card__tickets">
                {Object.values(planActivity.ticketCount || {}).reduce(
                  (acc: number, value: any) => acc + (value || 0),
                  0
                )}{" "}
                tickets
              </p>
            )}
            <p className="activity-card__price-value activity-card__price-value--cart">
              £ {(planActivity.ticketTotalPrice === 0) ? "-" : planActivity.ticketTotalPrice}
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
        src={activity.imageUrl}
        alt={activity.name}
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
            {renderStars(activity.reviewsAverageRating)}
          </div>
          <p className="activity-card__reviews-count">
            {activity.reviewsTotalCount}
          </p>
        </div>
        {activity.duration && (
          <p className="activity-card__duration">
            {getDuration(activity.duration)}
          </p>
        )}
        <span className="activity-card__price-value">
          {getPrice(activity.prices?.adult)}
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