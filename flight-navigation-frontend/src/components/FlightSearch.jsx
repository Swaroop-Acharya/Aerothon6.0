// FlightSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';

const FlightSearch = () => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [path, setPath] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/flight-paths', {
        departure,
        destination
      });
      console.log(response)
      
    } catch (err) {
      
      console.error('Error fetching flight path:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          <label>Departure:</label>
          <input type="text" value={departure} onChange={(e) => setDeparture(e.target.value)} />
        </div>
        <div>
          <label>Destination:</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
        </div>
        <button type="submit">Get Flight Path</button>
      </form>
      {path && (
        <div>
          <h3>Optimal Flight Path:</h3>
          <p>{path.join(' -> ')}</p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default FlightSearch;
