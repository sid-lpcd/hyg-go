import React, { useRef, useState } from "react";
import Error from "../../../assets/icons/error-icon.svg?react";
import "./InputText.scss";
import SearchIcon from "../../../assets/icons/search-icon.svg?react";
import { v4 as uuidv4 } from "uuid";

const InputText = ({
  isAutocomplete,
  getOptions,
  placeholder,
  inputValue,
  setInputValue,
  error,
  setError,
  currentLocation = false,
}) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [autocompleteActive, setAutocompleteActive] = useState(false);

  const dropdownRef = useRef();

  const handleChange = async (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError();

    if (isAutocomplete && value.length > 2) {
      const filtered = await getOptions(value);
      setFilteredOptions(filtered);
      setAutocompleteActive(true);
    }
  };

  const handleSearch = async () => {
    if (isAutocomplete) {
      const filtered = await getOptions(inputValue.name);
      setFilteredOptions(filtered[0]);
      setAutocompleteActive(true);
    }
  };
  const handleFocus = async () => {
    if (currentLocation && inputValue.length < 2) {
      const filtered = await getOptions();
      setFilteredOptions(filtered);
      setAutocompleteActive(true);
    }
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
    <div className="input-text__container">
      <div className={`input-text${error ? " input-text--error" : ""}`}>
        <SearchIcon className="input-text__search-icon" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-text__input"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {!isAutocomplete && (
          <button className="input-text__search" onClick={handleSearch}>
            Search
          </button>
        )}
        {isAutocomplete && filteredOptions.length > 0 && (
          <div
            className={`input-text__autocomplete ${
              autocompleteActive ? "input-text__autocomplete--active" : ""
            }`}
            ref={dropdownRef}
          >
            {filteredOptions.map((option) => {
              if (
                currentLocation &
                (option.name === "Use my current location")
              ) {
                return (
                  <div
                    key={uuidv4()}
                    className="input-text__options input-text__options--location"
                    onMouseDown={() => handleOptionClick(option)}
                  >
                    {option.name}
                  </div>
                );
              }
              return (
                <div
                  key={uuidv4()}
                  className="input-text__options"
                  onMouseDown={() => handleOptionClick(option)}
                >
                  {option.name}
                  {option.region && `, ${option.region}`}
                  {option.country && `, ${option.country}`}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && (
        <p className="input-text__error">
          <Error /> This is a required field
        </p>
      )}
    </div>
  );
};

export default InputText;
