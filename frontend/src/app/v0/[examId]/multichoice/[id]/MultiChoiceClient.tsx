"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import ZoomableImage from "@/components/ZoomableImage";
import { Checkbox } from "@/components/ui/checkbox";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { ExamContent } from "@/lib/questions";
import { cn } from "@/lib/utils";

const processMarkdown = (content: string) => {
	const processedContent = content.replace(/<br\/>/g, "\n\n");
	return processedContent.split(/(```[^`]*```)/g);
};

export default function MultiChoiceClient({
	data,
	examId,
	initialQuestionId,
}: {
	data: ExamContent;
	examId: string;
	initialQuestionId: number;
}) {
	const router = useRouter();
	const [id, setId] = useState(initialQuestionId);
	const [selectedOption, setSelectedOption] = useState<string>("");
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [answeredQuestions, setAnsweredQuestions] = useState<{
		[questionId: number]: string | string[];
	}>({});
	const [showSummary, setShowSummary] = useState(false);

	const currentQuestion = data.content[id - 1];
	const totalQuestions = data.content.length;
	const { toast, dismiss } = useToast();

	const isMultipleSelectionQuestion =
		currentQuestion?.resultType === "MULTICHOICE_MANY";

	useEffect(() => {
		if (id < data.content.length) {
			router.prefetch(`/v0/${examId}/multichoice/${id + 1}`);
		}
	}, [id, data.content.length, examId, router]);

	const handleSubmit = useCallback(() => {
		if (isMultipleSelectionQuestion) {
			if (selectedOptions.length === 0) {
				toast({
					description: "Please select at least one option",
					className: "bg-yellow-100 text-yellow-900 border-none",
				});
				return;
			}

			const newAnswers = {
				...answeredQuestions,
				[id]: selectedOptions.sort(), // Sort to maintain alphabetical order
			};

			setAnsweredQuestions(newAnswers);
			localStorage.setItem(
				"multichoiceAnswers",
				JSON.stringify(newAnswers)
			);
		} else {
			if (!selectedOption) {
				toast({
					description: "Please choose an option",
					className: "bg-yellow-100 text-yellow-900 border-none",
				});
				return;
			}

			const newAnswers = {
				...answeredQuestions,
				[id]: selectedOption,
			};

			setAnsweredQuestions(newAnswers);
			localStorage.setItem(
				"multichoiceAnswers",
				JSON.stringify(newAnswers)
			);
		}

		if (id < data.content.length) {
			setId(id + 1);
			router.replace(`/v0/${examId}/multichoice/${id + 1}`, {
				scroll: false,
			});
		}
	}, [
		selectedOption,
		selectedOptions,
		answeredQuestions,
		id,
		data.content.length,
		examId,
		router,
		toast,
		isMultipleSelectionQuestion,
	]);

	useEffect(() => {
		const savedAnswers = localStorage.getItem("multichoiceAnswers");
		if (savedAnswers) {
			setAnsweredQuestions(JSON.parse(savedAnswers));
		}
	}, []);

	useEffect(() => {
		if (answeredQuestions[id]) {
			const answer = answeredQuestions[id];
			if (Array.isArray(answer)) {
				setSelectedOptions(answer.sort()); // Sort to maintain alphabetical order
				setSelectedOption("");
			} else {
				setSelectedOption(answer);
				setSelectedOptions([]);
			}
		} else {
			setSelectedOption("");
			setSelectedOptions([]);
		}
	}, [id, answeredQuestions]);

	useEffect(() => {
		if (id > data.content.length || id < 1) {
			router.push(`/v0/${examId}/multichoice/1`);
		}
	}, [id, data.content.length, examId, router]);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (!currentQuestion?.choices) return;

			const key = event.key.toLowerCase();
			if (["a", "b", "c", "d", "e", "f", "g", "h"].includes(key)) {
				const index = key.charCodeAt(0) - "a".charCodeAt(0);
				if (index < currentQuestion.choices.length) {
					if (isMultipleSelectionQuestion) {
						// Toggle the option for multichoice_many
						setSelectedOptions((prev) => {
							const optionId = key;
							if (prev.includes(optionId)) {
								return prev.filter((item) => item !== optionId);
							} else {
								return [...prev, optionId].sort(); // Sort to maintain alphabetical order
							}
						});
					} else {
						// For single choice questions, toggle selection
						const choice = currentQuestion.choices[index];
						setSelectedOption((prevOption) =>
							prevOption === choice ? "" : choice
						);
					}
				}
			}
			if (event.key === "Enter") {
				handleSubmit();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [currentQuestion, handleSubmit, isMultipleSelectionQuestion]);

	const handleReset = () => {
		const newAnswers = { ...answeredQuestions };
		delete newAnswers[id];
		setAnsweredQuestions(newAnswers);
		setSelectedOption("");
		setSelectedOptions([]);
		localStorage.setItem("multichoiceAnswers", JSON.stringify(newAnswers));
	};

	const handlePageChange = (pageNumber: number) => {
		setId(pageNumber);
		router.replace(`/v0/${examId}/multichoice/${pageNumber}`, {
			scroll: false,
		});
	};

	const handleShowSummary = () => {
		setShowSummary(true);
	};

	const handleFinishSection = () => {
		toast({
			title: "Warning",
			description:
				"Once you proceed, you won't be able to return and edit your answers in this section. Do you want to continue?",
			className:
				"bg-yellow-100 text-yellow-900 border-none fixed top-4 left-1/2 -translate-x-1/2 w-[500px]",
			action: (
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							dismiss();
							router.push(`/v0/${examId}/problem`);
						}}
					>
						Yes
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setShowSummary(false);
							dismiss();
						}}
					>
						No
					</Button>
				</div>
			),
		});
	};

	const toggleOption = (option: string, index: number) => {
		const optionId = String.fromCharCode(97 + index); // Convert index to a, b, c, etc.
		setSelectedOptions((prev) => {
			if (prev.includes(optionId)) {
				return prev.filter((item) => item !== optionId);
			} else {
				return [...prev, optionId].sort(); // Sort to maintain alphabetical order
			}
		});
	};

	const parts = processMarkdown(currentQuestion.question);

	return (
		<div className="w-[80vw] h-[calc(100vh-2rem)] rounded-lg shadow-sm border p-6 mx-auto flex min-h-0">
			{currentQuestion ? (
				<div className="flex gap-4 w-full h-full">
					<div className="w-[80%] flex flex-col gap-4 h-full min-h-0">
						<div className="flex-1 min-h-0 bg-white rounded-lg overflow-y-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
							<h2 className="text-xl font-semibold mb-2">
								Question {id}
							</h2>
							<div className="prose dark:prose-invert pr-2">
								{parts.map((part, index) => {
									if (!part.startsWith("```")) {
										return (
											<ReactMarkdown
												key={index}
												className="my-2"
												components={{
													strong: ({ children }) => (
														<span className="font-bold text-primary">
															{children}
														</span>
													),
													blockquote: ({
														children,
													}) => (
														<blockquote className="border-l-4 border-primary/50 pl-4 italic my-2">
															{children}
														</blockquote>
													),
													code: ({ children }) => (
														<code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm">
															{children}
														</code>
													),
													img: ({ src }) =>
														src && (
															<ZoomableImage
																src={src}
															/>
														),
													em: ({ children }) => (
														<em className="not-italic my-2">
															{children}
														</em>
													),
													ul: ({ children }) => (
														<ul className="list-disc pl-6 space-y-2 my-2">
															{children}
														</ul>
													),
													p: ({ children }) => (
														<p className="my-2">
															{children}
														</p>
													),
												}}
											>
												{part}
											</ReactMarkdown>
										);
									} else {
										return (
											<pre
												key={index}
												className={cn(
													"bg-zinc-950 text-zinc-50 p-4 rounded-lg my-4",
													"font-mono text-sm overflow-x-auto",
													"border border-border"
												)}
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
							</div>
						</div>

						{currentQuestion.choices && (
							<div className="bg-white rounded-lg p-4 overflow-y-auto">
								<div className="text-sm text-muted-foreground mb-2">
									Press any keys to select/deselect • Press
									Enter to submit
								</div>

								{isMultipleSelectionQuestion ? (
									<div
										className={cn(
											"grid gap-2",
											currentQuestion.choices.length > 4
												? "grid-cols-2"
												: "grid-cols-1"
										)}
									>
										{currentQuestion.choices.map(
											(choice, index) => (
												<div
													key={choice}
													className="flex items-center space-x-2"
												>
													<Checkbox
														id={`checkbox-${choice}`}
														checked={selectedOptions.includes(
															String.fromCharCode(
																97 + index
															)
														)}
														onChange={() =>
															toggleOption(
																choice,
																index
															)
														}
													/>
													<Label
														htmlFor={`checkbox-${choice}`}
														className="text-base"
													>
														<ReactMarkdown>
															{choice}
														</ReactMarkdown>
													</Label>
												</div>
											)
										)}
									</div>
								) : (
									<RadioGroup
										value={selectedOption}
										onValueChange={setSelectedOption}
										className={cn(
											"grid gap-2",
											currentQuestion.choices.length > 4
												? "grid-cols-2"
												: "grid-cols-1"
										)}
									>
										{currentQuestion.choices.map(
											(choice, index) => (
												<div
													key={choice}
													className="flex items-center space-x-2"
												>
													<RadioGroupItem
														value={choice}
														id={choice}
													/>
													<Label
														htmlFor={choice}
														className="text-base"
													>
														<ReactMarkdown>
															{choice}
														</ReactMarkdown>
													</Label>
												</div>
											)
										)}
									</RadioGroup>
								)}
							</div>
						)}
					</div>

					<div className="w-[20%] bg-white rounded-lg p-4 flex flex-col gap-4">
						<div className="p-2 bg-muted rounded-sm text-center">
							<p className="text-sm text-muted-foreground">
								Question {id} of {totalQuestions} <br />(
								{Object.keys(answeredQuestions).length}{" "}
								answered)
							</p>
						</div>

						<div className="flex-1 overflow-y-auto">
							<div className="grid grid-cols-3 gap-2">
								{Array.from(
									{ length: totalQuestions },
									(_, i) => i + 1
								).map((pageNumber) => (
									<div
										key={pageNumber}
										onClick={() =>
											handlePageChange(pageNumber)
										}
										className={`
                      relative p-2 rounded text-center cursor-pointer
                      ${
							pageNumber === id
								? "bg-primary text-primary-foreground"
								: "hover:bg-muted"
						}
                      ${
							answeredQuestions[pageNumber]
								? 'after:content-["●"] after:absolute after:text-[8px] after:text-green-500 after:top-0 after:right-1'
								: ""
						}
                    `}
									>
										{pageNumber}
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col gap-2">
							<Button
								variant="outline"
								onClick={handleReset}
								className="w-full"
							>
								Reset
							</Button>
							<Button onClick={handleSubmit} className="w-full">
								Save
							</Button>
							{Object.keys(answeredQuestions).length ===
								data.content.length && (
								<Button
									onClick={handleShowSummary}
									variant="success"
								>
									Complete
								</Button>
							)}
						</div>
					</div>

					{showSummary && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
							<div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
								<h2 className="text-2xl font-bold mb-4">
									Summary
								</h2>
								<div className="space-y-4">
									{data.content.map((question, index) => (
										<div
											key={index + 1}
											className="border-b pb-2"
										>
											<p className="font-semibold">
												Question {index + 1}:
											</p>
											<p className="text-gray-600">
												Selected:{" "}
												{Array.isArray(
													answeredQuestions[index + 1]
												)
													? `${(
															answeredQuestions[
																index + 1
															] as string[]
													  ).join(", ")}`
													: answeredQuestions[
															index + 1
													  ] || "Not answered"}
											</p>
										</div>
									))}
								</div>
								<div className="flex gap-2 mt-4">
									<Button
										variant="outline"
										onClick={() => setShowSummary(false)}
									>
										Close
									</Button>
									<Button
										onClick={handleFinishSection}
										variant="success"
									>
										Finish multiple choices section
									</Button>
								</div>
							</div>
						</div>
					)}

					<Toaster />
				</div>
			) : (
				<div className="flex justify-center items-center h-screen">
					Question not found
				</div>
			)}
		</div>
	);
}
