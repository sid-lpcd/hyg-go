import Modal from "react-responsive-modal";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import Form from "../../base/Form/Form";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { InfinitySpin } from "react-loader-spinner";
import "./BasketSection.scss";

const BasketSection = ({ planInfo, basketState, setBasketState }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const removeActivityFromBasket = (activity) => {
    const newBasket = basketState?.activities?.filter(
      (item) => item.activity_id !== activity.activity_id
    );
    setBasketState({ ...basketState, activities: newBasket });
  };

  if (!basketState) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          visible={true}
          width="200"
          color="#ffffff"
          ariaLabel="infinity-spin-loading"
        />
      </div>
    );
  }
  return (
    <>
      <div className="list-activities">
        <h1 className="list-activities__title">Basket</h1>
        <div className="list-activities__list">
          {basketState?.activities?.map((activity) => {
            return (
              <ActivityCard
                key={activity.activity_id ? activity.activity_id : uuidv4()}
                activity={activity}
                openActivity={() => setSelectedActivity(activity)}
                basketState={basketState}
                setBasketState={setBasketState}
              />
            );
          })}
        </div>
      </div>
      <Modal
        open={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        center
        classNames={{
          modal: "activity-modal activity-modal--activity",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <Form
          title={`Are you sure you want to remove this ${selectedActivity?.name} from your basket?`}
          handleCancel={() => setSelectedActivity(null)}
          handleSubmit={removeActivityFromBasket}
        />
      </Modal>
    </>
  );
};

export default BasketSection;
