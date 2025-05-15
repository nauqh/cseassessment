import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import {
	DescriptionContent,
	ErdContent,
	NotebookContent,
} from "@/content/problem";

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
					<DescriptionContent
						questionNumber={questionNumber}
						content={content}
						tableData={tableData}
					/>
				) : name === "erd" ? (
					<ErdContent erdName={erdName} erdImageUrl={erdImageUrl} />
				) : name === "notebook" ? (
					<NotebookContent notebookUrl={notebookUrl} />
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
