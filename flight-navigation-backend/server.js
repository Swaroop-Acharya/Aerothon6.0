const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

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
    res.status(500).json({
      status: "error",
      message: "Failed to connect to PostgreSQL database",
    });
  }
});

app.post("/api/getlocation", async (req, res) => {
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
  return weatherResponse;
};

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

// Function to check weather conditions
const checkWeatherConditions = (weatherData) => {
  const minVisibility = 1.0; // Minimum visibility in kilometers
  const maxWindSpeed = 20.0; // Maximum wind speed in kilometers per hour

  // Check if visibility and wind speed are within acceptable ranges
  if (
    weatherData.visibility.km >= minVisibility &&
    weatherData.wind.speed <= maxWindSpeed
  ) {
    return true; // Weather conditions are suitable
  }
  return false; // Weather conditions are not suitable
};

app.post("/api/get-nearest-airport", async (req, res) => {
  const { latitude, longitude, radius, destinationIataCode } = req.body;

  async function fetchAirports(latitude, longitude) {
    try {
      const response = await axios.get(
        `https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${latitude}&longitude=${longitude}&radius=${radius}&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=relevance`,
        {
          headers: {
            accept: "application/vnd.amadeus+json",
            Authorization: `Bearer ${process.env.AMADEUS_API_KEY}`,
          },
        }
      );
      return response.data.data.map((airport) => ({
        iataCode: airport.iataCode,
        name: airport.name,
        city:airport.address.cityName,
        geoCode: {
          latitude: airport.geoCode.latitude,
          longitude: airport.geoCode.longitude,
        },
        distance: airport.distance.value, // Assuming the API returns the distance
      }));
    } catch (error) {
      console.error("Error fetching airport data:", error);
      return [];
    }
  }

  function constructGraph(airports) {
    const graph = {};

    airports.forEach((airport) => {
      graph[airport.iataCode] = [];
      airports.forEach((otherAirport) => {
        if (airport.iataCode !== otherAirport.iataCode) {
          graph[airport.iataCode].push({
            iataCode: otherAirport.iataCode,
            distance: otherAirport.distance,
          });
        }
      });
    });
    return graph;
  }

  function dijkstra(graph, start, exclude) {
    const distances = {};
    const visited = new Set();
    const queue = [[0, start]];

    Object.keys(graph).forEach((node) => {
      distances[node] = Infinity;
    });
    distances[start] = 0;

    while (queue.length) {
      queue.sort((a, b) => a[0] - b[0]); // Sort by distance
      const [currentDistance, currentNode] = queue.shift();

      if (visited.has(currentNode)) continue;
      visited.add(currentNode);

      graph[currentNode].forEach(({ distance, iataCode }) => {
        if (iataCode === exclude || distance === null) return;
        const newDistance = currentDistance + distance;
        if (newDistance < distances[iataCode]) {
          distances[iataCode] = newDistance;
          queue.push([newDistance, iataCode]);
        }
      });
    }

    return distances;
  }

  try {
    // Fetch airport data
    const airports = await fetchAirports(latitude, longitude);

    // Filter out airports with null distance
    const validAirports = airports.filter(
      (airport) => airport.distance !== null
    );

    if (validAirports.length === 0) {
      res
        .status(404)
        .json({ status: "error", message: "No valid airport data available." });
      return;
    }

    // Define the plane's node
    const planeNode = "PLM"; // Node representing the plane's current location

    // Create the graph from valid airport data
    const graph = constructGraph(validAirports);
    graph[planeNode] = validAirports.map((airport) => ({
      iataCode: airport.iataCode,
      distance: airport.distance,
    }));

    // Dijkstra's algorithm to find the shortest path
    const distancesFromPlane = dijkstra(graph, planeNode, destinationIataCode);

    // Find the nearest airport
    let nearestAirport = null;
    let minDistance = Infinity;
    Object.entries(distancesFromPlane).forEach(([iataCode, distance]) => {
      if (iataCode !== planeNode && distance < minDistance) {
        minDistance = distance;
        nearestAirport = iataCode;
      }
    });

    // Get the nearest airport details
    const nearestAirportDetails = validAirports.find(
      (airport) => airport.iataCode === nearestAirport
    );

    // Prepare the sorted list of all airports
   
    const sortedAirports = validAirports
      .filter((airport) => airport.distance !== null && airport.distance > 0)
      .map((airport) => ({
        iataCode:airport.iataCode,
        name: airport.name,
        city:airport.city,
        distance: airport.distance,
      }))
      .sort((a, b) => a.distance - b.distance);
    
      let nearestAirport1 = null;

    // Iterate through airports to find nearest airport with suitable weather conditions
    for (let airport of sortedAirports) {
      const weatherData = await getEnvironmentalData(airport.city);
      const factors = extractFactors(weatherData);
      console.log(factors)
      if (checkWeatherConditions(factors)) {
        nearestAirport1 = airport;
        break;
      }
      // console.log(airport)
    }
    console.log(nearestAirport1)




    res.json({
      nearestAirport: nearestAirportDetails,
      minDistance,
      allAirports: sortedAirports,
    });
  } catch (error) {
    console.error("Error fetching airport data:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch airport data" });
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
