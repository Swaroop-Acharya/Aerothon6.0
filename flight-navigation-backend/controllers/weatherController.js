const axios = require("axios");

const getEnvironmentalData = async (location) => {
  const weatherResponse = await axios.get(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no`
  );
  return weatherResponse;
};

const extractFactors = (weatherData) => {
  return {
    location: weatherData.data.location.name,
    text: weatherData.data.current.condition.text,
    latitude: weatherData.data.location.lat,
    longitude: weatherData.data.location.lon,
    wind: {
      speed: weatherData.data.current.wind_kph,
      direction: weatherData.data.current.wind_dir,
    },
    visibility: {
      km: weatherData.data.current.vis_km,
      miles: weatherData.data.current.vis_miles,
    },
    temperature: {
      celsius: weatherData.data.current.temp_c,
      fahrenheit: weatherData.data.current.temp_f,
    },
    pressure: {
      mb: weatherData.data.current.pressure_mb,
      in: weatherData.data.current.pressure_in,
    },
    precipitation: {
      mm: weatherData.data.current.precip_mm,
      inches: weatherData.data.current.precip_in,
    },
    humidity: weatherData.data.current.humidity,
    cloudCover: weatherData.data.current.cloud,
    uvIndex: weatherData.data.current.uv,
    gust: {
      mph: weatherData.data.current.gust_mph,
      kph: weatherData.data.current.gust_kph,
    },
    lastUpdated: weatherData.data.current.last_updated,
  };
};

const getLocation = async (req, res) => {
  try {
    const { location } = req.body;
    const weatherData = await getEnvironmentalData(location);
    const factors = extractFactors(weatherData);
    res.status(200).json(factors);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch environmental data",
    });
  }
};

module.exports = { getLocation };
