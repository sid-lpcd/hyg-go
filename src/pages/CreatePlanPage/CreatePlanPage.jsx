import "./CreatePlanPage.scss";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import Header from "../../components/sections/Header/Header";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../assets/icons/close-icon.svg?react";
import InputText from "../../components/base/InputText/InputText";

const CreatePlanPage = () => {
  const [selected, setSelected] = useState("");
  const [locations, setLocations] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
  };
  const goBack = () => navigate("/");

  const saveTrip = async () => {
    // save trip axios
    goBack();
  };

  const getLocations = async () => {
    //axios call
    setLocations(["Porto"]);
  };

  useEffect(() => {
    getLocations();
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
      <main>
        <InputText
          isAutocomplete={true}
          options={locations}
          inputValue={selected}
          setInputValue={setSelected}
          placeholder="Where are you going?"
        />
      </main>

      <Modal open={open} onClose={onCloseModal} center>
        <h3 className="react-responsive-modal__title">Save Dream?</h3>
        <div className="react-responsive-modal__btn-container">
          <button className="react-responsive-modal__btn" onClick={saveTrip}>
            No
          </button>
          <button
            className="react-responsive-modal__btn-active"
            onClick={saveTrip}
          >
            Yes
          </button>
        </div>
      </Modal>
    </>
  );
};

export default CreatePlanPage;
