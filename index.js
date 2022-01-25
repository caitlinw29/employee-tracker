const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

// Query database
db.query('SELECT * FROM department', function (err, results) {
  console.table(results);
});
