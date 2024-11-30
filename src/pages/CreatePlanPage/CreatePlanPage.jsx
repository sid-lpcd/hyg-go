import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import { DayPicker } from "react-day-picker";
import Header from "../../components/sections/Header/Header";
import { PeopleDropdown } from "../../components/base/PeopleDropdown/PeopleDropdown";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../assets/icons/close-icon.svg?react";
import InputText from "../../components/base/InputText/InputText";
import CalendarIcon from "../../assets/icons/calendar-icon.svg?react";
import Form from "../../components/base/Form/Form";
import "react-day-picker/style.css";
import "./CreatePlanPage.scss";
import { formatDate } from "../../utils/dateFormat";

const CreatePlanPage = () => {
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [datesDisplay, setDatesDisplay] = useState(false);
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

  const datepickerRef = useRef(null);
  const startRef = useRef(null);
  const endRef = useRef(null);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
  };

  const handleSelectLocation = (location) => {
    setLocation(location);
    setTripData({ ...tripData, location_id: location.id });
  };

  const handleChangePeople = (field, value) => {
    if (field === "adults")
      setTripData({
        ...tripData,
        people: {
          ...tripData.people,
          adults: Math.max(1, tripData.people.adults + value),
        },
      });
    if (field === "children")
      setTripData({
        ...tripData,
        people: {
          ...tripData.people,
          children: Math.max(0, tripData.people.children + value),
        },
      });
    if (field === "infant")
      setTripData({
        ...tripData,
        people: {
          ...tripData.people,
          infant: Math.max(0, tripData.people.infant + value),
        },
      });
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

  const handleClickOutside = (event) => {
    if (
      !datepickerRef?.current?.contains(event.target) &&
      !startRef?.current?.contains(event.target) &&
      !endRef?.current?.contains(event.target)
    ) {
      setDatesDisplay(false); // Close the date picker
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            ref={startRef}
            onClick={() => setDatesDisplay(true)}
          >
            <CalendarIcon className="dates__icon" />
            <p className="dates__text">
              {`${formatDate(tripData.start_date)} - ${formatDate(
                tripData.end_date,
                Date.now() + 24 * 60 * 60 * 1000
              )}`}
            </p>
          </article>

          <PeopleDropdown
            changeCount={handleChangePeople}
            people={tripData.people}
          />
        </section>

        <section
          className={`datepicker-container${
            !datesDisplay ? " datepicker-container--hidden" : ""
          }`}
          ref={datepickerRef}
        >
          <DayPicker
            modifiers={{
              selected: tripData.start_date
                ? {
                    after: tripData.start_date,
                    before: tripData.end_date,
                  }
                : undefined,
              range_start: tripData?.start_date,
              range_end: tripData?.end_date,
            }}
            onDayClick={(day) => {
              if (tripData.start_date && tripData.end_date) {
                setTripData({
                  ...tripData,
                  start_date: day,
                  end_date: null,
                });
                return;
              }
              if (!tripData.start_date) {
                setTripData({ ...tripData, start_date: day });
                return;
              } else {
                setTripData({ ...tripData, end_date: day });
                return;
              }
            }}
            disabled={{
              before: !tripData.end_date
                ? new Date() < tripData.start_date
                  ? tripData.start_date
                  : new Date()
                : new Date(),
            }}
            showOutsideDays
            numberOfMonths={2}
          />
        </section>
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
