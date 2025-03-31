import { Button } from "@/components/ui/button";
import Link from "next/link";

export type ProblemStatus = "solved" | "unsolved" | "in_progress" | "reviewing";

export interface Problem {
	id: string;
	title: string;
	description: string;
	difficulty: "easy" | "medium" | "hard";
	status: ProblemStatus;
}

export function ProblemCard({ problem }: { problem: Problem }) {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "easy":
				return "bg-green-100 text-green-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800";
			case "hard":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusColor = (status: ProblemStatus) => {
		switch (status) {
			case "solved":
				return "bg-green-100 text-green-800";
			case "in_progress":
				return "bg-blue-100 text-blue-800";
			case "reviewing":
				return "bg-yellow-100 text-yellow-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="flex flex-col p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow duration-200">
			<div className="flex justify-between items-start">
				<div className="flex flex-col gap-2">
					<h3 className="text-xl font-semibold text-gray-900">
						{problem.title}
					</h3>
					<p className="text-gray-600 text-sm">
						{problem.description}
					</p>
				</div>
				<div className="flex gap-2">
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
							problem.difficulty
						)}`}
					>
						{problem.difficulty}
					</span>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
							problem.status
						)}`}
					>
						{problem.status.replace("_", " ")}
					</span>
				</div>
			</div>
		</div>
	);
}
