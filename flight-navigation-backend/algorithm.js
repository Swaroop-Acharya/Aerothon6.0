const readline = require('readline');

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
  return locationWeather && locationWeather < 5; // assuming turbulence is rated from 1 to 10
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

function enroute(graph, startNode, goalNode, weatherData, nearbyNodes) {
  const nodes = [startNode, goalNode, ...Array.from(graph.keys()).filter(node => node !== startNode && node !== goalNode)];
  resetNodes(nodes);

  const { path, cost } = dijkstra(graph, startNode, goalNode, weatherData, false, true);

  if (path) {
    console.log("Enroute to destination:");
    path.forEach(step => {
      console.log(`Location: ${step.name}, Altitude: ${step.altitude} feet`);
      if (step.altitude) {
        const turbulence = weatherData[step.name]?.current?.turbulence;
        console.log(`Suggestion: ${suggestAltitude(step.altitude, turbulence)}`);
      }
    });
    console.log("Total cost:", cost);
  } else {
    console.log("No optimal route found due to unfavorable weather conditions. Evaluating alternative routes...");

    const nearbyAirports = nearbyNodes[startNode.name];
    let nearestAirportPath = null;
    let nearestDistance = Infinity;

    for (const airport of nearbyAirports) {
      console.log(`Evaluating path to ${airport}...`);
      const nearbyGoalNode = Array.from(graph.keys()).find(node => node.name === airport);
      if (nearbyGoalNode) {
        resetNodes(nodes);

        const result = dijkstra(graph, startNode, nearbyGoalNode, weatherData, true, true);

        if (result.path && result.cost < nearestDistance) {
          nearestAirportPath = result.path;
          nearestDistance = result.cost;
        }
      } else {
        console.log(`No direct connections from ${startNode.name} to ${airport}.`);
      }
    }

    if (nearestAirportPath) {
      console.log("Alternative route to the nearest favorable airport:");
      nearestAirportPath.forEach(step => {
        console.log(`Location: ${step.name}, Altitude: ${step.altitude} feet`);
        if (step.altitude) {
          const turbulence = weatherData[step.name]?.current?.turbulence;
          console.log(`Suggestion: ${suggestAltitude(step.altitude, turbulence)}`);
        }
      });
      console.log("Distance to nearest airport:", nearestDistance);
    } else {
      console.log("No alternative routes found due to unfavorable weather conditions.");
    }
  }
}

function resetNodes(nodes) {
  nodes.forEach(node => {
    node.cost = Infinity;
    node.parent = null;
    node.altitude = null;
  });
}

function takeoff(weatherData, graph, startNode, goalNode) {
  if (weatherData['Mangalore']?.current?.condition.text.toLowerCase().includes('rain')) {
    console.log("Heavy rain at Mangalore. Delaying takeoff until weather improves.");
  } else {
    console.log("Weather at Mangalore is favorable for takeoff.");
    
    const nodes = [startNode, goalNode, ...Array.from(graph.keys()).filter(node => node !== startNode && node !== goalNode)];
    resetNodes(nodes);

    const { path, cost } = dijkstra(graph, startNode, goalNode, weatherData, false, true);

    if (path) {
      console.log("Optimal route:");
      path.forEach(step => {
        console.log(`Location: ${step.name}, Altitude: ${step.altitude} feet`);
        if (step.altitude) {
          const turbulence = weatherData[step.name]?.current?.turbulence;
          console.log(`Suggestion: ${suggestAltitude(step.altitude, turbulence)}`);
        }
      });
      console.log("Total cost:", cost);
    } else {
      console.log("No route found due to unfavorable weather conditions.");
    }
  }
}

function landing(weatherData, graph, goalNode, nearbyNodes) {
  if (weatherData['Bangalore']?.current?.condition.text.toLowerCase().includes('fog')) {
    console.log("Dense fog expected at Bangalore during landing.");

    const nearbyAirports = nearbyNodes['Bangalore'];
    console.log("Nearby airports:", nearbyAirports.join(', '));

    let nearestAirportPath = null;
    let nearestDistance = Infinity;

    for (const airport of nearbyAirports) {
      console.log(`Evaluating path to ${airport}...`);
      const nearbyGoalNode = Array.from(graph.keys()).find(node => node.name === airport);
      if (nearbyGoalNode) {
        const nodes = [goalNode, ...Array.from(graph.keys()).filter(node => node !== goalNode)];
        resetNodes(nodes);

        const result = dijkstra(graph, goalNode, nearbyGoalNode, weatherData, false, true);
      

        if (result.path && result.cost < nearestDistance) {
          nearestAirportPath = result.path;
          nearestDistance = result.cost;
        }
      } else {
        console.log(`No direct connections from Bangalore to ${airport}.`);
      }
    }

    if (nearestAirportPath) {
      console.log("Nearest destination airport:");
      nearestAirportPath.forEach(step => {
        console.log(`Location: ${step.name}`);
      });
      console.log("Distance to nearest airport:", nearestDistance);
    } else {
      console.log("No path to nearby airports found due to unfavorable weather conditions.");
    }
  } else {
    console.log("No dense fog expected at Bangalore during landing. Proceed with normal landing procedures.");
  }
}

// Create and connect nodes and graph as before
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

const weatherData = {
  Mangalore: {
    current: {
      condition: {
        text: "Clear"
      },
      turbulence: 3
    }
  },
  Goa: {
    current: {
      condition: {
        text: "Clear"
      },
      turbulence: 2 // High turbulence
    }
  },
  Kochi: {
    current: {
      condition: {
        text: "Clear"
      },
      turbulence: 2 // Low turbulence
    }
  },
  Bangalore: {
    current: {
      condition: {
        text: "Dense fog"
      },
      turbulence: 1
    }
  }
};

const startNode = mangalore;
const goalNode = bangalore;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Is the plane at takeoff, enroute, or landing? ", (userInput) => {
  if (userInput.toLowerCase() === 'takeoff') {
    takeoff(weatherData, graph, startNode, goalNode);
  } else if (userInput.toLowerCase() === 'enroute') {
    enroute(graph, startNode, goalNode, weatherData, nearbyNodes);
  } else if (userInput.toLowerCase() === 'landing') {
    landing(weatherData, graph, goalNode, nearbyNodes);
  } else {
    console.log("Invalid input. Please enter 'takeoff', 'enroute', or 'landing'.");
  }
  rl.close();
});
