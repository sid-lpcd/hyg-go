import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllCategoriesForLocation } from "../../../utils/apiHelper";
import Header from "../../../components/sections/Header/Header";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Error from "../../../assets/icons/error-icon.svg?react";
import Navigation from "../../../components/sections/Navigation/Navigation";
import Form from "../../../components/base/Form/Form";
import Modal from "react-responsive-modal";
import ListActivitiesPage from "../../../components/sections/ListActivitiesSection/ListActivitiesSection";
import ListCategorySection from "../../../components/sections/ListCategorySection/ListCategorySection";
import MapPage from "../../../components/sections/MapPage/MapPage";
import BasketPage from "../../../components/sections/BasketPage/BasketPage";
import "./SelectActivitiesPage.scss";

const SelectActivitiesPage = () => {
  const location = useLocation();
  const [page, setPage] = useState(location.pathname.split("/").pop());
  const locationId = location.pathname.split("/")[1];
  const [openTripModal, setOpenTripModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSaveTrip = () => {
    console.log("Trip saved!");
    setOpenTripModal(false);
  };

  const getAllCategories = async () => {
    try {
      const response = await getAllCategoriesForLocation(locationId);
      setCategories(response);
      setError(false);
    } catch (error) {
      setCategories([]);
      setError(true);
    }
  };

  useEffect(() => {
    getAllCategories();
    setPage(location.pathname.split("/").pop());
  }, [location]);

  return (
    <>
      <Header
        leftElement={
          <BackArrowIcon
            onClick={() => navigate(-1)}
            className="header__icon"
          />
        }
        rightElement={
          <CloseIcon
            onClick={() => setOpenTripModal(true)}
            className="header__icon"
          />
        }
      />
      <main className="main">
        {page === "list" && (
          <ListCategorySection
            locationId={locationId}
            categories={categories}
          />
        )}
        {categories.find((category) => category.name === page) && (
          <ListActivitiesPage category={page} locationId={locationId} />
        )}
        {page === "map" && <MapPage />}
        {page === "basket" && <BasketPage />}
        {error && (
          <p className="main__error">
            <Error /> This is a required field
          </p>
        )}
      </main>
      <Navigation />

      <Modal
        open={openTripModal}
        onClose={() => setOpenTripModal(false)}
        classNames={{
          modal: "react-responsive-modal-modal--save-trip",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <Form
          title="Do you want to save this trip?"
          handleCancel={() => navigate("/")}
          handleSubmit={() => handleSaveTrip()}
        />
      </Modal>
    </>
  );
};

export default SelectActivitiesPage;
