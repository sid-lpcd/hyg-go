import { useEffect, useState } from "react";
import StarIcon from "../../../assets/icons/star-icon.svg?react";
import HalfStarIcon from "../../../assets/icons/star-half-icon.svg?react";
import FullStarIcon from "../../../assets/icons/star-full-icon.svg?react";
import "./ActivityModal.scss";
import { getAttractionById } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";

const ActivityModal = ({ activityId }) => {
  const [activity, setActivity] = useState(null);

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
  const initialRender = async () => {
    try {
      const response = await getAttractionById(activityId);

      setActivity({ ...response, images: response.images.slice(1, 5) });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initialRender();
  }, [activityId]);

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
        <h1 className="activity__title">{activity.name}</h1>
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
        {activity.images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`${activity.name} image`}
            className="activity__image"
          />
        ))}
      </article>

      <article className="activity__details">
        <h2 className="activity__subtitle">Details</h2>
        {activity.freeAttraction && (
          <p className="activity__info">
            <strong>Free</strong>
          </p>
        )}
        <div className="activity__reviews">
          <div className="activity-card__stars">
            {renderStars(activity?.reviews_average_rating)}
          </div>
          <p className="activity__reviews-count">
            {activity?.reviews_total_count}
          </p>
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
        </div>
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
    </>
  );
};

export default ActivityModal;
