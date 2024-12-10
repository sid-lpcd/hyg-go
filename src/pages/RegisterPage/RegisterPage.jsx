import { useState } from "react";
import "./RegisterPage.scss";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields.");
    } else {
      console.log("Form submitted:", formData);
    }
  };

  return (
    <div className="register-page">
      <h1 className="register-page__title">Register</h1>
      <form className="register-page__form" onSubmit={handleSubmit}>
        <div className="register-page__form-group">
          <label htmlFor="name" className="register-page__label">
            Name <span className="register-page__required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="register-page__input"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="register-page__form-group">
          <label htmlFor="email" className="register-page__label">
            Email <span className="register-page__required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="register-page__input"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="register-page__form-group">
          <label htmlFor="country" className="register-page__label">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            className="register-page__input"
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="register-page__button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
