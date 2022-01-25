const figlet = require('figlet');
var chalkRainbow = require('chalk-rainbow');

//Show fun "Employee Tracker" text on load of index.js
const chalkFiglet = 
  console.log(
    chalkRainbow(
      figlet.textSync('Employee Tracker', {
      font: 'big',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 100,
      whitespaceBreak: true
      })
    )
  );

module.exports = {
  chalkFiglet
}