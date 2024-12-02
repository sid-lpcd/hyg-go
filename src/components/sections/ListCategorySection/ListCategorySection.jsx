import { useEffect, useState } from "react";
import "./ListCategorySection.scss";

const ListCategorySection = ({ locationId }) => {
  const [categories, setCategories] = useState([]);

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesForLocation(locationId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);
  return <></>;
};

export default ListCategorySection;
