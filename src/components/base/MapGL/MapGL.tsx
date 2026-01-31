import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapGL.scss";
import { BoundingBox, Bounds } from "../../../types/common";
import { MapMarker } from "../../../types/common";

interface MapGLProps {
  initialLocation: [number, number];
  targetCenter?: [number, number];
  initialZoom?: number;
  targetZoom?: number;
  isResetVisible?: boolean;
  markersList: MapMarker[];
  labels?: string[];
  fetchMarkersWithinBounds?: (bounds: BoundingBox) => void;
  isMarkerClickable?: boolean;
  onMarkerClick?: (activity: MapMarker) => void;
  isMoveable?: boolean;
  basketActivityIds?: number[]; 
}

const MapGL: React.FC<MapGLProps> = ({
  initialLocation,
  targetCenter,
  initialZoom = 14,
  targetZoom,
  isResetVisible,
  markersList,
  labels,
  fetchMarkersWithinBounds,
  isMarkerClickable = false,
  onMarkerClick,
  isMoveable = true,
  basketActivityIds = [],
}) => {
  const [center, setCenter] = useState<[number, number]>(initialLocation);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [isCentered, setIsCentered] = useState<boolean>(true);
  const [previousBounds, setPreviousBounds] = useState<Bounds | null>(null);

  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const handleButtonClick = (): void => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: initialLocation,
      zoom: initialZoom,
    });
    setIsCentered(true);
  };

  const createLabelsObject = (labelsArray: string[], colors: string[], defaultColor: string = "gray"): Record<string, string> => {
    const labels = labelsArray.reduce((acc, label) => {
      acc[label] = colors.shift() || defaultColor;
      return acc;
    }, {} as Record<string, string>);
    labels.default = defaultColor; // Add a default color
    return labels;
  };
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "cyan",
    "magenta",
    "lime",
    "teal",
    "indigo",
    "amber",
    "violet",
    "gold",
    "coral",
    "turquoise",
    "peach",
    "crimson",
    "mint",
  ];

  const labelsWithColors = labels?.length
    ? createLabelsObject(labels, colors)
    : { default: "red" };

  const getMarkerCategory = (marker: MapMarker): string => {
    return labelsWithColors[marker.category || ''] || labelsWithColors.default;
  };

  const checkBasket = (marker: MapMarker): boolean => {
    return basketActivityIds.includes(marker.activityId);
  };

  const setMarkers = (): void => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    markersList.forEach((marker) => {
      let colorMarker = getMarkerCategory(marker);

      if (checkBasket(marker)) {
        colorMarker = "green";
      }

      const markerEl = new mapboxgl.Marker({ color: colorMarker })
        .setLngLat([marker.longitude, marker.latitude])
        .addClassName(`marker-${marker.activityId}`)
        .addTo(mapRef.current!);
      
      markersRef.current.push(markerEl);

      if (isMarkerClickable && onMarkerClick) {
        markerEl.getElement().addEventListener("click", (e: Event) => {
          const target = e.target as HTMLElement;
          const markerTarget = target?.parentElement?.parentElement;

          if (markerTarget) {
            const classNames = markerTarget.className.split(" ");
            const activityId = classNames[classNames.length - 1].split("-")[1];

            const activity = markersList.find(
              (item) => item.activityId === parseInt(activityId)
            );

            if (activity) {
              onMarkerClick(activity);
            }
          }
        });
      }
    });
  };

  const isSignificantChange = (old: [number, number], current: [number, number], distanceThreshold: number): boolean =>
    Math.abs(old[0] - current[0]) > distanceThreshold ||
    Math.abs(old[1] - current[1]) > distanceThreshold;

  const shouldFetchMarkers = (oldBounds: Bounds | null, newBounds: Bounds): boolean => {
    if (!oldBounds) return true;

    return (
      isSignificantChange(oldBounds.southwest, newBounds.southwest, 0.02) ||
      isSignificantChange(oldBounds.northeast, newBounds.northeast, 0.02)
    );
  };

  useEffect(() => {
    if (!mapRef) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPGL_API_KEY;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: center,
      zoom: zoom,
    });

    if (!mapRef.current) return;

    if (!isMoveable) {
      mapRef.current.dragPan.disable();
      mapRef.current.dragRotate.disable();
      mapRef.current.touchZoomRotate.disableRotation();
      mapRef.current.scrollZoom.disable();
    } else {
      mapRef.current.on("move", () => {
        const mapCenter = mapRef.current!.getCenter();
        const mapZoom = mapRef.current!.getZoom();

        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
        setIsCentered(false);
      });

      mapRef.current.on("moveend", () => {
        if (fetchMarkersWithinBounds && mapRef.current) {
          const bounds = mapRef.current.getBounds();
          if (!bounds) return;
          
          const southwest = bounds.getSouthWest();
          const northeast = bounds.getNorthEast();

          const currentBounds: Bounds = {
            southwest: [southwest.lng, southwest.lat],
            northeast: [northeast.lng, northeast.lat],
          };

          if (shouldFetchMarkers(previousBounds, currentBounds)) {
            fetchMarkersWithinBounds({
              swLat: southwest.lat,
              neLat: northeast.lat,
              swLng: southwest.lng,
              neLng: northeast.lng,
            });
            setPreviousBounds(currentBounds);
          }
        }
      });
    }

    markersList.length && setMarkers();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef?.current) return;

    setMarkers();
  }, [markersList, basketActivityIds]);

  // Handle dynamic center and zoom updates
  useEffect(() => {
    if (!mapRef?.current || (!targetCenter && !targetZoom)) return;
    
    mapRef.current.flyTo({
      center: targetCenter || center,
      zoom: targetZoom || zoom,
    });
    
    if (targetCenter) {
      setCenter(targetCenter);
      setIsCentered(false);
    }
    
    if (targetZoom) {
      setZoom(targetZoom);
    }
  }, [targetCenter, targetZoom]);

  return (
    <>
      {isResetVisible && (
        <button
          className="map__reset-btn"
          onClick={handleButtonClick}
          disabled={isCentered}
        >
          Reset
        </button>
      )}
      <div className="map__container" ref={mapContainerRef} />
    </>
  );
};

export default MapGL;
