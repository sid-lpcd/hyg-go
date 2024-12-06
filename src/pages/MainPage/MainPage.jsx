import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/sections/Header/Header";
import Navigation from "../../components/sections/Navigation/Navigation";
import "./MainPage.scss";
import { useEffect, useState } from "react";
import TripPlans from "../../components/sections/TripsPlans/TripPlans";

export const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(location.pathname.split("/").pop());

  const clickHandler = () => {
    navigate("/create-plan");
  };

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  return (
    <>
      <Header />
      <main className="main">{!page && <TripPlans />}</main>

      <Navigation pageType="travel" />
    </>
  );
};
