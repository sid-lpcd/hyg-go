import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllCategoriesForLocation,
  getPlanById,
} from "../../../utils/apiHelper";
import Header from "../../../components/sections/Header/Header";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Navigation from "../../../components/sections/Navigation/Navigation";
import Form from "../../../components/base/Form/Form";
import Modal from "react-responsive-modal";
import ListActivitiesPage from "../../../components/sections/ListActivitiesSection/ListActivitiesSection";
import MapPage from "../../../components/sections/MapPage/MapPage";
import BasketPage from "../../../components/sections/BasketPage/BasketPage";
import "./SelectActivitiesPage.scss";

const SelectActivitiesPage = () => {
  const location = useLocation();
  const locationId = location.pathname.split("/")[2];
  const [page, setPage] = useState(location.pathname.split("/").pop());
  const [openTripModal, setOpenTripModal] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);

  const navigate = useNavigate();

  const handleSaveTrip = () => {
    console.log("Trip saved!");
    setOpenTripModal(false);
  };

  const getPlanInfo = async () => {
    try {
      const response = await getPlanById(locationId);
      console.log(response);
      setPlanInfo(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  useEffect(() => {
    getPlanInfo();
  }, []);

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
        {page === "activities" && (
          <ListActivitiesPage locationId={locationId} planInfo={planInfo} />
        )}
        {page === "map" && (
          <MapPage locationId={locationId} planInfo={planInfo} />
        )}
        {page === "basket" && (
          <BasketPage locationId={locationId} planInfo={planInfo} />
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
