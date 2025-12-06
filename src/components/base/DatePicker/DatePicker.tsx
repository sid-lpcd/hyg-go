import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import "./DatePicker.scss";
import { TripData } from "@/types";

interface DatePickerProps {
  tripData: TripData;
  setTripData: (data: TripData) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ tripData, setTripData, onClose }) => {
  const [localDates, setLocalDates] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: tripData.startDate ? new Date(tripData.startDate) : undefined,
    endDate: tripData.endDate ? new Date(tripData.endDate) : undefined,
  });

  useEffect(() => {
    setLocalDates({
      startDate: tripData.startDate ? new Date(tripData.startDate) : undefined,
      endDate: tripData.endDate ? new Date(tripData.endDate) : undefined,
    });
  }, [tripData]);

  const handleDayClick = (day: Date): void => {
    if (localDates.startDate && localDates.endDate) {
      setLocalDates({
        startDate: day,
        endDate: undefined,
      });
      return;
    }
    if (!localDates.startDate) {
      setLocalDates({ ...localDates, startDate: day });
      return;
    } else if (day < localDates.startDate) {
      setLocalDates({ ...localDates, startDate: day, endDate: undefined });
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
            selected: localDates.startDate && localDates.endDate
              ? {
                  after: localDates.startDate,
                  before: localDates.endDate,
                }
              : localDates.startDate,
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
