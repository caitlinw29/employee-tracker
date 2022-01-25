-- Joins to provide role table
SELECT role.id, role.title, department.name as department, role.salary
FROM role
JOIN department
ON department.id = role.department_id;

-- Joins to provide employee table
SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name, ' ', m.last_name) as manager
FROM employee AS e LEFT OUTER JOIN employee AS m ON e.manager_id = m.id
JOIN role ON role.id = e.role_id
INNER JOIN department ON department.id = role.department_id;
