import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/sections/Header/Header";
import Navigation from "../../components/sections/Navigation/Navigation";
import TripPlans from "../../components/sections/TripsPlans/TripPlans";
import "./MainPage.scss";
import Div100vh from "react-div-100vh";

export const MainPage = () => {
  const location = useLocation();

  const [page, setPage] = useState(location.pathname.split("/").pop());

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  return (
    <>
      <Div100vh>
        <Header />
        <main className="main main-traveller">{!page && <TripPlans />}</main>

        <Navigation pageType="travel" />
      </Div100vh>
    </>
  );
};
