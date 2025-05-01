import Image from "next/image";

export default function PythonProblemIntro() {
	return (
		<div className="bg-muted p-6 rounded-lg space-y-4">
			<p>
				This section asks you to submit a <b>single function</b> to
				answer the question.
			</p>

			<div className="bg-blue-50 border-l-4 border-blue-200 p-4 space-y-3">
				<p className="font-semibold text-blue-700">IMPORTANT NOTES</p>
				<ul className="list-none space-y-2">
					<li>
						<strong>NOTE 1:</strong> You ARE allowed to use any
						built-in Python functions, like len, min, max, zip, map,
						etc.
					</li>
					<li>
						<strong>NOTE 2:</strong> You are NOT allowed to use any
						external library for this exam.
					</li>
					<li>
						<strong>NOTE 3:</strong> One and ONLY one function
						should be submitted for each question.
					</li>
					<li>
						<strong>NOTE 4:</strong> Your function must have return
						and must return the same values exactly like in the
						examples for each question.
					</li>
					<li>
						<strong>NOTE 5:</strong>Functions that have only print
						statements in it will NOT received any points.
					</li>
				</ul>
			</div>

			<div className="mt-8 space-y-6">
				<h3 className="font-bold text-lg">Examples of expression:</h3>
				<div>
					<p>
						1. Let's say you've created and tested a function called{" "}
						<code>hello_name</code> that answers the question
						correctly.
					</p>

					<Image
						src="https://drive.google.com/uc?export=view&id=1Vmit6aT4OfH24qMFv08Hvk4_YuZsynS1"
						alt="Function creation example"
						className="rounded-md border-2 border-gray-200"
						width={400}
						height={300}
					/>
				</div>

				<div>
					<p>
						2. To submit the function <code>hello_name</code>, copy{" "}
						<em>only</em> the definition block and paste into the
						submit box, then press "Submit". Do not submit{" "}
						<em>ANY</em> line of code outside of the function
						definition.
					</p>
					<Image
						src="https://drive.google.com/uc?export=view&id=1CDWW0YJM5dkeWazDcHom6-DXdOqwSwV2"
						alt="Function creation example"
						className="rounded-md border-2 border-gray-200"
						width={400}
						height={300}
					/>
				</div>

				<div>
					<p>
						3. Double check whether the system has received the
						answer you want, and you're good to go 👍
					</p>
					<Image
						src="https://drive.google.com/uc?export=view&id=1fvgNzOp3uMDolo-4F5f00fB49kua5iuX"
						alt="Function creation example"
						className="rounded-md border-2 border-gray-200"
						width={400}
						height={300}
					/>
				</div>
			</div>
		</div>
	);
}
