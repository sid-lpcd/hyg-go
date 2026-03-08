import React from "react";
import "./TripPreview.scss";
import Slider from "../../base/Slider/Slider";
import MapGL from "../../base/MapGL/MapGL";
import { MapMarker } from "../../../types/common";

interface TripPreviewProps {
  title: string;
  description: string;
  previewImages: string[];
  userName?: string;
  location?: string;
  mapMarkers?: MapMarker[];
  mapCenter?: [number, number] | null;
  isMapLoading?: boolean;
}

const TripPreview: React.FC<TripPreviewProps> = ({
  title,
  description,
  previewImages,
  userName = "Your Username",
  location = "Trip Location",
  mapMarkers = [],
  mapCenter = null,
  isMapLoading = false,
}) => {
  const mapSlide = isMapLoading ? (
    <div key="map-slide-loading" className="trip-preview__map-loading">
      <p>Loading map...</p>
    </div>
  ) : mapCenter ? (
    <div key="map-slide" className="trip-preview__map">
      <MapGL
        initialLocation={mapCenter}
        initialZoom={12}
        markersList={mapMarkers}
        fitToMarkers={true}
        fitPadding={32}
        fitMaxZoom={14}
        isResetVisible={false}
        isMoveable={false}
      />
    </div>
  ) : (
    <div key="map-slide-fallback" className="trip-preview__map-placeholder">
      <span>🗺️</span>
      <p>Map unavailable for this trip</p>
    </div>
  );

  // Create media slides: map first, then images
  const mediaSlides = [
    mapSlide,
    
    // Image slides
    ...previewImages.map((image, index) => (
      <div key={`image-slide-${index}-${image}`} className="trip-preview__image">
        <img src={image} alt={`Trip preview ${index + 1}`} />
      </div>
    )),
  ];

  return (
    <section className="trip-preview">      
        <div className="trip-preview__header">
            <div className="trip-preview__avatar">
                <div className="trip-preview__avatar-placeholder">U</div>
            </div>
            <div className="trip-preview__user-info">
                <h5 className="trip-preview__title">{title || "Your amazing trip title"}</h5>
                <div className="trip-preview__meta">
                    <span className="trip-preview__username">{userName}</span>
                    <span className="trip-preview__separator">•</span>
                    <span className="trip-preview__location">{location}</span>
                </div>
            </div>
        </div>
        
        <div className="trip-preview__content">            
            <Slider 
              className="trip-preview__media-slider"
              showIndicators={true}
              enableDrag={true}
            >
              {mediaSlides}
            </Slider>
        </div>
        
        {description && (
            <div className="trip-preview__description">
                {description}
            </div>
        )}
    </section>
  );
};

export default TripPreview;
