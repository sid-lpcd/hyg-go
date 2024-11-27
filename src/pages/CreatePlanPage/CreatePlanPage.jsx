import "./CreatePlanPage.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import Header from "../../components/sections/Header/Header";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../assets/icons/close-icon.svg?react";
import InputText from "../../components/base/InputText/InputText";
import axios from "axios";
import Form from "../../components/base/Form/Form";

const CreatePlanPage = () => {
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [tripData, setTripData] = useState({
    user_id: 1,
    title: "",
    description: "",
    location_id: null,
    start_date: "",
    end_date: "",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errorData, setErrorData] = useState({
    title: false,
    description: false,
    location_id: false,
    start_date: false,
    end_date: false,
  });

  const labels = [
    {
      name: "title",
      text: "Trip title",
      type: "input",
      placeholder: "Name your trip...",
    },
    {
      name: "description",
      text: "Description",
      type: "textarea",
      placeholder: "Describe your trip...",
    },
  ];

  const navigate = useNavigate();

  const handleSelectLocation = (location) => {
    setLocation(location);
    setTripData({ ...tripData, location_id: location.id });
  };

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorData({ ...errorData, [name]: false });
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrorData = { ...errorData };

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrorData[key] = true;
        hasErrors = true;
      }
    });

    setErrorData(newErrorData);

    if (hasErrors) return;
    try {
      const response = axios.post(
        `${import.meta.env.VITE_HYGGO_API_URL}/plans/`,
        { ...tripData, ...formData }
      );
    } catch (error) {}
    navigate("/");
  };

  const getLocations = async (name) => {
    let query = "";
    if (name) {
      query = `?search=${name}`;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_HYGGO_API_URL}/locations${query}`
      );

      return response.data;
    } catch (error) {
      return ["No locations found"];
    }
  };

  return (
    <>
      <Header
        leftElement={
          <BackArrowIcon onClick={onOpenModal} className="header__icon" />
        }
        rightElement={
          <CloseIcon onClick={onOpenModal} className="header__icon" />
        }
      />
      <main className="main">
        <InputText
          isAutocomplete={true}
          getOptions={getLocations}
          inputValue={location}
          setInputValue={handleSelectLocation}
          placeholder="Where are you going?"
        />
      </main>

      <Modal open={open} onClose={onCloseModal} center>
        <Form
          title="Do you want to save this trip?"
          labels={labels}
          formData={formData}
          errorData={errorData}
          handleChange={handleChangeForm}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
};

export default CreatePlanPage;
