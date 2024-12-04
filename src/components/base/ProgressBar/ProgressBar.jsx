import { useEffect, useState } from "react";
import "./ProgressBar.scss";
const ProgressBar = ({ total, current }) => {
  const [percentage, setPercentage] = useState(0);
  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  const calcPercentage = () => {
    const percentageCalc = Math.floor((current / total) * 100);
    setPercentage(percentageCalc);
    return percentageCalc;
  };

  const startAnimation = (tempPercentage) => {
    let start = displayedPercentage;
    const end = tempPercentage;
    const step = (end - start) / 20;
    let counter = 0;

    const animation = setInterval(() => {
      counter++;
      const newPercentage = Math.round(start + step * counter);
      if (counter >= 20 || newPercentage === end) {
        clearInterval(animation);
        setDisplayedPercentage(end);
      } else {
        setDisplayedPercentage(newPercentage);
      }
    }, 50);
  };

  useEffect(() => {
    if (isNaN(total) || isNaN(current)) return;
    const tempPercentage = calcPercentage();

    const delay = setTimeout(() => {
      startAnimation(tempPercentage);
    }, 1000);

    return () => clearTimeout(delay);
  }, [current]);

  return (
    <div className="progress-bar__container">
      <div className="progress-bar">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="progress-bar__percentage">{displayedPercentage}%</span>
    </div>
  );
};

export default ProgressBar;
