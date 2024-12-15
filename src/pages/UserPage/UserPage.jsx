import { useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import Header from "../../components/sections/Header/Header";
import LoginSection from "../../components/sections/LoginSection/LoginSection";
import RegisterSection from "../../components/sections/RegisterSection/RegisterSection";
import ProfileSection from "../../components/sections/ProfileSection/ProfileSection";
import "./UserPage.scss";

const UserPage = () => {
  const { authState } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <Header />
      <main>
        {authState.isLoggedIn ? (
          <ProfileSection />
        ) : (
          <div className="user-page__auth-container">
            <h1 className="user-page__title">
              {showLogin ? "Welcome Back!" : "Create Your Account"}
            </h1>
            <div className="user-page__toggle">
              <button
                className={`user-page__toggle-btn ${
                  showLogin ? "user-page__toggle-btn--active" : ""
                }`}
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className={`user-page__toggle-btn ${
                  !showLogin ? "user-page__toggle-btn--active" : ""
                }`}
                onClick={() => setShowLogin(false)}
              >
                Register
              </button>
            </div>

            {showLogin ? <LoginSection /> : <RegisterSection />}
          </div>
        )}
      </main>
    </>
  );
};

export default UserPage;
