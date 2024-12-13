import { useState } from "react";
import Error from "../../../assets/icons/error-icon.svg?react";
import "./LoginSection.scss";

const LoginSection = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.usernameOrEmail || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await loginUser(formData);

      if (!response.ok) {
        throw new Error("Invalid username/email or password.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Store JWT in localStorage
      alert("Login successful!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <h1 className="login-page__title">Login</h1>

      <form className="login-page__form" onSubmit={handleSubmit}>
        <div className="login-page__form-group">
          <label htmlFor="usernameOrEmail" className="login-page__label">
            Username or Email
          </label>
          <input
            type="text"
            id="usernameOrEmail"
            name="usernameOrEmail"
            className="login-page__input"
            value={formData.usernameOrEmail}
            onChange={handleInputChange}
          />
        </div>

        <div className="login-page__form-group">
          <label htmlFor="password" className="login-page__label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="login-page__input"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        {error && (
          <p className="login-page__error">
            <Error /> {error}
          </p>
        )}
        <button type="submit" className="login-page__btn">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginSection;
