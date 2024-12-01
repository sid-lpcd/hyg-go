import { useState } from "react";
import Header from "../../../components/sections/Header/Header";
import BackArrowIcon from "../../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../../assets/icons/close-icon.svg?react";
import Navigation from "../../../components/sections/Navigation/Navigation";
import Form from "../../../components/base/Form/Form";
import Modal from "react-responsive-modal";
import "./MapPage.scss";
import { useNavigate } from "react-router-dom";

const MapPage = () => {
  const [openTripModal, setOpenTripModal] = useState(false);

  const navigate = useNavigate();

  const handleSaveTrip = () => {
    console.log("Trip saved!");
    setOpenTripModal(false);
  };
  return (
    <>
      <Header
        leftElement={
          <BackArrowIcon
            onClick={() => navigate(-1)}
            className="header__icon"
          />
        }
        rightElement={
          <CloseIcon
            onClick={() => setOpenTripModal(true)}
            className="header__icon"
          />
        }
      />
      <main className="main"></main>
      <Navigation />

      <Modal
        open={openTripModal}
        onClose={() => setOpenTripModal(false)}
        classNames={{
          modal: "react-responsive-modal-modal--save-trip",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <Form
          title="Do you want to save this trip?"
          handleCancel={() => navigate("/")}
          handleSubmit={() => handleSaveTrip()}
        />
      </Modal>
    </>
  );
};

export default MapPage;
