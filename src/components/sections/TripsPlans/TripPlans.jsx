import { useState, useEffect } from "react";
import { InfinitySpin } from "react-loader-spinner";
import TripCard from "../../base/TripCard/TripCard";
import "./TripPlans.scss";
import { useNavigate } from "react-router-dom";

function TripPlans() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        setTrips([]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  if (loading)
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#ffffff"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );

  return (
    <div className="planned-trips">
      <h2 className="planned-trips__title">Your planned trips</h2>
      <div className="planned-trips__list">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
        <div className="planned-trips__add">
          <button
            className="planned-trips__add-button"
            onClick={() => {
              navigate("/create-plan");
            }}
          >
            + Add new trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default TripPlans;
