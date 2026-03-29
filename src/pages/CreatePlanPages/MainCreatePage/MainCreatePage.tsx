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
  getLocationByCoordinates,
  getLocationById,
  updatePlan,
} from "../../../utils/apiHelper";
import { 
  EntityId,
  Plan, 
  FormLabel, 
  LocationAutocompleteOption,
  PersonType,
  TripData,
  CreatePlanFormData,
  LocationState
} from "../../../types";
import { CreatePlanRequest, UpdatePlanRequest } from "../../../types/contract/requests/plan";

interface ErrorData extends Record<string, boolean> {
  title: boolean;
  description: boolean;
  locationId: boolean;
  startDate: boolean;
  endDate: boolean;
}

const MainCreatePage: React.FC = () => {
  const locationState = useLocation();
  const navigate = useNavigate();

  const [location, setLocation] = useState<string>("");
  const [nextLocationUrl, setNextLocationUrl] = useState<boolean>(false);
  const [openTripModal, setOpenTripModal] = useState<boolean>(false);
  const [openDatesModal, setOpenDatesModal] = useState<boolean>(false);
  const [openPeopleModal, setOpenPeopleModal] = useState<boolean>(false);
  const [tripData, setTripData] = useState<TripData>({
    title: "",
    description: "",
    locationId: null,
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    people: { [PersonType.ADULT]: 1, [PersonType.CHILD]: 0, [PersonType.INFANT]: 0 },
  });
  const [formData, setFormData] = useState<CreatePlanFormData>({
    title: "",
    description: "",
  });
  const [errorData, setErrorData] = useState<ErrorData>({
    title: false,
    description: false,
    locationId: false,
    startDate: false,
    endDate: false,
  });
  const [updateVisible, setUpdateVisible] = useState<boolean>(false);
  const [prevPlan, setPrevPlan] = useState<Plan | null>((locationState.state as LocationState)?.planInfo || null);

  const labels: FormLabel[] = [
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

  const onOpenModal = (): void => {
    if (updateVisible && prevPlan) {
      const { title, description } = prevPlan;
      setFormData({ ...formData, title: title || "", description: description || "", update: true });
    }
    setOpenTripModal(true);
  };

  const onCloseModal = (): void => {
    setOpenTripModal(false);
  };

  const handleSelectLocation = async (locationInput: string | LocationAutocompleteOption): Promise<void> => {
    if (typeof locationInput === "string") {
      setLocation(locationInput);
    } else {
      if (locationInput.name === "Use my current location") {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const response = await getLocationByCoordinates(latitude, longitude);
            if (!response) {
              setLocation("Location not found");
              return;
            }
            setLocation(
              `${response.name}${
                response.region ? `, ${response.region}` : ""
              } ${response.country ? `, ${response.country}` : ""}`
            );
            setTripData({ ...tripData, locationId: response.locationId });
          } catch (error) {
            console.error(error);
          }
        });
      } else {
        setLocation(
          `${locationInput.name}${locationInput.region ? `, ${locationInput.region}` : ""} ${
            locationInput.country ? `, ${locationInput.country}` : ""
          }`
        );
        const locationWithId = locationInput as any;
        setTripData({ ...tripData, locationId: locationWithId.locationId || null });
      }
    }
  };

  const handleChangeForm = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrorData({ ...errorData, [name]: false });
  };

  const handleCancel = (): void => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent, locationUrl: boolean): Promise<void> => {
    e.preventDefault();

    let hasErrors = false;
    const newErrorData = { ...errorData };
    const { update, ...newFormData } = formData;

    if (!newFormData.title || newFormData.title.trim() === '') {
      newErrorData.title = true;
      hasErrors = true;
    }

    setErrorData(newErrorData);

    if (hasErrors) return;
    
    try {
      let response: Plan | null = null;
      let planStatus: string;
      console.log("Trip Data, previous plan and update:", tripData, prevPlan, update);
      
      if (tripData.locationId === prevPlan?.locationId && update === true && prevPlan?.planId) {
        const updateData: UpdatePlanRequest = {
          ...newFormData,
          startDate: formatDateDisplay(tripData.startDate),
          endDate: formatDateDisplay(tripData.endDate),
          people: tripData.people,
          locationId: tripData.locationId || undefined,
        };
        await updatePlan(prevPlan.planId, updateData);
        response = prevPlan;
        planStatus = "updated";
      } else {
        if (!tripData.locationId) throw new Error("Location is required");
        
        const createData: CreatePlanRequest = {
          ...newFormData,
          userId: "1", // This should come from auth context
          locationId: tripData.locationId,
          startDate: formatDateDisplay(tripData.startDate),
          endDate: formatDateDisplay(tripData.endDate),
          people: tripData.people,
          isPublic: false,
        };
        response = await addPlan(createData);
        planStatus = "created";
      }

      if (response) {
        setOpenTripModal(false);
        navigate(`/${locationUrl ? `create-plan/${response.planId}/activities` : ""}`, {
          state: {
            planStatus: planStatus,
            fromPath: locationState?.pathname,
          },
        });
      }
    } catch (error) {
      setOpenTripModal(false);
      toast("Error creating plan", { type: "error" });
    }
  };

  const openUpdate = (): void => {
    if (prevPlan) {
      const { title, description } = prevPlan;
      setFormData({ ...formData, title: title || "", description: description || "", update: true });
      handleCreatePlan();
    }
  };

  const getLocations = async (name?: string): Promise<LocationAutocompleteOption[]> => {
    try {
      if (!name)
        return [{ name: "Use my current location" }];
      const response = await getAllLocations(name);
      const mappedResponse = response.map((loc: any) => ({
        name: loc.name,
        region: loc.region,
        country: loc.country,
        locationId: loc.locationId
      }));
      mappedResponse.unshift({ name: "Use my current location", region: undefined, country: undefined, locationId: undefined });
      return mappedResponse;
    } catch (error) {
      return [];
    }
  };

  const handleCreatePlan = (): void => {
    let hasErrors = false;
    const { title, description, ...newErrorData } = errorData;
    const {
      title: newTitle,
      description: newDescription,
      ...newFormData
    } = tripData;

    Object.keys(newFormData).forEach((key) => {
      if (!newFormData[key as keyof typeof newFormData]) {
        newErrorData[key as keyof typeof newErrorData] = true;
        hasErrors = true;
      }
    });

    setErrorData({ ...errorData, ...newErrorData });

    if (hasErrors) return;

    setNextLocationUrl(true);
    setOpenTripModal(true);
  };

  const getLocationInfo = async (locationId: EntityId): Promise<void> => {
    try {
      const response = await getLocationById(locationId);
      handleSelectLocation(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const state = locationState.state as LocationState;
    if (!state?.planInfo) return;
    
    const { planInfo } = state;
    setPrevPlan(planInfo);

    if (planInfo) {
      const { startDate, endDate, locationId, people, planId } = planInfo;
      getLocationInfo(planInfo.locationId);
      setTripData({
        ...tripData,
        startDate: startDate,
        endDate: endDate,
        locationId,
        people,
        planId,
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
              tripData.locationId ? onOpenModal() : handleCancel();
            }}
            className="header__icon"
          />
        }
        rightElement={
          <CloseIcon
            onClick={() => {
              tripData.locationId ? onOpenModal() : handleCancel();
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
            error={errorData.locationId}
            setError={() => setErrorData({ ...errorData, locationId: false })}
            currentLocation={true}
          />
          <article
            className="dates-container"
            onClick={() => setOpenDatesModal(true)}
          >
            <CalendarIcon className="dates__icon" />
            <p className="dates__text">
              {`${formatDateDisplay(tripData.startDate)} - ${formatDateDisplay(
                tripData.endDate,
                new Date(Date.now() + 24 * 60 * 60 * 1000)
              )}`}
            </p>
          </article>

          <article
            className="people-dropdown"
            onClick={() => setOpenPeopleModal(true)}
          >
            <ProfileIcon className="people-dropdown__icon" />
            <p className="people-dropdown__summary">
              {`${tripData.people[PersonType.ADULT]} Adults, ${tripData.people[PersonType.CHILD] || 0} Children, ${tripData.people[PersonType.INFANT] || 0} Infants`}
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
          tripData={{
            ...tripData,
            locationId: tripData.locationId,
            startDate: tripData.startDate,
            endDate: tripData.endDate,
          }}
          setTripData={(data: TripData) => {
            setTripData({
              ...tripData,
              ...data
            });
          }}
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
          setTripData={(data: TripData) => {
            setTripData({
              ...tripData,
              ...data
            });
          }}
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
