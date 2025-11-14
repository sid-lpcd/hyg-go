import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/timegrid";
import "./CalendarScheduleSection.scss";
import { useEffect, useRef, useState } from "react";
import Modal from "react-responsive-modal";
import AddNewActivityForm from "../AddNewActivityForm/AddNewActivityForm";
import { InfinitySpin } from "react-loader-spinner";
import { Plan, PlanActivityWithDetails } from "../../../types/common";
import { CalendarEvent } from "../../../types/common/calendar";
import { CalendarApi } from "@fullcalendar/core/index.js";

interface CalendarScheduleSectionProps {
  planInfo: Plan;
  activities: PlanActivityWithDetails[];
}

const CalendarScheduleSection: React.FC<CalendarScheduleSectionProps> = ({ planInfo, activities }) => {
  const calendarRef = useRef<FullCalendar>(null);

  const [openModalNew, setOpenModalNew] = useState<boolean>(false);
  const [displayedActivities, setDisplayedActivities] = useState<CalendarEvent[]>([]);
  const [remainingActivities] = useState<PlanActivityWithDetails[]>([]);
  const [, setError] = useState<string>("");

  const handleEventClick = () => {};

  const handleCloseModal = (): void => {
    setOpenModalNew(false);
    setError("");
  };

  const createEventId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  function addNewEvent(newActivity: PlanActivityWithDetails): void {
    const calendarApi: CalendarApi | undefined = calendarRef.current?.getApi();

    if (newActivity && calendarApi) {
      calendarApi.addEvent({
        id: createEventId(),
        title: newActivity.name,
        start: newActivity.startDate,
        end: newActivity.endDate,
        allDay: false,
      });
    }
  }

  const multiDayEventFormat = (activity: PlanActivityWithDetails): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    const endDateTime = new Date(activity.endDate);

    let currentStart = new Date(activity.startDate);

    while (currentStart <= endDateTime) {
      const nextDay = new Date(currentStart);
      nextDay.setUTCDate(currentStart.getUTCDate() + 1);
      nextDay.setUTCHours(0, 0, 0, 0); // Midnight of the next day

      // Determine the end time for the current day's event
      const currentEnd =
        nextDay <= endDateTime ? new Date(nextDay.getTime() - 1000) : endDateTime;

      // Push the event for the current day
      events.push({
        id: activity.activityId.toString(),
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

  const formatActivities = (activities: PlanActivityWithDetails[]): CalendarEvent[] => {
    let displayedActivities: CalendarEvent[] = [];

    console.log("Formatting activities:", activities);
    activities.forEach((activity) => {
      if (activity.startDate !== activity.endDate) {
        displayedActivities.push(...multiDayEventFormat(activity));
        return;
      }
      const event: CalendarEvent = {
        id: activity.activityId.toString(),
        title: activity.name,
        start: activity.startDate.toISOString(),
        end: activity.endDate.toISOString(),
        allDay: false,
      };

      displayedActivities.push(event);

      console.log("Formatted event:", event);
    });
    return displayedActivities;
  };

  const addDays = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
    date.setDate(date.getDate() + 1);

    return date.toLocaleDateString("en-CA", options); // Format back to YYYY-MM-DD
  };

  useEffect(() => {
    if (activities) {
      const tempDisplayedActivities: CalendarEvent[] = [];
      tempDisplayedActivities.push(...formatActivities(activities));
      setDisplayedActivities(tempDisplayedActivities);
    }
  }, [activities]);

  if (!planInfo || !activities) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          width="200"
          color="#ffffff"
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
          start: planInfo.startDate,
          end: addDays(planInfo.endDate),
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
