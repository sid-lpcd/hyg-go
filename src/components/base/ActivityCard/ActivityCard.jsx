import { v4 as uuidv4 } from "uuid";
import StarIcon from "../../../assets/icons/star-icon.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half-icon.svg?react";
import FullStarIcon from "../../../assets/icons/star-full-icon.svg?react";
import "./ActivityCard.scss";

const ActivityCard = ({ activity, openActivity }) => {
  function roundHalf(num) {
    return Math.round(num * 2) / 2;
  }
  const renderStars = (rating, maxRating = 5) => {
    const stars = [];
    const roundRating = roundHalf(parseFloat(rating));
    for (let i = 0; i < maxRating; i++) {
      if (i < roundRating) {
        stars.push(
          <div key={uuidv4()}>
            <FullStarIcon className="activity-card__star-icon activity-card__star-icon--full" />
          </div>
        );
      } else if (i + 0.5 === roundRating) {
        stars.push(
          <div key={uuidv4()}>
            <HalfStarIcon className="activity-card__star-icon" />
          </div>
        );
      } else {
        stars.push(
          <div key={uuidv4()}>
            <StarIcon className="activity-card__star-icon" />
          </div>
        );
      }
    }
    return stars;
  };

  if (!activity) {
    return;
  }

  return (
    <article className="activity-card">
      <img
        src={activity.image_url}
        alt={activity.title}
        className="activity-card__image"
      />
      <div className="activity-card__content">
        <h3 className="activity-card__title">{activity.name?.split("(")[0]}</h3>
        <p className="activity-card__location">{activity.location}</p>
        <p className="activity-card__description">
          {activity.description?.length
            ? activity.description.length > 60
              ? activity.description.substring(0, 60) + "..."
              : activity.description
            : "No description available"}
        </p>
        {/* Add category icon here? */}
        <div className="activity-card__tags">{activity.tags}</div>
        <div className="activity-card__box">
          <div className="activity-card__reviews">
            <div className="activity-card__stars">
              {renderStars(activity.reviews_average_rating)}
            </div>
            <p className="activity-card__reviews-count">
              {activity.reviews_total_count}
            </p>
            {activity.duration && (
              <p className="activity-card__duration">
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
          </div>
          <div className="activity-card__price">
            <span className="activity-card__price-value">
              {activity.prices?.adult
                ? "£" +
                  activity.prices?.adult
                    ?.match(/\d+\.?\d*/g)
                    .map(Number)
                    .map(Math.floor)[0] +
                  " - £" +
                  activity.prices?.adult
                    ?.match(/\d+\.?\d*/g)
                    .map(Number)
                    .map(Math.floor)[1]
                : "Free"}
            </span>
            <button
              className="activity-card__open-btn"
              onClick={() => openActivity(activity)}
            >
              See more
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ActivityCard;
