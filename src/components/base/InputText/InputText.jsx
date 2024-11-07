import React, { useState } from "react";
import "./InputText.scss";
import SearchIcon from "../../../assets/icons/search-icon.svg?react";

const InputText = ({ isAutocomplete, options, placeholder }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (isAutocomplete && options) {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
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
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-text__input"
      />
      <button className="input-text__search">Search</button>
      {isAutocomplete && filteredOptions.length > 0 && (
        <div className="input-text__autocomplete">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="input-text__options"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputText;
