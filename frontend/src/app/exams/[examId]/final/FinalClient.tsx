"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import SubmittingOverlay from "@/components/SubmittingOverlay";
import { ExamResults, MultiChoiceAnswer, ProblemAnswer } from "@/types/exam";
import { useUser } from "@clerk/nextjs";

export default function FinalClient({ examId }: { examId: string }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [response, setResponse] = useState("");
	const { toast } = useToast();
	const router = useRouter();
	const { user } = useUser();

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

	const handleSubmit = async () => {
		// const cachedResults = localStorage.getItem(`examResults_${examId}`);
		// if (cachedResults) {
		// 	setResponse(JSON.parse(cachedResults));
		// 	return;
		// }

		setIsSubmitting(true);
		const examResults: ExamResults = {
			email: user?.emailAddresses[0].emailAddress || "",
			exam_id: examId,
			exam_name: examDict[examId],
			answers: [
				...Object.entries(multichoiceAnswers).map(([_, answer]) => ({
					answer,
					type: "multichoice",
				})),
				...Object.entries(problemAnswers).map(([_, answer]) => ({
					answer: answer.code,
					type: answer.language,
				})),
			],
		};

		try {
			console.log(JSON.stringify(examResults));
			const response = await fetch(
				"https://cspyclient.up.railway.app/submissions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(examResults),
				}
			);

			const data = await response.json();
			// Cache the results
			// localStorage.setItem(`examResults_${examId}`, JSON.stringify(data));
			setResponse(data);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			toast({
				description: "Your exam has been submitted successfully!",
				className: "bg-green-100 text-green-900",
				duration: 3000,
			});

			router.replace(`/exams/${examId}/final/final-success`);
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
										Answer: {answer}
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
									<pre className="bg-gray-50 p-3 rounded mt-2 overflow-x-auto">
										<code>{data.code}</code>
									</pre>
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
