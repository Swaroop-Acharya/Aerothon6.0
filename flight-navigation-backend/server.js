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
        city: airport.address.cityName,
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
        iataCode: airport.iataCode,
        name: airport.name,
        city: airport.city,
        distance: airport.distance,
      }))
      .sort((a, b) => a.distance - b.distance);

    let nearestAirport1 = null;

    // Iterate through airports to find nearest airport with suitable weather conditions
    for (let airport of sortedAirports) {
      const weatherData = await getEnvironmentalData(airport.city);
      const factors = extractFactors(weatherData);
      // console.log(factors)
      if (checkWeatherConditions(factors)) {
        nearestAirport1 = airport;
        break;
      }
      // console.log(airport)
    }
    // console.log(nearestAirport1)

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

const routes = [
  {
    origin: "Mangalore",
    originIATACode: "IXE",
    destination: "Chennai International",
    destinationIATACode: "MAA",
    citiesCovered: ["Chikkamagaluru", "Vellore"],
  },
  {
    origin: "Mangalore",
    originIATACode: "IXE",
    destination: "Coimbatore International",
    destinationIATACode: "CJB",
    citiesCovered: ["Chikkamagaluru", "Mysore"],
  },
  {
    origin: "Mangalore",
    originIATACode: "IXE",
    destination: "Tirupati",
    destinationIATACode: "TIR",
    citiesCovered: ["Chikkamagaluru", "Chittoor"],
  },
  {
    origin: "Mangalore",
    originIATACode: "IXE",
    destination: "Cuddapah",
    destinationIATACode: "CDP",
    citiesCovered: ["Chikkamagaluru", "Chittoor"],
  },
  {
    origin: "Chennai International",
    originIATACode: "MAA",
    destination: "Bangalore",
    destinationIATACode: "BLR",
    citiesCovered: ["Vellore"],
  },
  {
    origin: "Coimbatore International",
    originIATACode: "CJB",
    destination: "Bangalore",
    destinationIATACode: "BLR",
    citiesCovered: ["Mysore"],
  },
  {
    origin: "Tirupati",
    originIATACode: "TIR",
    destination: "Bangalore",
    destinationIATACode: "BLR",
    citiesCovered: ["Chittoor"],
  },
  {
    origin: "Cuddapah",
    originIATACode: "CDP",
    destination: "Bangalore",
    destinationIATACode: "BLR",
    citiesCovered: ["Chittoor"],
  },
];

const getCitiesCovered = (originIATACode, destinationIATACode, routes) => {
  const findRoute = (origin, destination) =>
    routes.find(
      (route) =>
        (route.originIATACode === origin &&
          route.destinationIATACode === destination) ||
        (route.originIATACode === destination &&
          route.destinationIATACode === origin)
    );

  const directRoute = findRoute(originIATACode, destinationIATACode);
  if (directRoute) {
    return directRoute.citiesCovered;
  } else {
    // Check for indirect routes
    for (let route of routes) {
      if (route.originIATACode === originIATACode) {
        const intermediateRoute = findRoute(
          route.destinationIATACode,
          destinationIATACode
        );
        if (intermediateRoute) {
          return [...route.citiesCovered, ...intermediateRoute.citiesCovered];
        }
      } else if (route.destinationIATACode === originIATACode) {
        const intermediateRoute = findRoute(
          route.originIATACode,
          destinationIATACode
        );
        if (intermediateRoute) {
          return [...route.citiesCovered, ...intermediateRoute.citiesCovered];
        }
      }
    }
    return `No route found for ${originIATACode} to ${destinationIATACode}`;
  }
};

//Alternative api's
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Convert degrees to radians
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

const fetchAirportDistance = async (sourceIataCode, destinationIataCode) => {
  try {
    const response = await axios.post(
      `https://airportgap.com/api/airports/distance?from=${sourceIataCode}&to=${destinationIataCode}`
    );
    return response.data.data; // Extract and return the airport distance data from the response
  } catch (error) {
    console.error("Error fetching airport distance data:", error);
    return null; // Return null if there's an error
  }
};

