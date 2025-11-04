# ✈️ Flight Navigation Enhancement System

A full-stack web application designed to optimize flight route planning and mitigate risks by leveraging real-time data and advanced algorithms for efficient and safe flight operations.

🔗 **Live Site**: [https://flight-navigation-frontend.vercel.app](https://flight-navigation-frontend.vercel.app)  
🔗 **Backend API Base URL**: `https://flight-navigation-backend.onrender.com`

---
[![Watch the video](https://img.youtube.com/vi/DJQCf-_CgE8/0.jpg)](https://www.youtube.com/watch?v=DJQCf-_CgE8)

## 📘 Introduction

This system ensures enhanced flight navigation by dynamically computing optimal routes based on weather and airspace conditions. It integrates a scalable backend, responsive frontend, and real-time data handling to support efficient aviation operations.

---

## ⚙️ Tech Stack

- **Frontend**: React.js (deployed on [Vercel](https://vercel.com/))
- **Backend**: Node.js, Express.js (deployed on [Render](https://render.com/))
- **Database**: MySQL
- **Algorithm**: Dijkstra's algorithm for shortest path calculation
- **Real-time Updates**: WebSockets

---

## 🧠 Key Features

- Real-time shortest path route planning using Dijkstra's algorithm
- Live flight location tracking
- Distance and nearest airport calculations
- Fuel consumption tracking
- RESTful API access with authentication and rate limiting
- Integration with third-party APIs for airport and location data

---

## 🔁 Data Flow

1. Frontend sends requests to backend via RESTful API.
2. Backend processes data and communicates with MySQL.
3. Real-time updates and notifications via WebSockets.

---

## 🧩 Database

- Normalized to **3NF** for minimal redundancy and maximum data consistency
- Indexed for performance
- Tables include:
  - Airports
  - Flights
  - Intermediate Cities
  - Weather
  - Fuel Data

---

## 📈 Monitoring & Performance

- Logging via Node.js and Express middleware
- Query optimization and caching mechanisms
- Horizontal scalability built-in via stateless architecture

---

## 🚀 Deployment

- **Frontend**: Hosted on Vercel (CI/CD enabled)
- **Backend**: Hosted on Render (autoscaling and monitoring)

---

## 🔌 API Documentation

**Authentication**:  
Every API request must include an API key:
```
Authorization: Bearer YOUR_API_KEY
```

**Rate Limiting**:  
1000 requests/hour per API key

### ✈️ Available Endpoints

#### 1. Airport Distance API  
**GET** `https://airportgap.com/api/airports/distance`  
- **Params**: `from`, `to` (IATA codes)

#### 2. Route Planning API  
**GET** `/api/getRoute`  
- **Params**: `from`, `to` (IATA codes)

#### 3. Location API  
**GET** `/api/getlocation`  
- **Params**: `flight_id`

#### 4. Insert Airport API  
**POST** `/api/insertAirport`  
- **Body**: `iata`, `name`, `city`, `country`

#### 5. Insert Destination Airport API  
**POST** `/api/insertDestinationAirport`  
- **Body**: `iata`, `name`, `city`, `country`

#### 6. Flight Status API  
**GET** `/api/getFlyStatus`  
- **Params**: `flight_id`

#### 7. Nearest Airport API  
**GET** `/api/get-nearest-airport`  
- **Params**: `latitude`, `longitude`

#### 8. Nearby Airports API  
**GET** `/api/near`  
- **Params**: `latitude`, `longitude`, `radius`

#### 9. Airport Graphs API  
**GET** `/api/airport-graphs`  
- Retrieves graph data for airport connections

#### 10. External Airport Info API  
**GET** `https://airport-info.p.rapidapi.com/airport`  
- **Params**: `iata`

#### 11. Flight Fuel API  
- **GET** `/api/flight-fuel`  
  - **Params**: `flight_id`  
- **POST** `/api/insertFlightFuel`  
  - **Body**: `flight_id`, `fuel_used`, `fuel_remaining`

#### 12. External Location Data API  
**GET** `https://test.api.amadeus.com/v1/reference-data/locations`  
- **Params**: `keyword`

#### 13. Aircraft API  
**GET** `/api/aircraft`

#### 14. Routes API  
**GET** `/api/routes`

---

## ⚠️ Error Handling

- **400 Bad Request**: Invalid or malformed request
- **401 Unauthorized**: Missing or invalid API key
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unexpected server issue
