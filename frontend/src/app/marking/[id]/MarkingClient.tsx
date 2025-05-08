"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertCircle,
	FileText,
	Link as LinkIcon,
	Copy,
	Maximize2,
	Download,
} from "lucide-react";
import CodeOutput from "@/components/CodeOutput";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

type Link = {
	id: string;
	url: string;
	description: string;
	type: string;
	addedAt: number;
};

type File = {
	name: string;
	size: number;
	type: string;
	content: string;
};

type Answer = {
	answer: string | string[];
	type: string;
	links?: Link[];
	files?: File[];
};

type Submission = {
	id: number;
	email: string;
	answers: Answer[];
	exam_id: string;
	exam_name: string;
	submitted_at: string;
	summary: string;
	feedback?: string;
	score: number;
	channel: string | null;
	status: string;
};

// Function to decode base64 file content
const decodeBase64File = (content: string): string => {
	const base64Content = content.split(",")[1];
	if (!base64Content) return "Error decoding file content";

	try {
		return atob(base64Content);
	} catch (error) {
		console.error("Error decoding base64:", error);
		return "Error decoding file content";
	}
};

// Dictionary mapping exam IDs to their solution file URLs
const solutionUrls: Record<string, string> = {
	M11: "https://drive.google.com/file/d/1tvZyXZX2ttlD8S7RJl6RJHtKtYxS5j6s/preview",
	M21: "https://drive.google.com/file/d/1aUYMDcDpnk0YymyHiSyzxULnPjvpLzOE/preview",
	M12: "https://drive.google.com/file/d/1-0767BUsbseekFHzufuhDKEG253vclsg/preview",
	M31: "https://drive.google.com/file/d/17fS11_ClRjgGvL7x6MnP3019CkO8AFe6/preview",
};

