require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
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
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) {
            throw(err);
        }
        console.table(departments);
    })
    start();
}

function viewRoles() {
    db.query('SELECT role.id, role.title, department.department, role.salary FROM role JOIN department ON role.department_id = department.id', (err, roles) => {
        if (err) {
            throw(err);
        }
        console.table(roles);
    })
    start();
}

function viewEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', (err, employees) => {
        if (err) {
            throw(err);
        }
        console.table(employees);
    })
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