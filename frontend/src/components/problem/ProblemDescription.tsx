import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import ProblemDescriptionFormatter from "./ProblemDescriptionFormatter";
import TableDisplay from "./TableDisplay";
import ZoomableImage from "../ZoomableImage";
import Link from "next/link";
import { BiCodeBlock} from "react-icons/bi";
import { MdZoomIn } from "react-icons/md";

const ProblemDescription = ({
	name,
	content,
	questionNumber,
	tableData,
	erdImageUrl,
	erdName,
	notebookUrl,
}: {
	name: string;
	content?: string;
	questionNumber?: number;
	tableData?: { [key: string]: string }[];
	erdImageUrl?: string;
	erdName?: string;
	notebookUrl?: string;
}) => {
	return (
		<TabsContent value={name} className="overflow-y-auto">
			<div className="px-4">
				{name === "description" ? (
					<>
						<h2 className="text-xl font-semibold">
							Question {questionNumber}
						</h2>
						{content ? (
							<>
								<ProblemDescriptionFormatter
									content={content}
								/>
								<TableDisplay tableData={tableData || []} />
							</>
						) : (
							<div className="text-center text-gray-500">
								No description available
							</div>
						)}
					</>
				) : name === "erd" ? (
					<div className="space-y-4">
						<div className="prose max-w-none space-y-2">
							<h3 className="text-lg font-semibold">
								{erdName} Database Schema
							</h3>
							<p>
								This Entity Relationship Diagram (ERD) shows the structure of the database,
								including tables, their columns, and relationships between tables.
							</p>
						</div>
						<div>
							{erdImageUrl ? (
								<>
									<ZoomableImage src={erdImageUrl} />
									<p className="text-sm text-gray-600 mt-2 italic flex items-center justify-center">
										<MdZoomIn className="text-lg mr-1" />
										Click on the image for a clearer view. Use mouse scroll to zoom in/out.
									</p>
								</>
							) : (
								<div className="text-gray-500">
									No ERD image available
								</div>
							)}
						</div>
						<div className="bg-blue-50 border-l-4 border-blue-200 p-4 mt-4">
							<p className="font-medium text-blue-700 mb-2">Important Notes:</p>
							<ul className="list-disc list-inside space-y-2 text-sm">
								<li>
									If a table name contains spaces (e.g., <strong>"Order Details"</strong>), 
									always include it in double quotation marks <code>""</code>.
								</li>
								<li>
									Primary keys are typically marked with a key icon (🔑).
								</li>
								<li>
									Foreign keys are shown with relationship lines connecting tables.
								</li>
							</ul>
						</div>
					</div>
				) : name === "notebook" ? (
					<div className="space-y-4">
						<div className="prose max-w-none space-y-2">
							<h3 className="text-lg font-semibold">
								Pandas Notebook
							</h3>
							<p>
								Use this Google Colab notebook to test your
								pandas queries. Once you've completed your
								solution, copy your code back to the submission
								box.
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
											The notebook will open in a new tab.
											You can use it to:
										</p>
										<ul className="list-disc pl-5 mt-1 space-y-1">
											<li>
												Test your pandas queries
												interactively
											</li>
											<li>
												Visualize your data and results
											</li>
											<li>
												Experiment with different
												approaches
											</li>
										</ul>
									</div>
								</div>
							) : (
								<div className="text-gray-500">
									No notebook link available
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="text-center text-gray-500">
						No {name} available
					</div>
				)}
			</div>
		</TabsContent>
	);
};

export default ProblemDescription;
