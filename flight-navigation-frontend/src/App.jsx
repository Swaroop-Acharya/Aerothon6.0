import React from "react";
import FlightSearchBar from "./components/FlightSearchBar";

function App() {
  return (
    <div className="App">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-3xl">Flight Navigation System</h1>
      </header>
      <main className="p-4">
        <FlightSearchBar />
      </main>
    </div>
  );
}

export default App;
