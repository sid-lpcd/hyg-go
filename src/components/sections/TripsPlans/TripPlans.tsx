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

  const [pastTrips, setPastTrips] = useState<Plan[]>([]);
  const [futureTrips, setFutureTrips] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddBtnVisible, setIsAddBtnVisible] = useState<boolean>(false);
  const addDivRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchTrips = async (): Promise<void> => {
    try {
      const today = new Date();
      const pastDate = new Date();
      pastDate.setFullYear(today.getFullYear() - 2); // 2 years ago
      const futureDate = new Date();
      futureDate.setFullYear(today.getFullYear() + 2); // 2 years ahead
      
      // Make two separate API calls
      // today minus 1 day
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const [pastTripsResponse, futureTripsResponse] = await Promise.all([
        getAllPlansForUser(
          pastDate.toISOString().split('T')[0],
          yesterday.toISOString().split('T')[0]
        ),
        getAllPlansForUser(
          today.toISOString().split('T')[0],
          futureDate.toISOString().split('T')[0]
        )
      ]);
      
      // Sort and set trips separately
      const sortedPastTrips = pastTripsResponse.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA; // Descending (most recent first)
      });
      
      const sortedFutureTrips = futureTripsResponse.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB; // Ascending (earliest first)
      });
      
      setPastTrips(sortedPastTrips);
      setFutureTrips(sortedFutureTrips);
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

  if (!loading && futureTrips.length === 0 && pastTrips.length === 0) {
    return (
      <div className="planned-trips">
        <h2 className="planned-trips__title">Your planned trips</h2>
        <p>No trips found</p>
        <div
          className="planned-trips__add"
          onClick={() => {
            navigate("/create-plan");
          }}
        >
          + Add new trip
        </div>
      </div>
    );
  }

  return (
    <div className="planned-trips">
      <h2 className="planned-trips__title">Your planned trips</h2>
      <div className="planned-trips__list" ref={scrollRef}>
        
        {futureTrips.length > 0 && (
          <div className="planned-trips__section">
            <h3 className="planned-trips__section-title">Upcoming Trips</h3>
            <div className="planned-trips__cards">
              {futureTrips.map((trip) => (
                <TripCard key={trip.planId} trip={trip} />
              ))}
            </div>
          </div>
        )}

        <div
          className="planned-trips__add"
          onClick={() => {
            navigate("/create-plan");
          }}
          ref={addDivRef}
        >
          + Add new trip
        </div>
        
        {pastTrips.length > 0 && (
          <div className="planned-trips__section">
            <h3 className="planned-trips__section-title">Past Trips</h3>
            <div className="planned-trips__cards planned-trips__cards--past">
              {pastTrips.map((trip) => (
                <TripCard key={trip.planId} trip={{...trip, 
                  title: trip.title.trim().length > 10
                    ? `${trip.title.trim().slice(0, 12)}...`
                    : trip.title.trim(),}} />
              ))}
            </div>
          </div>
        )}
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