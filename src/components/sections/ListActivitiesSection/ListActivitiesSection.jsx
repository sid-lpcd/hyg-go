import { useEffect, useState } from "react";
import "./ListActivitiesSection.scss";

const ListActivitiesSection = ({ locationId, category }) => {
  const [activities, setActivities] = useState([]);

  const getActivitiesByCategory = async () => {
    try {
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getActivitiesByCategory();
  }, []);
  return <></>;
};

export default ListActivitiesSection;
