import React from "react";
import Link from "next/link";

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

			<div className="bg-green-50 border border-green-200 p-4 rounded-md mt-4">
				<div className="text-xs font-semibold text-green-700 mb-1">
					IMPORTANT
				</div>
				<div className="space-y-2">
					<p>
						We will provide you with a Google Colab notebook for you to run and test your pandas query.
					</p>
					<p>
						You should not run your query in the code editor here.
					</p>
					<p>
						After running your code in the provided Colab notebook, simply copy and paste your answer in the submission box.
					</p>
					<p>
						The Colab notebook link will be provided in the Notebook tab when you are working on the problems:
					</p>
					<a 
						href="https://colab.research.google.com/drive/1hCx_Udtmdl4v5WmNsFyomG0JvPeaSZw0#scrollTo=081jUhieHuXy" 
						target="_blank"
						rel="noopener noreferrer"
						className="underline font-medium"
					>
						Google Colab Notebook
					</a>
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
					Examples of NOT an expression:
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
