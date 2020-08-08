var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "indigo14",
    database: "employeesDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user

    start();
});

function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Update an Employee"
        ]
    })
        .then(function (answer) {
            switch (answer.action) {
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "View all Departments":
                    viewDepartments();
                    break;
                case "View all Roles":
                    viewRoles();
                    break;
                case "View all Employees":
                    viewEmployees();
                    break;
                case "Update an Employee":
                    updateEmployee();
                    break;
            }
        });

}

function addDepartment() {
    inquirer.prompt([
        {
            name: "department",
            type: "input",
            message: "What is the new department's name?"
        }
    ]).then(function (answer) {
        var query = `INSERT INTO department SET ?`;
        connection.query(query, { name: answer.department }, function (err, res) {
            start();
        });
    });
}

function addRole() {
    inquirer.prompt([{
        name: "title",
        type: "input",
        message: "What is the new role's title?"
    },
    {
        name: "salary",
        type: "input",
        message: "What is the new role's salary?"
    }, {
        name: "department_id",
        type: "input",
        message: "What is the id of the Role's department?"
    }]).then(function (answer) {
        ;
        var query = `INSERT INTO role SET ?`;
        connection.query(query, { title: answer.title, salary: answer.salary, department_id: answer.department_id }, function (err, res) {
            start();
        });
    });
}

function addEmployee() {
    inquirer.prompt([{
        name: "first",
        type: "input",
        message: "What is the new employee's first name?"
    },
    {
        name: "last",
        type: "input",
        message: "What is the new employee's last name?"
    }, {
        name: "role_id",
        type: "input",
        message: "What is the id of the employee's role"
    }, {
        name: "manager_id",
        type: "input",
        message: "What is the id of the employee's manager"
    }]).then(function (answer) {
        var query = `INSERT INTO employee SET ?`;
        connection.query(query, { first_name: answer.first, last_name: answer.last, role_id: answer.role_id, manager_id: answer.manager_id }, function (err, res) {
            start();
        });
    });
}

function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        console.log(res);
        start();
    })
}

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {
        console.log(res);
        start();
    })
}

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, res) {
        console.log(res);
        start();
    })
}

// function updateEmployee() {

// }
