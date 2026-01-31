import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProfileIcon from "../../assets/icons/full-profile-icon.svg?react";
import Header from "../../components/sections/Header/Header";
import Navigation from "../../components/sections/Navigation/Navigation";
import TripPlans from "../../components/sections/TripsPlans/TripPlans";
import "./MainPage.scss";
import { ToastContainer } from "react-toastify";
import { BasketProvider } from "../../context/BasketContext";
import Wallet from "../../components/sections/Wallet/Wallet";

interface LocationState {
  showToast?: boolean;
  username?: string;
}

export const MainPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [page, setPage] = useState<string | undefined>(location.pathname.split("/").pop());

  useEffect(() => {
    setPage(location.pathname.split("/").pop());
  }, [location]);

  useEffect(() => {
    const state = location.state as LocationState;
    if (!state?.showToast) return;
    toast(`Welcome to Hyg-go, ${state?.username}!`);
    state.showToast = false;
  }, [location.state]);

  return (
    <>
      <ToastContainer />
      <Header
        rightElement={
          <>
            <ProfileIcon
              className="header__profile-icon"
              onClick={() => navigate("/user")}
            />
          </>
        }
            />
      <>
        {(() => {
          console.log(page)
          switch (page) {
            case "wallet":
              // Add wallet-specific component here in future
              return <main className="main main-wallet"><Wallet /></main>;
            default:
              return <main className="main main-traveller"><TripPlans /></main>;
          }
        })()}
      </>


      <BasketProvider>
        <Navigation pageType="travel" />
      </BasketProvider>
    </>
  );
};