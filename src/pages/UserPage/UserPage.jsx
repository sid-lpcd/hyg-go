import { useEffect, useState } from "react";
import Header from "../../components/sections/Header/Header";
import LoginSection from "../../components/sections/LoginSection/LoginSection";
import RegisterSection from "../../components/sections/RegisterSection/RegisterSection";
import "./UserPage.scss";

const UserPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <Header />
      <main>
        {isLoggedIn ? (
          <ProfileSection />
        ) : (
          <div className="user-page__auth-container">
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
