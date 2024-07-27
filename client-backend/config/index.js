const mysql = require('mysql2');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'CampusSnackDB'
};

const localConfig = {
  host: '139.224.204.161',
  user: 'mrkaan',
  password: 'mrkaan',
  database: 'CampusSnackDB'
};

const connection = mysql.createConnection(dbConfig).promise();  // 添加 .promise()
connection.connect(error => {
  if (error) {
    console.error('Error connecting to the database: ' + error.stack);
    return;
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;

module.exports = connection;
