import React from "react";
import "./Form.scss";
import Error from "../../../assets/icons/error-icon.svg?react";
import { v4 as uuidv4 } from "uuid";
import { FormLabel } from "../../../types/common";
import ImageUpload from "../ImageUpload/ImageUpload";

interface FormProps {
  title?: string;
  labels?: FormLabel[];
  formData?: Record<string, any>;
  errorData?: Record<string, boolean>;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: (index: number) => void;
  previewImages?: string[];
  showPreviewImages?: boolean;
  cancelButtonText?: string;
  submitButtonText?: string;
  handleCancel: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<FormProps> = ({
  title,
  labels,
  formData,
  errorData,
  handleChange,
  handleImageUpload,
  handleRemoveImage,
  previewImages = [],
  showPreviewImages = true,
  cancelButtonText = "No",
  submitButtonText = "Yes",
  handleCancel,
  handleSubmit,
}) => {
  return (
    <form className="form" onSubmit={handleSubmit}>
      {title && <h2 className="form__title">{title}</h2>}
      <div className="form__section">
        {formData && errorData &&  handleChange && labels?.map((label) => {
          let input: JSX.Element = <></>;
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
            case "datetime-local":
              console.log(label);
              input = (
                <input
                  name={label.name}
                  value={formData[label.name]}
                  onChange={(e) => handleChange(e)}
                  type="datetime-local"
                  className={`form__input${
                    errorData[label.name] ? " form__input--error" : ""
                  }`}
                  placeholder={label.placeholder}
                  min={label.min}
                  max={label.max}
                  step={600}
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
              break;
            case "image":
              input = (
                <ImageUpload
                  label={label.text}
                  previewImages={previewImages}
                  onChange={handleImageUpload || (() => {})}
                  onRemoveImage={handleRemoveImage || (() => {})}
                  showPreviewImages={showPreviewImages}
                  multiple={label.multipleImages || false}
                  accept={label.acceptInputTypes || "image/*"}
                />
              );
              break;
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
          {cancelButtonText}
        </button>
        <button type="submit" className="form__btn">
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default Form;
