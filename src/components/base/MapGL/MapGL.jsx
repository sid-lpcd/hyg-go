import { act, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapGL.scss";
import { de } from "react-day-picker/locale";
const MapGL = ({ initialLocation, isResetVisible, markersList, labels }) => {
  const [center, setCenter] = useState(initialLocation);
  const [zoom, setZoom] = useState(14);
  const [isCentered, setIsCentered] = useState(true);

  const mapRef = useRef();
  const mapContainerRef = useRef();

  const handleButtonClick = () => {
    mapRef.current.flyTo({
      center: initialLocation,
      zoom: 14,
    });
    setIsCentered(true);
  };

  const createLabelsObject = (labelsArray, colors, defaultColor = "gray") => {
    const labels = labelsArray.reduce((acc, label) => {
      acc[label] = colors.shift() || defaultColor;
      return acc;
    }, {});
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
  const labelsWithColors = labels
    ? createLabelsObject(labels, colors)
    : { default: "red" };

  const getMarkerCategory = (marker) => {
    return labelsWithColors[marker.category] || labelsWithColors.default;
  };

  const setMarkers = () => {
    markersList.forEach((marker) => {
      const colorMarker = getMarkerCategory(marker);
      console.log(colorMarker);
      console.log(marker);
      new mapboxgl.Marker({ color: colorMarker })
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(mapRef.current);
    });
  };

  useEffect(() => {
    if (!mapRef) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPGL_API_KEY;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
      zoom: zoom,
    });

    mapRef.current.on("move", () => {
      const mapCenter = mapRef.current.getCenter();
      const mapZoom = mapRef.current.getZoom();

      setCenter([mapCenter.lng, mapCenter.lat]);
      setZoom(mapZoom);
      setIsCentered(false);
    });

    markersList.length && setMarkers();

    return () => {
      mapRef.current.remove();
    };
  }, []);
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
