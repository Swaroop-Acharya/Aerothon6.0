const mergedGraph = mergeGraphs(graph1, graph);

console.log(graph)
console.log(graph1)

console.log(mergedGraph);

// Output the merged graph
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

      graph[minNode].forEach(neighbor => {
          const alt = distances[minNode] + parseFloat(neighbor.distance);
          if (alt < distances[neighbor.iataCode]) {
              distances[neighbor.iataCode] = alt;
              prev[neighbor.iataCode] = minNode;
              pq.enqueue(neighbor.iataCode, alt);
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

// Priority Queue implementation
class PriorityQueue {
  constructor() {
      this.items = [];
  }

  enqueue(element, priority) {
      let contain = false;
      const qElement = { element, priority };

      for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].priority > qElement.priority) {
              this.items.splice(i, 0, qElement);
              contain = true;
              break;
          }
      }

      if (!contain) {
          this.items.push(qElement);
      }
  }

  dequeue() {
      if (this.isEmpty()) return "Underflow";
      return this.items.shift();
  }

  isEmpty() {
      return this.items.length === 0;
  }
}

// Define source and destination airports
const source = "MLR";
const destination = "BLR";

// Find the shortest path using Dijkstra's algorithm
const result = findShortestPath(mergedGraph, source, destination);

// Output the shortest path and distance
console.log(`Shortest path from ${source} to ${destination}:`, result.path.join(" -> "));
console.log(`Total distance: ${result.distance} KM`);

