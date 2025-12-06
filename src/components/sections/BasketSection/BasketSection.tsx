import React, { useState } from "react";
import Modal from "react-responsive-modal";
import ActivityCard from "../../base/ActivityCard/ActivityCard";
import Form from "../../base/Form/Form";
import { v4 as uuidv4 } from "uuid";
import { InfinitySpin } from "react-loader-spinner";
import { useBasket } from "../../../context/BasketContext";
import { Plan, Activity } from "../../../types/common";
import { PlanActivityWithDetails } from "../../../types/common/plan";
import "./BasketSection.scss";

interface BasketSectionProps {
  planInfo?: Plan;
  setSelectedActivity: (activity: PlanActivityWithDetails) => void;
}

const BasketSection: React.FC<BasketSectionProps> = ({
  setSelectedActivity,
}) => {
  const { basketState, removeActivity } = useBasket();
  const [selectedActivityDelete, setSelectedActivityDelete] = useState<Activity | PlanActivityWithDetails | null>(null);
  const [confirmFormData] = useState<Record<string, any>>({});
  const [confirmErrorData] = useState<Record<string, boolean>>({});

  const removeActivityFromBasket = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivityDelete) {
      removeActivity(selectedActivityDelete.activityId);
      setSelectedActivityDelete(null);
    }
  };

  if (!basketState) {
    return (
      <div className="loader-overlay">
        <InfinitySpin
          width="200"
          color="#ffffff"
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
                key={activity.activityId ? activity.activityId : uuidv4()}
                activity={activity}
                openActivity={() => setSelectedActivity(activity)}
                cartPage={true}
                openDeleteModal={() => setSelectedActivityDelete(activity)}
              />
            );
          })}
        </div>
      </div>
      <Modal
        open={!!selectedActivityDelete}
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
          formData={confirmFormData}
          errorData={confirmErrorData}
          handleChange={() => {}} // No form fields to handle
          handleCancel={() => setSelectedActivityDelete(null)}
          handleSubmit={removeActivityFromBasket}
        />
      </Modal>
    </>
  );
};

export default BasketSection;