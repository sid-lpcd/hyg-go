import { useState } from "react";
import "./RegisterSection.scss";
import Error from "../../../assets/icons/error-icon.svg?react";
import { registerUser } from "../../../utils/apiHelper";

const RegisterSection = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    country: "",
    password: "",
    re_password: "",
  });
  const [error, setError] = useState({
    first_name: false,
    last_name: false,
    username: false,
    email: false,
    password: false,
    re_password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: false });
    if (name === "re_password" || name === "password") {
      setError({ ...error, re_password: false, password: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrorData = { ...error };

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrorData[key] = true;
        hasErrors = true;
      }
    });

    if (formData.password !== formData.re_password) {
      newErrorData.re_password = true;
      hasErrors = true;
    }

    setError(newErrorData);

    if (hasErrors) return;

    try {
      const response = await registerUser(formData);
      console.log(response);
      if (response.status === 201) {
        setError({
          first_name: false,
          last_name: false,
          username: false,
          email: false,
          password: false,
          re_password: false,
        });
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          country: "",
          password: "",
          re_password: "",
        });
      }
    } catch (error) {
      console.log(error);
      if (error?.message) {
        setErrorMessage(error?.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <form className="register-page__form" onSubmit={handleSubmit}>
        <div className="register-page__form-group">
          <label htmlFor="first_name" className="register-page__label">
            First Name(s) <span className="register-page__required">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            className="register-page__input"
            value={formData.first_name}
            onChange={handleInputChange}
          />
          {error.first_name && (
            <p className="register-page__error">
              <Error /> This is a required field
            </p>
          )}
        </div>
        <div className="register-page__form-group">
          <label htmlFor="last_name" className="register-page__label">
            Last Name(s) <span className="register-page__required">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            className="register-page__input"
            value={formData.last_name}
            onChange={handleInputChange}
          />
          {error.last_name && (
            <p className="register-page__error">
              <Error /> This is a required field
            </p>
          )}
        </div>
        <div className="register-page__form-group">
          <label htmlFor="username" className="register-page__label">
            Username <span className="register-page__required">*</span>
          </label>
          <input
            type="text"
            name="username"
            className="register-page__input"
            value={formData.username}
            onChange={handleInputChange}
          />
          {error.username && (
            <p className="register-page__error">
              <Error /> This is a required field
            </p>
          )}
        </div>
        <div className="register-page__form-group">
          <label htmlFor="email" className="register-page__label">
            Email <span className="register-page__required">*</span>
          </label>
          <input
            type="email"
            name="email"
            className="register-page__input"
            value={formData.email}
            onChange={handleInputChange}
          />
          {error.email && (
            <p className="register-page__error">
              <Error /> This is a required field
            </p>
          )}
        </div>
        <div className="register-page__form-group">
          <label htmlFor="country" className="register-page__label">
            Country
          </label>
          <input
            type="text"
            name="country"
            className="register-page__input"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
        <div className="register-page__form-group">
          <label htmlFor="password" className="register-page__label">
            Password <span className="register-page__required">*</span>
          </label>
          <input
            type="password"
            name="password"
            className="register-page__input"
            value={formData.password}
            onChange={handleInputChange}
          />
          {error.password && (
            <p className="register-page__error">
              <Error /> This is a required field
            </p>
          )}
        </div>
        <div className="register-page__form-group">
          <label htmlFor="re_password" className="register-page__label">
            Confirm Password <span className="register-page__required">*</span>
          </label>
          <input
            type="password"
            name="re_password"
            className="register-page__input"
            value={formData.re_password}
            onChange={handleInputChange}
          />
          {error.re_password && (
            <p className="register-page__error">
              <Error /> Passwords do not match
            </p>
          )}
        </div>
        {errorMessage && <p className="register-page__error">{errorMessage}</p>}
        <button type="submit" className="register-page__btn">
          Register
        </button>
      </form>
    </>
  );
};

export default RegisterSection;
