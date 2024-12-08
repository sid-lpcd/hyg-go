import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/timegrid";
import "./CalendarScheduleSection.scss";
import { useEffect, useRef, useState } from "react";
import { combineDateTimeUTC, formatDateApi } from "../../../utils/dateFormat";
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

  const multiDayEventFormat = (activity) => {
    const events = [];

    const endDateTime = new Date(
      combineDateTimeUTC(activity.end_date, activity.end_time)
    );

    let currentStart = new Date(
      combineDateTimeUTC(activity.start_date, activity.start_time)
    );

    while (currentStart <= endDateTime) {
      const nextDay = new Date(currentStart);
      nextDay.setUTCDate(currentStart.getUTCDate() + 1);
      nextDay.setUTCHours(0, 0, 0, 0); // Midnight of the next day

      // Determine the end time for the current day's event
      const currentEnd =
        nextDay <= endDateTime ? new Date(nextDay - 1000) : endDateTime;

      // Push the event for the current day
      events.push({
        id: activity.activity_id,
        title: activity.name,
        start: currentStart.toISOString(),
        end: currentEnd.toISOString(),
        allDay: false,
      });

      // Move to the next day
      currentStart = new Date(nextDay);
    }
    return events;
  };

  const formatActivities = (activities) => {
    let currentActivity = activities;
    let displayedActivities = [];

    while (currentActivity) {
      if (
        currentActivity.activity.start_date !==
        currentActivity.activity.end_date
      ) {
        displayedActivities.push(
          ...multiDayEventFormat(currentActivity.activity)
        );
        currentActivity = currentActivity.next;
        continue;
      }
      let event = {
        id: currentActivity.activity.activity_id,
        title: currentActivity.activity.name,
        start: combineDateTimeUTC(
          formatDateApi(currentActivity.activity.start_date),
          currentActivity.activity.start_time
        ),
        end: combineDateTimeUTC(
          formatDateApi(currentActivity.activity.end_date),
          currentActivity.activity.end_time
        ),
        allDay: false,
      };
      displayedActivities.push(event);

      currentActivity = currentActivity.next;
    }
    return displayedActivities;
  };

  const addDays = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);

    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString("en-CA", options); // Format back to YYYY-MM-DD
  };

  useEffect(() => {
    if (activities) {
      let tempDisplayedActivities = [];
      activities.forEach((activity) => {
        tempDisplayedActivities.push(...formatActivities(activity));
      });
      setDisplayedActivities(tempDisplayedActivities);
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
        slotDuration="00:15:00"
        validRange={{
          start: planInfo.start_date,
          end: addDays(planInfo.end_date),
        }}
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