// Function to fetch airport data from the API
const fetchAirportData = async (latitude, longitude, radius) => {
  try {
    const response = await axios.get(
      `https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${latitude}&longitude=${longitude}&radius=${radius}&page[limit]=10&page[offset]=0&sort=relevance`,
      {
        headers: {
          accept: "application/vnd.amadeus+json",
          Authorization: `Bearer ${process.env.AMADEUS_API_KEY}`,
        },
      }
    );
    return response.data.data; // Extract and return the airport data from the response
  } catch (error) {
    console.error("Error fetching airport data:", error);
    return null; // Return null if there's an error
  }
};

async function getFlyStatus(citiesCovered) {
  try {
    const weatherPromises = citiesCovered.map((location) =>
      getEnvironmentalData(location)
    );
    const weatherResponses = await Promise.all(weatherPromises);

    const results = weatherResponses.map((weatherData) => {
      const factors = extractFactors(weatherData);
      const isSuitable = checkWeatherConditions(factors);
      return isSuitable;
    });

    const allSuitable = results.every((result) => result);

    return { flyingStatus: allSuitable };
  } catch (error) {
    console.error("Error in getFlyStatus:", error);
    return { status: "error", message: "Failed to fetch environmental data" };
  }
}

// Function to construct graph representing connections between airports based on distances
const constructGraph = async (
  airports,
  sourceIataCode,
  routes,
  getCitiesCovered,
  getFlyStatus
) => {
  const graph = {};

  for (const sourceAirport of airports) {
    // Skip if the current airport is the same as the sourceIataCode
    if (sourceAirport.iataCode === sourceIataCode) {
      continue;
    }

    const sourceLat = sourceAirport.geoCode.latitude;
    const sourceLon = sourceAirport.geoCode.longitude;

    const airportPromises = airports.map(async (airport) => {
      try {
        // Skip if the airport is the same as the sourceIataCode or the sourceAirport
        if (
          airport.iataCode !== sourceAirport.iataCode &&
          airport.iataCode !== sourceIataCode
        ) {
          const distance = calculateDistance(
            sourceLat,
            sourceLon,
            airport.geoCode.latitude,
            airport.geoCode.longitude
          );

          const citiesCovered = getCitiesCovered(
            sourceAirport.iataCode,
            airport.iataCode,
            routes
          );
          const canFly = await getFlyStatus(citiesCovered);

          if (!graph[sourceAirport.iataCode]) {
            graph[sourceAirport.iataCode] = [];
          }

       

          graph[sourceAirport.iataCode].push({
            iataCode: airport.iataCode,
            distance: distance,
            canFly: canFly.flyingStatus,
          });
        }
      } catch (error) {
        console.error(
          `Error processing ${sourceAirport.iataCode} -> ${airport.iataCode}:`,
          error
        );
      }
    });

    // Wait for all airport promises to resolve
    await Promise.all(airportPromises);
  }

  return graph;
};
// Function to construct graph1 representing connections between airports based on distances
const constructGraph1 = async (
  airportData,
  sourceLat,
  sourceLon,
  sourceIataCode,
  skipIataCode
) => {
  const graph = {};

  const airportPromises = airportData.map(async (airport) => {
    try {
      if (airport.iataCode !== skipIataCode) {
        const distance = calculateDistance(
          sourceLat,
          sourceLon,
          airport.geoCode.latitude,
          airport.geoCode.longitude
        );

        if (!graph[sourceIataCode]) {
          graph[sourceIataCode] = [];
        }

        const result = getCitiesCovered(
          sourceIataCode,
          airport.iataCode,
          routes
        );
        const flag = await getFlyStatus(result);

        graph[sourceIataCode].push({
          iataCode: airport.iataCode,
          distance: distance,
          canFly: flag.flyingStatus,
        });
      }
    } catch (error) {
      console.error(
        `Error processing ${sourceIataCode} -> ${airport.iataCode}:`,
        error
      );
    }
  });

  // Wait for all airport promises to resolve
  await Promise.all(airportPromises);

  return graph;
};
// Priority Queue implementation
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 1, queueElement);
        added = true;
        break;
      }
    }
    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

