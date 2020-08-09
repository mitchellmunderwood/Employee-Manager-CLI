DROP DATABASE IF EXISTS employeesDB;
CREATE DATABASE employeesDB;
USE employeesDB;

CREATE TABLE employee(
    id int primary key auto_increment,
    first_name varchar
(30) not null,
    last_name varchar
(30) not null,
    role_id int not null, 
    manager_id int
);

CREATE TABLE role(
    id int primary key auto_increment,
    title varchar
(30) not null, 
    salary decimal
(10,4) not null,
    department_id int not null
);

CREATE TABLE department(
    id int primary key auto_increment,
    name varchar
(30)
);

Select * from employee WHERE NOT manager_id = null;


