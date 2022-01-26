require('dotenv').config()
const mysql = require('mysql2');
const inquirer = require('inquirer');
const term = require( 'terminal-kit' ).terminal;
const {department, role, employee} = require('./helpers/queries');
require('./helpers/chalkFiglet');

const db = mysql.createConnection(
  {
    //TODO: Add your own information to use this app
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'employees_db'
  }
); 
// // Query database for department table
// department.runQuery();

// // Query database for role table
// role.runQuery();


//function runs on node index.js 
function mainMenu() {
  inquirer
      .prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
        }
      ])
      .then((choice) => {
        switch(choice.mainMenu){
          case 'View All Employees':
            //Query database for employee table
            employee.runQuery();
            mainMenu();
            break;
          case 'Add Employee':
            addEmployee();
            break;
          case 'Update Employee Role':
            updateEmployee();
            break;
          case 'View All Roles':
            //Query database for role table
            role.runQuery();
            mainMenu();
            break;
          case 'Add Role':
            addRole();
            break;
          case 'View All Departments':
            //query database for department table
            department.runQuery();
            mainMenu();
            break;
          case 'Add Department':
            addDept();
            break;
          default:
            //exit inquirer 
            process.exit(0);
        }     
      });
}

const addEmployee = () => {

}

const addRole = () => {

}

const addDept = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What is the name of the department?",
        validate(answer) {
          if(!answer) {
              return "Please provide a name of a department"
          }
          return true
       }
      }
    ])
    .then((data) => {
        db.query(`INSERT INTO department (name) VALUES ('${data.deptName}');`, function () {
          console.log(`Added ${data.deptName} to the database`);
        });
        
        
    })
}

const updateEmployee = () => {

}


mainMenu();

