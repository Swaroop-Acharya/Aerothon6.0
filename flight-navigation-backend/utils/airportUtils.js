const axios = require("axios");

const fetchAirports = async (latitude, longitude) => {
  try {
    const response = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${latitude}&longitude=${longitude}&radius=100&page[limit]=10&page[offset]=0&sort=relevance`, {
      headers: {
        accept: "application/vnd.amadeus+json",
        Authorization: `Bearer ${process.env.AMADEUS_API_KEY}`,
      },
    });
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

module.exports = { fetchAirports, constructGraph, dijkstra };
