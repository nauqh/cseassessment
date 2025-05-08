import React from "react";

export default function SQLProblemIntro() {
	return (
		<div className="bg-muted p-6 rounded-lg space-y-6">
			<p>
				This section asks you to submit a <b>single query</b> to answer
				questions related to the database provided in each problem.
			</p>
			<div className="space-y-4">
				<p>For each problem, you will need to:</p>
				<ul className="list-disc list-inside space-y-2 ml-4">
					<li>
						Identify the tables and relationships needed to answer
						the question
					</li>
					<li>
						Write a single SQL query that correctly answers the
						question
					</li>
					<li>Test and submit your query in the provided code editor</li>
				</ul>

				<div className="bg-blue-50 border-l-4 border-blue-200 p-4 mt-6 space-y-3">
					<p className="font-semibold text-blue-700">
						IMPORTANT NOTES
					</p>
					<ul className="space-y-2">
						<li>
							- If a table name contains spaces, always include it
							in double quotation marks " ". E.g. "Order Details".
						</li>
						<li>
							- The ERD will be available in the{" "}
							<code className="bg-gray-200 rounded px-1">
								ERD
							</code>{" "}
							tab for each question. You can refer to it at any
							time while working on your solution.
						</li>
						<li>
							- Make sure your query follows standard SQL syntax.
							Your query will be evaluated against the specific
							database for correctness.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
