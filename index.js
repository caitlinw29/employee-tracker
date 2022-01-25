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
  }
);

// Query database for department table
db.query('SELECT * FROM department', function (err, results) {
  console.table(results);
});

// Query database for role table
db.query('SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON department.id = role.department_id', function (err, results) {
  console.table(results);
});


//Query database for employee table
db.query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, " ", m.last_name) as manager FROM employee AS e  LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id', function (err, results) {
  console.table(results);
});