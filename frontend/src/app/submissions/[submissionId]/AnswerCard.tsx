"use client";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import TableDisplay from "@/components/problem/TableDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, LinkIcon, Maximize2, Download } from "lucide-react";
import CodeOutput from "@/components/CodeOutput";
import ZoomableImage from "@/components/ZoomableImage";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { Question } from "@/lib/questions";
import { SubmissionAnswer } from "./ReviewClient";

// Function to process markdown content
const processMarkdown = (content: string) => {
	const processedContent = content.replace(/<br\/>/g, "\n\n");
	return processedContent.split(/(```[^`]*```)/g);
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

// AnswerCard component for displaying individual answers
export default function AnswerCard({
	answer,
	questionNumber,
	question,
}: {
	answer: SubmissionAnswer;
	questionNumber: number;
	question: Question;
}) {
	const renderAnswerContent = () => {
		const status = answer.status;

		switch (answer.type) {
			case "multichoice":
				return (
					<div
						className={cn(
							"p-4 rounded-lg",
							status === "correct"
								? "bg-green-50"
								: status === "incorrect"
								? "bg-red-50"
								: status === "partial"
								? "bg-yellow-50"
								: "bg-gray-50"
						)}
					>
						<p
							className={cn(
								"font-medium mb-2",
								status === "correct"
									? "text-green-700"
									: status === "incorrect"
									? "text-red-700"
									: status === "partial"
									? "text-yellow-700"
									: "text-gray-700"
							)}
						>
							{status === "correct"
								? "✓ Correct"
								: status === "incorrect"
								? "✗ Incorrect"
								: status === "partial"
								? "◑ Partial"
								: "Not submitted"}
						</p>
						<div className="mt-2">
							<div
								className={cn(
									"text-sm",
									status === "correct"
										? "text-green-600"
										: status === "incorrect"
										? "text-red-600"
										: status === "partial"
										? "text-yellow-600"
										: "text-gray-600"
								)}
							>
								<span>Your answer:</span>
								{Array.isArray(answer.answer) ? (
									<span className="flex flex-wrap gap-1 mt-1">
										{answer.answer.map((choice, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{choice.trim()}
											</Badge>
										))}
									</span>
								) : (
									typeof answer.answer === 'string' && answer.answer.includes(',') ? (
										<span className="flex flex-wrap gap-1 mt-1">
											{answer.answer.split(',').map((choice, index) => (
												<Badge key={index} variant="outline" className="text-xs">
													{choice.trim()}
												</Badge>
											))}
										</span>
									) : (
										<span>{answer.answer}</span>
									)
								)}
							</div>
						</div>
						{status === "incorrect" && (
							<p className="text-sm mt-3 text-red-600">
								Please review the correct option for this
								question.
							</p>
						)}
						{status === "partial" && (
							<p className="text-sm mt-3 text-yellow-600">
								Your solution is partially correct. Review the feedback to improve.
							</p>
						)}
					</div>
				);

			case "python":
			case "sql":
			case "pandas":
				return (
					<div
						className={cn(
							"p-4 rounded-lg",
							status === "correct"
								? "bg-green-50"
								: status === "incorrect"
								? "bg-red-50"
								: status === "partial"
								? "bg-yellow-50"
								: "bg-gray-50"
						)}
					>
						<p
							className={cn(
								"font-medium mb-2",
								status === "correct"
									? "text-green-700"
									: status === "incorrect"
									? "text-red-700"
									: status === "partial"
									? "text-yellow-700"
									: "text-gray-700"
							)}
						>
							{status === "correct"
								? "✓ Correct"
								: status === "incorrect"
								? "✗ Incorrect"
								: status === "partial"
								? "◑ Partial"
								: "Not submitted"}
						</p>
						<div className="mt-2">
							<div
								className={cn(
									"text-sm mb-2",
									status === "correct"
										? "text-green-600"
										: status === "incorrect"
										? "text-red-600"
										: status === "partial"
										? "text-yellow-600"
										: "text-gray-600"
								)}
							>
								Your submission:
							</div>
							<pre
								className={cn(
									"p-3 rounded-lg overflow-x-auto text-sm font-mono",
									status === "correct"
										? "bg-green-100 border border-green-200"
										: status === "incorrect"
										? "bg-red-100 border border-red-200"
										: status === "partial"
										? "bg-yellow-100 border border-yellow-200"
										: "bg-gray-100 border border-gray-200"
								)}
							>
								<code>{Array.isArray(answer.answer) ? answer.answer.join('\n') : answer.answer}</code>
							</pre>
						</div>
						{status === "incorrect" && (
							<p className="text-sm mt-3 text-red-600">
								Check your logic and try to identify any errors
								in your code.
							</p>
						)}
						{status === "partial" && (
							<p className="text-sm mt-3 text-yellow-600">
								Your solution is partially correct. Review the feedback to improve.
							</p>
						)}
					</div>
				);

			case "file":
				return (
					<div
						className={cn(
							"p-4 rounded-lg",
							status === "correct"
								? "bg-green-50"
								: status === "incorrect"
								? "bg-red-50"
								: status === "partial"
								? "bg-yellow-50"
								: "bg-gray-50"
						)}
					>
						<p
							className={cn(
								"font-medium mb-2",
								status === "correct"
									? "text-green-700"
									: status === "incorrect"
									? "text-red-700"
									: status === "partial"
									? "text-yellow-700"
									: "text-gray-700"
							)}
						>
							{status === "correct"
								? "✓ Correct"
								: status === "incorrect"
								? "✗ Incorrect"
								: status === "partial"
								? "◑ Partial"
								: "Not submitted"}
						</p>
						<div className="mt-2">
							<p
								className={cn(
									"text-sm mb-2",
									status === "correct"
										? "text-green-600"
										: status === "incorrect"
										? "text-red-600"
										: status === "partial"
										? "text-yellow-600"
										: "text-gray-600"
								)}
							>
								Your uploaded files:
							</p>
							<div
								className={cn(
									"p-3 rounded-lg",
									status === "correct"
										? "bg-green-100 border border-green-200"
										: status === "incorrect"
										? "bg-red-100 border border-red-200"
										: status === "partial"
										? "bg-yellow-100 border border-yellow-200"
										: "bg-gray-100 border border-gray-200"
								)}
							>
								{answer.files?.length ? (
									<ul className="space-y-3">
										{answer.files.map((file, idx) => (
											<li
												key={idx}
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
															{(
																file.size / 1024
															).toFixed(1)}{" "}
															KB
														</Badge>
														<Dialog>
															<DialogTrigger
																asChild
															>
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
																		{
																			file.name
																		}
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
																			a.href =
																				url;
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
											</li>
										))}
									</ul>
								) : (
									<p className="text-sm text-gray-500">
										No files submitted
									</p>
								)}
							</div>
						</div>
					</div>
				);

			default:
				if (answer.links && answer.links.length > 0) {
					return (
						<div
							className={cn(
								"p-4 rounded-lg",
								status === "correct"
									? "bg-green-50"
									: status === "incorrect"
									? "bg-red-50"
									: status === "partial"
									? "bg-yellow-50"
									: "bg-gray-50"
							)}
						>
							<p
								className={cn(
									"font-medium mb-2",
									status === "correct"
										? "text-green-700"
										: status === "incorrect"
										? "text-red-700"
										: status === "partial"
										? "text-yellow-700"
										: "text-gray-700"
								)}
							>
								{status === "correct"
									? "✓ Correct"
									: status === "incorrect"
									? "✗ Incorrect"
									: status === "partial"
									? "◑ Partial"
									: "Not submitted"}
							</p>
							<div className="mt-2">
								<p
									className={cn(
										"text-sm mb-2",
										status === "correct"
											? "text-green-600"
											: status === "incorrect"
											? "text-red-600"
											: status === "partial"
											? "text-yellow-600"
											: "text-gray-600"
									)}
								>
									Your submitted links:
								</p>
								<div className="space-y-3">
									{answer.links.map((link) => (
										<div
											key={link.url}
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
									))}
								</div>
							</div>
						</div>
					);
				}

				return <p>Unsupported answer type: {answer.type}</p>;
		}
	};

	const renderQuestionContent = () => {
		const parts = processMarkdown(question.question);

		return (
			<div className="prose dark:prose-invert max-w-none mb-6">
				{parts.map((part, idx) => {
					if (!part.startsWith("```")) {
						return (
							<ReactMarkdown
								key={idx}
								components={{
									img: ({ src }) =>
										src && <ZoomableImage src={src} />,
									code: ({ children }) => (
										<code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm">
											{children}
										</code>
									),
								}}
							>
								{part}
							</ReactMarkdown>
						);
					} else {
						return (
							<pre
								key={idx}
								className="bg-zinc-950 text-zinc-50 p-4 rounded-lg my-4"
							>
								<code>
									{part
										.replace(/```/g, "")
										.replace("...", "")
										.trim()}
								</code>
							</pre>
						);
					}
				})}
				{question.tableData && (
					<TableDisplay tableData={question.tableData} />
				)}
			</div>
		);
	};

	const status = answer.status;

	return (
		<Card
			className={cn(
				"shadow-sm",
				status === "correct"
					? "border-green-200"
					: status === "incorrect"
					? "border-red-200"
					: status === "partial"
					? "border-yellow-200"
					: "border-gray-200"
			)}
		>
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
						{answer.type.toUpperCase()}
					</Badge>
					{/* <span
						className={cn(
							"text-sm px-2 py-1 rounded-full",
							status === "correct"
								? "bg-green-100 text-green-700"
								: status === "incorrect"
								? "bg-red-100 text-red-700"
								: status === "partial"
								? "bg-yellow-100 text-yellow-700"
								: "bg-gray-100 text-gray-700"
						)}
					>
						{status === "correct"
							? "+10 points"
							: status === "incorrect"
							? "0 points"
							: "Not submitted"}
					</span> */}
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				{renderQuestionContent()}
				{renderAnswerContent()}
			</CardContent>
		</Card>
	);
}
