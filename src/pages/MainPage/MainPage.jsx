import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/sections/Header/Header";
import Navigation from "../../components/sections/Navigation/Navigation";
import TripPlans from "../../components/sections/TripsPlans/TripPlans";
import "./MainPage.scss";

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
