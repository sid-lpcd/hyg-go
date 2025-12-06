import React, { useState, useEffect, useRef } from "react";
import { InfinitySpin } from "react-loader-spinner";
import TripCard from "../../base/TripCard/TripCard";
import "./TripPlans.scss";
import { useNavigate } from "react-router-dom";
import { getAllPlansForUser } from "../../../utils/apiHelper";
import { useAuth } from "../../../context/AuthContext";
import { Plan } from "../../../types/common";

const TripPlans: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Plan[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddBtnVisible, setIsAddBtnVisible] = useState<boolean>(false);
  const addDivRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchTrips = async (): Promise<void> => {
    try {
      const response = await getAllPlansForUser(new Date().toISOString().split('T')[0]);
      setTrips(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTrips();
  }, [authState]);

  const handleScroll = (): void => {
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
    const scrollElement = scrollRef.current;
    scrollElement.addEventListener("scroll", handleScroll);
    
    return () => {
      scrollElement?.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          width="200"
          color="#ffffff"
        />
      </div>
    );
  }

  if (!trips) {
    return (
      <div className="planned-trips">
        <h2 className="planned-trips__title">Your planned trips</h2>
        <p>No trips found</p>
      </div>
    );
  }

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
};

export default TripPlans;