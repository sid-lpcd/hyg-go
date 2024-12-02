import { useEffect, useState } from "react";
import Error from "../../../assets/icons/error-icon.svg?react";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import "./ListActivitiesSection.scss";
import { getAllAttractionsForLocation } from "../../../utils/apiHelper";

const ListActivitiesSection = ({ locationId }) => {
  let filters = {};
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    tags: [],
  });
  const [error, setError] = useState(false);
  const [activities, setActivities] = useState([]);

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
  return (
    <>
      <div className="list-activities">
        <h2 className="list-activities__title">Activities</h2>
        <div className="list-activities__filters"></div>
        <div className="list-activities__list">
          {activities.map((activity) => {
            return <ActivityCard key={activity.id} activity={activity} />;
          })}
        </div>
      </div>

      {error && (
        <p className="main__error">
          <Error /> This is a required field
        </p>
      )}
    </>
  );
};

export default ListActivitiesSection;
