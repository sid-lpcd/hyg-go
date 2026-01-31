import React from "react";
import { useBasket } from "../../../context/BasketContext";
import MapGL from "./MapGL";

interface MapGLProps {
  initialLocation: [number, number];
  initialZoom?: number;
  isResetVisible?: boolean;
  markersList: any[];
  labels?: string[];
  fetchMarkersWithinBounds?: (bounds: any) => void;
  isMarkerClickable?: boolean;
  onMarkerClick?: (activity: any) => void;
  isMoveable?: boolean;
}

const MapGLWithBasket: React.FC<MapGLProps> = (props) => {
  const { basketState } = useBasket();
  
  const basketActivityIds = basketState?.activities?.map(activity => activity.activityId) || [];
  
  return (
    <MapGL 
      {...props}
      basketActivityIds={basketActivityIds}
    />
  );
};

export default MapGLWithBasket;