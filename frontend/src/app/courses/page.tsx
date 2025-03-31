"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { BiTime, BiBook, BiTrophy } from "react-icons/bi";
import Link from "next/link";

// Mock data - replace with actual API call in production
const userCourses = [
	{
		id: "sql-101",
		title: "SQL Fundamentals",
		progress: 65,
		totalModules: 12,
		completedModules: 8,
		duration: "6 weeks",
		nextLesson: "Advanced Joins",
		image: "https://img.freepik.com/free-vector/gradient-sql-illustration_23-2149247491.jpg",
	},
	{
		id: "python-basics",
		title: "Python Programming",
		progress: 30,
		totalModules: 10,
		completedModules: 3,
		duration: "8 weeks",
		nextLesson: "Functions and Methods",
		image: "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg",
	},
	{
		id: "data-analytics",
		title: "Data Analytics with Pandas",
		progress: 15,
		totalModules: 8,
		completedModules: 1,
		duration: "4 weeks",
		nextLesson: "Data Cleaning",
		image: "https://img.freepik.com/free-vector/data-extraction-concept-illustration_114360-4876.jpg",
	},
];

export default function CoursesPage() {
	const { user } = useUser();

	return (
		<div className="min-h-screen bg-gray-50">
			<Navigation />

			<main className="container mx-auto px-4 py-12">
				<div className="max-w-6xl mx-auto">
					<header className="mb-12">
						<h1 className="text-4xl font-bold text-gray-800 mb-4">
							Your Courses
						</h1>
						<p className="text-lg text-gray-600">
							Welcome back, {user?.firstName}! Continue your
							learning journey.
						</p>
					</header>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{userCourses.map((course) => (
							<div
								key={course.id}
								className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
							>
								<div
									className="h-48 bg-cover bg-center"
									style={{
										backgroundImage: `url(${course.image})`,
									}}
								/>
								<div className="p-6">
									<h3 className="text-xl font-semibold text-gray-800 mb-2">
										{course.title}
									</h3>

									{/* Progress bar */}
									<div className="mb-4">
										<div className="flex justify-between text-sm text-gray-600 mb-1">
											<span>Progress</span>
											<span>{course.progress}%</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2">
											<div
												className="bg-primary rounded-full h-2 transition-all duration-300"
												style={{
													width: `${course.progress}%`,
												}}
											/>
										</div>
									</div>

									{/* Course stats */}
									<div className="grid grid-cols-3 gap-4 mb-6">
										<div className="flex items-center gap-2 text-gray-600">
											<BiBook className="w-5 h-5" />
											<span className="text-sm">
												{course.completedModules}/
												{course.totalModules}
											</span>
										</div>
										<div className="flex items-center gap-2 text-gray-600">
											<BiTime className="w-5 h-5" />
											<span className="text-sm">
												{course.duration}
											</span>
										</div>
										<div className="flex items-center gap-2 text-gray-600">
											<BiTrophy className="w-5 h-5" />
											<span className="text-sm">
												Certificate
											</span>
										</div>
									</div>

									{/* Next lesson */}
									<div className="mb-6">
										<p className="text-sm text-gray-600">
											Next lesson:
										</p>
										<p className="text-sm font-medium text-gray-800">
											{course.nextLesson}
										</p>
									</div>

									<Link href={`/courses/${course.id}`}>
										<Button className="w-full">
											Continue Learning
										</Button>
									</Link>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</div>
	);
}
