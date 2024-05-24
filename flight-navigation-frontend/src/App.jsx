import React from "react";
import FlightSearchBar from "./pages/FlightSearchBar";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import WeatherDashboard from "./pages/WeatherDetails";
import SearchAltRoute from "./pages/SearchAltRoute";
import Footer from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="bg-[#071A3D]">
      <Navbar />
      <Routes>
        <Route path="/" element={<FlightSearchBar />} />
        <Route path="/dashboard" element={<WeatherDashboard />} />
        <Route path="/altroute" element={<SearchAltRoute />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
