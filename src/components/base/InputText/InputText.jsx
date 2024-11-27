import React, { useRef, useState } from "react";
import "./InputText.scss";
import SearchIcon from "../../../assets/icons/search-icon.svg?react";
import { v4 as uuidv4 } from "uuid";

const InputText = ({
  isAutocomplete,
  getOptions,
  placeholder,
  inputValue,
  setInputValue,
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [autocompleteActive, setAutocompleteActive] = useState(false);

  const dropdownRef = useRef();

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (isAutocomplete && value.length > 2) {
      //potentially an api call
      const filtered = await getOptions(value);
      setFilteredOptions(filtered);
      setAutocompleteActive(true);
    }
  };
  const handleFocus = () => {
    if (isAutocomplete && filteredOptions && inputValue.length > 2) {
      setAutocompleteActive(true);
    }
  };
  const handleBlur = (event) => {
    if (
      dropdownRef.current &&
      dropdownRef.current.contains(event.relatedTarget)
    ) {
      return;
    }
    setAutocompleteActive(false);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    setFilteredOptions([]);
  };

  return (
    <div className="input-text">
      <SearchIcon className="input-text__search-icon" />
      <input
        type="text"
        value={inputValue.name}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-text__input"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <button className="input-text__search">Search</button>
      {isAutocomplete && filteredOptions.length > 0 && (
        <div
          className={`input-text__autocomplete ${
            autocompleteActive ? "input-text__autocomplete--active" : ""
          }`}
          ref={dropdownRef}
        >
          {filteredOptions.map((option) => (
            <div
              key={uuidv4()}
              className="input-text__options"
              onMouseDown={() => handleOptionClick(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputText;
