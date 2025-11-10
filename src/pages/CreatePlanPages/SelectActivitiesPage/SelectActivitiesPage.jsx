import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllCategoriesForLocation,
  getPlanById,
  updatePlanWithActivities,
} from "../../../utils/apiHelper";
import Header from "../../../components/sections/Header/Header";
import { computeAvailableHoursWithinDates, getNumbers } from "../../../utils/generalHelpers";
import { ToastContainer, toast } from "react-toastify";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Navigation from "../../../components/sections/Navigation/Navigation";
import Form from "../../../components/base/Form/Form";
import Modal from "react-responsive-modal";
import ListActivitiesSection from "../../../components/sections/ListActivitiesSection/ListActivitiesSection";
import MapSection from "../../../components/sections/MapSection/MapSection";
import BasketSection from "../../../components/sections/BasketSection/BasketSection";
import ProgressBar from "../../../components/base/ProgressBar/ProgressBar";
import ActivityModal from "../../../components/sections/ActivityModal/ActivityModal";
import CheckoutSection from "../../../components/sections/CheckoutSection/CheckoutSection";
import "./SelectActivitiesPage.scss";
import "react-toastify/dist/ReactToastify.css";
import { useBasket } from "../../../context/BasketContext";

const SelectActivitiesPage = () => {
  const location = useLocation();
  const locationId = location.pathname.split("/")[2];

  const navigate = useNavigate();

  const { 
    basketState, 
    setBasketState, 
    addActivity, 
    removeActivity,
    clearBasket 
  } = useBasket();

  const [page, setPage] = useState(location.pathname.split("/").pop());
  const [openTripModal, setOpenTripModal] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [totalTripLength, setTotalTripLength] = useState(null);
  const [planStatus, setPlanStatus] = useState(
    location.state?.planStatus || null
  );
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    if (!basketState || basketState.activities.length === 0) return;
    try {
      const response = await updatePlanWithActivities(
        planInfo.planId,
        basketState.activities
      );
      console.log(response);
      clearBasket();
    } catch (error) {
      console.error(error);
    }
    navigate(`/`);
    setOpenTripModal(false);
  };

  const updatedProgress = (basket) => {
    let activityTime = 0;
    console.log("Calculating progress for basket:", basket);
    if (basket.activities.length === 0) {
      activityTime = 0;
    } else if (basket.activities.length === 1) {
      activityTime = Number(basket.activities[0]?.duration) || 1;
    } else {
      activityTime = basket.activities.reduce(
        (total, activity) => total + (Number(activity?.duration) || 1),
        0
      );
    }

    setProgress(activityTime);
  };

  const compareBasket = (response) => {
    console.log("Comparing basket with response:", basketState, response);
    if (!basketState?.planId || basketState.planId !== response.planId) {
      const newBasket = { 
        planId: response.planId, 
        activities: response.activities, 
        gratuity: 0 
      };
      setBasketState(newBasket);
      updatedProgress(newBasket); 
    }
  };

  const getPlanInfo = async () => {
    try {
      const response = await getPlanById(locationId);
      console.log("Fetched plan info:", response);
      setPlanInfo(response);
      setTotalTripLength(computeAvailableHoursWithinDates(response.startDate, response.endDate));
      compareBasket(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (basketState) {
      updatedProgress(basketState);
    }
  }, [basketState]);

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  useEffect(() => {
    getPlanInfo();
    if (planStatus) {
      toast(`Your plan was ${planStatus} successfully!`);
    }
  }, []);

  useEffect(() => {
    if (!location.state) return;
    navigate("./activities", { replace: true }); // <-- redirect to current path w/o state
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <Header
        leftElement={
          <BackArrowIcon
            onClick={() =>
              navigate("/create-plan", { state: { planInfo: planInfo } })
            }
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
      <main className={`main${page === "basket" ? " main--basket" : ""}`}>
        {page === "activities" && (
          <ListActivitiesSection
            locationId={planInfo?.locationId}
            setSelectedActivity={(activity) => {
              setSelectedActivity(activity);
              setShowMap(true);
            }}
          />
        )}
        {page === "map" && (
          <MapSection
            locationId={planInfo?.locationId}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {page === "basket" && (
          <BasketSection
            planInfo={planInfo}
            setSelectedActivity={(activity) => {
              setSelectedActivity(activity);
              setShowMap(true);
            }}
          />
        )}
      </main>
      <div
        className={`bottom-fixed${
          page === "basket" ? " bottom-fixed--basket" : ""
        }`}
      >
        {page === "basket" ? (
          <CheckoutSection />
        ) : (
          <ProgressBar total={totalTripLength} current={progress} />
        )}
        <Navigation />
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
        <ActivityModal
          activityId={selectedActivity?.activityId}
          planInfo={planInfo}
          onClose={() => setSelectedActivity(null)}
          showMap={showMap}
        />
      </Modal>

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
          handleCancel={() =>{ 
            clearBasket();
            navigate("/")
          }}
          handleSubmit={(e) => handleSaveTrip(e)}
        />
      </Modal>
    </>
  );
};

export default SelectActivitiesPage;
