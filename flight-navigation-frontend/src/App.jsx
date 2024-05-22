import React from "react";
import FlightSearchBar from "./pages/FlightSearchBar";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import WeatherDashboard from "./pages/WeatherDashboard";
import SearchAltRoute from "./pages/SearchAltRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<FlightSearchBar />} />
        <Route path="/dashboard" element={<WeatherDashboard />} />
        <Route path="/altroute" element={<SearchAltRoute />} />
      </Routes>
    </>
  );
}

export default App;
