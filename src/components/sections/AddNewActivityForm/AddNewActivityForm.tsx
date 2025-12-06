import React, { useState } from "react";
import "./AddNewActivityForm.scss";
import Form from "../../base/Form/Form";
import { Plan, Activity, FormLabel, CalendarEvent, AddActivityFormData } from "../../../types/common";

interface AddNewActivityFormProps {
  planInfo?: Plan;
  availableActivities: Activity[];
  addNewEvent: (event: CalendarEvent) => void;
  handleCloseModal: () => void;
}

interface ErrorData extends Record<string, boolean> {
  activity: boolean;
  start_date: boolean;
}

const AddNewActivityForm: React.FC<AddNewActivityFormProps> = ({
  planInfo,
  availableActivities,
  addNewEvent,
  handleCloseModal,
}) => {
    //TODO: Review min max date handling
    // Have date as date objects
  const labels: FormLabel[] = [
    {
      type: "select",
      name: "activity",
      text: "Activity",
      placeholder: "Select an activity",
      options: availableActivities.map((activity) => activity.name),
    },
    {
      type: "datetime-local",
      name: "start_date",
      text: "Start Date",
      placeholder: "Start Date",
      min: planInfo?.startDate.toISOString().slice(0, 16),
      max: planInfo?.endDate.toISOString().slice(0, 16),
    },
  ];

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<AddActivityFormData>({
    activity: "",
    start_date: "",
  });
  const [errorData, setErrorData] = useState<ErrorData>({
    activity: false,
    start_date: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    let activityTemp: Activity | null = null;
    
    if (name === "activity") {
      activityTemp = availableActivities.find(
        (activity) => activity.activityId.toString() === value
      ) || null;
      setSelectedActivity(activityTemp);
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    setErrorData({
      ...errorData,
      [name]: false,
    });
  };

  const handleAddEvent = (e: React.FormEvent): void => {
    e.preventDefault();

    let hasErrors = false;
    const newErrorData = { ...errorData };

    if (!formData.activity) {
      newErrorData.activity = true;
      hasErrors = true;
    }
    if (!formData.start_date) {
      newErrorData.start_date = true;
      hasErrors = true;
    }

    setErrorData(newErrorData);

    if (hasErrors || !selectedActivity) {
      return;
    }

    // Calculate end time based on activity duration (assuming duration is in hours)
    const startTime = new Date(formData.start_date);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + (selectedActivity.duration || 1));

    addNewEvent({
      id: selectedActivity.activityId.toString(),
      title: selectedActivity.name,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      allDay: false,
    });

    handleCloseModal();
  };

  return (
    <>
      <Form
        title={"Add New Event"}
        labels={labels}
        handleSubmit={handleAddEvent}
        formData={formData}
        errorData={errorData}
        handleChange={handleChange}
        handleCancel={handleCloseModal}
      />
    </>
  );
};

export default AddNewActivityForm;