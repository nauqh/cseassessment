import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiCalendarEvent } from "react-icons/bi";
import { useState } from "react";

export type SubmissionStatus =
	| "completed"
	| "incompleted"
	| "failed"
	| "marking";

export interface ExamSubmission {
	id: number;
	email: string;
	exam_id: string;
	exam_name: string;
	submitted_at: string;
	summary: string;
	score: number;
	channel?: string;
	status: SubmissionStatus;
}

export function ExamCard({ exam }: { exam: ExamSubmission }) {
	const [showModal, setShowModal] = useState(false);

	const dateOptions: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};

	const formattedDate = new Date(exam.submitted_at).toLocaleDateString(
		"en-GB",
		dateOptions
	);

	return (
		<div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
			<div className="mb-4 md:mb-0 space-y-2">
				<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
					{exam.exam_id} - {exam.exam_name}
				</h3>
				<p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
					<BiCalendarEvent className="mr-1" />
					{formattedDate}
				</p>
			</div>
			<div className="flex items-center gap-4">
				<div
					className={`px-3 py-1 rounded-full text-sm font-medium ${
						exam.status === "completed"
							? "bg-green-100 text-green-800"
							: exam.status === "failed"
							? "bg-red-100 text-red-800"
							: exam.status === "incompleted"
							? "bg-gray-100 text-gray-800"
							: "bg-yellow-100 text-yellow-800"
					}`}
				>
					{exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
					{exam.score !== undefined && (
						<span>
							{exam.status === "marking"
								? " (...)"
								: ` (${exam.score})`}
						</span>
					)}
				</div>
				<div className="flex gap-2">
					{exam.status !== "marking" && (
						<>
							{exam.status === "failed" ? (
								<Link href={`/exams/${exam.exam_id}`}>
									<Button variant="outline">Retry</Button>
								</Link>
							) : (
								<>
									<Button
										variant="outline"
										onClick={() => setShowModal(true)}
									>
										Summary
									</Button>
									<Link
										href={`/submissions/${exam.exam_id}/${exam.id}`}
									>
										<Button variant="default">
											View Details
										</Button>
									</Link>
								</>
							)}
						</>
					)}
				</div>
			</div>
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
						<h2 className="text-xl font-semibold mb-4 dark:text-white">
							Exam Summary
						</h2>
						<div className="relative">
							<pre className="bg-gray-50 dark:bg-gray-700 p-4 rounded h-[400px] overflow-y-auto dark:text-gray-100">
								{exam.summary}
							</pre>
						</div>
						<Button
							onClick={() => setShowModal(false)}
							className="mt-4"
						>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
