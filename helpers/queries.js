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


//put all of the current roles in an array
const roleArr = [];
db.query('SELECT title FROM role', function (err, results) {
  for (const role of results){
    roleArr.push(role.title);
  };
  return roleArr;
})


const grabEmployees = () => {
  
}

const grabDepartments = () => {
  
}
module.exports = {
  department,
  role,
  employee,
  roleArr
}