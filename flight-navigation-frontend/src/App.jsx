import React from "react";
import FlightSearchBar from "./pages/FlightSearchBar";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar/>
      <main className="p-4">
        <FlightSearchBar />
      </main>
    </div>
  );
}

export default App;
