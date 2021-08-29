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
        message: "What would you like to do?",
        choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add employee",  "Update employee role", "Quit"],
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
        if (err) throw err;
        console.table(departments);
        start();
    })    
}

function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', (err, roles) => {
        if (err) throw err;
        console.table(roles);
        start();
    })
}

function viewEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(m.first_name, " " ,  m.last_name) AS Manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee m on employee.manager_id = m.id', (err, employees) => {
        if (err) throw err;
        console.table(employees);
        start();
    })
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        message: "What is the name of the department?",
        name: "departmentName"
    })
        .then(response => {
            db.query('INSERT INTO department (name) VALUES (?)', [response.departmentName], (err, result) => {
                if (err) throw err;
                console.log(`Added ${response.departmentName} department to the database`);
                start();
            })
        })
}

function addRole() {
    db.query('SELECT * FROM department', (err, res) => {
        if(err) throw err;
        let departments = [];
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].name);
        }

        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "roleName"
            },
            {
                type: "number",
                message: "What is the salary for the role?",
                name: "salary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                choices: departments,
                name: "department"
            }
        ])
            .then(response => {
                let departmentId = departments.indexOf(response.department) + 1;
                db.query('INSERT INTO role SET ?',
                    {
                        title: response.roleName,
                        salary: response.salary,
                        department_id: departmentId,
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`Added ${response.roleName} role to the database`);
                        console.table(response);
                        start();
                    })
            })
    })
}

function addEmployee() {
    let roleArray = [];
    let managerArray = ['No manager'];
    db.query('SELECT * FROM role', (err, res) => {
        for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
        db.query('SELECT * FROM employee', (err, res) => {
            for (var i = 0; i < res.length; i++) {
                managerArray.push(res[i].first_name + " " + res[i].last_name);
            }

            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    choices: roleArray,
                    name: "role"
                },
                {
                    type: "list",
                    message: "What employee will manage the new employee?",
                    choices: managerArray,
                    name: "manager"
                },
            ])
                .then((response) => {
                    let roleId = roleArray.indexOf(response.role) + 1;
                    let managerId = managerArray.indexOf(response.manager);
                    db.query(
                        'INSERT INTO employee SET ?',
                        {
                            first_name: response.firstName,
                            last_name: response.lastName,
                            role_id: roleId,
                            manager_id: managerId,
                        },
                        function (err) {
                            if (err) throw err;
                            console.log(`Added employee: ${response.firstName} ${response.lastName} to the database`);
                            console.table(response);
                            start();
                        })
                })
        })
    })
}

function updateEmployee() {
    let roleArray = [];
    let employeeArray = [];
    db.query('SELECT * FROM role', (err, res) => {
        for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
        db.query('SELECT * FROM employee', (err, res) => {
            for (var i = 0; i < res.length; i++) {
                employeeArray.push(res[i].first_name + " " + res[i].last_name);
            }

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    choices: employeeArray,
                    name: "employee"
                },
                {
                    type: "list",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleArray,
                    name: "role"
                },
            ])
                .then((response) => {
                    let employeeId = employeeArray.indexOf(response.employee) + 1;
                    let roleId = roleArray.indexOf(response.role) + 1;
                    db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId], (err, result) => {
                        if (err) throw err;
                        console.log(`Updated employee: ${response.employee}`);
                        console.table(response);
                        start();
                    })
                })
        })
    })
}


function quit() {
    process.exit();
}