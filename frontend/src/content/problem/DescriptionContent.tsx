import React from "react";
import ProblemDescriptionFormatter from "@/components/problem/ProblemDescriptionFormatter";
import TableDisplay from "@/components/problem/TableDisplay";

const DescriptionContent = ({
	questionNumber,
	content,
	tableData,
}: {
	questionNumber?: number;
	content?: string;
	tableData?: { [key: string]: string }[];
}) => {
	return (
		<>
			<h2 className="text-xl font-semibold">Question {questionNumber}</h2>
			{content ? (
				<>
					<ProblemDescriptionFormatter content={content} />
					<TableDisplay tableData={tableData || []} />
				</>
			) : (
				<div className="text-center text-gray-500">
					No description available
				</div>
			)}
		</>
	);
};

export default DescriptionContent;
