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
  inquirer
  .prompt([
    {
      type: "input",
      name: "roleName",
      message: "What is the name of the role?",
      validate(answer) {
        if(!answer) {
            return "Please provide the name of a role"
        }
        return true
     }
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
      validate(answer) {
        if(!answer) {
            return "Please provide the salary"
        }
        return true
     }
    },
    {
      type: "list",
      name: "roleDept",
      message: "Which department does the role belong to?",
      choices: ["Sales", "Engineering", "Finance", "Legal"]
    },
  ])
  .then((data) => {
      let deptNum;
      switch(data.roleDept){
        case 'Sales':
          deptNum = 1;
          break;
        case 'Engineering':
          deptNum = 2;
          break;
        case 'Finance':
          deptNum = 3;
          break;
        case 'Legal':
          deptNum = 4;
          break;
      }     
      db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.roleName}', ${data.salary}, ${deptNum});`, function () {
        console.log(`Added ${data.roleName} to the database`);
        mainMenu();
      });
  })
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
              return "Please provide the name of a department"
          }
          return true
       }
      }
    ])
    .then((data) => {
        db.query(`INSERT INTO department (name) VALUES ('${data.deptName}');`, function () {
          console.log(`Added ${data.deptName} to the database`);
          mainMenu();
        });
    })
}

const updateEmployee = () => {

}


mainMenu();

