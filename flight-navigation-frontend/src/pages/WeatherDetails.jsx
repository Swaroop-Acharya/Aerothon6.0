import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWind,
  faCloud,
  faSun,
  faTint,
} from "@fortawesome/free-solid-svg-icons";
import "chart.js/auto";

const Speedometer = ({ value }) => {
  const max = 100; // Maximum value for humidity
  const min = 0; // Minimum value for humidity
  const range = max - min;

  const degrees = ((value - min) * 180) / range; // Convert value to degrees
  const rotation = `rotate(${degrees}deg)`;

  return (
    <div className="relative w-32 h-32">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-4 border-gray-300"></div>
        <div
          className="absolute w-32 h-32 rounded-full border-4 border-transparent border-t-gray-500 transform"
          style={{ transform: rotation }}
        ></div>
        <div className="absolute flex items-center justify-center w-28 h-28 bg-white rounded-full">
          <div className="text-xl font-bold">{value}%</div>
        </div>
      </div>
    </div>
  );
};

const TemperatureChart = ({ temperature }) => {
  const data = {
    labels: ["0", "1", "2", "3", "4", "5", "6"], // Mock labels for the chart
    datasets: [
      {
        label: "Temperature (°C)",
        data: [
          temperature.celsius - 2,
          temperature.celsius - 1,
          temperature.celsius,
          temperature.celsius + 1,
          temperature.celsius + 2,
          temperature.celsius + 3,
          temperature.celsius + 4,
        ],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
      },
    ],
  };

  return (
    <div className="w-full">
      <Line data={data} />
    </div>
  );
};

const UVIndexBar = ({ uvIndex }) => {
  const uvColors = ["#3EA72D", "#FFF300", "#F18B00", "#E53210", "#B567A4"];
  const uvLabels = ["Low", "Moderate", "High", "Very High", "Extreme"];
  const uvLevel = Math.min(Math.floor(uvIndex / 3), 4); // Categorize UV index

  return (
    <div className="my-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">UV Index</div>
        <FontAwesomeIcon icon={faSun} className="text-yellow-500" />
      </div>
      <div className="w-full h-4 bg-gray-200 rounded">
        <div
          className="h-full rounded"
          style={{
            width: `${(uvIndex / 15) * 100}%`,
            backgroundColor: uvColors[uvLevel],
          }}
        ></div>
      </div>
      <div className="text-sm text-right">{uvLabels[uvLevel]}</div>
    </div>
  );
};

const PressureGauge = ({ pressure }) => {
  const maxPressure = 1050;
  const minPressure = 950;
  const range = maxPressure - minPressure;
  const percentage = ((pressure.mb - minPressure) / range) * 100;

  return (
    <div className="my-4">
      <div className="text-lg font-bold mb-2">Pressure</div>
      <div className="relative w-full h-6 bg-gray-200 rounded">
        <div
          className="absolute h-full rounded bg-blue-500"
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute text-blue-800 inset-0 flex justify-center items-center">
          {pressure.mb} mb
        </div>
      </div>
    </div>
  );
};

const PrecipitationBar = ({ precipitation }) => {
  const data = {
    labels: ["Precipitation"],
    datasets: [
      {
        label: "mm",
        data: [precipitation.mm],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="my-4">
      <div className="text-lg font-bold mb-2">
        Precipitation{" "}
        <FontAwesomeIcon icon={faTint} className="text-blue-500" />
      </div>
      <Bar data={data} />
    </div>
  );
};

const WeatherDetails = ({ weatherData,path }) => {
  if (!weatherData) return null;

  const {
    text,
    temperature,
    wind,
    visibility,
    humidity,
    cloudCover,
    uvIndex,
    pressure,
    precipitation,
  } = weatherData;

  return (
    <div className="bg-white p-6 mt-3 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold">{path} Weather Details</h2>
      </div>
      <div className="flex gap-3">

      <div>
        <p className="mb-2">
          <strong>Condition:</strong> {text}
        </p>
        <TemperatureChart temperature={temperature} />
        <p className="mb-2">
          <strong>Wind:</strong> <FontAwesomeIcon icon={faWind} /> {wind.speed}{" "}
          km/h {wind.direction}
        </p>
        <p className="mb-2">
          <strong>Visibility:</strong> {visibility.km} km / {visibility.miles}{" "}
          miles
        </p>
        <div className="my-4">
          <Speedometer value={humidity} />
        </div>
        <p className="mb-2">
          <strong>Cloud Cover:</strong> <FontAwesomeIcon icon={faCloud} />{" "}
          {cloudCover}%
        </p>
      </div>
      <div>
        <UVIndexBar uvIndex={uvIndex} />
        <PressureGauge pressure={pressure} />
        <PrecipitationBar precipitation={precipitation} />
      </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
