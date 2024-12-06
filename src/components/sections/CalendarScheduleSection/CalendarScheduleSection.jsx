import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/timegrid";
import "./CalendarScheduleSection.scss";
const CalendarScheduleSection = ({ activities }) => {
  const handleEventClick = () => {};
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="timeGridDay"
        events={activities}
        editable={true}
        selectable={true}
        selectMirror={true}
        eventClick={handleEventClick}
        titleFormat={{ year: "numeric", month: "short", day: "numeric" }}
      />
    </>
  );
};

export default CalendarScheduleSection;
