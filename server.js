const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

db.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt({
        type: "list",
        choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add employee",  "Update employee role", "Quit"],
        message: "What would you like to do?",
        name: "startChoice"
    })
        .then(response => {
            console.log(response.startChoice);

            switch (response.startChoice) {
                case "View departments":
                    viewDepartments();
                    break;
                case "View roles":
                    viewRoles();
                    break;
                case "View employees":
                    viewEmployees();
                    break;
                case "Add department":
                    addDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Update employee role":
                    updateEmployee();
                    break;
                default:
                    quit();
            }
        })
}

function viewDepartments() {
    start();
}

function viewRoles() {
    start();
}

function viewEmployees() {
    start();
}

function addDepartment() {
    start();
}

function addRole() {
    start();
}

function addEmployee() {
    start();
}

function updateEmployee() {
    start();
}

function quit() {
    process.exit();
}