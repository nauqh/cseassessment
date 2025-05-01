"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import SubmittingOverlay from "@/components/SubmittingOverlay";
import {
	ExamResults,
	LinkData,
	MultiChoiceAnswer,
	ProblemAnswer,
} from "@/types/exam";

export default function FinalClient({ examId }: { examId: string }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [response, setResponse] = useState("");
	const { toast } = useToast();
	const router = useRouter();

	const multichoiceAnswers: MultiChoiceAnswer = JSON.parse(
		localStorage.getItem("multichoiceAnswers") || "{}"
	);
	const problemAnswers: Record<string, ProblemAnswer> = JSON.parse(
		localStorage.getItem("problemAnswers") || "{}"
	);

	const examDict: { [key: string]: string } = {
		M11: "M1.1 Basics SQL",
		M12: "M1.2 Advanced SQL",
		M21: "M2.1 Python 101",
		M31: "M3.1 Pandas 101",
	};

	const downloadExamSubmission = (examResults: ExamResults) => {
		// Generate formatted text content
		let content = `${examResults.exam_name} EXAM SUBMISSION\n`;
		content += `${"=".repeat(examResults.exam_name.length + 16)}\n\n`;
		content += `Email: ${examResults.email}\n`;
		content += `Exam ID: ${examResults.exam_id}\n`;
		content += `Date: ${new Date().toLocaleString(undefined, {
			timeZoneName: "short",
		})}\n\n`;

		// Multiple choice answers
		content += `MULTIPLE CHOICE QUESTIONS\n`;
		content += `${"=".repeat(24)}\n\n`;
		const multichoiceAnswers = Object.entries(examResults.answers)
			.filter(
				([_, answer]: [
					string,
					{ type: string; answer: string | string[] }
				]) => answer.type === "multichoice"
			)
			.map(
				([index, answer]: [
					string,
					{ type: string; answer: string | string[] }
				]) => ({
					index,
					answer: answer.answer,
				})
			);

		if (multichoiceAnswers.length > 0) {
			multichoiceAnswers.forEach(
				(
					item: { index: string; answer: string | string[] },
					index: number
				) => {
					content += `Question ${index + 1}:\n`;
					if (Array.isArray(item.answer)) {
						content += `Answer: ${item.answer.join(", ")}\n`;
					} else {
						content += `Answer: ${item.answer}\n`;
					}
					content += "\n";
				}
			);
		} else {
			content += `No multiple choice answers submitted.\n\n`;
		}

		// Programming problems
		content += `PROGRAMMING PROBLEMS\n`;
		content += `${"=".repeat(20)}\n\n`;
		const localProblemAnswers: Record<string, ProblemAnswer> = JSON.parse(
			localStorage.getItem("problemAnswers") || "{}"
		);
		const problemEntries = Object.entries(localProblemAnswers);

		if (problemEntries.length > 0) {
			problemEntries.forEach(
				([problem, data]: [string, ProblemAnswer]) => {
					content += `Problem ${problem}:\n`;
					content += `${"-".repeat(problem.length + 9)}\n`;

					if (data.language === "file") {
						content += `Type: File Upload\n`;
						if (data.files && data.files.length > 0) {
							content += `Uploaded Files:\n`;
							data.files.forEach(
								(file: { name: string; size: number }) => {
									content += `- ${file.name} (${Math.round(
										file.size / 1024
									)} KB)\n`;
								}
							);
							content += `\n`;
						} else {
							content += `No files uploaded.\n\n`;
						}
					} else if (data.language === "link") {
						content += `Type: External Link\n`;
						if (data.links && data.links.length > 0) {
							content += `Links:\n`;
							data.links.forEach((link: LinkData) => {
								content += `- ${link.url}`;
								if (link.description) {
									content += ` - "${link.description}"`;
								}
								content += `\n`;
							});
							content += `\n`;
						} else {
							content += `No links provided.\n\n`;
						}
					} else {
						content += `Type: ${data.language.toUpperCase()}\n`;
						content += `${"*".repeat(40)}\n`;
						content += `${data.code}\n`;
						content += `${"*".repeat(40)}\n\n`;
					}
				}
			);
		} else {
			content += `No programming problems submitted.\n`;
		}

		// Create blob and download it
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${examResults.exam_name}_Submission_${new Date()
			.toISOString()
			.slice(0, 10)}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		const userEmail = localStorage.getItem("examUserEmail");

		if (!userEmail) {
			toast({
				description: "Email not found. Please start the exam again.",
				className: "bg-red-100 text-red-900",
				duration: 3000,
			});
			router.push(`/v0/${examId}`);
			return;
		}

		const examResults: ExamResults = {
			email: userEmail,
			exam_id: examId,
			exam_name: examDict[examId],
			answers: [
				...Object.entries(multichoiceAnswers).map(
					([key, answer]: [string, string | string[]]) => ({
						answer,
						type: "multichoice",
						files: undefined,
						links: undefined,
					})
				),
				...Object.entries(problemAnswers).map(
					([_, answer]: [string, ProblemAnswer]) => ({
						answer: answer.code,
						type: answer.language,
						files: answer.files || undefined,
						links: answer.links || undefined,
					})
				),
			],
		};

		try {
			console.log(JSON.stringify(examResults));
			// Download the exam submission before navigating
			downloadExamSubmission(examResults);
			const response = await fetch(
				"https://cseassessment.up.railway.app/submissions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(examResults),
				}
			);

			const data = await response.json();
			setResponse(data);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			toast({
				description: "Your exam has been submitted successfully!",
				className: "bg-green-100 text-green-900",
				duration: 3000,
			});

			// Short delay to ensure download starts before navigation
			setTimeout(() => {
				router.replace(`/v0/${examId}/final/success`);
			}, 1000);
		} catch (error) {
			toast({
				description: "Failed to submit exam. Please try again.",
				className: "bg-red-100 text-red-900",
				duration: 3000,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8">Final Review</h1>

			<div className="space-y-8">
				<section className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">
						Multiple Choice Answers
					</h2>
					<div className="grid gap-4">
						{Object.entries(multichoiceAnswers).map(
							([question, answer]) => (
								<div key={question} className="border-b pb-2">
									<p className="font-medium">
										Question {question}
									</p>
									<p className="text-gray-600">
										Answer:{" "}
										{Array.isArray(answer)
											? answer.join(", ")
											: answer}
									</p>
								</div>
							)
						)}
					</div>
				</section>

				<section className="bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">
						Programming Problems
					</h2>
					<div className="space-y-4">
						{Object.entries(problemAnswers).map(
							([problem, data]) => (
								<div key={problem} className="border-b pb-4">
									<p className="font-medium">
										Problem {problem}
									</p>
									{data.language === "file" ? (
										<div className="mt-2">
											{/* The user commented out this text */}
										</div>
									) : data.language === "link" ? (
										<div className="mt-2">
											{data.links &&
											data.links.length > 0 ? (
												<div className="mt-2">
													<p className="text-sm font-medium">
														Solution links:
													</p>
													<ul className="list-disc pl-5 mt-1 space-y-1 overflow-hidden">
														{data.links.map(
															(
																link: LinkData,
																index: number
															) => (
																<li key={index}>
																	<a
																		href={
																			link.url
																		}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-blue-600 hover:underline text-sm break-all"
																	>
																		{
																			link.url
																		}
																	</a>
																	{link.description && (
																		<span className="block text-gray-500 italic text-xs ml-2 overflow-hidden text-ellipsis">
																			"
																			{
																				link.description
																			}
																			"
																		</span>
																	)}
																</li>
															)
														)}
													</ul>
												</div>
											) : (
												<p className="text-sm italic text-gray-500">
													No links provided
												</p>
											)}
										</div>
									) : (
										<pre className="bg-gray-50 p-3 rounded mt-2 overflow-x-auto whitespace-pre-wrap">
											<code>{data.code}</code>
										</pre>
									)}

									{/* Display uploaded files */}
									{data.files && data.files.length > 0 && (
										<div className="mt-2">
											<p className="text-sm font-medium">
												Attached files:
											</p>
											<div className="flex flex-wrap gap-2 mt-1">
												{data.files.map(
													(file, index) => (
														<div
															key={index}
															className="text-xs bg-gray-100 p-1 px-2 rounded-md text-ellipsis overflow-hidden"
														>
															{file.name} (
															{Math.round(
																file.size / 1024
															)}{" "}
															KB)
														</div>
													)
												)}
											</div>
										</div>
									)}
								</div>
							)
						)}
					</div>
				</section>

				{response === "" && (
					<div className="flex gap-4 justify-end">
						<Button
							variant="outline"
							onClick={() => router.back()}
							disabled={isSubmitting}
						>
							Go Back
						</Button>
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting}
							variant="success"
						>
							{isSubmitting ? "Submitting..." : "Submit Exam"}
						</Button>
					</div>
				)}
			</div>

			{isSubmitting && <SubmittingOverlay />}
			<Toaster />
		</div>
	);
}
