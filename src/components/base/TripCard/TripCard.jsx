import "./TripCard.scss";
const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      <div
        className="trip-card__image"
        style={{ backgroundImage: `url(${trip.image})` }}
      ></div>
      <div className="trip-card__details">
        <div className="trip-card__meta">
          <span className="trip-card__participants">
            👥 {trip.participants}
          </span>
          <span className="trip-card__dates">
            {trip.startDate} - {trip.endDate}
          </span>
        </div>
        <h3 className="trip-card__title">{trip.title}</h3>
      </div>
    </div>
  );
};

export default TripCard;
