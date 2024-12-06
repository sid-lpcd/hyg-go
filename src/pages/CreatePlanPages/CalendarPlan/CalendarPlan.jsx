import { useState } from "react";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Header from "../../../components/sections/Header/Header";
import CalendarScheduleSection from "../../../components/sections/CalendarScheduleSection/CalendarScheduleSection";

const CalendarPlan = () => {
  const [activities, setActivities] = useState([]);

  return (
    <>
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
      <main className="main">
        <CalendarScheduleSection activities={activities} />
      </main>
    </>
  );
};

export default CalendarPlan;
