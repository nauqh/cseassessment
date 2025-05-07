-- Shows the total sales for each month along with the previous month's total sales and the difference between the two. Use the LAG() window function to compare month-over-month performance.
-- Solution
SELECT
    STRFTIME ('%Y-%m', InvoiceDate) AS "Month",
    SUM(Total) AS "Sales",
    LAG (SUM(Total), 1, 0) OVER (
        ORDER BY
            STRFTIME ('%Y-%m', InvoiceDate)
    ) AS "PreviousSales",
    SUM(Total) - LAG (SUM(Total), 1, 0) OVER (
        ORDER BY
            STRFTIME ('%Y-%m', InvoiceDate)
    ) AS "Difference"
FROM
    Invoice
GROUP BY
    STRFTIME ('%Y-%m', InvoiceDate)
ORDER BY
    "Month";

-- Solution (Alt)
WITH
    MonthlySales AS (
        SELECT
            STRFTIME ('%Y-%m', InvoiceDate) AS "Month",
            SUM(Total) AS "Sales"
        FROM
            Invoice
        GROUP BY
            STRFTIME ('%Y-%m', InvoiceDate)
    )
SELECT
    Month,
    "Sales",
    LAG ("Sales", 1, 0) OVER (
        ORDER BY
            Month
    ) AS "PreviousSales",
    "Sales" - LAG ("Sales", 1, 0) OVER (
        ORDER BY
            Month
    ) AS "Difference"
FROM
    MonthlySales
ORDER BY
    Month;