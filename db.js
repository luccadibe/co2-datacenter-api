const mysql = require("mysql2");
require("dotenv").config();

// Create the database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Export a function to query the database
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { query };
