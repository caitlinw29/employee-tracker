require('dotenv').config()
const mysql = require('mysql2');
const inquirer = require('inquirer');
const term = require( 'terminal-kit' ).terminal;
const {department, role, employee, deptArr, roleArr, empArr} = require('./helpers/queries');
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
            //wait to show main menu to avoid glitchy behavior
            setTimeout(() => {
              mainMenu();
            }, 10);
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
            setTimeout(() => {
              mainMenu();
            }, 10);
            break;
          case 'Add Role':
            addRole();
            break;
          case 'View All Departments':
            //query database for department table
            department.runQuery();
            setTimeout(() => {
              mainMenu();
            }, 10);
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
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?",
        validate(answer) {
          if(!answer) {
              return "Please provide the first name of the employee"
          }
          return true
      }
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?",
        validate(answer) {
          if(!answer) {
              return "Please provide the last name of the employee"
          }
          return true
      }
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: [...roleArr]
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: ["None", ...empArr]
      },
    ])
    .then((data) => {
      let roleNum;
      let managerNum;
      for (i=0; i<roleArr.length; i++){
        if(roleArr[i] === data.role){
          roleNum = i+1;
        }
      }
      for (i=0; i<empArr.length; i++){
        if (data.manager === "None"){
          managerNum = null;
        }
        if(empArr[i] === data.manager){
          managerNum = i+1;
        } 
      }   
      db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.firstName}', '${data.lastName}', ${roleNum}, ${managerNum});`, function () {
        console.log(`Added ${data.firstName} ${data.lastName} to the database`);
        empArr.push(data.firstName + " " + data.lastName);
        mainMenu();
      });
  })
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
      choices: [...deptArr]
    },
  ])
  .then((data) => {
      let deptNum;
      for (i=0; i<deptArr.length; i++){
        if(deptArr[i] === data.roleDept){
          deptNum = i+1;
        }
      }
      db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${data.roleName}', ${data.salary}, ${deptNum});`, function () {
        console.log(`Added ${data.roleName} to the database`);
        roleArr.push(data.roleName);
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
          deptArr.push(data.deptName);
          mainMenu();
        });
    })
}

const updateEmployee = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choices: [...empArr]
      },
      {
        type: "list",
        name: "newRole",
        message: "Which role do you want to assign the selected employee?",
        choices: [...roleArr]
      },
    ])
    .then((data) => {
      let roleNum;
      for (i=0; i<roleArr.length; i++){
        if(roleArr[i] === data.newRole){
          roleNum = i+1;
        }
      }
      db.query(`UPDATE employee SET role_id = ${roleNum} WHERE CONCAT(first_name, ' ', last_name) = '${data.employee}';`, function () {
        console.log(`Updated ${data.employee}'s role`);
        mainMenu();
      });
    })
}

mainMenu();

