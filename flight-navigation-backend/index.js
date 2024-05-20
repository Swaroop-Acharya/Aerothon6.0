const express = require("express");
const app = express();
const port = 3000;

// Dummy weather data for the example
const weatherData = {
  Mangalore: { current: { condition: { text: "clear" }, turbulence: 3 } },
  Goa: { current: { condition: { text: "Clear" }, turbulence: 2 } },
  Kochi: { current: { condition: { text: "Clear" }, turbulence: 2 } },
  Bangalore: { current: { condition: { text: "Dense fog" }, turbulence: 1 } },
};

// Nodes and graph setup
class Node {
  constructor(name) {
    this.name = name;
    this.cost = Infinity;
    this.parent = null;
    this.altitude = null;
  }
}

class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(node) {
    this.queue.push(node);
    this.queue.sort((a, b) => a.cost - b.cost);
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

const mangalore = new Node("Mangalore");
const goa = new Node("Goa");
const kochi = new Node("Kochi");
const bangalore = new Node("Bangalore");

const graph = new Map();
graph.set(mangalore, [
  [bangalore, 350],
  [goa, 200],
  [kochi, 150],
]);
graph.set(goa, [[bangalore, 300]]);
graph.set(kochi, [[bangalore, 300]]);
graph.set(bangalore, [
  [goa, 200],
  [kochi, 300],
]);

const nearbyNodes = {
  Bangalore: ["Goa", "Kochi"],
  Goa: ["Mangalore", "Kochi"],
  Kochi: ["Mangalore", "Goa"],
  Mangalore: ["Goa", "Kochi"],
};

function resetNodes(nodes) {
  nodes.forEach((node) => {
    node.cost = Infinity;
    node.parent = null;
    node.altitude = null;
  });
}

function isWeatherConditionFavorable(locationName, weatherData) {
  const locationWeather = weatherData[locationName]?.current?.condition;
  return (
    locationWeather && !locationWeather.text.toLowerCase().includes("rain")
  );
}

function isTurbulenceConditionFavorable(locationName, weatherData) {
  const locationWeather = weatherData[locationName]?.current?.turbulence;
  return locationWeather && locationWeather < 5;
}

function adjustAltitude(locationName, weatherData) {
  const locationWeather = weatherData[locationName]?.current;
  if (locationWeather && locationWeather.turbulence >= 5) {
    return 35000;
  }
  return 30000;
}

function suggestAltitude(altitude, turbulence) {
  if (turbulence >= 5 && altitude === 30000) {
    return "Consider flying higher to avoid turbulence.";
  } else if (turbulence < 5 && altitude === 35000) {
    return "Consider flying lower to save fuel.";
  } else {
    return "Current altitude is optimal.";
  }
}

function dijkstra(
  graph,
  start,
  goal,
  weatherData,
  ignoreGoalWeather = false,
  avoidTurbulence = false
) {
  const openSet = new PriorityQueue();
  openSet.enqueue(start);
  start.cost = 0;
  start.altitude = 30000;

  while (!openSet.isEmpty()) {
    const currentNode = openSet.dequeue();

    if (currentNode === goal) {
      const path = [];
      let node = currentNode;
      while (node) {
        path.unshift({ name: node.name, altitude: node.altitude });
        node = node.parent;
      }
      return { path, cost: goal.cost };
    }

    const neighbors = graph.get(currentNode) || [];
    for (const [neighbor, weight] of neighbors) {
      const newCost = currentNode.cost + weight;
      const newAltitude = avoidTurbulence
        ? adjustAltitude(neighbor.name, weatherData)
        : currentNode.altitude;

      if (
        (ignoreGoalWeather && neighbor === goal) ||
        (isWeatherConditionFavorable(neighbor.name, weatherData) &&
          (!avoidTurbulence ||
            isTurbulenceConditionFavorable(neighbor.name, weatherData)))
      ) {
        if (newCost < neighbor.cost) {
          neighbor.cost = newCost;
          neighbor.parent = currentNode;
          neighbor.altitude = newAltitude;
          openSet.enqueue(neighbor);
        }
      }
    }
  }

  return { path: null, cost: Infinity };
}

// Define API endpoints
app.get("/takeoff", (req, res) => {
  const startNode = mangalore;
  const goalNode = bangalore;
  const nodes = [
    startNode,
    goalNode,
    ...Array.from(graph.keys()).filter(
      (node) => node !== startNode && node !== goalNode
    ),
  ];
  resetNodes(nodes);

  const { path, cost } = dijkstra(
    graph,
    startNode,
    goalNode,
    weatherData,
    false,
    true
  );
  if (path) {
    res.json({ path, cost });
  } else {
    res.json({
      message: "No route found due to unfavorable weather conditions.",
    });
  }
});

app.get("/enroute", (req, res) => {
  const startNode = mangalore;
  const goalNode = bangalore;
  const nodes = [
    startNode,
    goalNode,
    ...Array.from(graph.keys()).filter(
      (node) => node !== startNode && node !== goalNode
    ),
  ];
  resetNodes(nodes);

  const { path, cost } = dijkstra(
    graph,
    startNode,
    goalNode,
    weatherData,
    false,
    true
  );
  if (path) {
    res.json({ path, cost });
  } else {
    // Alternative route logic
    const nearbyAirports = nearbyNodes[startNode.name];
    let nearestAirportPath = null;
    let nearestDistance = Infinity;

    for (const airport of nearbyAirports) {
      const nearbyGoalNode = Array.from(graph.keys()).find(
        (node) => node.name === airport
      );
      if (nearbyGoalNode) {
        resetNodes(nodes);
        const result = dijkstra(
          graph,
          startNode,
          nearbyGoalNode,
          weatherData,
          true,
          true
        );
        if (result.path && result.cost < nearestDistance) {
          nearestAirportPath = result.path;
          nearestDistance = result.cost;
        }
      }
    }

    if (nearestAirportPath) {
      res.json({ path: nearestAirportPath, cost: nearestDistance });
    } else {
      res.json({
        message:
          "No alternative routes found due to unfavorable weather conditions.",
      });
    }
  }
});

app.get("/landing", (req, res) => {
  const goalNode = bangalore;
  if (
    weatherData["Bangalore"]?.current?.condition.text
      .toLowerCase()
      .includes("fog")
  ) {
    const nearbyAirports = nearbyNodes["Bangalore"];
    let nearestAirportPath = null;
    let nearestDistance = Infinity;

    for (const airport of nearbyAirports) {
      const nearbyGoalNode = Array.from(graph.keys()).find(
        (node) => node.name === airport
      );
      if (nearbyGoalNode) {
        const nodes = [
          goalNode,
          ...Array.from(graph.keys()).filter((node) => node !== goalNode),
        ];
        resetNodes(nodes);

        const result = dijkstra(
          graph,
          goalNode,
          nearbyGoalNode,
          weatherData,
          false,
          true
        );
        if (result.path && result.cost < nearestDistance) {
          nearestAirportPath = result.path;
          nearestDistance = result.cost;
        }
      }
    }

    if (nearestAirportPath) {
      res.json({ path: nearestAirportPath, cost: nearestDistance });
    } else {
      res.json({
        message:
          "No path to nearby airports found due to unfavorable weather conditions.",
      });
    }
  } else {
    res.json({
      message:
        "No dense fog expected at Bangalore during landing. Proceed with normal landing procedures.",
    });
  }
});

app.listen(port, () => {
  console.log(`Airline navigation API listening at http://localhost:${port}`);
});
