const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const axios =require('axios')
const cors=require('cors')
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Route to check PostgreSQL database connection
app.get('/api/check-db-connection', async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    res.json({ status: 'success', message: 'PostgreSQL database connected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Failed to connect to PostgreSQL database' });
  }
});


app.post('/api/getlocation', async (req, res, next) => {
    try {
      const { location } = req.body;
      const weatherData = await getEnvironmentalData(location);
      const factors = extractFactors(weatherData);
      res.status(200).json(factors);
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch environmental data' });
    }
  });

const getEnvironmentalData = async (location) => {
    
    const weatherResponse = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}&aqi=no`
    );
   return weatherResponse;
  };
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const extractFactors = (weatherData) => {
  return {
    wind: {
      speed: weatherData.data.current.wind_kph,
      direction: weatherData.data.current.wind_dir
    },
    visibility: {
      km: weatherData.data.current.vis_km,
      miles: weatherData.data.current.vis_miles
    },
    temperature: {
      celsius: weatherData.data.current.temp_c,
      fahrenheit: weatherData.data.current.temp_f
    },
    pressure: {
      mb: weatherData.data.current.pressure_mb,
      in: weatherData.data.current.pressure_in
    },
    precipitation: {
      mm: weatherData.data.current.precip_mm,
      inches: weatherData.data.current.precip_in
    },
    humidity: weatherData.data.current.humidity,
    cloudCover: weatherData.data.current.cloud,
    uvIndex: weatherData.data.current.uv,
    gust: {
      mph: weatherData.data.current.gust_mph,
      kph: weatherData.data.current.gust_kph
    },
    lastUpdated: weatherData.data.current.last_updated
  };
};
