import PeopleIcon from "../../../assets/icons/profile-icon.svg?react";
import { formatDateTripDisplay } from "../../../utils/dateFormat";
import "./TripCard.scss";
const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      <div
        className="trip-card__background"
        style={{ backgroundImage: `url(${trip.location?.image?.url})` }}
      >
        <div className="trip-card__overlay"></div>
      </div>
      <div className="trip-card__content">
        <h3 className="trip-card__title">{trip.title}</h3>
        <div className="trip-card__details">
          <span className="trip-card__people">
            {trip.people
              ? Object.keys(trip.people).reduce(
                  (sum, type) => sum + trip.people[type],
                  0
                )
              : 1}
            <PeopleIcon className="trip-card__people-icon" />{" "}
          </span>
          <span className="trip-card__dates">
            {formatDateTripDisplay(trip.start_date, trip.end_date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
