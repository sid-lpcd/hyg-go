import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import Header from "../../../components/sections/Header/Header";
import { PeopleDropdown } from "../../../components/base/PeopleDropdown/PeopleDropdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import InputText from "../../../components/base/InputText/InputText";
import CalendarIcon from "../../../assets/icons/calendar-icon.svg?react";
import ProfileIcon from "../../../assets/icons/profile-icon.svg?react";
import Form from "../../../components/base/Form/Form";
import "./MainCreatePage.scss";
import { formatDateDisplay } from "../../../utils/dateFormat";
import DatePicker from "../../../components/base/DatePicker/DatePicker";
import InspirationSection from "../../../components/sections/InspirationSection/InspirationSection";
import {
  addPlan,
  getAllLocations,
  getLocationById,
  updatePlan,
} from "../../../utils/apiHelper";

const MainCreatePage = () => {
  const locationState = useLocation();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [nextLocationUrl, setNextLocationUrl] = useState(false);
  const [openTripModal, setOpenTripModal] = useState(false);
  const [openDatesModal, setOpenDatesModal] = useState(false);
  const [openPeopleModal, setOpenPeopleModal] = useState(false);
  const [tripData, setTripData] = useState({
    user_id: 1,
    title: "",
    description: "",
    location_id: null,
    start_date: formatDateDisplay(null),
    end_date: formatDateDisplay(null, Date.now() + 24 * 60 * 60 * 1000),
    people: { adult: 1, children: 0, infant: 0 },
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
  const [updateVisible, setUpdateVisible] = useState(false);
  const [prevPlan, setPrevPlan] = useState(locationState.state || null);

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

  const onOpenModal = () => {
    if (updateVisible) {
      let { title, description } = prevPlan;
      setFormData({ ...formData, title, description, update: true });
    }
    setOpenTripModal(true);
  };
  const onCloseModal = () => {
    setOpenTripModal(false);
  };

  const handleSelectLocation = (location) => {
    if (typeof location === "string") {
      setLocation(location);
    } else if (location.error) {
      setLocation(location.error);
    } else {
      setLocation(
        `${location.name}${location.region ? `, ${location.region}` : ""} ${
          location.country ? `, ${location.country}` : ""
        }`
      );
    }
    setTripData({ ...tripData, location_id: location.location_id });
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorData({ ...errorData, [name]: false });
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async (e, location) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrorData = { ...errorData };
    const { update, ...newFormData } = formData;

    Object.keys(newFormData).forEach((key) => {
      if (!newFormData[key]) {
        newErrorData[key] = true;
        hasErrors = true;
      }
    });

    setErrorData(newErrorData);

    if (hasErrors) return;
    try {
      let response = null;
      let planStatus = null;
      if (tripData.location_id === prevPlan?.location_id && update === true) {
        await updatePlan(prevPlan?.plan_id, {
          ...tripData,
          ...newFormData,
        });
        response = prevPlan?.plan_id;
        planStatus = "updated";
      } else {
        response = await addPlan({ ...tripData, ...newFormData });
        planStatus = "created";
      }

      if (response) {
        setOpenTripModal(false);
        navigate(`/${location ? `create-plan/${response}/activities` : ""}`, {
          state: {
            planStatus: planStatus,
          },
        });
      }
    } catch (error) {
      setOpenTripModal(false);
      toast("Error creating plan", { type: "error" });
    }
  };

  const openUpdate = () => {
    let { title, description } = prevPlan;
    setFormData({ ...formData, title, description, update: true });
    handleCreatePlan();
  };

  const getLocations = async (name) => {
    try {
      const response = await getAllLocations(name);
      return response;
    } catch (error) {
      return { error: "No locations found" };
    }
  };

  const handleCreatePlan = () => {
    let hasErrors = false;
    const { title, description, ...newErrorData } = errorData;
    const {
      title: newTitle,
      description: newDescription,
      ...newFormData
    } = tripData;

    Object.keys(newFormData).forEach((key) => {
      if (!newFormData[key]) {
        newErrorData[key] = true;
        hasErrors = true;
      }
    });

    setErrorData({ ...errorData, ...newErrorData });

    if (hasErrors) return;

    setNextLocationUrl(true);
    setOpenTripModal(true);
  };

  const getLocationInfo = async (locationId) => {
    try {
      const response = await getLocationById(locationId);
      handleSelectLocation(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!locationState.state) return;
    let { planInfo } = locationState.state;
    setPrevPlan(planInfo);

    if (planInfo) {
      const { start_date, end_date, user_id, location_id, people, plan_id } =
        planInfo;
      getLocationInfo(planInfo.location_id);
      setTripData({
        ...tripData,
        start_date,
        end_date,
        user_id,
        location_id,
        people,
        plan_id,
      });
      setUpdateVisible(true);
    }
  }, []);

  useEffect(() => {
    navigate(".", { replace: true });
  }, [navigate]);

  return (
    <>
      <ToastContainer />
      <Header
        leftElement={
          <BackArrowIcon
            onClick={() => {
              tripData.location_id ? onOpenModal() : handleCancel();
            }}
            className="header__icon"
          />
        }
        rightElement={
          <CloseIcon
            onClick={() => {
              tripData.location_id ? onOpenModal() : handleCancel();
            }}
            className="header__icon"
          />
        }
      />
      <main className="main">
        <section className="plan-container">
          <div>
            <h1 className="plan-container__title">Plan your trip</h1>
            <h2 className="plan-container__subtitle">Where are you going?</h2>
          </div>
          <InputText
            isAutocomplete={true}
            getOptions={getLocations}
            inputValue={location}
            setInputValue={handleSelectLocation}
            placeholder="Where are you going?"
            error={errorData.location_id}
            setError={() => setErrorData({ ...errorData, location_id: false })}
          />
          <article
            className="dates-container"
            onClick={() => setOpenDatesModal(true)}
          >
            <CalendarIcon className="dates__icon" />
            <p className="dates__text">
              {`${formatDateDisplay(tripData.start_date)} - ${formatDateDisplay(
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
              {`${tripData.people.adult} Adults, ${tripData.people.children} Children, ${tripData.people.infant} Infants`}
            </p>
          </article>

          {updateVisible && (
            <button
              className="plan-container__update-plan-btn"
              onClick={openUpdate}
            >
              Update plan
            </button>
          )}

          <button
            className="plan-container__create-plan-btn"
            onClick={() => {
              setFormData({
                title: "",
                description: "",
                update: false,
              });
              handleCreatePlan();
            }}
          >
            Create plan
          </button>
        </section>

        <InspirationSection />
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
          handleSubmit={(e) => handleSubmit(e, nextLocationUrl)}
        />
      </Modal>
    </>
  );
};

export default MainCreatePage;
