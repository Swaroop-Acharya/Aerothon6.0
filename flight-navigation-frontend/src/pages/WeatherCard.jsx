// WeatherCard.jsx
import React, { useEffect, useState } from "react";
import NearbyAirportSearcher from "./NearbyAirportSearcher";
import { Modal, Button } from "react-bootstrap";
import {toast} from 'react-toastify';
function WeatherCard({ weatherData, setNearbyRoute }) {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (weatherData) {
      const conditionsMet = checkWeatherConditions(weatherData.wind.speed, weatherData.visibility.km);
      if (!conditionsMet) {
        setShowModal(true);
      }
    }
  }, [weatherData]);

  const checkWeatherConditions = (windSpeed, visibility) => {
    
    const minVisibility = 1.0; // Minimum visibility in km
    const maxWindSpeed = 1.0; // Maximum wind speed in km/h

    if (visibility < minVisibility) {
      toast.error(`Cannot Land because visibility is too low.`);
      return false;
    }

    if (windSpeed > maxWindSpeed) {
      toast.error(`Cannot Land because wind speed is too high.`);
      return false;
    }

    return true;
  };

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Modal show={showModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Nearby Airport Searcher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NearbyAirportSearcher setNearbyRoute={setNearbyRoute} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WeatherCard;
