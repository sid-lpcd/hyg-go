import { Route, Routes } from "react-router-dom";
import "react-responsive-modal/styles.css";
import "./App.scss";
import MainCreatePage from "./pages/CreatePlanPages/MainCreatePage/MainCreatePage";
import { MainPage } from "./pages/MainPage/MainPage";
import ListPage from "./pages/CreatePlanPages/ListPage/ListPage";
import MapPage from "./pages/CreatePlanPages/MapPage/MapPage";
import BasketPage from "./pages/CreatePlanPages/BasketPage/BasketPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create-plan" element={<MainCreatePage />} />
        <Route path="/create-plan/:id/activities" element={<ListPage />} />
        <Route path="/create-plan/:id/map" element={<MapPage />} />
        <Route path="/create-plan/:id/basket" element={<BasketPage />} />
      </Routes>
    </>
  );
}

export default App;
