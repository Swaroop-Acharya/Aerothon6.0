// const { pool } = require("../db");

// const checkDbConnection = async (req, res) => {
//   try {
//     const client = await pool.connect();
//     client.release();
//     res.json({
//       status: "success",
//       message: "PostgreSQL database connected successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to connect to PostgreSQL database",
//     });
//   }
// };

// module.exports = { checkDbConnection };
