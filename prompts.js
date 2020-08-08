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
                    departmentList(addRole);
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

function addRole(departments) {
    var departmentList = departments.map(el => el.name)

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
        name: "department",
        type: "list",
        message: "What department is the new role in?",
        choices: departmentList
    }]).then(function (answer) {
        var department = departments.filter(el => el.name === answer.department)[0]; // use answer.department to find the id
        var query = `INSERT INTO role SET ?`;
        connection.query(query, { title: answer.title, salary: answer.salary, department_id: department.id }, function (err, res) {
            start();
        });
    });
}

function addEmployee() {
    var query = "SELECT * from role";
    connection.query(query, function (err, res1) {
        var roles = res1;
        var roleList = roles.map(el => el.title);

        var query = "Select id, first_name, last_name from employee Where manager_id in (Select manager_id from employee WHERE manager_id is not null GROUP by manager_id)"
        connection.query(query, function (err, res2) {
            var managers = res2;
            var managerList = managers.map(el => el.first_name);
            managerList.push("");

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
                name: "title",
                type: "list",
                message: "What is the Employee's role?",
                choices: roleList
            }, {
                name: "first_name",
                type: "list",
                message: "Who is the Employee's manager?",
                choices: managerList
            }]).then(function (answer) {
                var role = roles.filter(el => el.title === answer.title)[0];
                var manager = managers.filter(el => el.first_name === answer.first_name)[0]

                if (manager) {

                    var query = `INSERT INTO employee SET ?`;
                    connection.query(query, { first_name: answer.first, last_name: answer.last, role_id: role.id, manager_id: manager.id }, function (err, res) {
                        if (err) {
                            console.log(err);
                        }
                        start();

                    });
                } else {
                    var query = `INSERT INTO employee SET ?`;
                    connection.query(query, { first_name: answer.first, last_name: answer.last, role_id: role.id }, function (err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Successfully Added employee information!");
                        }
                        start();

                    });

                }




            });

        })
    });



}

function updateEmployee() {
    var query = "SELECT * from role";
    connection.query(query, function (err, res1) {
        var roles = res1;
        var roleList = roles.map(el => el.title);

        var query = "Select id, first_name, last_name from employee Where manager_id in (Select manager_id from employee GROUP by manager_id)"
        connection.query(query, function (err, res2) {
            var managers = res2;
            var managerList = managers.map(el => el.first_name);
            managerList.push("");

            var query = "Select id, first_name, last_name from employee";
            connection.query(query, function (err, res3) {
                var employees = res3;
                var employeeNames = employees.map(el => el.first_name + " " + el.last_name);

                inquirer.prompt([{
                    name: "employee_name",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employeeNames
                },
                {
                    name: "first",
                    type: "input",
                    message: "What is the new employee's first name?"
                },
                {
                    name: "last",
                    type: "input",
                    message: "What is the new employee's last name?"
                }, {
                    name: "title",
                    type: "list",
                    message: "What is the Employee's role?",
                    choices: roleList
                }, {
                    name: "first_name",
                    type: "list",
                    message: "Who is the Employee's manager?",
                    choices: managerList,

                }]).then(function (answer) {

                    var role = roles.filter(el => el.title === answer.title)[0];
                    var manager = managers.filter(el => el.first_name === answer.first_name)[0]
                    var name = answer.employee_name.split(" ");
                    var employee = employees.filter(el => el.first_name === name[0]);

                    if (manager) {

                        var query = "UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?";

                        var params = [answer.first, answer.last, role.id, manager.id || null, employee[0].id];
                        console.log(params);

                        connection.query(query, params, function (err, res) {
                            if (err) {
                                console.log(err);

                            } else {
                                console.log("Successfully updated the employees information");
                            }

                        });
                    } else {
                        var query = "UPDATE employee SET first_name = ?, last_name = ?, role_id = ? WHERE id = ?";

                        var params = [answer.first, answer.last, role.id, employee[0].id];
                        console.log(params);

                        connection.query(query, params, function (err, res) {
                            if (err) {
                                console.log(err);

                            } else {
                                console.log("Successfully updated the employees information");
                            }

                        });
                    }
                    start();
                });


            });





        });


    });


}

function departmentList(cb) {
    var query = "SELECT * from department";
    connection.query(query, function (err, res) {
        cb(res);
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