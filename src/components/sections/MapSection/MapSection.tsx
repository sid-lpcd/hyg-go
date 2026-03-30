import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import {
  getAllActivities as fetchAllActivities,
  getAllActivitiesForLocation,
  getAllCategoriesForLocation,
  getActivityById,
  getLocationById,
} from "../../../utils/apiHelper";
import { useBasket } from "../../../context/BasketContext";
import MapGLWithBasket from "../../base/MapGL/MapGLWithBasket";
import "./MapSection.scss";
import { useSearchParams } from "react-router-dom";
import { Activity, ActivitySelectedFilters, BasketActivity, BoundingBox, EntityId, MapMarker } from "../../../types/common";

interface MapSectionProps {
  locationId?: EntityId;
  setSelectedActivity: (activity: BasketActivity) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ locationId, setSelectedActivity }) => {
  const { basketState } = useBasket();
  const [searchParams] = useSearchParams();

  let filters: any = {};
  const [selectedFilters] = useState<ActivitySelectedFilters>({
    category: [],
    tags: [],
  });
  const [error, setError] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [initialLocation, setInitialLocation] = useState<[number, number] | null>(null);
  const [initialZoom, setInitialZoom] = useState<number | undefined>(undefined);

  const getLocationInfo = async (): Promise<void> => {
    try {
      if (searchParams.get("activity")) {
        const activityId = searchParams.get("activity");
        if (activityId) {
          const response = await getActivityById(activityId);
          if (response.longitude && response.latitude) {
            setInitialLocation([response.longitude, response.latitude]);
            setInitialZoom(15);
            return;
          }
        }
      }
      
      if (!locationId) return;
      
      const response = await getLocationById(locationId);
      if (response.longitude && response.latitude) {
        setInitialLocation([response.longitude, response.latitude]);
        if (response.type === "COUNTRY") {
          setInitialZoom(6);
        } else {
          setInitialZoom(11);
        }
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const getAllActivities = async (): Promise<void> => {
    if (!locationId) return;
    
    const limit = activities ? activities.length + 10 : 10;
    try {
      const response = await getAllActivitiesForLocation(locationId, 0, limit);
      setActivities(response);
      setError(false);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  const getAllCategories = async (): Promise<void> => {
    if (!locationId) return;
    
    try {
      const response = await getAllCategoriesForLocation(locationId);
      filters = { ...filters, categories: response };
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  const getAllFilters = async (): Promise<void> => {
    try {
      await getAllCategories();
    } catch (error) {
      setError(true);
    }
  };

  const getActivitiesByFilter = async (): Promise<void> => {
    try {
      console.log("Filters:", selectedFilters);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkerClick = (marker: MapMarker): void => {
    // Find the full activity from the activities array
    const activity = activities?.find(act => act.activityId === marker.activityId);
    if (activity) {
      setSelectedActivity(activity as BasketActivity);
    }
  };

  const convertToMapMarkers = (activities: Activity[]): MapMarker[] => {
    return activities
      .filter(activity => activity.latitude && activity.longitude)
      .map(activity => ({
        activityId: activity.activityId,
        latitude: activity.latitude!,
        longitude: activity.longitude!,
        category: activity.category
      }));
  };

  const fetchMarkersWithinBounds = async (bounds: BoundingBox): Promise<void> => {
    try {
      console.log("Fetching activities within bounds:", bounds);
      const response = await fetchAllActivities(bounds);
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
    getAllFilters();
  }, [locationId]);

  if (!activities || !basketState || !initialLocation) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          width="200"
          color="#ffffff"
        />
      </div>
    );
  }

  return (
    <>
      <section className="map-section">
        <MapGLWithBasket
          initialLocation={initialLocation}
          initialZoom={initialZoom}
          isResetVisible={true}
          markersList={convertToMapMarkers(activities)}
          labels={filters}
          fetchMarkersWithinBounds={fetchMarkersWithinBounds}
          isMarkerClickable={true}
          onMarkerClick={handleMarkerClick}
        />
      </section>

      {error && (
        <p className="main__error">
          Failed Loading Map & Activities
        </p>
      )}
    </>
  );
};

export default MapSection;
