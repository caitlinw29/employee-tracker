const mysql = require('mysql2');
require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
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
      console.table(results);
    });
  }
};

//create instances of the query class for each table
const department = new Query('SELECT * FROM department');
const role = new Query('SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON department.id = role.department_id');
const employee = new Query('SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, " ", m.last_name) as manager FROM employee AS e  LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id');

module.exports = {
  department,
  role,
  employee
}