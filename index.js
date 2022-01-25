require('dotenv').config()
const inquirer = require('inquirer');
const term = require( 'terminal-kit' ).terminal;
const {department, role, employee} = require('./helpers/queries');
require('./helpers/chalkFiglet');

// Query database for department table
department.runQuery();

// Query database for role table
role.runQuery();

//Query database for employee table
employee.runQuery();