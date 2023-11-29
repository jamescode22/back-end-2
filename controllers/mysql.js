const mysql = require("mysql2");

// create database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "cars",
});

const dbQuery = (query) =>
  new Promise((resolve, reject) => {
    console.log(query);
    db.query(query, (err, results, fields) => {
      if (err) reject(err);
      resolve(results);
    });
  });

module.exports = dbQuery;
