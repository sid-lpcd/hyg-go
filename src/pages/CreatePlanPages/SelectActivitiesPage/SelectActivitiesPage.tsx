import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getPlanById,
  updatePlanWithActivities,
} from "../../../utils/apiHelper";
import Header from "../../../components/sections/Header/Header";
import { computeAvailableHoursWithinDates } from "../../../utils/generalHelpers";
import { ToastContainer, toast } from "react-toastify";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Navigation from "../../../components/sections/Navigation/Navigation";
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
import { BasketState, BasketActivity, LocationState, PlanWithActivities } from "../../../types";
import Form from "../../../components/base/Form/Form";

const SelectActivitiesPage: React.FC = () => {
  const location = useLocation();
  const locationId = location.pathname.split("/")[2];

  const navigate = useNavigate();

  const { 
    basketState, 
    setBasketState, 
    clearBasket 
  } = useBasket();

  const [page, setPage] = useState<string | undefined>(location.pathname.split("/").pop());
  const [openTripModal, setOpenTripModal] = useState<boolean>(false);
  const [planInfo, setPlanInfo] = useState<PlanWithActivities | undefined>(undefined);
  const [progress, setProgress] = useState<number>(0);
  const [totalTripLength, setTotalTripLength] = useState<number>(0);
  const [planStatus] = useState<string | null>(
    (location.state as LocationState)?.planStatus || null
  );
  const [selectedActivity, setSelectedActivity] = useState<BasketActivity | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

  const handleSaveTrip = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!basketState || basketState.activities.length === 0) return;
    try {
      await updatePlanWithActivities(
        planInfo!.planId,
        basketState.activities
      );
      clearBasket();
    } catch (error) {
      console.error(error);
    }
    navigate(`/`);
    setOpenTripModal(false);
  };

  const updatedProgress = (basket: BasketState): void => {
    let activityTime = 0;
    if (basket.activities.length === 0) {
      activityTime = 0;
    } else if (basket.activities.length === 1) {
      const activity = basket.activities[0];
      activityTime = ('duration' in activity ? Number(activity.duration) : 1) || 1;
    } else {
      activityTime = basket.activities.reduce(
        (total, activity) => {
          const duration = 'duration' in activity ? Number(activity.duration) : 1;
          return total + (duration || 1);
        },
        0
      );
    }

    setProgress(activityTime);
  };

  const compareBasket = (response: PlanWithActivities): void => {
    if (!basketState?.planId || basketState.planId !== response.planId) {
    
      const newBasket: BasketState = { 
        planId: response.planId, 
        activities: [],
        gratuity: 0 
      };
      console.log("Comparing basket with plan activities:", response.activities);
      response.activities.forEach(activity => {
        console.log("Processing activity:", activity);
        if (isBasketActivity(activity)) {
          newBasket.activities.push(activity);
        } else {
          console.warn("Activity missing required details for basket:", activity);
        }
      });
      setBasketState(newBasket);
      updatedProgress(newBasket); 
    }
  };

  const isBasketActivity = (activity: any): activity is BasketActivity => {
    return 'name' in activity && 'locationId' in activity && 'planId' in activity;
  };

  const getPlanInfo = async (): Promise<void> => {
    try {
      const response = await getPlanById(parseInt(locationId), "detail");
      setPlanInfo(response);
      setTotalTripLength(computeAvailableHoursWithinDates(response.startDate, response.endDate));
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
    if (planInfo && basketState !== undefined) {
      compareBasket(planInfo);
    }
  }, [planInfo, basketState]);

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  useEffect(() => {
    getPlanInfo();
    if (planStatus) {
      toast(`Your plan was ${planStatus} successfully!`);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Header
        leftElement={
          <BackArrowIcon
            onClick={() => {
              const fromPath = (location.state as LocationState)?.fromPath;
              const isFromCreatePage = fromPath && fromPath.includes('/create');
              
              if (isFromCreatePage && planInfo) {
                navigate(fromPath, { 
                  state: { planInfo: planInfo } 
                });
              } else {
                navigate(-1);
              }
            }}
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
            locationId={planInfo?.locationId || 0}
            setSelectedActivity={(activity: BasketActivity) => {
              setSelectedActivity(activity);
              setShowMap(true);
            }}
          />
        )}
        {page === "map" && (
          <MapSection
            locationId={planInfo?.locationId || 0}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {page === "basket" && (
          <BasketSection
            planInfo={planInfo}
            setSelectedActivity={(activity: BasketActivity) => {
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
        open={!!selectedActivity}
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
          handleCancel={() => {
                clearBasket();
                navigate("/");
              }}
          handleSubmit={(e) => handleSaveTrip(e)}
        />
      </Modal>
    </>
  );
};

export default SelectActivitiesPage;
