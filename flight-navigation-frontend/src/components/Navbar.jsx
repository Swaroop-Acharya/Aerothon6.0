import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      
      <nav className="bg-[rgb(7,26,61)] p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-white text-2xl font-bold">{"</AIROTHON 6.0> AIRBUS"}</div>
          <div className="flex space-x-4">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className=" font-semibold text-white">
                  Incident
                </Link>
              </li>
              <li>
                <Link to="/altroute" className=" font-semibold text-white">
                  Alternative Route
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className=" font-semibold text-white">
                  Dashboard
                </Link>
              </li>
             
            </ul>
          </div>
        </div>
      </nav>
      <div id="player" className="overlay relative">
        <video
          id="kpkVjs"
          crossOrigin="anonymous"
          preload="none"
          playsInline
          autoPlay
          loop
          muted
          poster="https://mediaassets.airbus.com/medias/domain38/media101851/555343-axnfdce994-whr.jpg"
        >
          <source
            src="https://mediaassets.airbus.com/medias/domain38/media101851/555343-axnfdce994-1080.mp4"
            type="video/mp4"
          />
        </video>
        <div className="overlayText absolute top-0 left-0 w-full h-full flex items-center justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
          <div className="teaserbox text-center text-white">
            <h2 className="font-semibold text-4xl">Pioneering sustainable aerospace for<br/> a safe and united world</h2>
            
           
          </div>
        </div>
      </div>
    </>
  );
}
