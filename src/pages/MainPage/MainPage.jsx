import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/sections/Header/Header";
import Navigation from "../../components/sections/Navigation/Navigation";
import TripPlans from "../../components/sections/TripsPlans/TripPlans";
import "./MainPage.scss";
import { ToastContainer } from "react-toastify";

export const MainPage = () => {
  const location = useLocation();

  const [page, setPage] = useState(location.pathname.split("/").pop());

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  useEffect(() => {
    if (!location.state?.showToast) return;
    toast(`Welcome to Hyg-go, ${location.state?.username}!`);
    location.state.showToast = false;
  }, []);

  return (
    <>
      <ToastContainer />
      <Header />
      <main className="main main-traveller">{!page && <TripPlans />}</main>

      <Navigation pageType="travel" />
    </>
  );
};
