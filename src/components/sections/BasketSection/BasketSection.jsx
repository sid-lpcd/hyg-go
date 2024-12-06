import Modal from "react-responsive-modal";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import Form from "../../base/Form/Form";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { InfinitySpin } from "react-loader-spinner";
import "./BasketSection.scss";

const BasketSection = ({
  planInfo,
  basketState,
  setBasketState,
  setSelectedActivity,
}) => {
  const [selectedActivityDelete, setSelectedActivityDelete] = useState(null);

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
      <div className="basket-activities">
        <h1 className="basket-activities__title">Basket</h1>
        <div className="basket-activities__list">
          {basketState?.activities?.map((activity) => {
            return (
              <ActivityCard
                key={activity.activity_id ? activity.activity_id : uuidv4()}
                activity={activity}
                openActivity={() => setSelectedActivity(activity)}
                basketState={basketState}
                setBasketState={setBasketState}
                cartPage={true}
                openDeleteModal={() => setSelectedActivityDelete(activity)}
              />
            );
          })}
        </div>
      </div>
      <Modal
        open={selectedActivityDelete}
        onClose={() => setSelectedActivityDelete(null)}
        center
        classNames={{
          modal: "activity-modal activity-modal--delete",
          modalAnimationIn: "modalInBottom",
          modalAnimationOut: "modalOutBottom",
        }}
        animationDuration={500}
      >
        <Form
          title={`Are you sure you want to remove this ${selectedActivityDelete?.name} from your basket?`}
          handleCancel={() => setSelectedActivityDelete(null)}
          handleSubmit={removeActivityFromBasket}
        />
      </Modal>
    </>
  );
};

export default BasketSection;
