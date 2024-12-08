import { Route, Routes } from "react-router-dom";
import "react-responsive-modal/styles.css";
import "./App.scss";
import { MainPage } from "./pages/MainPage/MainPage";
import MainCreatePage from "./pages/CreatePlanPages/MainCreatePage/MainCreatePage";
import CalendarPlan from "./pages/CreatePlanPages/CalendarPlan/CalendarPlan";
import SelectActivitiesPage from "./pages/CreatePlanPages/SelectActivitiesPage/SelectActivitiesPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create-plan" element={<MainCreatePage />} />
        <Route path="/create-plan/:id/plan" element={<CalendarPlan />} />
        <Route path="/create-plan/:id/*" element={<SelectActivitiesPage />} />
      </Routes>
    </>
  );
}

export default App;
