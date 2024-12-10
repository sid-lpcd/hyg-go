import { useState } from "react";
import "./RegisterPage.scss";
import Header from "../../components/sections/Header/Header";
import { registerEarlyUser } from "../../utils/apiHelper";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
  });
  const [error, setError] = useState({
    name: false,
    email: false,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError({ ...error, name: true });
    }
    if (!formData.email) {
      setError({ ...error, email: true });
    }
    if (formData.name && formData.email) {
      try {
        const response = await registerEarlyUser(formData);
        setSuccessMessage("User registered successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Header />
      <main className="register-page">
        <h1 className="register-page__title">Register</h1>
        {successMessage ? (
          <p className="register-page__success">{successMessage}</p>
        ) : (
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
            <button type="submit" className="register-page__btn">
              Register
            </button>
          </form>
        )}
      </main>
    </>
  );
};

export default RegisterPage;
