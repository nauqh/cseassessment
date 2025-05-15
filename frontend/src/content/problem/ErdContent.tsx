import React from "react";
import ZoomableImage from "@/components/ZoomableImage";
import { MdZoomIn } from "react-icons/md";

const ErdContent = ({
	erdName,
	erdImageUrl,
}: {
	erdName?: string;
	erdImageUrl?: string;
}) => {
	return (
		<div className="space-y-4">
			<div className="prose max-w-none space-y-2">
				<h3 className="text-lg font-semibold">
					{erdName} Database Schema
				</h3>
				<p>
					This Entity Relationship Diagram (ERD) shows the structure
					of the database, including tables, their columns, and
					relationships between tables.
				</p>
			</div>
			<div>
				{erdImageUrl ? (
					<>
						<ZoomableImage src={erdImageUrl} />
						<p className="text-sm text-gray-600 mt-2 italic flex items-center justify-center">
							<MdZoomIn className="text-lg mr-1" />
							Click on the image for a clearer view. Use mouse
							scroll to zoom in/out.
						</p>
					</>
				) : (
					<div className="text-gray-500">No ERD image available</div>
				)}
			</div>
			<div className="bg-blue-50 border-l-4 border-blue-200 p-4 mt-4">
				<p className="font-medium text-blue-700 mb-2">
					Important Notes:
				</p>
				<ul className="list-disc list-inside space-y-2 text-sm">
					<li>
						If a table name contains spaces (e.g.,{" "}
						<strong>"Order Details"</strong>), always include it in
						double quotation marks <code>""</code>.
					</li>
					<li>
						Primary keys are typically marked with a key icon (🔑).
					</li>
					<li>
						Foreign keys are shown with relationship lines
						connecting tables.
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ErdContent;