function findShortestPath(graph, startNode, endNode) {
  const distances = {};
  const prev = {};
  const pq = new PriorityQueue();

  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  for (let node in graph) {
    if (node !== startNode) {
      distances[node] = Infinity;
    }
    prev[node] = null;
  }

  while (!pq.isEmpty()) {
    const minNode = pq.dequeue().element;
    if (minNode === endNode) break;

    graph[minNode].forEach((neighbor) => {
      if (neighbor.canFly) {
        const alt = distances[minNode] + parseFloat(neighbor.distance);
        if (alt < distances[neighbor.iataCode]) {
          distances[neighbor.iataCode] = alt;
          prev[neighbor.iataCode] = minNode;
          pq.enqueue(neighbor.iataCode, alt);
        }
      }
    });
  }

  const path = [];
  for (let at = endNode; at !== null; at = prev[at]) {
    path.push(at);
  }
  path.reverse();

  return { path, distance: distances[endNode] };
}

// Route to fetch and return the airport graphs
app.post("/api/airport-graphs", async (req, res) => {
  const { sourceIataCode, destinationIataCode } = req.body; // Extract source and destination IATA codes from request body
  console.log(req.body);

  const airportDistanceData = await fetchAirportDistance(
    sourceIataCode,
    destinationIataCode
  ); // Fetch airport distance data

  if (!airportDistanceData) {
    res.status(500).json({ error: "Error fetching airport distance data" }); // Return error if data fetch fails
    return;
  }

  const sourceLat = airportDistanceData.attributes.from_airport.latitude;
  const sourceLon = airportDistanceData.attributes.from_airport.longitude;
  const destinationLat = airportDistanceData.attributes.to_airport.latitude;
  const destinationLon = airportDistanceData.attributes.to_airport.longitude;
  const skipIataCode = airportDistanceData.attributes.to_airport.iata; // Skip destination IATA code

  // Fetch airport data
  const airportData = await fetchAirportData(
    destinationLat,
    destinationLon,
    280
  );
  if (!airportData) {
    res.status(500).json({ error: "Error fetching airport data" }); // Return error if data fetch fails
    return;
  }

  // Construct the graphs
  let graph, graph1;
  try {
    graph = await constructGraph(
      airportData,
      sourceIataCode,
      routes,
      getCitiesCovered,
      getFlyStatus
    );

    graph1 = await constructGraph1(
      airportData,
      sourceLat,
      sourceLon,
      sourceIataCode,
      skipIataCode
    );
  } catch (error) {
    console.error("Error constructing graph:", error);
  }

  console.log(graph1);

  // Merge the graphs
  const mergedGraph = { ...graph1, ...graph };


  console.log(mergedGraph)

  // Find the shortest path using Dijkstra's algorithm
  const result = findShortestPath(mergedGraph, sourceIataCode, skipIataCode);

  // Send the shortest path and total distance as JSON response
  res.json({
    path: result.path,
    distance: `${result.distance.toFixed(2)}`,
  });
});




app.post('/api/airport-graphs', async (req, res) => {
  try {
    const { sourceIataCode, destinationIataCode } = req.body;
    const response = await axios.post('http://localhost:5000/api/airport-graphs', {
      sourceIataCode,
      destinationIataCode,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/airport-distance', async (req, res) => {
  try {
    const { from, to } = req.body;
    const response = await axios.post('https://airportgap.com/api/airports/distance', { from, to });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/flight-fuel', async (req, res) => {
  try {
    const { aircraft, distance, gcd } = req.query;
    const response = await axios.get('https://despouy.ca/flight-fuel-api/q/', {
      params: { aircraft, distance, gcd }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
