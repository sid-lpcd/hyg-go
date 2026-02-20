import React from "react";
import { PlanActivityWithDetails, ActivityMarker } from "../../../types/common";
import "./ActivityItemItinerary.scss";

interface ActivityItemItineraryProps {
  activity: PlanActivityWithDetails;
  index: number;
  selectedDay: number;
  dayColors: string[];
  visibleMarkers: ActivityMarker[];
}

const ActivityItemItinerary: React.FC<ActivityItemItineraryProps> = React.memo(({
  activity,
  index,
  selectedDay,
  dayColors,
  visibleMarkers
}) => {
  return (
    <article 
      className="activity-item"
      style={{ borderLeftColor: dayColors[selectedDay - 1] }}
    >
      <div 
        className="activity-item__number"
        style={{ backgroundColor: dayColors[selectedDay - 1] }}
      >
        {visibleMarkers.find(m => m.activityId === activity.activityId)?.order || index + 1}
      </div>
      
      <div className="activity-item__content">
        <div className="activity-item__header">
          <h4 className="activity-item__name">{activity.name}</h4>
          <div className="activity-item__time">
            <span className="activity-item__time-slot">
              {new Date(activity.startDate).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })} - {new Date(activity.endDate).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            {activity.duration && (
              <span className="activity-item__duration">
                ({activity.duration}h)
              </span>
            )}
          </div>
        </div>
        
        {activity.description && (
          <p className="activity-item__description">
            {activity.description}
          </p>
        )}
      </div>
    </article>
  );
});

export default ActivityItemItinerary;