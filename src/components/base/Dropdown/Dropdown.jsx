import "./Dropdown.scss";
import { useState } from "react";
import DropdownIcon from "../../../assets/icons/dropdown-icon.svg?react";

const Dropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    onSelect(option);
  };
  return (
    <div className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown__btn">
        {selected} <DropdownIcon />
      </button>
      {isOpen && (
        <div className="dropdown__options">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelect(option)}
              className="dropdown__item"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
