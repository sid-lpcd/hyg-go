import { act, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./MapGL.scss";

const MapGL = ({
  initialLocation,
  initialZoom = 14,
  isResetVisible,
  markersList,
  labels,
  fetchMarkersWithinBounds,
  isMarkerClickable = false,
  onMarkerClick,
  basketState,
}) => {
  const [center, setCenter] = useState(initialLocation);
  const [zoom, setZoom] = useState(initialZoom);
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
  const labelsWithColors = labels?.length
    ? createLabelsObject(labels, colors)
    : { default: "red" };

  const getMarkerCategory = (marker) => {
    return labelsWithColors[marker.category] || labelsWithColors.default;
  };

  const checkBasket = (marker) => {
    if (
      basketState.activities.find(
        (item) => item.activity_id === marker.activity_id
      )
    ) {
      return true;
    } else {
      return false;
    }
  };

  const setMarkers = () => {
    markersList.forEach((marker) => {
      let colorMarker = getMarkerCategory(marker);

      if (checkBasket(marker)) {
        colorMarker = "green";
      }

      const markerEl = new mapboxgl.Marker({ color: colorMarker })
        .setLngLat([marker.longitude, marker.latitude])
        .addClassName(`marker-${marker.activity_id}`)
        .addTo(mapRef.current);

      if (isMarkerClickable) {
        markerEl.getElement().addEventListener("click", (e) => {
          const markerTarget = e.target?.parentElement?.parentElement;

          const classNames = markerTarget.className.split(" ");
          const activityId = classNames[classNames.length - 1].split("-")[1];

          const activity = markersList.find(
            (item) => item.activity_id === parseInt(activityId)
          );

          console.log(activity);
          onMarkerClick(activity);
        });
      }
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

      if (fetchMarkersWithinBounds) {
        const { _sw: southwest, _ne: northeast } = mapRef.current.getBounds();

        fetchMarkersWithinBounds({
          southwest: [southwest.lng, southwest.lat],
          northeast: [northeast.lng, northeast.lat],
        });
      }
    });

    markersList.length && setMarkers();

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef?.current) return;

    setMarkers();
  }, [markersList]);

  useEffect(() => {
    if (!mapRef) return;
    setMarkers();
  }, [basketState]);

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
