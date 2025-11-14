import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import "./DatePicker.scss";
import { Plan } from "../../../types/common/plan";

interface DatePickerProps {
  tripData: Partial<Plan>;
  setTripData: (data: Partial<Plan>) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ tripData, setTripData, onClose }) => {
  const [localDates, setLocalDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: tripData.startDate || null,
    endDate: tripData.endDate || null,
  });

  useEffect(() => {
    setLocalDates({
      startDate: tripData.startDate || null,
      endDate: tripData.endDate || null,
    });
  }, [tripData]);

  const handleDayClick = (day: Date): void => {
    if (localDates.startDate && localDates.endDate) {
      setLocalDates({
        startDate: day,
        endDate: null,
      });
      return;
    }
    if (!localDates.startDate) {
      setLocalDates({ ...localDates, startDate: day });
      return;
    } else if (day < localDates.startDate) {
      setLocalDates({ ...localDates, startDate: day, endDate: null });
    } else {
      setLocalDates({ ...localDates, endDate: day });
    }
  };

  const handleDone = (): void => {
    setTripData({
      ...tripData,
      startDate: localDates.startDate,
      endDate: localDates.endDate,
    });
    onClose();
  };

  return (
    <>
      <div className="datepicker-container">
        <DayPicker
          modifiers={{
            selected: localDates.startDate
              ? {
                  after: localDates.startDate,
                  before: localDates.endDate,
                }
              : undefined,
            range_start: localDates.startDate,
            range_end: localDates.endDate,
          }}
          onDayClick={handleDayClick}
          disabled={{
            before: new Date(),
          }}
          numberOfMonths={1}
        />
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
