const mysql = require('mysql2');
require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    //TODO: Add your own information to use this app
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employees_db'
  }
); 

//set up a class to be able to query any table from our database
class Query {
  constructor(query){
     this.query= query;
  }
  //when we run a query, console.table will show the results in a table in the console.
  runQuery(){
    db.query(this.query, function (err, results) {
      console.table('\n', results, '\n');
    });
  }
};

//create instances of the query class for each table
const department = new Query('SELECT * FROM department');
const role = new Query('SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON department.id = role.department_id ORDER BY id');
const employee = new Query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, " ", m.last_name) as manager FROM employee AS e  LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id ORDER BY id');
const sortByManager = new Query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, " ", m.last_name) as manager FROM employee AS e  LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id ORDER BY e.manager_id');
const sortByDept = new Query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, " ", m.last_name) as manager FROM employee AS e  LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id ORDER BY role.department_id');
const sortByFirstName = new Query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, " ", m.last_name) as manager FROM employee AS e  LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id ORDER BY e.first_name');
const sortByLastName = new Query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, " ", m.last_name) as manager FROM employee AS e  LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id ORDER BY e.last_name');

//put all departments in an array
const deptArr = [];
db.query('SELECT name FROM department', function (err, results) {
  for (const dept of results){
    deptArr.push(dept.name);
  };
  return deptArr;
})

//put all of the current roles in an array
const roleArr = [];
db.query('SELECT title FROM role', function (err, results) {
  for (const role of results){
    roleArr.push(role.title);
  };
  return roleArr;
})

//put all employees in an array
const empArr = [];
db.query('SELECT first_name, last_name FROM employee', function (err, results) {
  for (const emp of results){
    empArr.push(emp.first_name + " " + emp.last_name);
  };
  return empArr;
})

//put all managers in an array
const managerArr = [];
db.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', function (err, results) {
  for (const manager of results){
    managerArr.push(manager.first_name + " " + manager.last_name);
  };
  return managerArr;
})

module.exports = {
  db,
  department,
  role,
  employee,
  sortByManager,
  sortByDept,
  sortByFirstName,
  sortByLastName,
  deptArr,
  roleArr,
  empArr,
  managerArr
}