import React from "react";

const SqliteTutorialContent = () => {
	return (
		<div className="space-y-4">
			<div className="prose max-w-none">
				<h3 className="text-lg font-semibold">
					SQLite Date Formatting
				</h3>
				<p>
					In this exam, you will query data from an SQLite database. Unlike other DBMS that support the <code>to_char()</code> function for formatting dates, in SQLite, we use the <code>strftime()</code> function.
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full text-sm border-collapse">
					<thead>
						<tr className="bg-amber-100">
							<th className="border border-amber-200 px-4 py-2 text-left">to_char()</th>
							<th className="border border-amber-200 px-4 py-2 text-left">strftime()</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td className="border border-amber-200 px-4 py-2">'YYYY-MM-DD'</td>
							<td className="border border-amber-200 px-4 py-2">'%Y-%m-%d'</td>
						</tr>
						<tr>
							<td className="border border-amber-200 px-4 py-2">'YYYY'</td>
							<td className="border border-amber-200 px-4 py-2">'%Y'</td>
						</tr>
						<tr>
							<td className="border border-amber-200 px-4 py-2">'MM'</td>
							<td className="border border-amber-200 px-4 py-2">'%m'</td>
						</tr>
						<tr>
							<td className="border border-amber-200 px-4 py-2">'DD'</td>
							<td className="border border-amber-200 px-4 py-2">'%d'</td>
						</tr>
						<tr>
							<td className="border border-amber-200 px-4 py-2">'HH24:MI:SS'</td>
							<td className="border border-amber-200 px-4 py-2">'%H:%M:%S'</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div>
				<p className="font-medium mb-2">Examples:</p>
				<div className="bg-gray-800 overflow-x-auto">
					<pre className="text-amber-100 text-sm">
						<code>
{`-- Other DBMS
SELECT TO_CHAR(order_date, 'YYYY') AS "Year"
FROM orders;

-- SQLite
SELECT strftime('%Y', order_date) AS "Year"
FROM orders;`}
						</code>
					</pre>
				</div>
			</div>

			<div className="bg-blue-50 border-l-4 border-blue-200 p-4">
				<p>
					SQLite offers a wide range of utility functions to help you work with time and date data effectively. You are encouraged to explore and use them as needed. 
					<br />
					For more details, refer to this tutorial: <a href="https://www.sqlitetutorial.net/sqlite-date-functions/sqlite-strftime-function/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SQLite strftime() function</a>
				</p>
			</div>
		</div>
	);
};

export default SqliteTutorialContent;
