import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-annotation";
import {toast} from 'react-toastify'
const FlightDetailsCard = ({ aircraft }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    
    toast.error(aircraft.systemAlerts[0])
    if (!chartRef.current || !aircraft) return;

    const { engineHealth } = aircraft;
    const engine1Data = engineHealth?.engine1;
    const engine2Data = engineHealth?.engine2;

    const chartData = {
      labels: ["EGT Margin", "Vibration"],
      datasets: [
        {
          label: "Engine 1",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          data: [engine1Data?.EGTMargin || 0, engine1Data?.vibration || 0],
        },
        {
          label: "Engine 2",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          data: [engine2Data?.EGTMargin || 0, engine2Data?.vibration || 0],
        },
      ],
    };

    const chartOptions = {
      plugins: {
        legend: {
          position: "right",
        },
        annotation: {
          annotations: [
            {
              type: "text",
              drawTime: "afterDatasetsDraw",
              x: "Engine 1",
              y: engine1Data?.oilPressure === "Normal" ? 0.8 : 0.2,
              fontSize: 12,
              fontStyle: "bold",
              fontColor: "rgba(0, 0, 0, 1)",
              text: "Engine 1 Oil Pressure: " + (engine1Data?.oilPressure || "Unknown"),
            },
            {
              type: "text",
              drawTime: "afterDatasetsDraw",
              x: "Engine 2",
              y: engine2Data?.oilPressure === "Normal" ? 0.8 : 0.2,
              fontSize: 12,
              fontStyle: "bold",
              fontColor: "rgba(0, 0, 0, 1)",
              text: "Engine 2 Oil Pressure: " + (engine2Data?.oilPressure || "Unknown"),
            },
          ],
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [aircraft]);

  return (
    <div className="bg-white rounded shadow-md p-4">
      <h2 className="text-lg font-bold mb-2">{aircraft?.model} Engine Health Comparison</h2>
      <div className="mb-2">
        <canvas ref={chartRef} width={200} height={100}></canvas>
      </div>
      <div className="bg-gray-100 p-2 rounded">
        <p className="text-xs">Engine 1 Oil Pressure: {aircraft?.engineHealth?.engine1?.oilPressure || "Unknown"}</p>
        <p className="text-xs">Engine 2 Oil Pressure: {aircraft?.engineHealth?.engine2?.oilPressure || "Unknown"}</p>
      </div>
    </div>
  );
};

export default FlightDetailsCard;
