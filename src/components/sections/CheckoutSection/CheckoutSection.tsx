import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePlanWithActivities } from "../../../utils/apiHelper";
import { useBasket } from "../../../context/BasketContext";
import "./CheckoutSection.scss";

const CheckoutSection: React.FC = () => {
  const { basketState, updateGratuity } = useBasket();
  const navigate = useNavigate();

  const [gratuityPercentage, setGratuityPercentage] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numValue = parseFloat(value);

    if (numValue < 0) {
      setGratuityPercentage(0);
      updateGratuity((totalCost * 0));
      return;
    }
    setGratuityPercentage(numValue || 0);
    updateGratuity((totalCost * (numValue || 0) / 100));
  };

  const handleIncrease = () => {
    const newPercentage = gratuityPercentage + 2.5;
    setGratuityPercentage(newPercentage);
    updateGratuity((totalCost * (newPercentage / 100)));
  };

  const handleDecrease = () => {
    if (gratuityPercentage <= 0) {
      setGratuityPercentage(0);
      updateGratuity(0);
      return;
    }
    const newPercentage = gratuityPercentage - 2.5;
    setGratuityPercentage(newPercentage);
    updateGratuity((totalCost * (newPercentage / 100)));
  };

  const savePlan = async () => {
    if (!basketState) return;
    
    try {
      await updatePlanWithActivities(
        basketState.planId,
        basketState.activities
      );
      navigate(`/plan/${basketState?.planId}/itinerary`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (basketState) {
      const total = basketState?.activities
        ?.reduce((total, activity) => {
          return total + (activity.ticketTotalPrice || 0);
        }, 0) || 0;
      
      setTotalCost(Number(total.toFixed(2)));
    }
  }, [basketState]);

  if (!basketState) {
    return null;
  }
  
  return (
    <div className="checkout">
      <div className="checkout__info">
        <p className="checkout__label">Sub-total: </p>
        <p className="checkout__value">£{totalCost}</p>
      </div>
      <div className="checkout__info">
        <p className="checkout__label">Gratuity: </p>
        <div className="checkout__gratuity-container">
          <button
            className="checkout__btn-gratuity checkout__btn-gratuity--decrease"
            onClick={handleDecrease}
          >
            -
          </button>
          <div>
            <input
              type="number"
              className="checkout__value checkout__value--input"
              name="gratuity"
              value={gratuityPercentage}
              onChange={handleChange}
            />
            <span className="checkout__percentage">%</span>
            {gratuityPercentage > 0 && (
              <span className="checkout__gratuity">
                (£{basketState?.gratuity?.toFixed(2)})
              </span>
            )}
          </div>
          <button className="checkout__btn-gratuity" onClick={handleIncrease}>
            +
          </button>
        </div>
      </div>
      <button
        className="checkout__btn-pay"
        onClick={savePlan}
      >
        Pay
      </button>
    </div>
  );
};

export default CheckoutSection;