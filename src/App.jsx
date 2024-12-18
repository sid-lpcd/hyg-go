import { Route, Routes } from "react-router-dom";
import "react-responsive-modal/styles.css";
import "./App.scss";
import MainCreatePage from "./pages/CreatePlanPages/MainCreatePage/MainCreatePage";
import SelectActivitiesPage from "./pages/CreatePlanPages/SelectActivitiesPage/SelectActivitiesPage";
import { MainPage } from "./pages/MainPage/MainPage";
import CalendarPlan from "./pages/CreatePlanPages/CalendarPlan/CalendarPlan";
import RegisterPage from "./pages/EarlyAccessPage/EarlyAccessPage";
import UserPage from "./pages/UserPage/UserPage";
import ProtectedRoute from "./context/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="/user" element={<UserPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/create-plan"
          element={
            <ProtectedRoute>
              <MainCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-plan/:id/plan"
          element={
            <ProtectedRoute>
              <CalendarPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-plan/:id/*"
          element={
            <ProtectedRoute>
              <SelectActivitiesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
