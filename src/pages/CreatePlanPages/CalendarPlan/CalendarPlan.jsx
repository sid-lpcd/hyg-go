import { useEffect, useState } from "react";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Header from "../../../components/sections/Header/Header";
import CalendarScheduleSection from "../../../components/sections/CalendarScheduleSection/CalendarScheduleSection";
import "./CalendarPlan.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { getAIPlan, getPlanById } from "../../../utils/apiHelper";
const CalendarPlan = () => {
  const location = useLocation();
  const planId = location.pathname.split("/")[2];

  const navigate = useNavigate();

  const [planInfo, setPlanInfo] = useState({});
  const [activities, setActivities] = useState([]);

  const getPlanActivities = async () => {
    try {
      const responsePlan = await getPlanById(planId);
      setPlanInfo(responsePlan);
      console.log(responsePlan);

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
    </>
  );
};

export default CalendarPlan;
