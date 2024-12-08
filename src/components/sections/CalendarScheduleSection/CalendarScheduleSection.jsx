import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/timegrid";
import "./CalendarScheduleSection.scss";
import { useEffect, useRef, useState } from "react";
import { combineDateTimeUTC } from "../../../utils/dateFormat";
import Modal from "react-responsive-modal";
import AddNewActivityForm from "../AddNewActivityForm/AddNewActivityForm";
import { InfinitySpin } from "react-loader-spinner";
const CalendarScheduleSection = ({ planInfo, activities }) => {
  const calendarRef = useRef(null);

  const [openModalNew, setOpenModalNew] = useState(false);
  const [displayedActivities, setDisplayedActivities] = useState([]);
  const [remainingActivities, setRemainingActivities] = useState([]);

  const handleEventClick = () => {};

  const handleCloseModal = () => {
    setOpenModalNew(false);
    setError("");
  };

  function addNewEvent(newActivity) {
    let calendarApi = calendarRef.current.getApi();

    if (newActivity) {
      calendarApi.addEvent({
        id: createEventId(),
        title: newActivity.name,
        start: combineDateTimeUTC(
          newActivity.start_date,
          newActivity.start_time
        ),
        end: combineDateTimeUTC(newActivity.end_date, newActivity.end_time),
        allDay: false,
      });
    }
  }
  const formatActivities = (activities) => {
    let currentActivity = activities[0];
    let displayedActivities = [];

    while (currentActivity) {
      let event = {
        id: currentActivity.activity.activity_id,
        title: currentActivity.activity.name,
        start: combineDateTimeUTC(
          currentActivity.activity.start_date,
          currentActivity.activity.start_time
        ),
        end: combineDateTimeUTC(
          currentActivity.activity.end_date,
          currentActivity.activity.end_time
        ),
        allDay: false,
      };
      displayedActivities.push(event);

      currentActivity = currentActivity.next;
    }
    return displayedActivities;
  };
  useEffect(() => {
    if (activities.length) {
      setDisplayedActivities(formatActivities(activities));
    }
  }, [activities]);
  if (!planInfo || !activities) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#ffffff"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }
  return (
    <section className="calendar">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="timeGridDay"
        events={displayedActivities}
        editable={true}
        selectable={true}
        selectMirror={true}
        eventClick={handleEventClick}
        titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
      />
      <button
        className="calendar__add-btn"
        onClick={() => setOpenModalNew(true)}
      >
        +
      </button>
      <Modal
        open={openModalNew}
        onClose={() => setOpenModalNew(false)}
        center
        classNames={{
          modal: "activity-modal activity-modal--new-activity",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <AddNewActivityForm
          planInfo={planInfo}
          addNewEvent={addNewEvent}
          availableActivities={remainingActivities}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
    </section>
  );
};

export default CalendarScheduleSection;
