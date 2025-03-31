import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

// Adding interface for the new dataframe type
interface DataframeOutput {
  type: "dataframe";
  data: Record<string, unknown>[];
}

// Adding interface for pandas Series type
interface SeriesOutput {
  type: "series";
  data: Record<string, unknown>;
}

// Adding interface for single value type
interface ValueOutput {
  type: "value";
  data: string | number | boolean | null | undefined;
}

// Adding interface for PivotTable type
interface PivotTableOutput {
  type: "pivot_table";
  data: {
    flat: Record<string, unknown>[];
    structured: Record<string, unknown>[];
    nested: Record<string, Record<string, unknown>>;
  };
  metadata: {
    index_hierarchy: Array<{
      level: number;
      name: string;
      values: string[];
    }>;
    column_hierarchy: Array<{
      level: number;
      name: string;
      values: string[];
    }>;
    shape: number[];
    columns: string[];
    index: string[];
  };
}

// Define the possible output types
type OutputData = string | Record<string, unknown>[] | DataframeOutput | SeriesOutput | ValueOutput | PivotTableOutput;

// Extending the component's props type to handle the new format
const CodeOutput = ({ data }: { data: OutputData | { output: OutputData, language: string } }) => {
	// Handle empty data
	if (data === "") {
		return (
			<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto"></div>
		);
	}

	// Format a value for display based on its type
	const formatValue = (value: unknown): string => {
		if (value === null || value === undefined) return "-";
		if (typeof value === 'number') {
			return Number.isInteger(value) ? 
				value.toString() : 
				value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 });
		}
		if (typeof value === 'object') {
			try {
				return JSON.stringify(value);
			} catch {
				return "[Object]";
			}
		}
		return String(value);
	};

	// Handle SQL dataframe format
	if (typeof data === "object" && !Array.isArray(data) && 'output' in data) {
		const outputData = data.output;
		// Simply pass the output data to the same component for processing
		return <CodeOutput data={outputData} />;
	}

	// Handle plain text output
	if (typeof data === "string") {
		return (
			<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto 2xl:text-xl">
				{data}
			</div>
		);
	}

	// Handle value type directly
	if (typeof data === "object" && !Array.isArray(data) && 'type' in data && data.type === "value") {
		const valueData = data.data;
		
		return (
			<div className="h-full bg-zinc-900 text-emerald-300/90 font-mono text-sm p-3 rounded-lg whitespace-pre-wrap flex overflow-y-auto 2xl:text-xl">
				{formatValue(valueData)}
			</div>
		);
	}

	// Handle pivot table type
	if (typeof data === "object" && !Array.isArray(data) && 'type' in data && data.type === "pivot_table") {
		const pivotData = data as PivotTableOutput;
		return <PivotTable data={pivotData.data} metadata={pivotData.metadata} />;
	}

	// Handle dataframe type directly
	if (typeof data === "object" && !Array.isArray(data) && 'type' in data && data.type === "dataframe") {
		const dataframeData = data.data;
		
		if (!Array.isArray(dataframeData) || dataframeData.length === 0) {
			return (
				<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
					No data available
				</div>
			);
		}

		const columns = Object.keys(dataframeData[0]);

		return (
			<div className="overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead></TableHead>
							{columns.map((column) => (
								<TableHead key={column}>{column}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{dataframeData.map((row, rowIndex) => (
							<TableRow key={rowIndex}>
								<TableCell>{rowIndex + 1}</TableCell>
								{columns.map((column) => (
									<TableCell key={`${rowIndex}-${column}`}>
										{formatValue(row[column])}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	// Handle series type directly
	if (typeof data === "object" && !Array.isArray(data) && 'type' in data && data.type === "series") {
		const seriesData = data.data;
		
		if (!seriesData || Object.keys(seriesData).length === 0) {
			return (
				<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
					No data available
				</div>
			);
		}

		return (
			<div className="overflow-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Index</TableHead>
							<TableHead>Value</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(seriesData).map(([index, value], rowIndex) => (
							<TableRow key={rowIndex}>
								<TableCell>{index}</TableCell>
								<TableCell>
									{formatValue(value)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	// Handle array of records (original SQL output)
	if (!Array.isArray(data) || data.length === 0) {
		return (
			<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
				No data available
				</div>
		);
	}

	const columns = Object.keys(data[0]);

	return (
		<div className="overflow-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead></TableHead>
						{columns.map((column) => (
							<TableHead key={column}>{column}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row, rowIndex) => (
						<TableRow key={rowIndex}>
							<TableCell>{rowIndex + 1}</TableCell>
							{columns.map((column) => (
								<TableCell key={`${rowIndex}-${column}`}>
									{formatValue(row[column])}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

// Custom PivotTable component to render hierarchical pivot table data
const PivotTable = ({ 
  data, 
  metadata 
}: { 
  data: PivotTableOutput["data"], 
  metadata: PivotTableOutput["metadata"] 
}) => {
	// Check if data is available
	if (!data || (!data.flat?.length && !data.structured?.length && !Object.keys(data.nested || {}).length)) {
		return (
			<div className="min-h-[150px] flex items-center justify-center text-gray-500 2xl:text-xl">
				No pivot table data available
			</div>
		);
	}

	// Format a numeric value with proper formatting
	const formatValue = (value: unknown): string => {
		if (value === null || value === undefined) return "-";
		if (typeof value === 'number') {
			return Number.isInteger(value) ? 
				value.toString() : 
				value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		}
		if (typeof value === 'object') {
			try {
				return JSON.stringify(value);
			} catch {
				return "[Object]";
			}
		}
		return String(value);
	};

	// Extract metadata
	const { index_hierarchy, column_hierarchy } = metadata;
	
	// Get row index field name (typically "JobTitle" or similar)
	const rowIndexField = index_hierarchy?.[0]?.name || "";
	const rowIndexValues = metadata.index || [];
	
	// Get column hierarchies
	const metrics = column_hierarchy?.[0]?.values || [];
	const years = column_hierarchy?.[1]?.values || [];
  
	return (
		<div className="overflow-auto">
			<Table>
				<TableHeader>
					{/* First header row - Metrics (BasePay, OvertimePay, TotalPay) */}
					<TableRow>
						{/* Empty cell for row index column */}
						<TableHead className="border bg-zinc-50 font-bold">{rowIndexField}</TableHead>
						
						{/* Render metric headers that span across years */}
						{metrics.map((metric) => (
							<TableHead 
								key={metric} 
								colSpan={years.length}
								className="text-center border bg-zinc-100 font-bold"
							>
								{metric}
							</TableHead>
						))}
					</TableRow>
					
					{/* Second header row - Years (2011, 2012, 2013, 2014) */}
					<TableRow>
						{/* Empty cell for row index column */}
						<TableHead className="border bg-zinc-50"></TableHead>
						
						{/* Render year headers under each metric */}
						{metrics.flatMap((metric) => 
							years.map((year) => (
								<TableHead 
									key={`${metric}_${year}`}
									className="text-center border bg-zinc-100"
								>
									{year}
								</TableHead>
							))
						)}
					</TableRow>
				</TableHeader>
				
				<TableBody>
					{/* Map through each row (job title) */}
					{rowIndexValues.map((rowIndex, idx) => (
						<TableRow key={rowIndex}>
							{/* Row index cell (job title) */}
							<TableCell className="font-medium border bg-gray-50">{rowIndex}</TableCell>
							
							{/* Render data cells for each metric and year combination */}
							{metrics.flatMap((metric) => 
								years.map((year) => {
									// Get value from the appropriate data structure
									let value;
									
									if (data.flat && data.flat[idx]) {
										// For flat data format
										value = data.flat[idx][`${metric}_${year}`];
									} else if (data.structured && data.structured[idx]) {
										// For structured data format
										value = data.structured[idx][`${metric}_${year}`];
									} else if (data.nested && data.nested[rowIndex]) {
										// For nested data format
										value = data.nested[rowIndex][`('${metric}', ${year})`];
									}
									
									return (
										<TableCell 
											key={`${rowIndex}_${metric}_${year}`}
											className="text-right border"
										>
											{formatValue(value)}
										</TableCell>
									);
								})
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default CodeOutput;
