import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllCategoriesForLocation,
  getPlanById,
  updatePlanWithActivities,
} from "../../../utils/apiHelper";
import Header from "../../../components/sections/Header/Header";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Navigation from "../../../components/sections/Navigation/Navigation";
import Form from "../../../components/base/Form/Form";
import Modal from "react-responsive-modal";
import ListActivitiesSection from "../../../components/sections/ListActivitiesSection/ListActivitiesSection";
import MapSection from "../../../components/sections/MapPage/MapSection";
import BasketSection from "../../../components/sections/BasketSection/BasketSection";
import "./SelectActivitiesPage.scss";
import { InfinitySpin } from "react-loader-spinner";
import { getBasket, setBasket } from "../../../utils/sessionStorageHelper";

const SelectActivitiesPage = () => {
  const location = useLocation();
  const locationId = location.pathname.split("/")[2];
  const [page, setPage] = useState(location.pathname.split("/").pop());
  const [openTripModal, setOpenTripModal] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [basketState, setBasketState] = useState(null);

  const navigate = useNavigate();

  const handleSaveTrip = () => {
    if (basketState.length === 0) return;
    try {
      const response = updatePlanWithActivities(planInfo.plan_id, basketState);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    // navigate(`/`);
    setOpenTripModal(false);
  };

  const compareBasket = (planId) => {
    const basket = getBasket();

    if (basket.plan_id !== planId) {
      setBasketState({ plan_id: planId, activities: [] });
    } else {
      setBasketState(basket);
    }
  };

  const getPlanInfo = async () => {
    try {
      const response = await getPlanById(locationId);
      setPlanInfo(response);
      compareBasket(response.plan_id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!basketState) return;
    setBasket(basketState);
  }, [basketState]);

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  useEffect(() => {
    getPlanInfo();
  }, []);

  if (!planInfo || !basketState)
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
          <ListActivitiesSection
            locationId={planInfo?.location_id}
            planInfo={planInfo}
            basketState={basketState}
            setBasketState={setBasketState}
          />
        )}
        {page === "map" && (
          <MapSection
            locationId={planInfo?.location_id}
            planInfo={planInfo}
            basketState={basketState}
            setBasketState={setBasketState}
          />
        )}
        {page === "basket" && (
          <BasketSection
            locationId={planInfo?.location_id}
            planInfo={planInfo}
            basketState={basketState}
            setBasketState={setBasketState}
          />
        )}
      </main>
      <Navigation basketState={basketState} setBasketState={setBasketState} />

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
