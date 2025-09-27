import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Error from "../../../assets/icons/error-icon.svg?react";
import "./RegisterSection.scss";
import { useNavigate } from "react-router-dom";

const RegisterSection = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    country: "",
    password: "",
    rePassword: "",
  });
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    password: false,
    rePassword: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: false });
    if (name === "rePassword" || name === "password") {
      setError({ ...error, rePassword: false, password: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrorData = { ...error };

    Object.keys(formData).forEach((key) => {
      if (key !== "country" && !formData[key]) {
        newErrorData[key] = true;
        hasErrors = true;
      }
    });

    if (formData.password !== formData.rePassword) {
      newErrorData.rePassword = true;
      hasErrors = true;
    }

    setError(newErrorData);

    if (hasErrors) return;

    const result = await register(formData);
    if (!result.success)
      return setErrorMessage(result.error || "Registration failed.");

    setError({
      firstName: false,
      lastName: false,
      username: false,
      email: false,
      password: false,
      rePassword: false,
    });
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      country: "",
      password: "",
      rePassword: "",
    });
    navigate(`/`);
  };

  return (
    <>
      <form className="register-page__form" onSubmit={handleSubmit}>
        <div className="register-page__form-group">
          <label htmlFor="firstName" className="register-page__label">
            First Name(s) <span className="register-page__required">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            className="register-page__input"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {error.firstName && (
            <p className="register-page__error">
              <Error /> This is a required field
            </p>
          )}
        </div>
        <div className="register-page__form-group">
          <label htmlFor="lastName" className="register-page__label">
            Last Name(s) <span className="register-page__required">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            className="register-page__input"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {error.lastName && (
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
          <label htmlFor="rePassword" className="register-page__label">
            Confirm Password <span className="register-page__required">*</span>
          </label>
          <input
            type="password"
            name="rePassword"
            className="register-page__input"
            value={formData.rePassword}
            onChange={handleInputChange}
          />
          {error.rePassword && (
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
