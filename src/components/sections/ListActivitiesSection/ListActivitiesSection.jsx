import { useEffect, useState } from "react";
import { getAllAttractionsForLocation } from "../../../utils/apiHelper";
import { InfinitySpin } from "react-loader-spinner";
import Error from "../../../assets/icons/error-icon.svg?react";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import "./ListActivitiesSection.scss";
import Modal from "react-responsive-modal";
import ActivityModal from "../ActivityModal/ActivityModal";

const ListActivitiesSection = ({ locationId }) => {
  let filters = {};
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    tags: [],
  });
  const [error, setError] = useState(false);
  const [activities, setActivities] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const getAllActivities = async () => {
    try {
      console.log("getting activities for location:", locationId);
      const response = await getAllAttractionsForLocation(locationId);
      console.log(response);
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
    getAllActivities();
    filters = getAllFilters() || {};
  }, []);

  if (!activities) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#1e6655"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }

  return (
    <>
      <div className="list-activities">
        <h2 className="list-activities__title">Activities</h2>
        <div className="list-activities__filters"></div>
        <div className="list-activities__list">
          {activities.map((activity) => {
            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                openActivity={() => setSelectedActivity(activity)}
              />
            );
          })}
        </div>
      </div>

      <Modal
        open={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        center
        classNames={{
          modal: "activity-modal activity-modal--activity",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <ActivityModal activityId={selectedActivity?.activity_id} />
      </Modal>

      {error && (
        <p className="main__error">
          <Error /> This is a required field
        </p>
      )}
    </>
  );
};

export default ListActivitiesSection;