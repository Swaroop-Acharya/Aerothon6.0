// Define the Haversine formula and helper functions
function haversine(lon1, lat1, lon2, lat2) {
    const R = 6371; // Radius of the Earth in km
  
    lon1 = degreesToRadians(lon1);
    lat1 = degreesToRadians(lat1);
    lon2 = degreesToRadians(lon2);
    lat2 = degreesToRadians(lat2);
  
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance;
  }
  
  function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
  
  // Fetch airports from the API
  async function fetchAirports(latitude, longitude) {
    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/airports?latitude=${latitude}&longitude=${longitude}&radius=500&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=relevance`,
      {
        headers: {
          'accept': 'application/vnd.amadeus+json',
          'Authorization': 'Bearer 2mH7oKEasqqecP8mOhCGxGZTPIZQ'
        }
      }
    );
    const data = await response.json();
    console.log(data)
    return data.data; // Assuming the API returns data in a "data" field
  }
  
  // Find the nearest airport
  async function findNearestAirport(planeLatitude, planeLongitude, destinationIataCode) {
    const airports = await fetchAirports(planeLatitude, planeLongitude);
  
    let nearestAirport = null;
    let minDistance = Infinity;
  
    for (const airport of airports) {
      if (airport.iataCode === destinationIataCode) {
        continue;
      }
      const distance = haversine(
        planeLongitude,
        planeLatitude,
        airport.geoCode.longitude,
        airport.geoCode.latitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestAirport = airport;
      }
    }
  
    console.log(
      `The nearest airport is ${nearestAirport.name} (${
        nearestAirport.iataCode
      }) with a distance of ${minDistance.toFixed(2)} km.`
    );
  }
  
  // Example usage
  const planeLatitude = 13.2;
  const planeLongitude = 77.5;
  const destinationIataCode = "BLR";
  
  findNearestAirport(planeLatitude, planeLongitude, destinationIataCode);
  