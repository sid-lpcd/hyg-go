import { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import {
  getAllAttractionsForBounds,
  getAllAttractionsForLocation,
  getAllCategoriesForLocation,
  getAttractionById,
  getLocationById,
} from "../../../utils/apiHelper";
import MapGL from "../../base/MapGL/MapGL";
import "./MapSection.scss";
import { useSearchParams } from "react-router-dom";

const MapSection = ({ locationId, basketState, setSelectedActivity }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  let filters = {};
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    tags: [],
  });
  const [error, setError] = useState(false);
  const [activities, setActivities] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);
  const [initialZoom, setInitialZoom] = useState(null);

  const getLocationInfo = async () => {
    try {
      if (searchParams.get("activity")) {
        const activityId = searchParams.get("activity");
        const response = await getAttractionById(activityId);
        setInitialLocation([response.longitude, response.latitude]);
        setInitialZoom(15);
        return;
      }
      const response = await getLocationById(locationId);
      setInitialLocation([response.longitude, response.latitude]);
      if (response.type === "COUNTRY") {
        setInitialZoom(6);
      } else {
        setInitialZoom(11);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllActivities = async () => {
    const limit = activities ? activities.length + 10 : 10;
    try {
      const response = await getAllAttractionsForLocation(locationId, 0, limit);
      setActivities(response);

      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesForLocation(locationId);
      filters = { ...filters, categories: response };
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  const getAllFilters = async () => {
    try {
      getAllCategories();
    } catch (error) {
      setError(true);
    }
  };

  const getActivitiesByFilter = async () => {
    try {
      console.log("Filters:", selectedFilters);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMarkersWithinBounds = async (bounds) => {
    try {
      const response = await getAllAttractionsForBounds(locationId, bounds);

      setActivities(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getActivitiesByFilter();
  }, [selectedFilters]);

  useEffect(() => {
    getLocationInfo();
    getAllActivities();
    filters = getAllFilters() || [];
  }, []);

  if (!activities || !basketState || !initialLocation) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#ffffff"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  return (
    <>
      <section className="map-section">
        <MapGL
          initialLocation={initialLocation}
          initialZoom={initialZoom}
          isResetVisible={true}
          markersList={activities}
          labels={filters}
          basketState={basketState}
          fetchMarkersWithinBounds={fetchMarkersWithinBounds}
          isMarkerClickable={true}
          onMarkerClick={setSelectedActivity}
        />
      </section>

      {error && (
        <p className="main__error">
          <Error /> Failed Loading Map & Activities
        </p>
      )}
    </>
  );
};

export default MapSection;
