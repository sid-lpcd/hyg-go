import { useNavigate } from "react-router-dom";
import PeopleIcon from "../../../assets/icons/profile-icon.svg?react";
import { formatDateTripDisplay } from "../../../utils/dateFormat";
import "./TripCard.scss";
import { Plan } from "../../../types/common";

interface TripCardProps {
  trip: Plan;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  return (
    <div
      className="trip-card"
      onClick={() => {
        navigate(`/create-plan/${trip.planId}/activities`);
      }}
    >
      <div
        className="trip-card__background"
        style={{ backgroundImage: `url(${trip.mainImageUrl})` }}
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
            {formatDateTripDisplay(trip.startDate, trip.endDate)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
