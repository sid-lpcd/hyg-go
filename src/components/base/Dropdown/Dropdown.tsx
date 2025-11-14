import "./Dropdown.scss";
import { useState } from "react";
import DropdownIcon from "../../../assets/icons/dropdown-icon.svg?react";

interface DropdownProps {
  options: string[];
  selectHandler: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectHandler }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(options[0]);

  const handleSelect = (option: string): void => {
    setSelected(option);
    setIsOpen(false);
    selectHandler(option);
  };
  return (
    <div className="dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown__selection"
      >
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
