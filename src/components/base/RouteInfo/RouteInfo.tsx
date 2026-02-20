import React, { useState, useMemo } from "react";
import { PlanActivityWithDetails, TravelMode, TravelInfo } from "../../../types/common";
import "./RouteInfo.scss";

interface RouteInfoProps {
  currentActivity: PlanActivityWithDetails;
  nextActivity: PlanActivityWithDetails;
}

const RouteInfo: React.FC<RouteInfoProps> = React.memo(({
  currentActivity,
  nextActivity
}) => {
  // Helper functions moved to component level
  const getDefaultTransportMode = (travelInfos: TravelInfo[]): TravelMode => {
    const walkingInfo = travelInfos.find(info => info.mode === TravelMode.WALKING);
    
    if (walkingInfo && walkingInfo.durationValue > 60 * 60) { // More than 60 minutes (in seconds)
      const drivingInfo = travelInfos.find(info => info.mode === TravelMode.DRIVING);
      return drivingInfo ? TravelMode.DRIVING : TravelMode.WALKING;
    }
    
    return TravelMode.WALKING;
  };

  const getTravelInfo = (travelInfos: TravelInfo[], mode: TravelMode): TravelInfo | null => {
    return travelInfos.find(info => info.mode === mode) || null;
  };

  const getNextTransportMode = (travelInfos: TravelInfo[], currentMode: TravelMode): TravelMode => {
    const availableModes = travelInfos.map(info => info.mode);
    const currentIndex = availableModes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % availableModes.length;
    return availableModes[nextIndex];
  };

  if (!currentActivity.routeInfo || !currentActivity.routeInfo[nextActivity.activityId]) {
    return null;
  }

  const travelInfos = currentActivity.routeInfo[nextActivity.activityId];
  
  // Local state for transport mode - no need to trigger parent re-render
  const [selectedMode, setSelectedMode] = useState<TravelMode>(() => getDefaultTransportMode(travelInfos));
  
  const travelInfo = useMemo(() => getTravelInfo(travelInfos, selectedMode), [travelInfos, selectedMode]);

  if (!travelInfo) return null;

  const durationMinutes = Math.round(travelInfo.durationValue / 60);
  const distanceKm = (travelInfo.distanceValue / 1000).toFixed(1);

  const handleClick = () => {
    const nextMode = getNextTransportMode(travelInfos, selectedMode);
    setSelectedMode(nextMode);
  };

  return (
    <div className="route-info">
      <div className="route-info__line"></div>
      <div 
        className="route-info__details"
        onClick={handleClick}
      >
        <span className="route-info__duration">
          {durationMinutes} min {selectedMode}
        </span>
        <span className="route-info__distance">
          ({distanceKm}km)
        </span>
      </div>
    </div>
  );
});

export default RouteInfo;