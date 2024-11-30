import "./Form.scss";
import Error from "../../../assets/icons/error-icon.svg?react";
import { v4 as uuidv4 } from "uuid";

export default function Form({
  title,
  labels,
  formData,
  errorData,
  handleChange,
  handleCancel,
  handleSubmit,
}) {
  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2 className="form__title">{title}</h2>
      <div className="form__section">
        {labels?.map((label) => {
          let input = <></>;
          switch (label.type) {
            case "input":
              input = (
                <input
                  name={label.name}
                  value={formData[label.name]}
                  onChange={(e) => handleChange(e)}
                  type="text"
                  className={`form__input${
                    errorData[label.name] ? " form__input--error" : ""
                  }`}
                  placeholder={label.placeholder}
                />
              );
              break;
            case "textarea":
              input = (
                <textarea
                  name={label.name}
                  value={formData[label.name]}
                  onChange={(e) => handleChange(e)}
                  className={`form__textarea${
                    errorData[label.name] ? " form__textarea--error" : ""
                  }`}
                  placeholder={label.placeholder}
                />
              );
              break;
            case "select":
              input = (
                <select
                  name={label.name}
                  value={formData[label.name]}
                  onChange={(e) => handleChange(e)}
                  className={`form__select${
                    errorData[label.name] ? " form__select--error" : ""
                  }`}
                >
                  {label.options?.map((option) => (
                    <option value={option} key={uuidv4()}>
                      {option}
                    </option>
                  ))}
                </select>
              );
            default:
              break;
          }
          return (
            <div className="form__row" key={label.name}>
              <label className="form__label">{label.text}</label>
              {input}
              {errorData[label.name] && (
                <p className="form__error">
                  <Error /> This is a required field
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="form__btn-container">
        <button
          className="form__btn form__btn--inactive"
          onClick={handleCancel}
        >
          No
        </button>
        <button className="form__btn" onClick={handleSubmit}>
          Yes
        </button>
      </div>
    </form>
  );
}
