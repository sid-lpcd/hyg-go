import { useState } from "react";
import "./AddNewActivityForm.scss";
import Form from "../../base/Form/Form";
const AddNewActivityForm = ({
  planInfo,
  availableActivities,
  addNewEvent,
  handleCloseModal,
}) => {
  const labels = [
    {
      type: "select",
      name: "activity",
      placeholder: "Select an activity",
      options: availableActivities.map((activity) => ({
        label: activity.name,
        value: activity.activity_id,
      })),
    },
    {
      type: "datetime-local",
      name: "start_date",
      placeholder: "Start Date",
      min: planInfo?.start_date,
      max: planInfo?.end_date,
    },
  ];
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: null,
    start: null,
    end: null,
    allDay: false,
  });
  const [errorData, setErrorData] = useState({
    id: null,
    title: null,
    start: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let activityTemp = null;
    if (name === "activity") {
      activityTemp = availableActivities.find(
        (activity) => activity.activity_id === value
      );
      setSelectedActivity(activityTemp);
    }
    setFormData({
      ...formData,
      [name]: value,
      end: formData.start ? formData.start + selectedActivity.duration : null,
    });
  };

  const handleAddEvent = () => {
    if (!selectedActivity || !startDateTime || !endDateTime) {
      setError("Please complete all fields before adding the event.");
      return;
    }

    addNewEvent({
      id: selectedActivity.activity_id,
      title: selectedActivity.name,
      start: startDateTime,
      end: endDateTime,
      allDay: false,
    });

    // Reset the modal fields

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
