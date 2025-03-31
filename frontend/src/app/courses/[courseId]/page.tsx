"use client";

import Navigation from "@/components/Navigation";
import {
	AssignmentCard,
	type Assignment,
} from "@/components/course/AssignmentCard";
import { useParams } from "next/navigation";

// Mock data - replace with actual API call
const mockAssignments: Record<string, Assignment[]> = {
	"sql-101": [
		{
			id: "sql-101-a1",
			title: "Basic SQL Queries",
			description:
				"Practice fundamental SQL queries including SELECT, WHERE, and ORDER BY",
			totalProblems: 5,
			solvedProblems: 5,
		},
		{
			id: "sql-101-a2",
			title: "JOIN Operations",
			description: "Master different types of JOIN operations in SQL",
			totalProblems: 4,
			solvedProblems: 2,
		},
		{
			id: "sql-101-a3",
			title: "Database Design Project",
			description:
				"Create a database schema for a real-world application",
			totalProblems: 3,
			solvedProblems: 0,
		},
	],
	"python-basics": [
		{
			id: "py-101-a1",
			title: "Python Fundamentals Quiz",
			description: "Test your knowledge of Python basics",
			totalProblems: 6,
			solvedProblems: 3,
		},
		{
			id: "py-101-a2",
			title: "Functions and Methods",
			description: "Practice creating and using functions in Python",
			totalProblems: 4,
			solvedProblems: 0,
		},
	],
};

export default function CourseAssignments() {
	const params = useParams();
	const courseId = params.courseId as string;
	const assignments = mockAssignments[courseId] || [];

	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation />

			<main className="container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto">
					<header className="mb-12">
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							Course Assignments
						</h1>
						<p className="text-lg text-gray-600">
							Complete these assignments to progress through the
							course
						</p>
					</header>

					<div className="grid gap-6">
						{assignments.map((assignment) => (
							<AssignmentCard
								key={assignment.id}
								assignment={assignment}
							/>
						))}
					</div>

					{assignments.length === 0 && (
						<div className="text-center py-12">
							<p className="text-gray-600">
								No assignments found for this course.
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
