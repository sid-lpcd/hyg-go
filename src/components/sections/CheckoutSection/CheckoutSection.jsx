import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePlanWithActivities } from "../../../utils/apiHelper";
import { useBasket } from "../../../context/BasketContext";
import "./CheckoutSection.scss";
const CheckoutSection = () => {
  const { basketState, updateGratuity } = useBasket();
  const navigate = useNavigate();

  const [gratuityPercentage, setGratuityPercentage] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const handleChange = (e) => {
    const { value } = e.target;

    if (value < 0) {
      setGratuityPercentage(0);
      updateGratuity((totalCost * 0));
      return;
    }
    setGratuityPercentage(parseFloat(value));
    updateGratuity((totalCost * parseFloat(value) / 100));
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
    try {
      const response = await updatePlanWithActivities(
        basketState.planId,
        basketState.activities
      );
      console.log(response);
      navigate(`/create-plan/${basketState?.planId}/plan`);
      // navigate(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (basketState) {
      setTotalCost(
        Number(
          basketState?.activities
            ?.reduce((total, activity) => total + (Number(activity.totalPrice) || 0), 0)
            .toFixed(2)
        ) || 0
      );
    }
  }, [basketState]);

  if (!basketState) {
    return;
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
          <button className="checkout__btn-gratuity" onClick={handleIncrease}>
            +
          </button>
          <div>
            <input
              type="number"
              className="checkout__value checkout__value--input"
              name="gratuity"
              value={gratuityPercentage}
              onChange={(e) => handleChange(e)}
            />
            <span className="checkout__percentage">%</span>
          </div>
          {gratuityPercentage > 0 && (
            <span className="checkout__gratuity">
              (£{basketState?.gratuity?.toFixed(2)})
            </span>
          )}
        </div>
      </div>
      <button
        className="checkout__btn-pay"
        onClick={() => savePlan(basketState)}
      >
        Pay
      </button>
    </div>
  );
};

export default CheckoutSection;
