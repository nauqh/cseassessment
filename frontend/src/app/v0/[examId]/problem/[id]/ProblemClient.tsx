"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import {
	BiHelpCircle,
	BiBarChartSquare,
	BiX,
	BiUpload,
	BiLinkAlt,
	BiPlus,
	BiEdit,
	BiCodeBlock,
	BiCalendar,
} from "react-icons/bi";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import ProblemDescription from "@/components/problem/ProblemDescription";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ExamContent } from "@/lib/questions";
import CodeOutput from "@/components/CodeOutput";
import { EditorView } from "@codemirror/view";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SqliteTutorialContent from "@/content/problem/SqliteTutorialContent";

type OutputType = {
	output: Record<string, string>[] | string;
	language: string;
};

type FileData = {
	name: string;
	size: number;
	type: string;
	content: string;
};

type LinkData = {
	id: string;
	url: string;
	description: string;
	type: "github" | "codepen" | "jsfiddle" | "replit" | "other";
	addedAt: number;
};

export default function ProblemClient({
	data,
	examId,
	initialProblemId,
}: {
	data: ExamContent;
	examId: string;
	initialProblemId: number;
}) {
	const { toast } = useToast();
	const router = useRouter();
	const editorRef = useRef<{ view?: EditorView }>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const linkInputRef = useRef<HTMLInputElement>(null);
	const [code, setCode] = useState<string>("");
	const [output, setOutput] = useState<OutputType>({
		output: "",
		language: "",
	});
	const [language, setLanguage] = useState(data.language);
	const [currentPage, setCurrentPage] = useState(initialProblemId);
	const [answeredProblems, setAnsweredProblems] = useState<{
		[problemId: number]: {
			code: string;
			language: string;
			files?: FileData[];
			links?: LinkData[];
		};
	}>({});
	const [showSummary, setShowSummary] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
	const [submittedLinks, setSubmittedLinks] = useState<LinkData[]>([]);
	const [currentLink, setCurrentLink] = useState("");
	const [currentLinkDescription, setCurrentLinkDescription] = useState("");
	const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(
		null
	);

	useEffect(() => {
		const savedAnswers = localStorage.getItem("problemAnswers");
		if (savedAnswers) {
			setAnsweredProblems(JSON.parse(savedAnswers));
		}
	}, []);

	useEffect(() => {
		if (currentPage > data.content.length || currentPage < 1) {
			router.push(`/v0/${examId}/problem/1`);
		}
	}, [currentPage, data.content.length, examId, router]);

	useEffect(() => {
		if (answeredProblems[currentPage]) {
			setCode(answeredProblems[currentPage].code);
			setLanguage(answeredProblems[currentPage].language);
			setUploadedFiles(answeredProblems[currentPage].files || []);
			setSubmittedLinks(answeredProblems[currentPage].links || []);
		} else {
			setCode("");
			setUploadedFiles([]);
			setSubmittedLinks([]);
		}
	}, [currentPage, answeredProblems, data.language]);

	const currentProblem = data.content[currentPage - 1];

	// Add prefetching for next problem
	useEffect(() => {
		if (currentPage < data.content.length) {
			router.prefetch(`/v0/${examId}/problem/${currentPage + 1}`);
		}
	}, [currentPage, data.content.length, examId, router]);

	// Update page change handler for client-side navigation
	const handlePageChange = useCallback(
		(page: number) => {
			setCurrentPage(page);
			router.replace(`/v0/${examId}/problem/${page}`, {
				scroll: false,
			});
		},
		[router, examId]
	);

	const handleCodeChange = useCallback((value: string) => {
		setCode(value);
	}, []);

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);

			if (uploadedFiles.length + files.length > 3) {
				toast({
					description: "Maximum 3 files allowed per problem",
					className: "bg-yellow-100 text-yellow-900 border-none",
					duration: 3000,
				});
				return;
			}

			// Process each file
			files.forEach((file) => {
				const reader = new FileReader();
				reader.onload = (event) => {
					if (event.target && event.target.result) {
						const newFile: FileData = {
							name: file.name,
							size: file.size,
							type: file.type,
							content: event.target.result as string,
						};

						setUploadedFiles((prev) => [...prev, newFile]);
					}
				};
				reader.readAsDataURL(file);
			});

			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const removeFile = (index: number) => {
		setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleRunCode = useCallback(async () => {
		try {
			setOutput({ output: "Executing...", language });
			const response = await fetch(
				"https://cseassessment.up.railway.app/execute",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						code: code,
						language: language,
						database:
							examId === "M11"
								? "northwind"
								: examId === "M12"
								? "chinook"
								: null,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setOutput({ output: `Error: ${errorData.detail}`, language });
				return;
			}

			const data = await response.json();
			setOutput({ output: data.output, language });
		} catch (error) {
			setOutput({
				output: "Error connecting to the server. Please try again.",
				language,
			});
		}
	}, [code, language, examId]);

	// Update submit handler for client-side navigation
	const handleSubmit = useCallback(() => {
		if (language !== "link" && language !== "file" && !code.trim()) {
			toast({
				description: "Please write some code before submitting",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 3000,
			});
			return;
		}

		if (
			language === "link" &&
			submittedLinks.length === 0 &&
			!currentLink
		) {
			toast({
				description: "Please add at least one link before submitting",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 3000,
			});
			return;
		}

		if (language === "file" && uploadedFiles.length === 0) {
			toast({
				description:
					"Please upload at least one file before submitting",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 3000,
			});
			return;
		}

		// If there's a pending link, add it before submitting
		if (language === "link" && currentLink && isValidUrl(currentLink)) {
			handleAddLink();
		}

		const newAnswers = {
			...answeredProblems,
			[currentPage]: {
				code,
				language,
				files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
				links: submittedLinks.length > 0 ? submittedLinks : undefined,
			},
		};

		setAnsweredProblems(newAnswers);
		localStorage.setItem("problemAnswers", JSON.stringify(newAnswers));

		if (currentPage < data.content.length) {
			setCurrentPage(currentPage + 1);
			router.replace(`/v0/${examId}/problem/${currentPage + 1}`, {
				scroll: false,
			});
		}
	}, [
		code,
		language,
		currentPage,
		answeredProblems,
		data.content.length,
		examId,
		router,
		toast,
		uploadedFiles,
		submittedLinks,
		currentLink,
	]);

	const handleReset = () => {
		const newAnswers = { ...answeredProblems };
		delete newAnswers[currentPage];
		setAnsweredProblems(newAnswers);
		setCode("");
		setOutput({ output: "", language });
		setUploadedFiles([]);
		setSubmittedLinks([]);
		setCurrentLink("");
		setCurrentLinkDescription("");
		setEditingLinkIndex(null);
		localStorage.setItem("problemAnswers", JSON.stringify(newAnswers));
	};

	// Function to detect link type based on URL
	const detectLinkType = (
		url: string
	): "github" | "codepen" | "jsfiddle" | "replit" | "other" => {
		if (!url) return "other";

		if (url.includes("github.com")) return "github";
		if (url.includes("codepen.io")) return "codepen";
		if (url.includes("jsfiddle.net")) return "jsfiddle";
		if (url.includes("replit.com")) return "replit";

		return "other";
	};

	// Function to validate URL
	const isValidUrl = (url: string): boolean => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	// Handle link input keydown for Enter key
	const handleLinkKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleAddLink();
		}
	};

	// Handle adding or updating a link
	const handleAddLink = () => {
		if (!currentLink) {
			toast({
				description: "Please enter a valid URL",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 3000,
			});
			return;
		}

		if (!isValidUrl(currentLink)) {
			toast({
				description:
					"Please enter a valid URL format (e.g., https://example.com)",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 3000,
			});
			return;
		}

		if (submittedLinks.length >= 3 && editingLinkIndex === null) {
			toast({
				description: "Maximum 3 links allowed per problem",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 3000,
			});
			return;
		}

		if (editingLinkIndex !== null) {
			// Update existing link
			const updatedLinks = [...submittedLinks];
			updatedLinks[editingLinkIndex] = {
				...updatedLinks[editingLinkIndex],
				url: currentLink,
				description: currentLinkDescription,
				type: detectLinkType(currentLink),
			};
			setSubmittedLinks(updatedLinks);
		} else {
			// Add new link
			const newLink: LinkData = {
				id: Date.now().toString(),
				url: currentLink,
				description: currentLinkDescription,
				type: detectLinkType(currentLink),
				addedAt: Date.now(),
			};
			setSubmittedLinks([...submittedLinks, newLink]);
		}

		// Reset form
		setCurrentLink("");
		setCurrentLinkDescription("");
		setEditingLinkIndex(null);

		// Also update code state with the URLs to maintain backward compatibility
		const urlsText = [...submittedLinks, { url: currentLink }]
			.map((link) => link.url)
			.join("\n");
		setCode(urlsText);
	};

	// Function to edit a link
	const handleEditLink = (index: number) => {
		const link = submittedLinks[index];
		setCurrentLink(link.url);
		setCurrentLinkDescription(link.description);
		setEditingLinkIndex(index);
	};

	// Function to remove a link
	const handleRemoveLink = (index: number) => {
		const updatedLinks = submittedLinks.filter((_, i) => i !== index);
		setSubmittedLinks(updatedLinks);

		// Also update code state with the remaining URLs
		const urlsText = updatedLinks.map((link) => link.url).join("\n");
		setCode(urlsText);
	};

	// Link icon mapping
	const getLinkIcon = (type: LinkData["type"]) => {
		switch (type) {
			case "github":
				return "🔗 GitHub";
			case "codepen":
				return "🖌️ CodePen";
			case "jsfiddle":
				return "📝 JSFiddle";
			case "replit":
				return "💻 Replit";
			default:
				return "🔗 Link";
		}
	};

	const handleFinishSection = () => {
		router.push(`/v0/${examId}/final`);
	};

	// Add keyboard event listener for editor focus
	useEffect(() => {
		const handleGlobalKeyPress = (event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement
			) {
				return;
			}

			if (editorRef.current?.view) {
				editorRef.current.view.focus();
			}
		};

		window.addEventListener("keydown", handleGlobalKeyPress);
		return () => {
			window.removeEventListener("keydown", handleGlobalKeyPress);
		};
	}, []);

	// Custom keymap to override Shift+Enter and Ctrl+Enter behavior
	const customKeymap = useCallback(() => {
		return Prec.highest(
			keymap.of([
				{
					key: "Shift-Enter",
					preventDefault: true,
					run: () => {
						handleSubmit();
						return true;
					},
				},
				{
					key: "Mod-Enter", // Mod is Ctrl on Windows/Linux and Cmd on Mac
					preventDefault: true,
					run: () => {
						handleRunCode();
						return true;
					},
				},
			])
		);
	}, [handleSubmit, handleRunCode]);

	// Add memoization for code output
	const memoizedOutput = React.useMemo(
		() => <CodeOutput data={output.output} />,
		[output.output]
	);

	return (
		<div className="p-6 h-[100vh] w-full">
			<ResizablePanelGroup direction="horizontal">
				{/* Problem description panel */}
				<ResizablePanel defaultSize={50} minSize={30}>
					<div className="h-full flex flex-col border rounded-sm justify-between">
						<Tabs
							defaultValue="description"
							className="overflow-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100"
						>
							<TabsList 
								className={`grid w-full ${["M12", "M11"].includes(examId) ? "grid-cols-3" : examId === "M31" ? "grid-cols-2" : "grid-cols-1"} bg-gray-50 rounded-none sticky top-0 z-10`}
							>
								<TabsTrigger
									value="description"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiHelpCircle className="w-4 h-4" />
									Description
								</TabsTrigger>
								{["M12", "M11"].includes(examId) && (
									<TabsTrigger
										value="erd"
										className="hover:bg-gray-100 flex items-center gap-2"
									>
										<BiBarChartSquare className="w-4 h-4" />
										ERD
									</TabsTrigger>
								)}
								{["M12", "M11"].includes(examId) && (
									<TabsTrigger
										value="sqlite"
										className="hover:bg-gray-100 flex items-center gap-2"
									>
										<BiCalendar className="w-4 h-4" />
										Date Format
									</TabsTrigger>
								)}
								{language === "pandas" && (
									<TabsTrigger
										value="notebook"
										className="hover:bg-gray-100 flex items-center gap-2"
									>
										<BiCodeBlock className="w-4 h-4" />
										Notebook
									</TabsTrigger>
								)}
								{/* <TabsTrigger
									value="discussion"
									className="hover:bg-gray-100 flex items-center gap-2"
								>
									<BiMessageRoundedDots className="w-4 h-4" />
									Discussion
								</TabsTrigger> */}
							</TabsList>
							<ProblemDescription
								name="description"
								content={currentProblem?.question}
								questionNumber={currentPage}
								{...(currentProblem?.tableData && {
									tableData: currentProblem.tableData,
								})}
							/>
							{examId === "M11" && (
								<ProblemDescription
									name="erd"
									erdImageUrl="/northwinderd.svg"
									erdName="Northwind"
								/>
							)}
							{examId === "M12" && (
								<ProblemDescription
									name="erd"
									erdImageUrl="/chinookerd.svg"
									erdName="Chinook"
								/>
							)}
							{["M12", "M11"].includes(examId) && (
								<ProblemDescription
									name="sqlite"
								/>
							)}
							{language === "pandas" && (
								<ProblemDescription
									name="notebook"
									notebookUrl="https://colab.research.google.com/drive/1Lsw2XMMMRqfqzTs2aid00BllhuUOfkWc?usp=sharing"
								/>
							)}
							{/* <ProblemDescription name="discussion" /> */}
						</Tabs>
						<div className="flex items-center justify-center gap-2 p-2 border-b">
							{Array.from(
								{ length: data.content.length },
								(_, i) => i + 1
							).map((page) => (
								<button
									key={page}
									onClick={() => handlePageChange(page)}
									className={`
                                        w-8 h-8 rounded-sm flex items-center justify-center relative
                                        ${
											currentPage === page
												? "bg-primary text-primary-foreground"
												: "hover:bg-muted"
										}
                                        ${
											answeredProblems[page]
												? 'after:content-["●"] after:absolute after:text-[8px] after:text-green-500 after:top-0 after:right-1'
												: ""
										}
                                    `}
								>
									{page}
								</button>
							))}
						</div>
					</div>
				</ResizablePanel>

				<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />

				{/* Code editor and output panel */}
				<ResizablePanel defaultSize={50} minSize={30}>
					<ResizablePanelGroup
						direction="vertical"
						className="h-full flex flex-col border rounded-sm"
					>
						{/* Code editor panel */}
						<ResizablePanel
							defaultSize={65}
							minSize={10}
							className="flex-1 overflow-hidden flex flex-col"
						>
							<div className="flex items-center justify-between p-2 border-b bg-gray-50">
								<div className="flex items-center gap-4">
									<h1 className="text-lg font-semibold">
										Input
									</h1>

									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<kbd className="px-1.5 py-0.5 text-xs rounded bg-gray-100 border border-gray-200">
												⌘/Ctrl+Enter
											</kbd>
											<span>to run code</span>
										</div>
										<div className="flex items-center gap-1">
											<kbd className="px-1.5 py-0.5 text-xs rounded bg-gray-100 border border-gray-200">
												Shift+Enter
											</kbd>
											<span>to submit</span>
										</div>
									</div>
								</div>
								<Select
									value={language}
									onValueChange={(value) => {
										setLanguage(value);
										setCode("");
									}}
								>
									<SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="python">
											Python
										</SelectItem>
										<SelectItem value="pandas">
											Pandas
										</SelectItem>
										<SelectItem value="sql">SQL</SelectItem>
										<SelectItem value="text">
											Text
										</SelectItem>
										<SelectItem value="link">
											Link
										</SelectItem>
										<SelectItem value="file">
											File
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="flex-1 overflow-auto">
								{language === "link" ? (
									<div className="p-4 h-full overflow-y-auto">
										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												{editingLinkIndex !== null
													? "Edit solution link:"
													: "Add solution link:"}
											</label>

											<div className="flex flex-col space-y-3">
												<div className="flex space-x-2">
													<Input
														ref={linkInputRef}
														type="url"
														value={currentLink}
														onChange={(e) =>
															setCurrentLink(
																e.target.value
															)
														}
														onKeyDown={
															handleLinkKeyDown
														}
														placeholder="https://example.com/your-solution"
														className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-primary"
													/>
													<Button
														onClick={handleAddLink}
														size="sm"
														className="whitespace-nowrap"
													>
														{editingLinkIndex !==
														null ? (
															<>
																<BiEdit className="mr-1 h-4 w-4" />{" "}
																Update
															</>
														) : (
															<>
																<BiPlus className="mr-1 h-4 w-4" />{" "}
																Add Link
															</>
														)}
													</Button>
												</div>

												<div>
													<label className="block text-xs font-medium text-gray-600 mb-1">
														Description (optional):
													</label>
													<Input
														type="text"
														value={
															currentLinkDescription
														}
														onChange={(e) =>
															setCurrentLinkDescription(
																e.target.value
															)
														}
														onKeyDown={
															handleLinkKeyDown
														}
														placeholder="Briefly describe what this link contains"
														className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary"
													/>
												</div>
											</div>

											<div className="mt-2 flex items-center">
												<BiLinkAlt className="h-4 w-4 text-gray-500 mr-1" />
												<p className="text-xs text-gray-500">
													Submit links to your
													solutions (GitHub, CodePen,
													JSFiddle, etc.). Maximum 3
													links per problem.
												</p>
											</div>

											{isValidUrl(currentLink) && (
												<div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-100">
													<p className="text-xs text-blue-600">
														Link type detected:{" "}
														<strong>
															{getLinkIcon(
																detectLinkType(
																	currentLink
																)
															)}
														</strong>
													</p>
												</div>
											)}
										</div>

										{/* Display submitted links */}
										{submittedLinks.length > 0 && (
											<div className="mt-6">
												<h3 className="text-sm font-medium text-gray-700 mb-2">
													Submitted Links (
													{submittedLinks.length}/3):
												</h3>
												<div className="space-y-3">
													{submittedLinks.map(
														(link, index) => (
															<div
																key={link.id}
																className="p-3 bg-gray-50 rounded-md border border-gray-200 shadow-sm transition hover:shadow-md"
															>
																<div className="flex items-center justify-between">
																	<div className="flex items-center">
																		<span className="text-sm font-medium mr-2">
																			{getLinkIcon(
																				link.type
																			)}
																		</span>
																	</div>
																	<div className="flex space-x-2">
																		<button
																			onClick={() =>
																				handleEditLink(
																					index
																				)
																			}
																			className="p-1 text-blue-500 rounded hover:bg-blue-50"
																			title="Edit this link"
																		>
																			<BiEdit className="h-4 w-4" />
																		</button>
																		<button
																			onClick={() =>
																				handleRemoveLink(
																					index
																				)
																			}
																			className="p-1 text-red-500 rounded hover:bg-red-50"
																			title="Remove this link"
																		>
																			<BiX className="h-4 w-4" />
																		</button>
																	</div>
																</div>

																<a
																	href={
																		link.url
																	}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-blue-600 hover:underline text-sm break-all mt-1 block"
																>
																	{link.url}
																</a>

																{link.description && (
																	<p className="mt-1 text-xs text-gray-600 italic">
																		"
																		{
																			link.description
																		}
																		"
																	</p>
																)}
															</div>
														)
													)}
												</div>
											</div>
										)}
									</div>
								) : language === "file" ? (
									<div className="p-4 h-full overflow-y-auto">
										<div className="mb-4">
											<label className="block text-sm font-medium text-gray-700 mb-2">
												Upload files
											</label>
											<div className="flex flex-col space-y-4">
												<div>
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
															<BiUpload className="h-4 w-4" />
															Files
														</span>
														<span className="text-xs text-gray-500">
															{
																uploadedFiles.length
															}
															/3 files
														</span>
													</div>
													<div className="border-2 border-dashed border-gray-300 rounded-md p-6 mt-2 text-center">
														<input
															ref={fileInputRef}
															type="file"
															accept=".java,.py,.js,.c,.cpp,.sql,.html,.css,.tsx,.jsx,.ts"
															multiple
															onChange={
																handleFileUpload
															}
															className="hidden"
														/>
														<div className="space-y-2">
															<BiUpload className="mx-auto h-10 w-10 text-gray-400" />
															<p className="text-sm text-gray-500">
																Drag and drop
																files, or{" "}
																<button
																	type="button"
																	onClick={() =>
																		fileInputRef.current?.click()
																	}
																	className="text-blue-500 hover:text-blue-700 font-medium"
																>
																	browse
																</button>
															</p>
															<p className="text-xs text-gray-400">
																Accepted
																formats: .java,
																.py, .js, .c,
																.cpp, .sql,
																.html, .css,
																.tsx, .jsx, .ts
															</p>
														</div>
													</div>
												</div>

												{/* Display uploaded files */}
												{uploadedFiles.length > 0 && (
													<div className="mt-4">
														<h3 className="text-sm font-medium text-gray-700 mb-2">
															Uploaded files:
														</h3>
														<div className="space-y-2">
															{uploadedFiles.map(
																(
																	file,
																	index
																) => (
																	<div
																		key={
																			index
																		}
																		className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
																	>
																		<div className="flex items-center">
																			<span className="truncate max-w-xs">
																				{
																					file.name
																				}
																			</span>
																			<span className="ml-2 text-xs text-gray-500">
																				(
																				{Math.round(
																					file.size /
																						1024
																				)}{" "}
																				KB)
																			</span>
																		</div>
																		<button
																			type="button"
																			onClick={() =>
																				removeFile(
																					index
																				)
																			}
																			className="p-1 text-red-500 rounded hover:bg-red-50"
																			title="Remove file"
																		>
																			<BiX className="h-4 w-4" />
																		</button>
																	</div>
																)
															)}
														</div>
													</div>
												)}

												{uploadedFiles.length === 0 && (
													<p className="text-sm text-gray-500 italic">
														No files uploaded yet.
														Please upload at least
														one file for your
														solution.
													</p>
												)}
											</div>
										</div>
									</div>
								) : (
									<CodeMirror
										ref={editorRef}
										value={code}
										height="100%"
										onChange={handleCodeChange}
										className="h-full 2xl:text-xl"
										extensions={[
											customKeymap(),
											// EditorView.lineWrapping,
										]}
									/>
								)}
							</div>
						</ResizablePanel>

						{language !== "text" &&
						language !== "link" &&
						language !== "pandas" &&
						language !== "file" ? (
							<>
								<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />

								{/* Output panel */}
								<ResizablePanel
									defaultSize={35}
									minSize={35}
									className="h-52 p-4 border-t flex flex-col"
								>
									<div className="text-lg mb-2 font-semibold">
										Output
									</div>

									{memoizedOutput}

									{/* Action buttons */}
									<div className="flex gap-4 justify-end mt-auto pt-2">
										<Button
											variant="outline"
											onClick={handleReset}
										>
											Reset
										</Button>
										<Button
											variant="outline"
											onClick={handleRunCode}
										>
											Run Code
										</Button>
										<Button onClick={handleSubmit}>
											Submit
										</Button>
										{Object.keys(answeredProblems)
											.length === data.content.length && (
											<Button
												onClick={() =>
													setShowSummary(true)
												}
												variant="success"
											>
												Complete
											</Button>
										)}
									</div>
								</ResizablePanel>
							</>
						) : (
							<>
								<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />
								<ResizablePanel
									defaultSize={10}
									minSize={10}
									maxSize={10}
									className="h-52 p-4 border-t flex flex-col"
								>
									<div className="flex gap-4 justify-end mt-auto pt-2">
										<Button
											variant="outline"
											onClick={handleReset}
										>
											Reset
										</Button>
										<Button onClick={handleSubmit}>
											Submit
										</Button>
										{Object.keys(answeredProblems)
											.length === data.content.length && (
											<Button
												onClick={() =>
													setShowSummary(true)
												}
												variant="success"
											>
												Review
											</Button>
										)}
									</div>
								</ResizablePanel>
							</>
						)}
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>

			{/* Summary overlay */}
			{showSummary && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setShowSummary(false);
						}
					}}
				>
					<div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<h2 className="text-2xl font-bold mb-4">Summary</h2>
						<div className="space-y-4">
							{data.content.map((problem, index) => (
								<div key={index + 1} className="border-b pb-2">
									<p className="font-semibold">
										Problem {index + 1}:
									</p>

									{/* Show different content based on language type */}
									{answeredProblems[index + 1]?.language ===
									"file" ? (
										<div className="mt-2">
											{/* <p className="text-sm text-gray-600">
												Solution submitted as file upload
											</p> */}
										</div>
									) : answeredProblems[index + 1]
											?.language === "link" ? (
										<div className="mt-2">
											{/* <p className="text-sm text-gray-600">
												Solution submitted as links
											</p> */}
										</div>
									) : (
										<pre className="bg-gray-50 p-2 mt-1 rounded overflow-x-auto whitespace-pre-wrap">
											{answeredProblems[index + 1]
												?.code || "No code submitted"}
										</pre>
									)}

									{/* Display uploaded files in summary */}
									{answeredProblems[index + 1]?.files &&
										answeredProblems[index + 1]?.files!
											.length > 0 && (
											<div className="mt-2">
												<p className="text-sm font-medium">
													Attached files:
												</p>
												<div className="flex flex-wrap gap-2 mt-1">
													{answeredProblems[
														index + 1
													]?.files!.map(
														(file, fileIndex) => (
															<div
																key={fileIndex}
																className="text-xs bg-gray-100 p-1 px-2 rounded-md text-ellipsis overflow-hidden"
															>
																{file.name} (
																{Math.round(
																	file.size /
																		1024
																)}{" "}
																KB)
															</div>
														)
													)}
												</div>
											</div>
										)}

									{answeredProblems[index + 1]?.links &&
										answeredProblems[index + 1]?.links!
											.length > 0 && (
											<div className="mt-2">
												<p className="text-sm font-medium">
													Solution links:
												</p>
												<ul className="list-disc pl-5 mt-1 space-y-1 overflow-hidden">
													{answeredProblems[
														index + 1
													]?.links!.map((link) => (
														<li key={link.id}>
															<a
																href={link.url}
																target="_blank"
																rel="noopener noreferrer"
																className="text-blue-600 hover:underline text-sm break-all"
															>
																{link.url}
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
													))}
												</ul>
											</div>
										)}
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
								Finish Problem Section
							</Button>
						</div>
					</div>
				</div>
			)}
			<Toaster />
		</div>
	);
}
