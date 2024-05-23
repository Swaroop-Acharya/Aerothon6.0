import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="bg-[rgb(7,26,61)] p-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white text-2xl font-bold">AIRBUS</div>
        <div className="flex space-x-4">
          <ul className="flex  space-x-4">
            <li>
              <Link to="/" className="text-white hover:text-gray-300">
                Incident
              </Link>
            </li>
            <li>
              <Link to="/altroute" className="text-white hover:text-gray-300">
                Alternative Route
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white hover:text-gray-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
