import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
import NumberedMarker from "../NumberedMarker/NumberedMarker";
import "./MapGL.scss";
import { BoundingBox, Bounds } from "../../../types/common";
import { MapMarker } from "../../../types/common";

const EMPTY_BASKET_ACTIVITY_IDS: number[] = [];

interface MapGLProps {
  initialLocation: [number, number];
  targetCenter?: [number, number];
  initialZoom?: number;
  targetZoom?: number;
  fitToMarkers?: boolean;
  fitPadding?: number;
  fitMaxZoom?: number;
  fitDuration?: number;
  isResetVisible?: boolean;
  markersList: MapMarker[];
  labels?: string[];
  fetchMarkersWithinBounds?: (bounds: BoundingBox) => void;
  isMarkerClickable?: boolean;
  onMarkerClick?: (activity: MapMarker) => void;
  isMoveable?: boolean;
  basketActivityIds?: number[];
  useNumberedMarkers?: boolean;
}

const MapGL: React.FC<MapGLProps> = ({
  initialLocation,
  targetCenter,
  initialZoom = 14,
  targetZoom,
  fitToMarkers = false,
  fitPadding = 40,
  fitMaxZoom = 15,
  fitDuration = 800,
  isResetVisible,
  markersList,
  labels,
  fetchMarkersWithinBounds,
  isMarkerClickable = false,
  onMarkerClick,
  isMoveable = true,
  basketActivityIds,
  useNumberedMarkers = false,
}) => {
  const [center, setCenter] = useState<[number, number]>(initialLocation);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [isCentered, setIsCentered] = useState<boolean>(true);
  const [previousBounds, setPreviousBounds] = useState<Bounds | null>(null);

  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const rootsRef = useRef<any[]>([]);
  const effectiveBasketActivityIds = basketActivityIds ?? EMPTY_BASKET_ACTIVITY_IDS;
  const basketActivityIdsKey = effectiveBasketActivityIds.join(",");

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
    const categoryKey = Array.isArray(marker.category)
      ? marker.category[0]
      : marker.category;
    return labelsWithColors[categoryKey || ''] || labelsWithColors.default;
  };

  const checkBasket = (marker: MapMarker): boolean => {
    return effectiveBasketActivityIds.includes(marker.activityId);
  };

  const setMarkers = (): void => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Schedule root cleanup for next tick to avoid race conditions
    const oldRoots = [...rootsRef.current];
    rootsRef.current = [];
    setTimeout(() => {
      oldRoots.forEach(root => root.unmount());
    }, 0);
    
    markersList.forEach((marker: any) => {
      let markerEl: mapboxgl.Marker;
      
      if (useNumberedMarkers && marker.order) {
        // Create numbered marker using React component
        const markerElement = document.createElement('div');
        const root = createRoot(markerElement);
        
        root.render(
          <NumberedMarker
            order={marker.order}
            color={marker.color || '#666'}
            activityId={marker.activityId}
            onClick={() => onMarkerClick?.(marker)}
          />
        );
        
        rootsRef.current.push(root);
        
        markerEl = new mapboxgl.Marker({ element: markerElement })
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(mapRef.current!);
      } else {
        // Create standard marker
        let colorMarker = getMarkerCategory(marker);
        if (checkBasket(marker)) {
          colorMarker = "green";
        }
        
        markerEl = new mapboxgl.Marker({ color: colorMarker })
          .setLngLat([marker.longitude, marker.latitude])
          .addClassName(`marker-${marker.activityId}`)
          .addTo(mapRef.current!);
          
        // Apply custom className and attributes if provided
        const element = markerEl.getElement();
        if (marker.className) {
          element.classList.add(marker.className);
        }
        if (marker['data-order']) {
          element.setAttribute('data-order', marker['data-order']);
        }
        if (marker.style) {
          Object.entries(marker.style).forEach(([key, value]) => {
            element.style.setProperty(key, value as string);
          });
        }
      }
      
      markersRef.current.push(markerEl);

      if (isMarkerClickable && onMarkerClick) {
        markerEl.getElement().addEventListener("click", (e: Event) => {
          const target = e.target as HTMLElement;
          const markerTarget = target?.parentElement?.parentElement;

          if (markerTarget) {
            const classNames = markerTarget.className.split(" ");
            const markerClass = classNames.find((className) => className.startsWith("marker-"));
            const activityId = markerClass?.replace(/^marker-/, "");

            if (!activityId) return;

            const activity = markersList.find(
              (item) => String(item.activityId) === activityId
            );

            if (activity) {
              onMarkerClick(activity);
            }
          }
        });
      }
    });
  };

  const fitMapToMarkers = (): void => {
    if (!mapRef.current || !fitToMarkers || markersList.length === 0) return;

    if (markersList.length === 1) {
      const marker = markersList[0];
      mapRef.current.flyTo({
        center: [marker.longitude, marker.latitude],
        zoom: fitMaxZoom,
        duration: fitDuration,
      });
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();
    markersList.forEach((marker) => {
      bounds.extend([marker.longitude, marker.latitude]);
    });

    mapRef.current.fitBounds(bounds, {
      padding: fitPadding,
      maxZoom: fitMaxZoom,
      duration: fitDuration,
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
      interactive: isMoveable,
    });

    if (!mapRef.current) return;

    if (!isMoveable) {
      mapRef.current.dragPan.disable();
      mapRef.current.dragRotate.disable();
      mapRef.current.touchZoomRotate.disable();
      mapRef.current.scrollZoom.disable();
      mapRef.current.boxZoom.disable();
      mapRef.current.doubleClickZoom.disable();
      mapRef.current.keyboard.disable();
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
    fitMapToMarkers();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Schedule root cleanup to avoid race conditions
      const oldRoots = [...rootsRef.current];
      rootsRef.current = [];
      setTimeout(() => {
        oldRoots.forEach(root => root.unmount());
      }, 0);
      
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef?.current) return;

    setMarkers();
    fitMapToMarkers();
  }, [markersList, basketActivityIdsKey]);

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
