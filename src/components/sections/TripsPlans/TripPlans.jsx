import { useState, useEffect, useRef } from "react";
import { InfinitySpin } from "react-loader-spinner";
import TripCard from "../../base/TripCard/TripCard";
import "./TripPlans.scss";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "../../../utils/apiHelper";

function TripPlans() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState(null);
  const [visibleTrips, setVisibleTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddBtnVisible, setIsAddBtnVisible] = useState(false);
  const addDivRef = useRef(null);
  const scrollRef = useRef(null);

  const filterTrips = (trips) => {
    const filteredTrips = trips.filter(
      (trip) => new Date(trip.start_date) >= new Date()
    );
    setVisibleTrips(filteredTrips);
  };

  const fetchTrips = async () => {
    try {
      const response = await getAllPlans();
      filterTrips(response);
      setTrips(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleScroll = () => {
    if (addDivRef.current) {
      const elemInfo = addDivRef.current.getBoundingClientRect();

      if (elemInfo.bottom >= window.innerHeight) {
        setIsAddBtnVisible(true);
      } else {
        setIsAddBtnVisible(false);
      }
    }
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    handleScroll();
    scrollRef.current.addEventListener("scroll", handleScroll);
    return () => {
      scrollRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

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
      <div className="planned-trips__list" ref={scrollRef}>
        {visibleTrips.map((trip) => (
          <TripCard key={trip.plan_id} trip={trip} />
        ))}
        <div
          className="planned-trips__add"
          onClick={() => {
            navigate("/create-plan");
          }}
          ref={addDivRef}
        >
          + Add new trip
        </div>
      </div>
      {isAddBtnVisible && (
        <button
          className="planned-trips__add-btn"
          onClick={() => {
            navigate("/create-plan");
          }}
        >
          +
        </button>
      )}
    </div>
  );
}

export default TripPlans;
