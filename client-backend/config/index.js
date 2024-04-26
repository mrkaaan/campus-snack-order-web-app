const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'CampusSnackDB'
};

const connection = mysql.createConnection(dbConfig);
connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database: ' + error.stack);
    return;
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;
