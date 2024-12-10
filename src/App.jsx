import { Route, Routes } from "react-router-dom";
import "react-responsive-modal/styles.css";
import "./App.scss";
import MainCreatePage from "./pages/CreatePlanPages/MainCreatePage/MainCreatePage";
import SelectActivitiesPage from "./pages/CreatePlanPages/SelectActivitiesPage/SelectActivitiesPage";
import { MainPage } from "./pages/MainPage/MainPage";
import CalendarPlan from "./pages/CreatePlanPages/CalendarPlan/CalendarPlan";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create-plan" element={<MainCreatePage />} />
        <Route path="/create-plan/:id/plan" element={<CalendarPlan />} />
        <Route path="/create-plan/:id/*" element={<SelectActivitiesPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
