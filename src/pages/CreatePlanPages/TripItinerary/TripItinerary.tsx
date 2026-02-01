import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlanById } from "../../../utils/apiHelper";
import { getDayColors } from "../../../utils/themeColors";
import { Plan, PlanActivityWithDetails, ActivityMarker } from "../../../types/common";
import MapGL from "../../../components/base/MapGL/MapGL";
import { InfinitySpin } from "react-loader-spinner";
import Header from "../../../components/sections/Header/Header";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import EditIcon from "../../../assets/icons/edit-icon.svg?react";
import "./TripItinerary.scss";


const TripItinerary: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [activities, setActivities] = useState<PlanActivityWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleEditActivities = () => {
    if (planId) {
      navigate(`/create-plan/${planId}/activities`);
    }
  };

  // Get theme-consistent day colors from utils
  const dayColors = getDayColors();

  const fetchPlanDetails = async (): Promise<void> => {
    if (!planId) return;
    
    try {
      const planData = await getPlanById(parseInt(planId));
      setPlan(planData);
      
      if ('activities' in planData && planData.activities) {
        const sortedActivities = (planData.activities as PlanActivityWithDetails[])
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        setActivities(sortedActivities);
      }
      
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

    activities.forEach((activity, index) => {
      if (!activity.latitude || !activity.longitude) return;

      const activityDate = new Date(activity.startDate);
      const dayNumber = Math.floor((activityDate.getTime() - planStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (!groupedByDay[dayNumber]) {
        groupedByDay[dayNumber] = [];
      }
      groupedByDay[dayNumber].push(activity);

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
        order: index + 1,
        day: dayNumber,
        startTime,
        endTime,
        name: activity.name
      });
    });

    return { activitiesByDay: groupedByDay, activityMarkers: markers };
  }, [plan, activities]);

  // Filter markers based on selected day
  const visibleMarkers = useMemo(() => {
    return activityMarkers.filter(marker => marker.day === selectedDay);
  }, [activityMarkers, selectedDay]);

  // Get center location for the map
  const mapCenter = useMemo(() => {    
    const avgLat = visibleMarkers.reduce((sum, marker) => sum + marker.latitude, 0) / visibleMarkers.length;
    const avgLng = visibleMarkers.reduce((sum, marker) => sum + marker.longitude, 0) / visibleMarkers.length;
    
    return [avgLng, avgLat] as [number, number];
  }, [visibleMarkers]);

  const totalDays = Object.keys(activitiesByDay).length;

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
          <EditIcon
            onClick={handleEditActivities}
            className="header__icon header__icon--edit"
          />
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
       

        {/* Map */}
        <section className="trip-itinerary__map">
          <MapGL
            initialLocation={mapCenter}
            targetCenter={mapCenter}
            initialZoom={12}
            targetZoom={13}
            markersList={visibleMarkers.map(marker => ({
              activityId: marker.activityId,
              latitude: marker.latitude,
              longitude: marker.longitude,
              category: marker.category,
              order: marker.order,
              color: dayColors[selectedDay - 1]
            } as any))}
            isResetVisible={false}
            isMarkerClickable={true}
            useNumberedMarkers={true}
          />
        </section>

        {/* Activity list for selected day */}
        <section className="trip-itinerary__activities">
          <h3 className="trip-itinerary__activities-title">
            Day {selectedDay} Schedule
          </h3>
          
          {activitiesByDay[selectedDay]?.map((activity, index) => (
            <article 
              key={activity.activityId}
              className="trip-itinerary__activity"
              style={{ borderLeftColor: dayColors[selectedDay - 1] }}
            >
              <div 
                className="trip-itinerary__activity-number"
                style={{ backgroundColor: dayColors[selectedDay - 1] }}
              >
                {visibleMarkers.find(m => m.activityId === activity.activityId)?.order || index + 1}
              </div>
              
              <div className="trip-itinerary__activity-content">
                <div className="trip-itinerary__activity-header">
                    <h4 className="trip-itinerary__activity-name">{activity.name}</h4>
                    <div className="trip-itinerary__activity-time">
                    <span className="trip-itinerary__activity-time-slot">
                        {new Date(activity.startDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                        })} - {new Date(activity.endDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                        })}
                    </span>
                    {activity.duration && (
                        <span className="trip-itinerary__activity-duration">
                        ({activity.duration}h)
                        </span>
                    )}
                    </div>
                </div>
                
                {activity.description && (
                  <p className="trip-itinerary__activity-description">
                    {activity.description}
                  </p>
                )}
              </div>
            </article>
          )) || (
            <article className="trip-itinerary__no-activities">
              No activities scheduled for Day {selectedDay}
            </article>
          )}
        </section>
      </main>
    </>
  );
};

export default TripItinerary;