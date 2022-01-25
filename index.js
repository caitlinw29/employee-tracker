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
            mainMenu();
            break;
          default:
            //exit inquirer 
            process.exit(0);
        }     
      });
}



mainMenu();

