async function fetchAirports(latitude, longitude) {
    try {
        const response = await fetch(
            `https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${latitude}&longitude=${longitude}&radius=500&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=relevance`,
            {
                headers: {
                    'accept': 'application/vnd.amadeus+json',
                    'Authorization': 'Bearer UGZwKAALIx3iGGWEADAbgmH0J6T7'
                }
            }
        );
        const data = await response.json();
        return data.data.map(airport => ({
            iataCode: airport.iataCode,
            name: airport.name,
            geoCode: {
                latitude: airport.geoCode.latitude,
                longitude: airport.geoCode.longitude
            },
            distance: airport.distance.value // Assuming the API returns the distance
        }));
    } catch (error) {
        console.error('Error fetching airport data:', error);
        return [];
    }
}

function constructGraph(airports) {
    const graph = {};

    airports.forEach(airport => {
        graph[airport.iataCode] = [];
        airports.forEach(otherAirport => {
            if (airport.iataCode !== otherAirport.iataCode) {
                graph[airport.iataCode].push({ 
                    iataCode: otherAirport.iataCode, 
                    distance: otherAirport.distance 
                });
            }
        });
    });
    console.log(graph);
    return graph;
}

function dijkstra(graph, start, exclude) {
    const distances = {};
    const visited = new Set();
    const queue = [[0, start]];

    Object.keys(graph).forEach(node => {
        distances[node] = Infinity;
    });
    distances[start] = 0;

    while (queue.length) {
        queue.sort((a, b) => a[0] - b[0]); // Sort by distance
        const [currentDistance, currentNode] = queue.shift();

        if (visited.has(currentNode)) continue;
        visited.add(currentNode);

        graph[currentNode].forEach(({ distance, iataCode }) => {
            if (iataCode === exclude) return;
            const newDistance = currentDistance + distance;
            if (newDistance < distances[iataCode]) {
                distances[iataCode] = newDistance;
                queue.push([newDistance, iataCode]);
            }
        });
    }

    return distances;
}

async function main() {
    // Fetch airport data
    const latitude = 13.1979; // Example latitude of the plane
    const longitude = 77.706299; // Example longitude of the plane
    const airports = await fetchAirports(latitude, longitude);

    if (airports.length === 0) {
        console.log('No airport data available.');
        return;
    }

    // Define the destination airport code to be excluded
    const destinationIataCode = "BLR";

    // Define the plane's node
    const planeNode = "PLM"; // Node representing the plane's current location

    // Create the graph from airport data
    const graph = constructGraph(airports);
    graph[planeNode] = airports.map(airport => ({
        iataCode: airport.iataCode,
        distance: airport.distance
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

    // Output the nearest airport
    const nearestAirportInfo = airports.find(airport => airport.iataCode === nearestAirport);
    console.log(`The nearest airport is ${nearestAirportInfo.name} (${nearestAirportInfo.iataCode}) with a distance of ${minDistance.toFixed(2)} km.`);
}

// Run the main function
main();
