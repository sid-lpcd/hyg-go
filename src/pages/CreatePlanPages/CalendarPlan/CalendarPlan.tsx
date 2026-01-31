import React, { useEffect, useState } from "react";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Header from "../../../components/sections/Header/Header";
import CalendarScheduleSection from "../../../components/sections/CalendarScheduleSection/CalendarScheduleSection";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createAIPlan,
  generatePass,
  getPlanById,
  updatePlanWithActivities
} from "../../../utils/apiHelper";
import Form from "../../../components/base/Form/Form";
import Modal from "react-responsive-modal";
import "./CalendarPlan.scss";
import { useBasket } from "../../../context/BasketContext";
import { Plan, PlanActivityWithDetails, PlanWithActivities } from "../../../types/common";

const CalendarPlan: React.FC = () => {
  const location = useLocation();
  const planId = location.pathname.split("/")[2];

  const navigate = useNavigate();

  const { } = useBasket();

  const [planInfo, setPlanInfo] = useState<Plan | null>(null);
  const [activities, setActivities] = useState<PlanActivityWithDetails[] | null>(null);
  const [openTripModal, setOpenTripModal] = useState<boolean>(false);

  const handleSaveTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (planInfo && activities) {
        await updatePlanWithActivities(
          planInfo.planId,
          activities.map(activity => ({
            ...activity,
            startDate: activity.startDate.toISOString(),
            endDate: activity.endDate.toISOString()
          }))
        );
        const pass = await generatePass(planInfo.planId)
        console.log(pass)
      }
    } catch (error) {
      console.error(error);
    }
    navigate(`/`);
    setOpenTripModal(false);
  };

  const getPlanActivities = async (): Promise<void> => {
    try {
      const planIdNum = parseInt(planId, 10);
      const responsePlan = await getPlanById(planIdNum);
      setPlanInfo(responsePlan);
      const planDTO = await createAIPlan(planIdNum) as PlanWithActivities;
      console.log("Fetched activities for plan:", planDTO.planId);
      setActivities(planDTO.activities as PlanActivityWithDetails[]);
      console.log("Activities set in state:", planDTO.activities.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlanActivities();
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
      <main className="main main--calendar">
        {planInfo && activities && (
          <CalendarScheduleSection planInfo={planInfo} activities={activities} />
        )}
      </main>
      <footer className="calendar__footer">
        <button
          className="calendar__confirm-btn"
          onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
            await handleSaveTrip(e as any);
            // await deleteBasket();
            navigate("/");
          }}
        >
          Confirm
        </button>
      </footer>

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

export default CalendarPlan;
