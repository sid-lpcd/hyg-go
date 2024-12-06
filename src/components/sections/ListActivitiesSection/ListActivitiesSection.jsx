import { useEffect, useState } from "react";
import { getAllAttractionsForLocation } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import Error from "../../../assets/icons/error-icon.svg?react";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import "./ListActivitiesSection.scss";
import Modal from "react-responsive-modal";
import ActivityModal from "../ActivityModal/ActivityModal";

const ListActivitiesSection = ({
  locationId,
  planInfo,
  basketState,
  setBasketState,
  setSelectedActivity,
}) => {
  let filters = {};
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    tags: [],
  });
  const [error, setError] = useState(false);
  const [activities, setActivities] = useState(null);

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

  useEffect(() => {
    getActivitiesByFilter();
  }, [selectedFilters]);

  useEffect(() => {
    if (!locationId) return;
    getAllActivities();
    filters = getAllFilters() || {};
  }, [locationId]);

  if (!activities || !basketState) {
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
      <div className="list-activities">
        <h1 className="list-activities__title">Activities</h1>
        <div className="list-activities__filters"></div>
        <div className="list-activities__list">
          {activities.map((activity) => {
            return (
              <ActivityCard
                key={activity.activity_id ? activity.activity_id : uuidv4()}
                activity={activity}
                openActivity={() => setSelectedActivity(activity)}
                basketState={basketState}
                setBasketState={setBasketState}
              />
            );
          })}
        </div>
        <button
          className="list-activities__load-more-btn"
          onClick={getAllActivities}
        >
          Load more
        </button>
      </div>

      {error && (
        <p className="main__error">
          <Error /> Failed Loading Activities
        </p>
      )}
    </>
  );
};

export default ListActivitiesSection;
