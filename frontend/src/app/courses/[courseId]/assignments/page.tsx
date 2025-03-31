"use client";

import Navigation from "@/components/Navigation";
import { ProblemCard, type Problem } from "@/components/course/ProblemCard";
import { useParams } from "next/navigation";

const mockProblems: Record<string, Problem[]> = {
	"sql-101": [
		{
			id: "sql-p1",
			title: "Employee Directory Query",
			description:
				"Write a SELECT statement to retrieve all employees' names and departments",
			difficulty: "easy",
			status: "solved",
		},
		{
			id: "sql-p2",
			title: "Complex Joins Challenge",
			description:
				"Create a query joining multiple tables to analyze department performance",
			difficulty: "medium",
			status: "solved",
		},
		{
			id: "sql-p3",
			title: "Advanced Aggregation",
			description:
				"Use window functions and complex aggregations to generate sales reports",
			difficulty: "hard",
			status: "solved",
		},
	],
	"python-basics": [
		{
			id: "py-p1",
			title: "List Manipulation",
			description:
				"Create functions to perform various operations on lists",
			difficulty: "easy",
			status: "solved",
		},
		{
			id: "py-p2",
			title: "Dictionary Operations",
			description: "Implement a phone book using Python dictionaries",
			difficulty: "medium",
			status: "solved",
		},
		{
			id: "py-p3",
			title: "OOP Challenge",
			description:
				"Design a class hierarchy for a library management system",
			difficulty: "hard",
			status: "solved",
		},
	],
};

export default function CourseAssignmentsPage() {
	const params = useParams();
	const courseId = params.courseId as string;
	const problems = mockProblems[courseId] || [];

	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation />

			<main className="container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto">
					<header className="mb-12">
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							Course Problems
						</h1>
						<p className="text-lg text-gray-600">
							Solve these problems to test your understanding
						</p>
					</header>

					<div className="grid gap-6">
						{problems.map((problem) => (
							<ProblemCard key={problem.id} problem={problem} />
						))}
					</div>

					{problems.length === 0 && (
						<div className="text-center py-12">
							<p className="text-gray-600">
								No problems found for this course.
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
