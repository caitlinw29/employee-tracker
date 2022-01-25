require('dotenv').config()
const inquirer = require('inquirer');
const term = require( 'terminal-kit' ).terminal;
const {department, role, employee} = require('./helpers/queries');
require('./helpers/chalkFiglet');

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
        //uses the data to create an Engineer instance before pushing it to the team array
        console.log(`Added ${data.deptName} to the database`);
        
    })
}

const updateEmployee = () => {

}


mainMenu();

