import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const TableDisplay = ({
	tableData,
}: {
	tableData: { [key: string]: string }[];
}) => {
	if (!tableData || tableData.length === 0) return null;

	const columns = Object.keys(tableData[0]);

	return (
		<div className="my-4 overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead></TableHead>
						{columns.map((column) => (
							<TableHead key={column} className="capitalize">
								{column}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{tableData.map((row, index) => (
						<TableRow key={index}>
							<TableCell>{index + 1}</TableCell>
							{columns.map((column) => (
								<TableCell key={column}>
									{row[column]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default TableDisplay;
