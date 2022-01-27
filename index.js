require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const {department, role, employee, sortByManager, sortByDept, sortByFirstName, sortByLastName, deptArr, roleArr, empArr, managerArr} = require('./helpers/queries');
//runs function on page load to show colored title
require('./helpers/chalkFiglet');
require('console.table');

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
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Sort Employees', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department',  'View Utilized Budget', 'Delete Entry', 'Quit']
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
          case 'Sort Employees':
            sortEmp();
            break;
          case 'Delete Entry':
            deletion();
            break;
          case 'View Utilized Budget':
            budget();
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
        if(roleArr[i] === data.newRole){
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
      db.query(`UPDATE employee SET role_id = ${roleNum}, manager_id = '${managerNum}' WHERE CONCAT(first_name, ' ', last_name) = '${data.employee}';`, function () {
        console.log(`Updated ${data.employee}'s role`);
        mainMenu();
      });
    })
}

const deletion = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deleteMenu",
        message: "What would you like to delete?",
        choices: ['Department', 'Role', 'Employee', 'Go Back']
      },
    ])
    .then((choice) => {
      switch(choice.deleteMenu){
        case 'Department':
          deleteDept();
          break;
        case 'Role':
          deleteRole();
          break;
        case 'Employee':
          deleteEmployee();
          break;
        default:
          mainMenu();
      }
    })
}

const deleteDept = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deleteDept",
        message: "Which department would you like to delete?",
        choices: [...deptArr]
      },
    ])
    .then((data) => {
      db.query(`DELETE FROM department WHERE name= '${data.deleteDept}'`, function () {
        console.log(`Deleted ${data.deleteDept} from database`);
        const index = deptArr.indexOf(data.deleteDept);
        if (index > -1) {
          deptArr.splice(index, 1);
        }
        mainMenu();
      });
    })
}

const deleteRole = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deleteRole",
        message: "Which role would you like to delete?",
        choices: [...roleArr]
      },
    ])
    .then((data) => {
      db.query(`DELETE FROM role WHERE title= '${data.deleteRole}'`, function () {
        console.log(`Deleted ${data.deleteRole} from database`);
        const index = roleArr.indexOf(data.deleteRole);
        if (index > -1) {
          roleArr.splice(index, 1);
        }
        mainMenu();
      });
    })
}

const deleteEmployee = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "deleteEmp",
        message: "Which employee would you like to delete?",
        choices: [...empArr]
      },
    ])
    .then((data) => {
      db.query(`DELETE FROM employee WHERE CONCAT(first_name, ' ', last_name) = '${data.deleteEmp}';`, function () {
        console.log(`Deleted ${data.deleteEmp} from database`);
        const index = empArr.indexOf(data.deleteEmp);
        if (index > -1) {
          empArr.splice(index, 1);
        }
        mainMenu();
      });
    })
}

const sortEmp = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "sortEmp",
        message: "How would you like to sort?",
        choices: ["By Manager", "By Department", "By First Name", "By Last Name", "Choose a Manager", "Choose a Department"]
      },
    ])
    .then((choice) => {
      switch(choice.sortEmp){
        case 'By Manager':
          sortByManager.runQuery();
          setTimeout(() => {
            mainMenu();
          }, 10);
          break;
        case 'By Department':
          sortByDept.runQuery();
          setTimeout(() => {
            mainMenu();
          }, 10);
          break;
        case 'By First Name':
          sortByFirstName.runQuery();
          setTimeout(() => {
            mainMenu();
          }, 10);
          break;
        case 'By Last Name':
          sortByLastName.runQuery();
          setTimeout(() => {
            mainMenu();
          }, 10);
          break;
        case 'Choose a Manager':
          chooseManager();
          break;
        case 'Choose a Department':
          chooseDept();
          break;
        default:
          mainMenu();
      }
    })
}

const chooseManager = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "chooseManager",
        message: "Which manager's employees would you like to see?",
        choices: [...managerArr]
      },
    ])
    .then((choice) => {
      db.query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, ' ', m.last_name) as manager FROM employee AS e LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id`, function (err, results) {
        employeesOfManager = [];
        for (let i=0; i<results.length; i++){
          if (results[i].manager===choice.chooseManager){
            employeesOfManager.push(results[i]);
          }
        }
        console.log(`${choice.chooseManager}'s Employees:`)
        console.table(employeesOfManager);
        setTimeout(() => {
          mainMenu();
        }, 10);
      });
    })
}

const chooseDept = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "chooseDept",
        message: "Which department would you like to see the employees of?",
        choices: [...deptArr]
      },
    ])
    .then((choice) => {
      db.query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, ' ', m.last_name) as manager FROM employee AS e LEFT OUTER JOIN employee AS m ON e.manager_id = m.id JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id`, function (err, results) {
        employeesOfDept = [];
        for (let i=0; i<results.length; i++){
          if (results[i].department===choice.chooseDept){
            employeesOfDept.push(results[i]);
          }
        }
        console.log(` Employees of ${choice.chooseDept}:`)
        console.table(employeesOfDept);
        setTimeout(() => {
          mainMenu();
        }, 10);
      });
    })
}

const budget = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "budget",
        message: "For which department would you like to see the utilized budget?",
        choices: [...deptArr]
      }
    ])
    .then((data) => {
        db.query(`SELECT department.name as department, role.salary FROM employee AS e JOIN role ON role.id = e.role_id INNER JOIN department ON department.id = role.department_id`, function (err, results) {
          let totalBudget = 0;
          for (let i=0; i<results.length; i++){
            if(results[i].department === data.budget){
              totalBudget += Number(results[i].salary);
            }
          }
          console.log(`Total spending of ${data.budget}: $${totalBudget}`);
          mainMenu();
        });
    })
}

mainMenu();

