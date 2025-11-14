import React, { useRef, useState } from "react";
import Error from "../../../assets/icons/error-icon.svg?react";
import "./InputText.scss";
import SearchIcon from "../../../assets/icons/search-icon.svg?react";
import { v4 as uuidv4 } from "uuid";
import { LocationAutocompleteOption } from "../../../types/common";

interface InputTextProps {
  isAutocomplete?: boolean;
  getOptions?: (value?: string) => Promise<LocationAutocompleteOption[]>;
  placeholder: string;
  inputValue: string | LocationAutocompleteOption;
  setInputValue: (value: string | LocationAutocompleteOption) => void;
  error?: boolean;
  setError?: () => void;
  currentLocation?: boolean;
}

const InputText: React.FC<InputTextProps> = ({
  isAutocomplete,
  getOptions,
  placeholder,
  inputValue,
  setInputValue,
  error,
  setError,
  currentLocation = false,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<LocationAutocompleteOption[]>([]);
  const [autocompleteActive, setAutocompleteActive] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const value = e.target.value;
    setInputValue(value);
    setError?.();

    if (isAutocomplete && getOptions && value.length > 2) {
      const filtered = await getOptions(value);
      setFilteredOptions(filtered);
      setAutocompleteActive(true);
    }
  };

  const handleSearch = async (): Promise<void> => {
    if (isAutocomplete && getOptions) {
      const inputName = typeof inputValue === 'string' ? inputValue : inputValue.name;
      const filtered = await getOptions(inputName);
      setFilteredOptions([filtered[0]]);
      setAutocompleteActive(true);
    }
  };

  const handleFocus = async (): Promise<void> => {
    if (currentLocation && getOptions && (typeof inputValue === 'string' ? inputValue.length < 2 : true)) {
      const filtered = await getOptions();
      setFilteredOptions(filtered);
      setAutocompleteActive(true);
    }
    const inputLength = typeof inputValue === 'string' ? inputValue.length : inputValue.name.length;
    if (isAutocomplete && filteredOptions && inputLength > 2) {
      setAutocompleteActive(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    if (
      dropdownRef.current &&
      dropdownRef.current.contains(event.relatedTarget as Node)
    ) {
      return;
    }
    setAutocompleteActive(false);
  };

  const handleOptionClick = (option: LocationAutocompleteOption): void => {
    setInputValue(option);
    setFilteredOptions([]);
  };

  return (
    <div className="input-text__container">
      <div className={`input-text${error ? " input-text--error" : ""}`}>
        <SearchIcon className="input-text__search-icon" />
        <input
          type="text"
          value={typeof inputValue === 'string' ? inputValue : inputValue.name}
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
                currentLocation &&
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
