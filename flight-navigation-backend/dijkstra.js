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

function isWeatherConditionFavorable(locationName, weatherData) {
  const locationWeather = weatherData[locationName]?.current?.condition;
  return locationWeather && !locationWeather.text.toLowerCase().includes('rain');
}

function isTurbulenceConditionFavorable(locationName, weatherData) {
  const locationWeather = weatherData[locationName]?.current?.turbulence;
  return locationWeather && locationWeather < 5;
}

function adjustAltitude(locationName, weatherData) {
  const locationWeather = weatherData[locationName]?.current;
  if (locationWeather && locationWeather.turbulence >= 5) {
    return 35000; // Example: Change to 35,000 feet to avoid turbulence
  }
  return 30000; // Example: Default altitude
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

function dijkstra(graph, start, goal, weatherData, ignoreGoalWeather = false, avoidTurbulence = false) {
  const openSet = new PriorityQueue();
  openSet.enqueue(start);
  start.cost = 0;
  start.altitude = 30000; // Initial altitude

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

      const newAltitude = avoidTurbulence ? adjustAltitude(neighbor.name, weatherData) : currentNode.altitude;
      if ((ignoreGoalWeather && neighbor === goal) ||
        (isWeatherConditionFavorable(neighbor.name, weatherData) && (!avoidTurbulence || isTurbulenceConditionFavorable(neighbor.name, weatherData)))) {
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

function resetNodes(nodes) {
  nodes.forEach(node => {
    node.cost = Infinity;
    node.parent = null;
    node.altitude = null;
  });
}

module.exports = {
  Node,
  PriorityQueue,
  isWeatherConditionFavorable,
  isTurbulenceConditionFavorable,
  adjustAltitude,
  suggestAltitude,
  dijkstra,
  resetNodes
};
