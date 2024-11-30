import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import Header from "../../components/sections/Header/Header";
import { PeopleDropdown } from "../../components/base/PeopleDropdown/PeopleDropdown";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../assets/icons/close-icon.svg?react";
import InputText from "../../components/base/InputText/InputText";
import CalendarIcon from "../../assets/icons/calendar-icon.svg?react";
import ProfileIcon from "../../assets/icons/profile-icon.svg?react";
import Form from "../../components/base/Form/Form";
import "./CreatePlanPage.scss";
import { formatDate } from "../../utils/dateFormat";
import DatePicker from "../../components/base/DatePicker/DatePicker";

const CreatePlanPage = () => {
  const [location, setLocation] = useState("");
  const [openTripModal, setOpenTripModal] = useState(false);
  const [openDatesModal, setOpenDatesModal] = useState(false);
  const [openPeopleModal, setOpenPeopleModal] = useState(false);
  const [tripData, setTripData] = useState({
    user_id: 1,
    title: "",
    description: "",
    location_id: null,
    start_date: null,
    end_date: null,
    people: { adults: 1, children: 0, infant: 0 },
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

  const onOpenModal = () => setOpenTripModal(true);
  const onCloseModal = () => {
    setOpenTripModal(false);
  };

  const handleSelectLocation = (location) => {
    setLocation(location);
    setTripData({ ...tripData, location_id: location.id });
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
        <section className="plan-container">
          <InputText
            isAutocomplete={true}
            getOptions={getLocations}
            inputValue={location}
            setInputValue={handleSelectLocation}
            placeholder="Where are you going?"
          />
          <article
            className="dates-container"
            onClick={() => setOpenDatesModal(true)}
          >
            <CalendarIcon className="dates__icon" />
            <p className="dates__text">
              {`${formatDate(tripData.start_date)} - ${formatDate(
                tripData.end_date,
                Date.now() + 24 * 60 * 60 * 1000
              )}`}
            </p>
          </article>

          <article
            className="people-dropdown"
            onClick={() => setOpenPeopleModal(true)}
          >
            <ProfileIcon className="people-dropdown__icon" />
            <p className="people-dropdown__summary">
              {`${tripData.people.adults} Adults, ${tripData.people.children} Children, ${tripData.people.infant} Infants`}
            </p>
          </article>
        </section>
      </main>

      <Modal
        open={openPeopleModal}
        onClose={() => setOpenPeopleModal(false)}
        classNames={{
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <PeopleDropdown
          tripData={tripData}
          setTripData={setTripData}
          onClose={() => setOpenPeopleModal(false)}
        />
      </Modal>

      <Modal
        open={openDatesModal}
        onClose={() => setOpenDatesModal(false)}
        showCloseIcon={false}
        classNames={{
          modal: "react-responsive-modal-modal--dates",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <DatePicker
          tripData={tripData}
          setTripData={setTripData}
          onClose={() => setOpenDatesModal(false)}
        />
      </Modal>

      <Modal
        open={openTripModal}
        onClose={onCloseModal}
        classNames={{
          modal: "react-responsive-modal-modal--save-trip",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
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
