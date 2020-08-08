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
    console.log(getAllDepartments());
    // start();
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
            "View a Department",
            "View a Role",
            "View an Employee",
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
                case "View a Department":
                    viewDepartment();
                    break;
                case "View a Role":
                    viewRole();
                    break;
                case "View an Employee":
                    viewEmployee();
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
    }]).then(function (answer) {
        var department_id = pickDepartment();
        var query = `INSERT INTO role SET ?`;
        connection.query(query, { title: answer.title, salary: answer.salary, department_id: "1" }, function (err, res) {
            start();
        });
    });
}

function pickDepartment() {
    inquirer.prompt([{
        name: "name",
        type: "list",
        message: "which department do you wish to designate?",
        choices: getAllDepartments()
    }]).then(function (answer) {
        var query = "Select id FROM department WHERE name = ?"
        connection.query(query, answer.name, function (err, res) {
            return res[0];
        })
    })
}

function getAllDepartments() {
    var query = "SELECT name FROM department"
    let results;
    connection.query(query, [], function (err, res) {
        // return res.map(el => el.name);
        return res.map(el => el.name);
    });

}

// function addEmployees() {

// }

// function viewDepartments() {
//     var query = "SELECT * from departments";
//     connection.query(query, function (err, res) {
//         console.log(res);
//     })
// }

// function viewRoles() {

// }

// function viewEmployees() {

// }

// function updateEmployee() {

// }
