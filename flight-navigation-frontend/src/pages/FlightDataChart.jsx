import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const FlightDataChart = ({ aircraftData }) => {
  if (!aircraftData || aircraftData.length === 0) {
    return <div>No data available to display chart.</div>;
  }

  const data = aircraftData.map((aircraft) => ({
    name: aircraft.model,
    value: aircraft.flightHours,
  }));

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name, percent }) =>
          `${name}: ${(percent * 100).toFixed(0)}%`
        }
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default FlightDataChart;
