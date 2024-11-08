import React from "react";
import Header from "../../components/sections/Header/Header";
import BackArrowIcon from "../../assets/icons/back-arrow-icon.svg?react";
import CloseIcon from "../../assets/icons/close-icon.svg?react";

const CreatePlanPage = () => {
  const goBack = () => {};
  const closePage = () => {};

  return (
    <>
      <Header
        leftElement={<BackArrowIcon onClick={goBack} />}
        rightElement={<CloseIcon onClick={closePage} />}
      />
    </>
  );
};

export default CreatePlanPage;
