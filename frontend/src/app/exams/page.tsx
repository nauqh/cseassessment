"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";

const courses = [
	{
		id: "m1-1",
		title: "M1.1 Introduction to SQL",
		description:
			"Learn the fundamentals of SQL including basic queries, joins, and database concepts",
		path: "/exams/M11",
	},
	{
		id: "m1-2",
		title: "M1.2 Advanced SQL",
		description:
			"Master complex SQL queries, stored procedures, and database optimization",
		path: "/exams/M12",
	},
	{
		id: "m2-1",
		title: "M2.1 Python 101",
		description:
			"Introduction to Python programming language and basic programming concepts",
		path: "/exams/M21",
	},
	{
		id: "m3-1",
		title: "M3.1 Pandas 101",
		description:
			"Learn data manipulation and analysis with Python Pandas library",
		path: "/exams/M31",
	},
];

export default function ExamHome() {
	useEffect(() => {
		localStorage.clear();
	}, []);

	return (
		<div className="min-h-screen">
			<Navigation />

			<main className="container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto">
					<header className="text-center mb-12">
						<h1 className="text-5xl font-extrabold text-gray-800 mb-4">
							eExams
						</h1>
						<p className="text-xl text-gray-600">
							Select a course to start your assessment
						</p>
					</header>

					{/* Courses Grid */}
					<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{courses.map((course) => (
							<Link key={course.id} href={course.path}>
								<div
									className="
										group relative h-[250px] bg-white rounded-2xl shadow-md 
										border border-gray-200 overflow-hidden transform 
										transition-all duration-300 hover:shadow-xl hover:scale-105
									"
								>
									<div className="p-6 flex flex-col justify-between h-full">
										<h2
											className="
												text-xl font-semibold text-gray-800 mb-3 
												transition-colors duration-300 group-hover:text-[#1d283a]
											"
										>
											{course.title}
										</h2>
										<p className="text-gray-600 mb-6">
											{course.description}
										</p>
										<Button
											className="
												w-full bg-[#1d283a] hover:bg-[#2a3a52] 
												text-white transition-colors duration-300
											"
										>
											Start exam →
										</Button>
									</div>
								</div>
							</Link>
						))}
					</section>
				</div>
			</main>
		</div>
	);
}
