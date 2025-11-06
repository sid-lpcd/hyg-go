import { useState, useEffect, useRef } from "react";
import { InfinitySpin } from "react-loader-spinner";
import TripCard from "../../base/TripCard/TripCard";
import "./TripPlans.scss";
import { useNavigate } from "react-router-dom";
import { getAllPlans, getAllPlansForUser } from "../../../utils/apiHelper";
import { useAuth } from "../../../context/AuthContext";

function TripPlans() {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddBtnVisible, setIsAddBtnVisible] = useState(false);
  const addDivRef = useRef(null);
  const scrollRef = useRef(null);

  const fetchTrips = async () => {
    try {
      const response = await getAllPlansForUser(new Date().toISOString().split('T')[0]);
      setTrips(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTrips();
  }, [authState]);

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
        {trips.map((trip) => (
          <TripCard key={trip.planId} trip={trip} />
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
