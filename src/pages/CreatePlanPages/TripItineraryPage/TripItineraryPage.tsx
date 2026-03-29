import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLocationById, getPlanById } from "../../../utils/apiHelper";
import { PlanActivityWithDetails, ActivityMarker, PlanWithDetailedActivities} from "../../../types/common";
import MapGL from "../../../components/base/MapGL/MapGL";
import ActivityItemItinerary from "../../../components/base/ActivityItemItinerary/ActivityItemItinerary";
import RouteInfo from "../../../components/base/RouteInfo/RouteInfo";
import { InfinitySpin } from "react-loader-spinner";
import Header from "../../../components/sections/Header/Header";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import DoneIcon from "../../../assets/icons/done-icon.svg?react";
import EditIcon from "../../../assets/icons/edit-icon.svg?react";
import ShareIcon from "../../../assets/icons/share-icon.svg?react";
import "./TripItineraryPage.scss";

const ITINERARY_MARKER_COLOR = "#6F3E7F";

const TripItineraryPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [plan, setPlan] = useState<PlanWithDetailedActivities | null>(null);
  const [activities, setActivities] = useState<PlanActivityWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditActivities = () => {
    if (planId) {
      navigate(`/create-plan/${planId}/activities`, {
        state: { 
          planInfo: plan,
          fromPath: location.pathname
        }
      });
    }
  };

  const handleShareTrip = () => {
    if (planId) {
      navigate(`/plan/${planId}/share`)
    }
  }

  const handleDone = () => {
    navigate("/");
  };

  const fetchPlanDetails = async (): Promise<void> => {
    if (!planId) return;
    
    try {
      const planData = await getPlanById(planId, "detail");
      setPlan(planData);

      const sortedActivities = (planData.activities as PlanActivityWithDetails[])
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setActivities(sortedActivities);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plan details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [planId]);

  // Group activities by day and create markers
  const { activitiesByDay, activityMarkers } = useMemo(() => {
    if (!plan || activities.length === 0) {
      return { activitiesByDay: {}, activityMarkers: [] };
    }

    const planStartDate = new Date(plan.startDate);
    const groupedByDay: { [key: number]: PlanActivityWithDetails[] } = {};
    const markers: ActivityMarker[] = [];

    // First pass: group activities by day
    activities.forEach((activity) => {
      const activityDate = new Date(activity.startDate);
      const dayNumber = Math.floor((activityDate.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (!groupedByDay[dayNumber]) {
        groupedByDay[dayNumber] = [];
      }
      groupedByDay[dayNumber].push(activity);
    });

    // Second pass: create markers with day-specific numbering
    Object.keys(groupedByDay).forEach(dayKey => {
      const dayNumber = parseInt(dayKey);
      const dayActivities = groupedByDay[dayNumber];
      
      dayActivities.forEach((activity, dayIndex) => {
        if (!activity.latitude || !activity.longitude) return;

        const startTime = new Date(activity.startDate).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        const endTime = new Date(activity.endDate).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });

        markers.push({
          activityId: activity.activityId,
          latitude: activity.latitude,
          longitude: activity.longitude,
          category: activity.category,
          order: dayIndex + 1, 
          day: dayNumber,
          startTime,
          endTime,
          name: activity.name
        });
      });
    });

    return { activitiesByDay: groupedByDay, activityMarkers: markers };
  }, [plan, activities]);

  // Filter markers based on selected day
  const visibleMarkers = useMemo(() => {
    return activityMarkers.filter(marker => marker.day === selectedDay);
  }, [activityMarkers, selectedDay]);

  // Update map center when visible markers or plan changes
  useEffect(() => {
    const updateMapCenter = async () => {
      if (visibleMarkers.length === 0 && plan) {
        try {
          const response = await getLocationById(plan.locationId);
          setMapCenter([response.longitude!, response.latitude!]);
        } catch (error) {
          console.error("Error fetching location:", error);
          // Fallback to a default center if needed
          setMapCenter([0, 0]);
        }
      } else if (visibleMarkers.length > 0) {
        const avgLat = visibleMarkers.reduce((sum, marker) => sum + marker.latitude, 0) / visibleMarkers.length;
        const avgLng = visibleMarkers.reduce((sum, marker) => sum + marker.longitude, 0) / visibleMarkers.length;
        setMapCenter([avgLng, avgLat]);
      }
    };

    updateMapCenter();
  }, [visibleMarkers, plan]);

  const totalDays = Object.keys(activitiesByDay).length;
  
  const isPastTrip = plan ? plan.endDate < new Date() : false;
  
  const MapSection = useMemo(() => {
    if (!mapCenter) return null;
    
    return (
      <section className="trip-itinerary__map">
        <MapGL
          initialLocation={mapCenter}
          initialZoom={12}
          fitToMarkers={visibleMarkers.length > 0}
          fitPadding={50}
          fitMaxZoom={14}
          fitDuration={1800}
          markersList={visibleMarkers.map(marker => ({
            activityId: marker.activityId,
            latitude: marker.latitude,
            longitude: marker.longitude,
            category: marker.category,
            order: marker.order,
            color: ITINERARY_MARKER_COLOR
          } as any))}
          isResetVisible={false}
          isMarkerClickable={true}
          useNumberedMarkers={true}
        />
      </section>
    );
  }, [mapCenter, visibleMarkers]);

  if (loading) {
    return (
      <div className="loader-overlay">
        <InfinitySpin width="200" color="#ffffff" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="trip-itinerary">
        <Header
          leftElement={
            <BackArrowIcon
              onClick={() => navigate(-1)}
              className="header__icon"
            />
          }
        />
        <div className="trip-itinerary__error">
          <p>Plan not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        leftElement={
          <BackArrowIcon
            onClick={handleBackClick}
            className="header__icon"
          />
        }
        rightElement={
          <div className="trip-itinerary__header-actions">
            <DoneIcon
              onClick={handleDone}
              className="header__icon header__icon--done"
            />
            {isPastTrip ? (
              <ShareIcon
                onClick={handleShareTrip}
                className="header__icon header__icon--share"
              />
            ) : (
              <EditIcon
                onClick={handleEditActivities}
                className="header__icon header__icon--edit"
              />
            )}
          </div>
        }
      />
      
      <main className="main trip-itinerary">
        <div className="trip-itinerary__header">
            <h2 className="trip-itinerary__title">{plan.title}</h2>
            {totalDays > 1 && (
            <section className="trip-itinerary__day-selector">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
                <button
                    key={day}
                    className={`trip-itinerary__day-btn ${selectedDay === day ? 'active' : ''}`}
                    onClick={() => setSelectedDay(day)}
                >
                    Day {day}
                </button>
                ))}
            </section>
            )}
        </div>
       
        {MapSection}

        <section className="trip-itinerary__activities">
          <h3 className="trip-itinerary__activities-title">
            Day {selectedDay} Schedule
          </h3>
          
          {activitiesByDay[selectedDay]?.map((activity, index) => {
            const dayActivities = activitiesByDay[selectedDay];
            const nextActivity = dayActivities && index < dayActivities.length - 1 ? dayActivities[index + 1] : null;
            
            return (
              <React.Fragment key={activity.activityId}>
                <ActivityItemItinerary
                  activity={activity}
                  index={index}
                  selectedDay={selectedDay}
                  dayColors={dayColors}
                  visibleMarkers={visibleMarkers}
                />

                {/* Route info to next activity */}
                {nextActivity && (
                  <RouteInfo
                    currentActivity={activity}
                    nextActivity={nextActivity}
                  />
                )}
              </React.Fragment>
            );
          }) || (
            <article className="trip-itinerary__no-activities">
              No activities scheduled for Day {selectedDay}
            </article>
          )}
        </section>
      </main>
    </>
  );
};

export default TripItineraryPage;
