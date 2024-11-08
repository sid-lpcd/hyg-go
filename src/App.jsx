import { Route, Routes } from "react-router-dom";
import "./App.scss";
import CreatePlanPage from "./pages/CreatePlanPage/CreatePlanPage";
import { MainPage } from "./pages/MainPage/MainPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create-plan" element={<CreatePlanPage />} />
      </Routes>
    </>
  );
}

export default App;
