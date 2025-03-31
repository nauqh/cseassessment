"use client";

import { MdCalendarMonth } from "react-icons/md";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DateFilterProps {
	dateRange: DateRange | undefined;
	setDateRange: (date: DateRange | undefined) => void;
}

export function DateFilter({ dateRange, setDateRange }: DateFilterProps) {
	return (
		<div className="pl-4 border-l-2 border-muted">
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className={`justify-start text-left font-normal ${
							!dateRange && "text-muted-foreground"
						}`}
					>
						<MdCalendarMonth className="mr-2 h-4 w-4" />
						{dateRange?.from ? (
							dateRange.to ? (
								<>
									{format(dateRange.from, "LLL dd, y")} -{" "}
									{format(dateRange.to, "LLL dd, y")}
								</>
							) : (
								format(dateRange.from, "LLL dd, y")
							)
						) : (
							"Pick a date range"
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						selected={dateRange}
						onSelect={setDateRange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
			{dateRange && (
				<Button
					variant="ghost"
					size="sm"
					className="ml-2"
					onClick={() => setDateRange(undefined)}
				>
					Clear
				</Button>
			)}
		</div>
	);
}
