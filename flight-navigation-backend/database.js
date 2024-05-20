const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  database: "flight-navigation",
  user: "root",
  password: "root",
});


module.exports=connection;