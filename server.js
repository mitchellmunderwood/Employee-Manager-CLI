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
        name: action,
        type: list,
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

addDepartment() {

}

addRoles() {

}

addEmployees() {

}

viewDepartment() {

}

viewRoles() {

}

viewEmployees() {

}

updateEmployee() {

}
