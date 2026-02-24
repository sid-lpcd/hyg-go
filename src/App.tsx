import { Route, Routes } from "react-router-dom";
import "react-responsive-modal/styles.css";
import "./App.scss";
import MainCreatePage from "./pages/CreatePlanPages/MainCreatePage/MainCreatePage";
import SelectActivitiesPage from "./pages/CreatePlanPages/SelectActivitiesPage/SelectActivitiesPage";
import SharePlanPage from "./pages/SharePlanPage/SharePlanPage";
import { MainPage } from "./pages/MainPage/MainPage";
import TripItineraryPage from "./pages/CreatePlanPages/TripItineraryPage/TripItineraryPage";
import UserPage from "./pages/UserPage/UserPage";
import ProtectedRoute from "./context/ProtectedRoute";
import { BasketProvider } from "./context/BasketContext";

function App(): JSX.Element {
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
        <Route 
          path="/wallet" 
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/map" 
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/user" element={<UserPage />} />
        <Route
          path="/create-plan"
          element={
            <ProtectedRoute>
              <MainCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan/:planId/itinerary"
          element={
            <ProtectedRoute>
              <TripItineraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plan/:planId/share"
          element={
            <ProtectedRoute>
              <SharePlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-plan/:id/*"
          element={
            <ProtectedRoute>
              <BasketProvider>
                <SelectActivitiesPage />
              </BasketProvider>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;