export default function MarkingClient({
	submissionId,
}: {
	submissionId: string;
}) {
	const [submission, setSubmission] = useState<Submission | null>(null);
	const [examId, setExamId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState("submission");
	const [copiedToClipboard, setCopiedToClipboard] = useState(false);
	const [copiedSolutionLink, setCopiedSolutionLink] = useState(false);
	const [copiedFullFeedback, setCopiedFullFeedback] = useState(false);
	const [feedback, setFeedback] = useState<string>("");
	const [savingFeedback, setSavingFeedback] = useState(false);
	const [feedbackSaved, setFeedbackSaved] = useState(false);
	const [feedbackChanged, setFeedbackChanged] = useState(false);
	const { toast } = useToast();

	const getSolutionFileUrl = () => {
		if (!examId) return "";
		return solutionUrls[examId] || "";
	};

	useEffect(() => {
		const fetchSubmission = async () => {
			try {
				const response = await fetch(
					`https://cseassessment.up.railway.app/submissions/${submissionId}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch submission");
				}

				const data = await response.json();
				setSubmission(data);
				setExamId(data.exam_id);
				setFeedback(data.feedback || "");
				setFeedbackChanged(false);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to load submission data"
				);
			} finally {
				setLoading(false);
			}
		};

		fetchSubmission();
	}, [submissionId]);

	// Check if feedback differs from summary
	useEffect(() => {
		if (submission) {
			const feedbackDiffersFromSummary =
				feedback !== submission.summary &&
				feedback !== (submission.feedback || "");
			setFeedbackChanged(feedbackDiffersFromSummary);
		}
	}, [feedback, submission]);

	const handleCopyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopiedToClipboard(true);
		setTimeout(() => setCopiedToClipboard(false), 2000);
	};

	const handleCopySolutionLink = () => {
		// Get the shareable URL by replacing "/preview" with "/view?usp=drive_link"
		const shareableUrl = getSolutionFileUrl().replace(
			"/preview",
			"/view?usp=drive_link"
		);
		navigator.clipboard.writeText(shareableUrl);
		setCopiedSolutionLink(true);
		setTimeout(() => setCopiedSolutionLink(false), 2000);
	};

	const handleCopyFullFeedback = () => {
		// Check if feedback has unsaved changes before copying
		if (feedbackChanged) {
			toast({
				title: "Warning",
				description:
					"You have unsaved feedback changes. Please save your feedback first.",
				className: "bg-yellow-100 text-yellow-900",
				duration: 5000,
			});
			return;
		}

		// Get the shareable URL for the solution
		const shareableUrl = getSolutionFileUrl().replace(
			"/preview",
			"/view?usp=drive_link"
		);

		// Always use the current feedback value
		const feedbackContent = feedback || submission?.summary || "";

		// Format the full feedback message
		const fullFeedbackMessage = `
\`\`\`
${feedbackContent}
\`\`\`
${
	submission?.score && submission.score < 80
		? "❗You have FAILED the exam. Please retake the exam in order to unlock new module."
		: "🎉 Congratulations! You have PASSED the exam."
}
${
	submission?.score && submission.score >= 80
		? `View solution: [Open solution](${shareableUrl})`
		: "Solution is not available for this submission."
}

View your submission: [Open review page](https://csassessment.it.com/submissions/${submissionId})
		`.trim();

		navigator.clipboard.writeText(fullFeedbackMessage);
		setCopiedFullFeedback(true);
		setTimeout(() => setCopiedFullFeedback(false), 2000);
	};

	const handleSaveFeedback = async () => {
		if (!submission) return;

		setSavingFeedback(true);
		try {
			const response = await fetch(
				`https://cseassessment.up.railway.app/submissions/${submissionId}/feedback`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ feedback }),
				}
			);

			if (!response.ok) {
				throw new Error("Failed to save feedback");
			}

			// Update the submission object with the new feedback
			setSubmission((prev) =>
				prev ? { ...prev, feedback: feedback } : null
			);
			setFeedbackSaved(true);
			setFeedbackChanged(false);
			toast({
				description: "Feedback saved successfully!",
				className: "bg-green-100 text-green-900",
				duration: 3000,
			});
			setTimeout(() => setFeedbackSaved(false), 2000);
		} catch (err) {
			console.error("Error saving feedback:", err);
		} finally {
			setSavingFeedback(false);
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto py-12 max-w-6xl flex justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
					<p className="text-muted-foreground">
						Loading submission...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return <ErrorState error={error} />;
	}

	if (!submission) {
		return <ErrorState error="No submission data found" />;
	}

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="flex flex-col gap-6">
				<div className="bg-white rounded-lg py-6 mb-8">
					<div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
						<div className="w-full">
							<h1 className="text-2xl font-bold">
								Submission Review
							</h1>
							<div className="text-muted-foreground mt-1">
								<span className="font-medium">
									{submission.exam_name}
								</span>
								<span className="mx-2">•</span>
								<span>{submission.email}</span>
							</div>
						</div>
						<div className="flex flex-wrap gap-4 w-full sm:justify-end">
							{/* <div className="flex flex-col min-w-[80px]">
								<span className="font-semibold">
									<Badge
										variant={
											submission.status === "completed"
												? "default"
												: "outline"
										}
										className="px-3 py-1 uppercase text-xs tracking-wider mt-1"
									>
										{submission.status}
									</Badge>
								</span>
							</div> */}
							<div className="flex flex-col min-w-[80px]">
								<span className="text-muted-foreground text-sm">
									Score
								</span>
								<span className="font-semibold">
									{submission.score}/100
								</span>
							</div>
							<div className="flex flex-col">
								<span className="text-muted-foreground text-sm">
									Submitted
								</span>
								<span className="font-semibold text-sm sm:text-base">
									{new Date(
										submission.submitted_at
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
					</div>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full"
				>
					<TabsList className="mb-4 w-full sm:w-auto">
						<TabsTrigger
							value="submission"
							className="flex-1 sm:flex-initial"
						>
							Answers
						</TabsTrigger>
						<TabsTrigger
							value="summary"
							className="flex-1 sm:flex-initial"
						>
							Summary
						</TabsTrigger>
						<TabsTrigger
							value="feedback"
							className="flex-1 sm:flex-initial"
						>
							Feedback
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="submission"
						className="space-y-6 animate-in fade-in-50 duration-300"
					>
						{submission.answers.map((answer, index) => (
							<AnswerCard
								key={index}
								answer={answer}
								questionNumber={index + 1}
							/>
						))}
					</TabsContent>

					<TabsContent
						value="summary"
						className="animate-in fade-in-50 duration-300"
					>
						<Card className="shadow-sm">
							<CardHeader className="pb-3 border-b">
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg">
										Summary
									</CardTitle>
									<button
										onClick={() =>
											handleCopyToClipboard(
												submission.summary
											)
										}
										className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
										title="Copy summary to clipboard"
									>
										<Copy size={14} />
										<span>
											{copiedToClipboard
												? "Copied!"
												: "Copy"}
										</span>
									</button>
								</div>
							</CardHeader>
							<CardContent className="pt-4">
								<pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-slate-50 rounded-md overflow-auto max-h-[500px]">
									{submission.summary}
								</pre>
							</CardContent>
						</Card>

						{/* Solution File Section */}
						<div className="mt-6">
							<Card className="shadow-sm">
								<CardHeader className="pb-3 border-b">
									<div className="flex justify-between items-center">
										<CardTitle className="text-lg">
											Solution
										</CardTitle>
										<button
											onClick={handleCopySolutionLink}
											className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
											title="Copy solution link to clipboard"
										>
											<Copy size={14} />
											<span>
												{copiedSolutionLink
													? "Copied!"
													: "Copy"}
											</span>
										</button>
									</div>
								</CardHeader>
								<CardContent className="pt-4">
									{getSolutionFileUrl() ? (
										<div className="rounded-md overflow-hidden border">
											<iframe
												src={getSolutionFileUrl()}
												className="w-full"
												height="600"
												allow="autoplay"
												title="Solution File"
											></iframe>
										</div>
									) : (
										<p className="text-muted-foreground italic text-center py-8">
											No solution available for this exam
										</p>
									)}
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent
						value="feedback"
						className="animate-in fade-in-50 duration-300"
					>
						<Card className="shadow-sm">
							<CardHeader className="pb-3 border-b">
								<div className="flex justify-between items-center">
									<CardTitle className="text-lg">
										Feedback
									</CardTitle>
									<div className="flex items-center gap-2">
										<button
											onClick={handleSaveFeedback}
											disabled={savingFeedback}
											className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
											title="Save feedback"
										>
											{savingFeedback ? (
												<div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											) : (
												<FileText size={14} />
											)}
											<span>
												{feedbackSaved
													? "Saved!"
													: savingFeedback
													? "Saving..."
													: "Save"}
											</span>
										</button>
										{/* <button
											onClick={() =>
												handleCopyToClipboard(feedback)
											}
											className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
											title="Copy feedback to clipboard"
										>
											<Copy size={14} />
											<span>
											{copiedToClipboard
												? "Copied!"
												: "Copy"}
										</span>
										</button> */}
									</div>
								</div>
							</CardHeader>
							<CardContent className="pt-4">
								<textarea
									value={feedback}
									onChange={(e) => {
										setFeedback(e.target.value);
									}}
									className="w-full min-h-[500px] font-mono text-sm p-4 bg-slate-50 rounded-md focus:outline-none focus:ring-0 resize-y"
									placeholder="Add your feedback here. This will be stored alongside the autograded summary."
								/>

								{feedbackChanged && (
									<div className="mt-2 p-2 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-700 text-sm flex items-center gap-2">
										<AlertCircle size={16} />
										<span>
											You have unsaved changes. Don't
											forget to save your feedback.
										</span>
									</div>
								)}

								<div className="mt-6 flex justify-end">
									<button
										onClick={handleCopyFullFeedback}
										className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
										title="Copy full feedback message to send to learner"
									>
										<Copy size={16} />
										<span>
											{copiedFullFeedback
												? "Copied!"
												: "Copy Feedback to Send to Learner"}
										</span>
									</button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
			<Toaster />
		</div>
	);
}

// Helper components
function ErrorState({ error }: { error: string }) {
	return (
		<div className="container mx-auto py-12 max-w-5xl">
			<Card className="shadow-sm">
				<CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
					<AlertCircle className="h-12 w-12 text-red-500 mb-4" />
					<p className="text-lg font-medium text-center">{error}</p>
					<p className="text-muted-foreground mt-2 text-center">
						Please try again or contact support if the issue
						persists.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}

function AnswerCard({
	answer,
	questionNumber,
}: {
	answer: Answer;
	questionNumber: number;
}) {
	const renderAnswerContent = () => {
		switch (answer.type) {
			case "multichoice":
				return (
					<div className="flex flex-wrap items-center gap-2">
						{Array.isArray(answer.answer) ? (
							answer.answer.map((choice, index) => (
								<Badge
									key={index}
									variant="outline"
									className="px-3 py-1 text-base"
								>
									{choice.trim()}
								</Badge>
							))
						) : (
							<Badge
								variant="outline"
								className="px-3 py-1 text-base"
							>
								{answer.answer}
							</Badge>
						)}
					</div>
				);

			case "python":
			case "sql":
			case "pandas":
				// Handle array case for code output
				const codeContent = Array.isArray(answer.answer)
					? answer.answer.join("\n")
					: answer.answer;
				return <CodeOutput data={codeContent} />;

			case "text":
				return (
					<div className="p-4 bg-slate-50 border rounded-md">
						<p className="whitespace-pre-wrap">{answer.answer}</p>
					</div>
				);

			case "link":
				return (
					<div className="space-y-3">
						{answer.links?.length ? (
							answer.links.map((link) => (
								<div
									key={link.id}
									className="flex flex-col p-3 bg-slate-50 border rounded-md"
								>
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline flex items-center gap-2"
									>
										<LinkIcon className="h-4 w-4" />
										{link.url}
									</a>
									{link.description && (
										<p className="text-sm text-muted-foreground ml-6 mt-1">
											{link.description}
										</p>
									)}
								</div>
							))
						) : (
							<p className="text-muted-foreground italic">
								No links provided
							</p>
						)}
					</div>
				);

			case "file":
				return (
					<div className="space-y-4">
						{answer.files?.length ? (
							answer.files.map((file) => (
								<div
									key={file.name}
									className="border rounded-md overflow-hidden shadow-sm"
								>
									<div className="bg-slate-100 px-4 py-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<FileText className="h-4 w-4 text-blue-500" />
											<span className="font-medium">
												{file.name}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className="text-xs"
											>
												{(file.size / 1024).toFixed(1)}{" "}
												KB
											</Badge>
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8"
													>
														<Maximize2 className="h-4 w-4" />
													</Button>
												</DialogTrigger>
												<DialogContent className="max-w-4xl w-[90vw] p-5">
													<DialogHeader className="mb-4">
														<DialogTitle className="flex items-center gap-2">
															<FileText className="h-5 w-5 text-blue-500" />
															{file.name}
														</DialogTitle>
													</DialogHeader>
													<div className="border rounded-md overflow-auto h-[60vh]">
														<CodeOutput
															data={decodeBase64File(
																file.content
															)}
														/>
													</div>
													<div className="mt-5 flex justify-end">
														<Button
															variant="outline"
															className="flex items-center gap-2"
															onClick={() => {
																const blob =
																	new Blob(
																		[
																			decodeBase64File(
																				file.content
																			),
																		],
																		{
																			type: "text/plain",
																		}
																	);
																const url =
																	URL.createObjectURL(
																		blob
																	);
																const a =
																	document.createElement(
																		"a"
																	);
																a.href = url;
																a.download =
																	file.name;
																document.body.appendChild(
																	a
																);
																a.click();
																document.body.removeChild(
																	a
																);
																URL.revokeObjectURL(
																	url
																);
															}}
														>
															<Download className="h-4 w-4" />
															Download
														</Button>
													</div>
												</DialogContent>
											</Dialog>
										</div>
									</div>
									<div className="overflow-hidden max-h-[200px] relative">
										<div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
										<CodeOutput
											data={decodeBase64File(
												file.content
											)}
										/>
									</div>
								</div>
							))
						) : (
							<p className="text-muted-foreground italic">
								No files submitted
							</p>
						)}
					</div>
				);
			default:
				return <p>Unsupported answer type: {answer.type}</p>;
		}
	};

	return (
		<Card className="shadow-sm">
			<CardHeader className="pb-3 flex flex-row justify-between items-center border-b">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center bg-slate-100 w-8 h-8 rounded-full">
						<CardTitle className="text-sm font-bold">
							{questionNumber}
						</CardTitle>
					</div>
					<Badge
						variant="outline"
						className="capitalize text-xs px-2 py-0.5"
					>
						{answer.type}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pt-4">{renderAnswerContent()}</CardContent>
		</Card>
	);
}
