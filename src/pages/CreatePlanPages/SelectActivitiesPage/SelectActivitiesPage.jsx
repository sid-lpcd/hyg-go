import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllCategoriesForLocation,
  getPlanById,
  updatePlanWithActivities,
} from "../../../utils/apiHelper";
import Header from "../../../components/sections/Header/Header";
import { getBasket, setBasket } from "../../../utils/localStorageHelper";
import { calcLength, getNumbers } from "../../../utils/generalHelpers";
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

const SelectActivitiesPage = () => {
  const location = useLocation();
  const locationId = location.pathname.split("/")[2];

  const navigate = useNavigate();

  const [page, setPage] = useState(location.pathname.split("/").pop());
  const [openTripModal, setOpenTripModal] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [basketState, setBasketState] = useState(null);
  const [progress, setProgress] = useState(null);
  const [totalTripLength, setTotalTripLength] = useState(null);
  const [planStatus, setPlanStatus] = useState(
    location.state?.planStatus || null
  );
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    if (basketState.length === 0) return;
    try {
      const response = await updatePlanWithActivities(
        planInfo.plan_id,
        basketState
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    // navigate(`/`);
    setOpenTripModal(false);
  };

  const getActivityDuration = (activity) => {
    let duration = 1;
    try {
      duration = Math.floor(
        (getNumbers(activity?.duration, 0) +
          getNumbers(activity?.duration, 1)) /
          2
      );
    } catch (error) {
      console.error(error);
    }
    return duration;
  };

  const updatedProgress = (basket) => {
    let activityTime = 0;
    if (basket.activities.length === 0) {
      activityTime = 0;
    } else if (basket.activities.length === 1) {
      activityTime = getActivityDuration(basket.activities[0]);
    } else {
      activityTime = basket.activities.reduce(
        (total, activity) => total + getActivityDuration(activity),
        0
      );
    }

    setProgress(activityTime);
  };
  const compareBasket = (planId) => {
    const basket = getBasket();

    if (basket.plan_id !== planId) {
      setBasketState({ plan_id: planId, activities: [], gratuity: 0 });
    } else {
      setBasketState(basket);
      updatedProgress(basket);
    }
  };

  const getPlanInfo = async () => {
    try {
      const response = await getPlanById(locationId);
      setPlanInfo(response);
      setTotalTripLength(calcLength(response.start_date, response.end_date));
      compareBasket(response.plan_id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!basketState) return;
    setBasket(basketState);
    updatedProgress(basketState);
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
            locationId={planInfo?.location_id}
            planInfo={planInfo}
            basketState={basketState}
            setBasketState={setBasketState}
            setSelectedActivity={(activity) => {
              setSelectedActivity(activity);
              setShowMap(true);
            }}
          />
        )}
        {page === "map" && (
          <MapSection
            locationId={planInfo?.location_id}
            basketState={basketState}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {page === "basket" && (
          <BasketSection
            planInfo={planInfo}
            basketState={basketState}
            setBasketState={setBasketState}
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
          <CheckoutSection
            basketState={basketState}
            setBasketState={setBasketState}
          />
        ) : (
          <ProgressBar total={totalTripLength} current={progress} />
        )}
        <Navigation basketState={basketState} />
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
          activityId={selectedActivity?.activity_id}
          planInfo={planInfo}
          basketState={basketState}
          setBasketState={setBasketState}
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
          handleCancel={() => navigate("/")}
          handleSubmit={(e) => handleSaveTrip(e)}
        />
      </Modal>
    </>
  );
};

export default SelectActivitiesPage;
