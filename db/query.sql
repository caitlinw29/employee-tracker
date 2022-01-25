-- Joins to provide role table
SELECT role.id, role.title, department.name as department, role.salary
FROM role
JOIN department
ON department.id = role.department_id;

-- Joins to provide employee table
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.id as manager
FROM employee
JOIN role
ON role.id = employee.role_id
INNER JOIN department ON department.id = role.department_id;