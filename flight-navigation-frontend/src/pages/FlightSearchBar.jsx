import React, { useState, useEffect } from "react";
import axios from "axios";
import FlightForm from "./FlightForm";
import FlightMap from "./FlightMap";
import FlightInfo from "./FlightInfo";
import WeatherCard from "./WeatherCard";
import FlightDetailsCard from "./FlightDetailsCard";
import { toast } from "react-toastify";
import WeatherDetails from "./WeatherDetails";

export default function FlightSearchBar() {
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [flightType, setFlightType] = useState("takeoff");
  const [route, setRoute] = useState(null);
  const [kilometers, setKilometers] = useState(null);
  const [fromAirportInfo, setFromAirportInfo] = useState(null);
  const [toAirportInfo, setToAirportInfo] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [nearbyRoute, setNearbyRoute] = useState(null);
  const [aircraftData, setAircraftData] = useState([]);
  const [selectedAircraftModel, setSelectedAircraftModel] = useState("");
  const [showFlightDetails, setShowFlightDetails] = useState(false);

  const [fromWeatherData, setFromWeatherData] = useState("");
  const [toWeatherData, setToWeatherData] = useState("");

  useEffect(() => {
    const fetchAircraftData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/aircraft");
        console.log(response.data);
        console.log("Aircraft data fetched:", response.data);
        setAircraftData(response.data);
      } catch (error) {
        console.error("Error fetching aircraft data:", error);
      }
    };

    fetchAircraftData();
  }, []);


  function checkWeatherConditions(weatherData, location) {
    const minVisibilityKm = 5; // Minimum visibility in kilometers
    const maxWindSpeedKph = 40; // Maximum wind speed in kilometers per hour
    const maxCloudCover = 80; // Maximum cloud cover in percentage
    const minTemperatureC = -40; // Minimum temperature in Celsius
    const maxTemperatureC = 49; // Maximum temperature in Celsius
    const minPressureMb = 950; // Minimum pressure in millibars
    const maxHumidity = 95; // Maximum humidity in percentage
    const maxUVIndex = 5; // Maximum UV index
  
    if (!weatherData) {
      toast.error(
        "Cannot fetch weather data for " +
          location +
          ". Flight status is unknown."
      );
      return false;
    }
  
    let conditionMet = true;
  
  
    
    // Check visibility
    if (factors.visibility.km < minVisibilityKm) {
      toast.error(
        "Cannot fly because visibility at " + location + " is too low. Flight will be delayed."
      );
      conditionMet = false;
    }
  
    // Check wind speed
    if (factors.wind.speed > maxWindSpeedKph) {
      toast.error(
        "Cannot fly because wind speed at " + location + " is too high. Flight will be delayed."
      );
      conditionMet = false;
    }
  
    // Check cloud cover
    if (factors.cloudCover > maxCloudCover) {
      toast.error(
        "Cannot fly because cloud cover at " + location + " is too high. Flight will be delayed."
      );
      conditionMet = false;
    }
  
    // Check temperature
    if (factors.temperature.celsius < minTemperatureC || factors.temperature.celsius > maxTemperatureC) {
      toast.error(
        "Cannot fly because temperature at " + location + " is out of the safe range. Flight will be delayed."
      );
      conditionMet = false;
    }
  
    // Check pressure
    if (factors.pressure.mb < minPressureMb) {
      toast.error(
        "Cannot fly because pressure at " + location + " is too low. Flight will be delayed."
      );
      conditionMet = false;
    }
  
    // Check humidity
    if (factors.humidity > maxHumidity) {
      toast.error(
        "Cannot fly because humidity at " + location + " is too high. Flight will be delayed."
      );
      conditionMet = false;
    }
  
    // Check UV index
    if (factors.uvIndex > maxUVIndex) {
      toast.error(
        "Cannot fly because UV index at " + location + " is too high. Flight will be delayed."
      );
      conditionMet = false;
    }
  
    return conditionMet;
  }
  
 
  function getCitiesCovered(origin, destination,routes) {

    console.log(routes)
    const route = routes.find(
      (route) => route.origin === origin && route.destination === destination
    );
    return route ? route.citiesCovered : [];
  }

  function canOperateSafely(from_weatherData, to_weatherData) {
    const fromConditions = checkWeatherConditions(
      from_weatherData,
      "departure"
    );
    const toConditions = checkWeatherConditions(to_weatherData, "destination");

    if (fromConditions && toConditions) {
      toast("Flight can operate safely.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://airportgap.com/api/airports/distance",
        new URLSearchParams({ from: fromAirport, to: toAirport })
      );

      const from_city = response.data.data.attributes.from_airport.city;
      const to_city = response.data.data.attributes.to_airport.city;

      const routesData = await axios.get('http://localhost:5000/api/getRoute');
      
     
      const citiesCovered = getCitiesCovered(from_city, to_city, routesData.data);
      const getWeatherResponse1 = await axios.post(
        "http://localhost:5000/api/getlocation",
        { location: from_city }
      );
      const getWeatherResponse2 = await axios.post(
        "http://localhost:5000/api/getlocation",
        { location: to_city }
      );
      const from_weatherData = getWeatherResponse1.data;
      const to_weatherData = getWeatherResponse2.data;

     
      console.log(from_city, to_city, ...citiesCovered);

      await axios.post(
        "http://localhost:5000/api/insertAirport",
        response.data
      );
      await axios.post(
        "http://localhost:5000/api/insertDestinationAirport",
        response.data
      );
      console.log(from_weatherData);
      console.log(to_weatherData);

      setFromWeatherData(from_weatherData);
      setToWeatherData(to_weatherData);

      if (flightType === "takeoff") {
        
        const fromFlyStatus = await axios.post(
          `http://localhost:5000/api/getFlyStatus`,
          [from_city]
        );
        const middleCitiesFlyStatus = await axios.post(
          `http://localhost:5000/api/getFlyStatus`,
          [to_city, ...citiesCovered]
        );
        const toFlyStatus = await axios.post(
          `http://localhost:5000/api/getFlyStatus`,
          [to_city]
        );
        
        if (fromFlyStatus.data && toFlyStatus.data && middleCitiesFlyStatus.data == false) {
          toast.error(
            "Cities between Source and Destination weather condition is bad. Go for Alternative Route!!"
          );
        } else if (fromFlyStatus.data == false) {
          toast.error(
            "Source weather condition is bad, Flight takeoff will be delayed"
          );
        } else if(toFlyStatus.data==false) {
          toast.error(
            "Destination weather conditon is bad, Flight takeoff will be delayed"
          )
        }else{
          toast(
            "Flight can takeoff!!"
          )
        }
      }

      const { from_airport, to_airport, kilometers } =
        response.data.data.attributes;
      const fromCoords = [
        parseFloat(from_airport.latitude),
        parseFloat(from_airport.longitude),
      ];
      const toCoords = [
        parseFloat(to_airport.latitude),
        parseFloat(to_airport.longitude),
      ];

      setFromAirportInfo(from_airport);
      setToAirportInfo(to_airport);
      setRoute([fromCoords, toCoords]);
      setKilometers(kilometers);
      setWeatherData(to_weatherData);
      setShowFlightDetails(true);
      console.log(aircraftData);

      const selectedAircraft = aircraftData.find(
        (aircraft) => aircraft.model === selectedAircraftModel
      );
      if (selectedAircraft) {
        console.log("Selected Aircraft ID:", selectedAircraft.aircraftID);
      }
    } catch (error) {
      console.error("Error fetching the location data:", error);
    }
  };

  const selectedAircraft = aircraftData?.find(
    (aircraft) => aircraft.model === selectedAircraftModel
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        <div className="w-full block ">
        <h1 className="text-3xl text-white font-bold mb-4">Check status of current route</h1>
          <FlightForm
            fromAirport={fromAirport}
            setFromAirport={setFromAirport}
            toAirport={toAirport}
            setToAirport={setToAirport}
            flightType={flightType}
            setFlightType={setFlightType}
            aircraftData={aircraftData}
            selectedAircraftModel={selectedAircraftModel}
            setSelectedAircraftModel={setSelectedAircraftModel}
            handleSubmit={handleSubmit}
          />
        </div>
        <div>
          {flightType === "landing" && weatherData && (
            <div className="w-full block">
              <WeatherCard
                weatherData={weatherData}
                setNearbyRoute={setNearbyRoute}
              />
            </div>
          )}
        </div>
      </div>

      {showFlightDetails && (
        <div>
          <div className="flex space-x-4">
            <div className="w-1/3 bg-gray-100 block p-4 rounded shadow-md">
              <FlightInfo
                AirportInfo={fromAirportInfo}
                kilometers={kilometers}
                path="Source"
              />
            </div>
            <div className="w-full">
              <FlightMap route={nearbyRoute || route} />
            </div>
            <div className="w-1/3 bg-gray-100 block p-4 rounded shadow-md">
              <FlightInfo
                AirportInfo={toAirportInfo}
                kilometers={kilometers}
                path="Destination"
              />
            </div>
          </div>
          <div className=" flex gap-3  w-2/4 h-2/4">
            <WeatherDetails weatherData={fromWeatherData} path="Source" />
            <WeatherDetails weatherData={toWeatherData} path="Destination" />
          </div>
          <div className="mt-3 gap-3 justify-center rounded  flex">
            <div className="w-2/3 h-2/4">
              <FlightDetailsCard aircraft={selectedAircraft} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
