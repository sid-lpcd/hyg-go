import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import "./DatePicker.scss";

const DatePicker = ({ tripData, setTripData, onClose }) => {
  const [localDates, setLocalDates] = useState({
    start_date: tripData.start_date || null,
    end_date: tripData.end_date || null,
  });
  const [months, setMonths] = useState(2);

  useEffect(() => {
    setLocalDates({
      start_date: tripData.start_date || null,
      end_date: tripData.end_date || null,
    });
  }, [tripData]);

  const handleDayClick = (day) => {
    if (localDates.start_date && localDates.end_date) {
      setLocalDates({
        start_date: day,
        end_date: null,
      });
      return;
    }
    if (!localDates.start_date) {
      setLocalDates({ ...localDates, start_date: day });
      return;
    } else {
      setLocalDates({ ...localDates, end_date: day });
    }
  };

  const handleDone = () => {
    setTripData({
      ...tripData,
      start_date: localDates.start_date,
      end_date: localDates.end_date,
    });
    onClose();
  };

  return (
    <>
      <div className="datepicker-container">
        <DayPicker
          modifiers={{
            selected: localDates.start_date
              ? {
                  after: localDates.start_date,
                  before: localDates.end_date,
                }
              : undefined,
            range_start: localDates.start_date,
            range_end: localDates.end_date,
          }}
          onDayClick={handleDayClick}
          disabled={{
            before: !localDates.end_date
              ? new Date() < localDates.start_date
                ? localDates.start_date
                : new Date()
              : new Date(),
          }}
          numberOfMonths={months}
          hideNavigation
        />
        <button
          onClick={() => {
            setMonths(months + 2);
          }}
          className="datepicker-container__load-more"
        >
          Load more
        </button>
      </div>
      <div className="datepicker-actions">
        <button
          onClick={onClose}
          className="datepicker-actions__btn datepicker-actions__btn--inactive"
        >
          Cancel
        </button>
        <button onClick={handleDone} className="datepicker-actions__btn">
          Done
        </button>
      </div>
    </>
  );
};

export default DatePicker;
