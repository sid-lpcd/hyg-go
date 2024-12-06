import { useEffect, useState } from "react";
import "./CheckoutSection.scss";
import { useNavigate } from "react-router-dom";
const CheckoutSection = ({ basketState, setBasketState }) => {
  const navigate = useNavigate();

  const [gratuityPercentage, setGratuityPercentage] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const handleChange = (e) => {
    const { value } = e.target;

    if (value < 0) {
      setGratuityPercentage(0);
      setBasketState({
        ...basketState,
        gratuity: (totalCost * 0).toFixed(2),
      });
      return;
    }
    setGratuityPercentage(parseFloat(value));
    setBasketState({
      ...basketState,
      gratuity: (totalCost * parseFloat(value)).toFixed(2),
    });
  };

  const handleIncrease = () => {
    setGratuityPercentage(gratuityPercentage + 2.5);
    setBasketState({
      ...basketState,
      gratuity: (totalCost * ((gratuityPercentage + 2.5) / 100)).toFixed(2),
    });
  };

  const handleDecrease = () => {
    if (gratuityPercentage < 0) {
      setGratuityPercentage(0);
      setBasketState({
        ...basketState,
        gratuity: (totalCost * 0).toFixed(2),
      });
      return;
    }
    setGratuityPercentage(gratuityPercentage - 2.5);
    setBasketState({
      ...basketState,
      gratuity: (totalCost * ((gratuityPercentage - 2.5) / 100)).toFixed(2),
    });
  };
  useEffect(() => {
    if (basketState) {
      setTotalCost(
        basketState?.activities
          ?.reduce((total, activity) => total + activity.totalPrice, 0)
          .toFixed(2)
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
              (£{basketState?.gratuity})
            </span>
          )}
        </div>
      </div>
      <button
        className="checkout__btn-pay"
        onClick={() => {
          navigate("/");
        }}
      >
        Pay
      </button>
    </div>
  );
};

export default CheckoutSection;
