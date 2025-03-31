import { Button } from "@/components/ui/button";
import { ExamSubmission } from "./ExamCard";
import { statusFilters } from "@/types/exam";

interface StatusFiltersProps {
	selectedStatus: ExamSubmission["status"] | null;
	setSelectedStatus: (status: ExamSubmission["status"] | null) => void;
}

export function StatusFilters({
	selectedStatus,
	setSelectedStatus,
}: StatusFiltersProps) {
	return (
		<div className="pl-4 border-l-2 border-muted">
			<div className="flex flex-wrap gap-2">
				<Button
					size="sm"
					variant={selectedStatus === null ? "secondary" : "ghost"}
					onClick={() => setSelectedStatus(null)}
				>
					All Status
				</Button>
				{statusFilters.map((filter) => (
					<Button
						size="sm"
						key={filter.status}
						variant={
							selectedStatus === filter.status
								? "secondary"
								: "ghost"
						}
						onClick={() => setSelectedStatus(filter.status)}
					>
						{filter.label}
					</Button>
				))}
			</div>
		</div>
	);
}
