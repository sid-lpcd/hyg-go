import { act, useEffect, useState } from "react";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Header from "../../../components/sections/Header/Header";
import CalendarScheduleSection from "../../../components/sections/CalendarScheduleSection/CalendarScheduleSection";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAIPlan,
  getPlanById,
  updatePlanWithActivitiesCalendar,
} from "../../../utils/apiHelper";
import Form from "../../../components/base/Form/Form";
import Modal from "react-responsive-modal";
import "./CalendarPlan.scss";
const CalendarPlan = () => {
  const location = useLocation();
  const planId = location.pathname.split("/")[2];

  const navigate = useNavigate();

  const [planInfo, setPlanInfo] = useState(null);
  const [activities, setActivities] = useState(null);
  const [openTripModal, setOpenTripModal] = useState(false);

  const handleSaveTrip = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePlanWithActivitiesCalendar(
        planInfo.plan_id,
        activities
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    // navigate(`/`);
    setOpenTripModal(false);
  };

  const getPlanActivities = async () => {
    try {
      console.log(planId);
      const responsePlan = await getPlanById(planId);
      console.log(responsePlan);
      setPlanInfo(responsePlan);
      const response = await getAIPlan(planId);
      console.log(response);
      setActivities(response);
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
        <CalendarScheduleSection planInfo={planInfo} activities={activities} />
      </main>
      <footer className="calendar__footer">
        <button
          className="calendar__confirm-btn"
          onClick={async (e) => {
            await handleSaveTrip(e);
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
