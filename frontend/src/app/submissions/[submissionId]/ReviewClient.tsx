"use client";
import React, { useState, useEffect } from "react";
import { ExamContent } from "@/lib/questions";
import { FileData, LinkData } from "@/types/exam";
import AnswerCard from "./AnswerCard";
import { BsListUl } from "react-icons/bs";

export type SubmissionAnswer = {
	answer: string | string[];
	type: "multichoice" | "sql" | "python" | "pandas" | "file";
	status?: "correct" | "incorrect" | "partial" | "not_submitted";
	files?: FileData[];
	links?: LinkData[];
};

export type Submission = {
	email: string;
	answers: SubmissionAnswer[];
	exam_id: string;
	exam_name: string;
	submitted_at: string;
	summary: string;
	score: number;
	status: string;
	feedback: string;
};

// Function to parse the exam summary markdown string and extract question correctness
const parseExamSummary = (
	summaryMarkdown: string
): {
	questionId: string;
	status: "correct" | "incorrect" | "partial" | "not_submitted";
}[] => {
	const results: {
		questionId: string;
		status: "correct" | "incorrect" | "partial" | "not_submitted";
	}[] = [];

	// Extract sections for correct, partial, incorrect and not submitted
	const correctMatch = summaryMarkdown.match(
		/Correct:[\s\S]*?(Partial:|Incorrect:|Not submitted:|Issue:|FINAL SCORE:)/
	);
	const partialMatch = summaryMarkdown.match(
		/Partial:[\s\S]*?(Correct:|Incorrect:|Not submitted:|Issue:|FINAL SCORE:)/
	);
	const incorrectMatch = summaryMarkdown.match(
		/Incorrect:[\s\S]*?(Correct:|Partial:|Not submitted:|Issue:|FINAL SCORE:)/
	);
	const notSubmittedMatch = summaryMarkdown.match(
		/Not submitted:[\s\S]*?(Correct:|Partial:|Incorrect:|Issue:|FINAL SCORE:)/
	);

	// Helper function to extract question IDs from a section
	const extractQuestionIds = (sectionText: string | null): string[] => {
		if (!sectionText) return [];

		// Match all question IDs in the format "Q1", "Q2", etc.
		const matches = sectionText.matchAll(/- Q(\d+)/g);
		return Array.from(matches).map((match) => match[1]);
	};

	// Process correct questions
	const correctQuestions = extractQuestionIds(correctMatch?.[0] || null);
	correctQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "correct" });
	});

	// Process partially correct questions
	const partialQuestions = extractQuestionIds(partialMatch?.[0] || null);
	partialQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "partial" });
	});

	// Process incorrect questions
	const incorrectQuestions = extractQuestionIds(incorrectMatch?.[0] || null);
	incorrectQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "incorrect" });
	});

	// Process not submitted questions
	const notSubmittedQuestions = extractQuestionIds(
		notSubmittedMatch?.[0] || null
	);
	notSubmittedQuestions.forEach((qId) => {
		results.push({ questionId: qId, status: "not_submitted" });
	});

	// Sort results by question ID (numerically)
	results.sort((a, b) => parseInt(a.questionId) - parseInt(b.questionId));

	return results;
};

export default function ReviewClient({
	data,
	submission,
}: {
	data: ExamContent;
	submission: Submission;
}) {
	const [processedSubmission, setProcessedSubmission] =
		useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		try {
			// Process the submission to add status to each answer
			// NOTE: feedback is finalized results from summary
			// const questionResults = parseExamSummary(submission.summary);
			const questionResults = parseExamSummary(submission.feedback);

			// Map the answers with the correct status value based on questionId
			const processedAnswers = submission.answers.map(
				(answer: SubmissionAnswer, index: number) => {
					// Question IDs are 1-indexed, so add 1 to the index
					const questionId = (index + 1).toString();
					const result = questionResults.find(
						(q) => q.questionId === questionId
					);

					return {
						...answer,
						status: result ? result.status : "not_submitted",
					};
				}
			);

			const updatedSubmission = {
				...submission,
				answers: processedAnswers,
			};

			setProcessedSubmission(updatedSubmission);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Error processing submission data"
			);
		} finally {
			setLoading(false);
		}
	}, [submission]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="flex flex-col items-center gap-4">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
					<p className="text-muted-foreground">
						Loading submission data...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				{error}
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="bg-white rounded-lg py-6 mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
					<div className="w-full">
						<h1 className="text-2xl font-bold">
							Your Exam Results
						</h1>
						<div className="text-muted-foreground mt-1">
							<span className="font-medium">
								{submission.exam_name}
							</span>
							<span className="mx-2">•</span>
							<span>{submission.email}</span>
						</div>
					</div>
					{processedSubmission && (
						<div className="flex flex-wrap gap-4 w-full sm:justify-end">
							<div className="flex flex-col min-w-[80px]">
								<span className="text-muted-foreground text-sm">
									Score
								</span>
								<span className="font-semibold">
									{processedSubmission.score}/100
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-muted-foreground text-sm">
									Submitted (UTC)
								</span>
								<span className="font-semibold text-sm sm:text-base">
									{new Date(
										processedSubmission.submitted_at
									).toLocaleString("en-US", {
										day: "2-digit",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Raw Summary Markdown Section */}
			<div className="mb-6">
				<details className="w-full group rounded-md overflow-hidden bg-white ring-1 ring-gray-200">
					<summary className="cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between p-3 text-sm">
						<span className="flex items-center gap-1.5">
							<BsListUl className="inline-block text-muted-foreground" />
							Summary
						</span>
						<span className="text-xs text-muted-foreground opacity-60">
							Click to view
						</span>
					</summary>
					<div className="p-4 bg-gray-50 border-t border-gray-200 overflow-auto max-h-[400px]">
						<pre className="whitespace-pre-wrap text-sm font-mono text-gray-700">
							{submission.feedback}
						</pre>
					</div>
				</details>
			</div>

			<div className="space-y-6">
				{data.content.map((question, index) => {
					const questionNumber = index + 1;
					const submissionAnswer =
						processedSubmission?.answers[index];

					if (!submissionAnswer) return null;

					return (
						<AnswerCard
							key={index}
							answer={submissionAnswer}
							questionNumber={questionNumber}
							question={question}
						/>
					);
				})}
			</div>
		</div>
	);
}
