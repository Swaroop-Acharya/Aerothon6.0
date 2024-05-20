const express = require("express");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const axios = require("axios");
const cors = require("cors");
const connection =require('./database')
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const {
  Node,
  PriorityQueue,
  isWeatherConditionFavorable,
  isTurbulenceConditionFavorable,
  adjustAltitude,
  suggestAltitude,
  dijkstra,
  resetNodes
} = require('./dijkstra');

// Dummy weather data for the example
const weatherData = {
  Mangalore: { current: { condition: { text: "Clear" }, turbulence: 3 }},
  Goa: { current: { condition: { text: "Clear" }, turbulence: 2 }},
  Kochi: { current: { condition: { text: "Clear" }, turbulence: 2 }},
  Bangalore: { current: { condition: { text: "Dense fog" }, turbulence: 1 }}
};

// Nodes and graph setup
const mangalore = new Node('Mangalore');
const goa = new Node('Goa');
const kochi = new Node('Kochi');
const bangalore = new Node('Bangalore');

const graph = new Map();
graph.set(mangalore, [[bangalore, 350], [goa, 200], [kochi, 150]]);
graph.set(goa, [[bangalore, 300]]);
graph.set(kochi, [[bangalore, 300]]);
graph.set(bangalore, [[goa, 200], [kochi, 300]]);

const nearbyNodes = {
  Bangalore: ['Goa', 'Kochi'],
  Goa: ['Mangalore', 'Kochi'],
  Kochi: ['Mangalore', 'Goa'],
  Mangalore: ['Goa', 'Kochi']
};

app.get('/takeoff', (req, res) => {
  const startNode = mangalore;
  const goalNode = bangalore;
  const nodes = [startNode, goalNode, ...Array.from(graph.keys()).filter(node => node !== startNode && node !== goalNode)];
  resetNodes(nodes);

  const { path, cost } = dijkstra(graph, startNode, goalNode, weatherData, false, true);
  if (path) {
    res.json({ path, cost });
  } else {
    res.json({ message: 'No route found due to unfavorable weather conditions.' });
  }
});

app.get('/enroute', (req, res) => {
  const startNode = mangalore;
  const goalNode = bangalore;
  const nodes = [startNode, goalNode, ...Array.from(graph.keys()).filter(node => node !== startNode && node !== goalNode)];
  resetNodes(nodes);

  const { path, cost } = dijkstra(graph, startNode, goalNode, weatherData, false, true);
  if (path) {
    res.json({ path, cost });
  } else {
    // Alternative route logic
    const nearbyAirports = nearbyNodes[startNode.name];
    let nearestAirportPath = null;
    let nearestDistance = Infinity;

    for (const airport of nearbyAirports) {
      const nearbyGoalNode = Array.from(graph.keys()).find(node => node.name === airport);
      if (nearbyGoalNode) {
        resetNodes(nodes);
        const result = dijkstra(graph, startNode, nearbyGoalNode, weatherData, true, true);
        if (result.path && result.cost < nearestDistance) {
          nearestAirportPath = result.path;
          nearestDistance = result.cost;
        }
      }
    }

    if (nearestAirportPath) {
      res.json({ path: nearestAirportPath, cost: nearestDistance });
    } else {
      res.json({ message: 'No alternative routes found due to unfavorable weather conditions.' });
    }
  }
});

app.get('/landing', (req, res) => {
  const goalNode = bangalore;
  if (weatherData['Bangalore']?.current?.condition.text.toLowerCase().includes('fog')) {
    const nearbyAirports = nearbyNodes['Bangalore'];
    let nearestAirportPath = null;
    let nearestDistance = Infinity;

    for (const airport of nearbyAirports) {
      const nearbyGoalNode = Array.from(graph.keys()).find(node => node.name === airport);
      if (nearbyGoalNode) {
        const nodes = [goalNode, ...Array.from(graph.keys()).filter(node => node !== goalNode)];
        resetNodes(nodes);

        const result = dijkstra(graph, goalNode, nearbyGoalNode, weatherData, false, true);
        if (result.path && result.cost < nearestDistance) {
          nearestAirportPath = result.path;
          nearestDistance = result.cost;
        }
      }
    }

    if (nearestAirportPath) {
      res.json({ path: nearestAirportPath, cost: nearestDistance });
    } else {
      res.json({ message: 'No path to nearby airports found due to unfavorable weather conditions.' });
    }
  } else {
    res.json({ message: 'No dense fog expected at Bangalore during landing. Proceed with normal landing procedures.' });
  }
});

// Route to check PostgreSQL database connection
app.get("/api/check-db-connection", async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.json({
      status: "success",
      message: "PostgreSQL database connected successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to connect to PostgreSQL database",
      });
  }
});

app.post("/api/getlocation", async (req, res, next) => {
  try {
    const { location } = req.body;
    const weatherData = await getEnvironmentalData(location);
    const factors = extractFactors(weatherData);
    res.status(200).json(factors);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch environmental data" });
  }
});

const getEnvironmentalData = async (location) => {
  const weatherResponse = await axios.get(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no`
  );
  console.log(weatherResponse);
  return weatherResponse;
};
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // connection.connect(function(err){
  //   if(err) throw err;
  //   console.log("Database connected")
  // })
});

const extractFactors = (weatherData) => {
  return {
    location: weatherData.data.location.name,
    text: weatherData.data.current.condition.text,
    latitude: weatherData.data.location.lat,
    longitude: weatherData.data.location.lon,
    wind: {
      speed: weatherData.data.current.wind_kph,
      direction: weatherData.data.current.wind_dir,
    },
    visibility: {
      km: weatherData.data.current.vis_km,
      miles: weatherData.data.current.vis_miles,
    },
    temperature: {
      celsius: weatherData.data.current.temp_c,
      fahrenheit: weatherData.data.current.temp_f,
    },
    pressure: {
      mb: weatherData.data.current.pressure_mb,
      in: weatherData.data.current.pressure_in,
    },
    precipitation: {
      mm: weatherData.data.current.precip_mm,
      inches: weatherData.data.current.precip_in,
    },
    humidity: weatherData.data.current.humidity,
    cloudCover: weatherData.data.current.cloud,
    uvIndex: weatherData.data.current.uv,
    gust: {
      mph: weatherData.data.current.gust_mph,
      kph: weatherData.data.current.gust_kph,
    },
    lastUpdated: weatherData.data.current.last_updated,
  };
};
