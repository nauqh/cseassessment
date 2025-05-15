import React from "react";
import Link from "next/link";
import { BiCodeBlock } from "react-icons/bi";

const NotebookContent = ({ notebookUrl }: { notebookUrl?: string }) => {
	return (
		<div className="space-y-4">
			<div className="prose max-w-none space-y-2">
				<h3 className="text-lg font-semibold">Pandas Notebook</h3>
				<p>
					Use this Google Colab notebook to test your pandas queries.
					Once you've completed your solution, copy your code back to
					the submission input.
				</p>
			</div>
			<div className="mt-4">
				{notebookUrl ? (
					<div className="flex flex-col items-start space-y-3">
						<Link
							href={notebookUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							<BiCodeBlock className="mr-2 h-5 w-5" />
							Open Google Colab Notebook
						</Link>
						<div className="text-sm text-gray-600 mt-2">
							<p>
								The notebook will open in a new tab. You can use
								it to:
							</p>
							<ul className="list-disc pl-5 mt-1 space-y-1">
								<li>Test your pandas queries interactively</li>
								<li>Visualize your data and results</li>
								<li>Experiment with different approaches</li>
							</ul>
						</div>

						<div className="mt-4 p-4 rounded-md border border-gray-200">
							<h4 className="text-md font-medium mb-2">Schema</h4>
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="bg-gray-100">
											<th className="py-2 px-3 text-left">
												#
											</th>
											<th className="py-2 px-3 text-left">
												Column
											</th>
											<th className="py-2 px-3 text-left">
												Non-Null Count
											</th>
											<th className="py-2 px-3 text-left">
												Dtype
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										<tr>
											<td className="py-2 px-3">0</td>
											<td className="py-2 px-3 font-mono">
												Id
											</td>
											<td className="py-2 px-3">
												148654 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												int64
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">1</td>
											<td className="py-2 px-3 font-mono">
												EmployeeName
											</td>
											<td className="py-2 px-3">
												148654 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												object
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">2</td>
											<td className="py-2 px-3 font-mono">
												JobTitle
											</td>
											<td className="py-2 px-3">
												148654 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												object
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">3</td>
											<td className="py-2 px-3 font-mono">
												BasePay
											</td>
											<td className="py-2 px-3">
												148045 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												float64
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">4</td>
											<td className="py-2 px-3 font-mono">
												OvertimePay
											</td>
											<td className="py-2 px-3">
												148650 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												float64
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">5</td>
											<td className="py-2 px-3 font-mono">
												OtherPay
											</td>
											<td className="py-2 px-3">
												148650 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												float64
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">6</td>
											<td className="py-2 px-3 font-mono">
												Benefits
											</td>
											<td className="py-2 px-3">
												112491 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												float64
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">7</td>
											<td className="py-2 px-3 font-mono">
												TotalPay
											</td>
											<td className="py-2 px-3">
												148654 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												float64
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">8</td>
											<td className="py-2 px-3 font-mono">
												TotalPayBenefits
											</td>
											<td className="py-2 px-3">
												148654 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												float64
											</td>
										</tr>
										<tr>
											<td className="py-2 px-3">9</td>
											<td className="py-2 px-3 font-mono">
												Year
											</td>
											<td className="py-2 px-3">
												148654 non-null
											</td>
											<td className="py-2 px-3 font-mono">
												int64
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				) : (
					<div className="text-gray-500">
						No notebook link available
					</div>
				)}
			</div>
		</div>
	);
};

export default NotebookContent;
