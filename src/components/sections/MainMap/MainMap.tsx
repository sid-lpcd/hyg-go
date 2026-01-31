import React, { useState, useEffect, useMemo } from "react";
import { getAllPlansForUser, getPlanById, getLocationById } from "../../../utils/apiHelper";
import { useAuth } from "../../../context/AuthContext";
import { Plan, PlanActivityWithDetails, Location } from "../../../types/common";
import Dropdown from "../../base/Dropdown/Dropdown";
import MapGL from "../../base/MapGL/MapGL";
import { InfinitySpin } from "react-loader-spinner";
import "./MainMap.scss";

const MainMap: React.FC = () => {
  const { authState } = useAuth();
  const [futureTrips, setFutureTrips] = useState<Plan[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tripActivities, setTripActivities] = useState<PlanActivityWithDetails[]>([]);
  const [tripLocation, setTripLocation] = useState<Location | null>(null);
  const [loadingTripDetails, setLoadingTripDetails] = useState<boolean>(false);

  const fetchTripDetails = async (planId: number): Promise<void> => {
    setLoadingTripDetails(true);
    try {
      const planWithActivities = await getPlanById(planId);
      if ('activities' in planWithActivities) {
        setTripActivities(planWithActivities.activities as PlanActivityWithDetails[]);
      }
      
      if (selectedTrip?.locationId) {
        const locationDetails = await getLocationById(selectedTrip.locationId);
        setTripLocation(locationDetails);
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
    } finally {
      setLoadingTripDetails(false);
    }
  };

  const fetchFutureTrips = async (): Promise<void> => {
    try {
      const today = new Date();
      const futureDate = new Date();
      futureDate.setFullYear(today.getFullYear() + 2);
      
      const futureTripsResponse = await getAllPlansForUser(
        today.toISOString().split('T')[0],
        futureDate.toISOString().split('T')[0]
      );
      
      const sortedFutureTrips = futureTripsResponse.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      });
      
      setFutureTrips(sortedFutureTrips);
      
      if (sortedFutureTrips.length > 0) {
        setSelectedTrip(sortedFutureTrips[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching future trips:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchFutureTrips();
  }, [authState]);

  useEffect(() => {
    if (selectedTrip) {
      fetchTripDetails(selectedTrip.planId);
    }
  }, [selectedTrip]);

  const tripOptions = useMemo(() => {
    return futureTrips.map(trip => trip.title);
  }, [futureTrips]);

  const convertActivitiesToMarkers = useMemo(() => {
    console.log(tripActivities)
    return tripActivities
      .filter(activity => activity.latitude && activity.longitude)
      .map(activity => ({
        activityId: activity.activityId,
        latitude: activity.latitude!,
        longitude: activity.longitude!,
        category: activity.category
      }));
  }, [tripActivities]);

  const initialMapLocation = useMemo(() => {
    if (tripLocation?.latitude && tripLocation?.longitude) {
      return [tripLocation.longitude, tripLocation.latitude] as [number, number];
    }
    // Default to center of Europe if no location available
    return [2.3522, 48.8566] as [number, number];
  }, [tripLocation]);

  const handleTripChange = (tripTitle: string) => {
    const trip = futureTrips.find(t => t.title === tripTitle);
    if (trip) {
      setSelectedTrip(trip);
      fetchTripDetails(trip.planId);
    }
  };

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

  if (futureTrips.length === 0) {
    return (
      <section className="main-map">
        <h2 className="main-map__title">Trip Map</h2>
        <div className="main-map__empty">
          <p>No upcoming trips found.</p>
          <p>Create a trip to see it on the map!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="main-map">
      <h2 className="main-map__title">Trip Map</h2>
      <div className="main-map__content">
        <div className="main-map__controls">
          <Dropdown
            options={tripOptions}
            selected={selectedTrip?.title || ''}
            selectHandler={handleTripChange}
          />
        </div>
        
        <div className="main-map__map-container">
          <MapGL 
            initialLocation={[2.3522, 48.8566]} 
            targetCenter={tripLocation ? initialMapLocation : undefined} 
            initialZoom={6}
            targetZoom={tripLocation? 10 : undefined}
            markersList={convertActivitiesToMarkers}
            isResetVisible={true}
            isMarkerClickable={true}
          />
        </div>
      </div>
    </section>
  );
};

export default MainMap;