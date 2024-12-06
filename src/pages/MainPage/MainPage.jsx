import { useNavigate } from "react-router-dom";
import Header from "../../components/sections/Header/Header";
import Navigation from "../../components/sections/Navigation/Navigation";
import "./MainPage.scss";

export const MainPage = () => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate("/create-plan");
  };

  return (
    <>
      <Header />
      <main className="main">
        <h1 className="main__title">Next Trips</h1>
      </main>

      <Navigation pageType="travel" />
    </>
  );
};
