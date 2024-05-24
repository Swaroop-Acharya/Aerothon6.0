const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const airportRoutes = require("./routes/airportRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
// const dbRoutes = require("./routes/dbRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/api", airportRoutes);
app.use("/api", weatherRoutes);
// app.use("/api", dbRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
