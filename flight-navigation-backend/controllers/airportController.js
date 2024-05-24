const axios = require("axios");

const fetchAirports = async (latitude, longitude, radius) => {
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
      distance: airport.distance.value,
    }));
  } catch (error) {
    console.error("Error fetching airport data:", error);
    return [];
  }
};

const constructGraph = (airports) => {
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
};

const dijkstra = (graph, start, exclude) => {
  const distances = {};
  const visited = new Set();
  const queue = [[0, start]];

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
  });
  distances[start] = 0;

  while (queue.length) {
    queue.sort((a, b) => a[0] - b[0]);
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
};

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

const checkWeatherConditions = (weatherData) => {
  const minVisibility = 1.0;
  const maxWindSpeed = 20.0;

  if (
    weatherData.visibility.km >= minVisibility &&
    weatherData.wind.speed <= maxWindSpeed
  ) {
    return true;
  }
  return false;
};

const getNearestAirport = async (req, res) => {
  const { latitude, longitude, radius, destinationIataCode } = req.body;

  try {
    const airports = await fetchAirports(latitude, longitude, radius);
    const validAirports = airports.filter((airport) => airport.distance !== null);

    if (validAirports.length === 0) {
      res.status(404).json({
        status: "error",
        message: "No valid airport data available.",
      });
      return;
    }

    const planeNode = "PLM";
    const graph = constructGraph(validAirports);
    graph[planeNode] = validAirports.map((airport) => ({
      iataCode: airport.iataCode,
      distance: airport.distance,
    }));

    const distancesFromPlane = dijkstra(graph, planeNode, destinationIataCode);

    let nearestAirport = null;
    let minDistance = Infinity;
    Object.entries(distancesFromPlane).forEach(([iataCode, distance]) => {
      if (iataCode !== planeNode && distance < minDistance) {
        minDistance = distance;
        nearestAirport = iataCode;
      }
    });

    const nearestAirportDetails = validAirports.find(
      (airport) => airport.iataCode === nearestAirport
    );

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

    for (let airport of sortedAirports) {
      const weatherData = await getEnvironmentalData(airport.city);
      const factors = extractFactors(weatherData);
      if (checkWeatherConditions(factors)) {
        nearestAirport1 = airport;
        break;
      }
    }

    res.json({
      nearestAirport: nearestAirportDetails,
      minDistance,
      allAirports: sortedAirports,
    });
  } catch (error) {
    console.error("Error fetching airport data:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch airport data",
    });
  }
};

const getAirportGraph = async (req, res) => {

    console.log(req.body)
  const { latitude, longitude, radius } = req.body;

  try {
    const airports = await fetchAirports(latitude, longitude, radius);
    const validAirports = airports.filter((airport) => airport.distance !== null);

    if (validAirports.length === 0) {
      res.status(404).json({
        status: "error",
        message: "No valid airport data available.",
      });
      return;
    }

    const graph = constructGraph(validAirports);

    res.json({
      graph,
    });
  } catch (error) {
    console.error("Error fetching airport data:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch airport data",
    });
  }
    
};

const getGraph = async (req, res) => {

   console.log("HIIIIIIII")

  try {
    
  } catch (error) {
    console.error("Error fetching airport data:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch airport data",
    });
  }
    
};


module.exports = { getNearestAirport, getAirportGraph ,getGraph};
