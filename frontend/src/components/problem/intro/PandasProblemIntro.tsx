import React from "react";

export default function PandasProblemIntro() {
	return (
		<div className="bg-muted p-6 rounded-lg space-y-4">
			<p>
				This section asks you to submit a <b>single expression</b> to
				answer the question.
			</p>

			<div className="space-y-4">
				<div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
					<div className="text-xs font-semibold text-blue-700 mb-1">
						DEFINITION
					</div>
					<p>
						An expression is a combination of values, variables,
						operators, and function calls that are evaluated to
						produce a value. It does not perform any action but
						simply returns a result.
					</p>
				</div>

				<p>Don't mistake them with statements</p>

				<div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
					<div className="text-xs font-semibold text-blue-700 mb-1">
						DEFINITION
					</div>
					<p>
						A statement is an instruction that performs an action,
						such as creating variables, controlling flow, or
						defining functions. A statement may contain expressions
						but does not return a value.
					</p>
				</div>
			</div>

			<div className="mt-6">
				<h3 className="font-bold text-lg mb-2">
					Examples of expression:
				</h3>
				<pre className="bg-zinc-950 text-zinc-50 p-4 font-mono text-sm rounded-md overflow-x-auto">
					{`>>> 5 + 3               # Evaluates to 8
>>> len("hello")        # Evaluates to 5
>>> df['Salary'] > 50000  # Evaluates to a boolean series
>>> pd.DataFrame({'Name': ['Alice', 'Bob'], 'Age': [25, 30]}) # Evaluates to a dataframe`}
				</pre>
			</div>

			<div className="mt-4">
				<h3 className="font-bold text-lg mb-2">
					Examples of not an expression:
				</h3>
				<pre className="bg-zinc-950 text-zinc-50 p-4 font-mono text-sm rounded-md overflow-x-auto">
					{`>>> x = y + 2
>>> df = pd.DataFrame({'Name': ['Alice', 'Bob'], 'Age': [25, 30]})
>>> df.drop(columns=['Salary'], inplace=True)
>>> df.rename(columns={'Name': 'FullName'}, inplace=True)`}
				</pre>
			</div>
		</div>
	);
}
