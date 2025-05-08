CREATE TABLE
    Employees_new AS
SELECT
    EmployeeID,
    LastName,
    FirstName,
    Title,
    TitleOfCourtesy,
    BirthDate,
    HireDate,
    Address,
    City,
    Region,
    PostalCode,
    Country,
    HomePhone,
    Extension,
    Notes,
    ReportsTo
FROM
    Employees;

DROP TABLE Employees;

CREATE TABLE
    Categories_new AS
SELECT
    CategoryID,
    CategoryName,
    Description
FROM
    Categories;

DROP TABLE Categories;

-- ALTER TABLE Categories_new
-- RENAME TO Categories;
-- ALTER TABLE Employees_new
-- RENAME TO Employees;