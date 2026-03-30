import React from "react";
import { EntityId } from "../../../types/common";
import "./NumberedMarker.scss";

interface NumberedMarkerProps {
  order: number;
  color: string;
  onClick?: () => void;
  className?: string;
  activityId: EntityId;
}

const NumberedMarker: React.FC<NumberedMarkerProps> = ({ 
  order, 
  color, 
  onClick, 
  className = "",
  activityId 
}) => {
  return (
    <div
      className={`numbered-marker marker-${activityId} ${className}`.trim()}
      style={{ '--marker-color': color } as React.CSSProperties}
      data-order={order}
      onClick={onClick}
    >
      {order}
    </div>
  );
};

export default NumberedMarker;
