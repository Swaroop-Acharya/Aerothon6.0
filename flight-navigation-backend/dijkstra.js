const heapq = require('heapq');

class Node {
  constructor(name) {
    this.name = name;
    this.cost = Infinity; // Cost from start node to current node
    this.parent = null; // Parent node for path reconstruction
  }
}

const dijkstra = (graph, start, goal) => {
  const openSet = []; // Priority queue for nodes to be evaluated
  heapq.push(openSet, start);
  start.cost = 0;

  while (openSet.length > 0) {
    const currentNode = heapq.pop(openSet);

    if (currentNode === goal) {
      const path = [];
      let node = currentNode;
      while (node) {
        path.push(node.name);
        node = node.parent;
      }
      return path.reverse();
    }

    for (const [neighbor, weight] of graph[currentNode.name]) {
      const newCost = currentNode.cost + weight;

      if (newCost < neighbor.cost) {
        neighbor.cost = newCost;
        neighbor.parent = currentNode;
        heapq.push(openSet, neighbor);
      }
    }
  }

  return null; // No path found
};
module.exports = { Node, dijkstra };