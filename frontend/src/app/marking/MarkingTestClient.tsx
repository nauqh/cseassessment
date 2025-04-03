"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import CodeMirror from "@uiw/react-codemirror";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import CodeOutput from "@/components/CodeOutput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type OutputType = {
	output: Record<string, string>[] | string;
	language: string;
};

export default function MarkingTestClient() {
	const { toast } = useToast();
	const [code, setCode] = useState<string>("");
	const [output, setOutput] = useState<OutputType>({
		output: "",
		language: "",
	});
	const [language, setLanguage] = useState("python");
	const [database, setDatabase] = useState<string | null>("northwind");

	const handleCodeChange = useCallback((value: string) => {
		setCode(value);
	}, []);

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
						database: database,
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
			toast({
				title: "Connection Error",
				description:
					"Could not connect to the execution service. This may happen if the database is suspended due to inactivity. Please try again.",
				className: "bg-yellow-100 text-yellow-900 border-none",
				duration: 5000,
			});
		}
	}, [code, language, database, toast]);

	// Custom keymap to override Shift+Enter and Ctrl+Enter behavior
	const customKeymap = useCallback(() => {
		return Prec.highest(
			keymap.of([
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
	}, [handleRunCode]);

	// Memoize the output component to prevent unnecessary re-renders
	const memoizedOutput = React.useMemo(
		() => <CodeOutput data={output.output} />,
		[output.output]
	);

	return (
		<div className="p-4 h-screen w-full">
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel
					defaultSize={50}
					minSize={40}
					className="h-full"
				>
					<Tabs
						defaultValue="editor"
						className="h-full flex flex-col"
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="editor">Input</TabsTrigger>
							<TabsTrigger value="info">Information</TabsTrigger>
						</TabsList>

						<TabsContent value="editor" className="flex-1">
							<div className="h-full flex flex-col border rounded-md">
								<div className="flex items-center justify-between p-2 border-b bg-gray-50">
									<h1 className="text-lg font-semibold">
										Code Editor
									</h1>
									<div className="flex items-center gap-4">
										<Select
											value={language}
											onValueChange={(value) => {
												setLanguage(value);
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
												<SelectItem value="sql">
													SQL
												</SelectItem>
												<SelectItem value="text">
													Text
												</SelectItem>
											</SelectContent>
										</Select>

										<Select
											value={database || "none"}
											onValueChange={(value) => {
												setDatabase(
													value === "none"
														? null
														: value
												);
											}}
										>
											<SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0">
												<SelectValue placeholder="Database" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="northwind">
													Northwind
												</SelectItem>
												<SelectItem value="chinook">
													Chinook
												</SelectItem>
												<SelectItem value="none">
													None
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="flex-1 overflow-hidden">
									<CodeMirror
										value={code}
										height="100%"
										onChange={handleCodeChange}
										className="h-full 2xl:text-xl"
										extensions={[
											customKeymap(),
											EditorView.lineWrapping,
										]}
									/>
								</div>

								<div className="flex justify-end p-2 border-t bg-gray-50">
									<span className="text-xs text-gray-500 mr-4 flex items-center">
										<span className="text-xs text-gray-500 bg-gray-100 p-2 rounded-md mr-1">
											Ctrl+Enter
										</span>
										to run code
									</span>
									<Button onClick={handleRunCode}>
										Run Code
									</Button>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="info" className="flex-1">
							<div className="h-full border rounded-md p-4 overflow-auto">
								<h2 className="text-xl font-bold mb-4">
									Testing Information
								</h2>

								<div className="space-y-4">
									<div>
										<h3 className="text-lg font-semibold">
											Database Information
										</h3>
										<p className="text-sm text-gray-600 mt-1">
											This interface connects to the same
											databases used by students during
											their exams:
										</p>
										<ul className="list-disc pl-6 mt-2 text-sm space-y-1">
											<li>
												<strong>Northwind</strong>: Used
												in M11 exams
											</li>
											<li>
												<strong>Chinook</strong>: Used
												in M12 exams
											</li>
										</ul>
										<p className="text-sm text-gray-600 mt-2">
											Note: The databases may be suspended
											due to inactivity. If you encounter
											connection errors, please try
											running your code again after a few
											seconds.
										</p>
									</div>

									<div>
										<h3 className="text-lg font-semibold">
											Available Languages
										</h3>
										<ul className="list-disc pl-6 mt-2 text-sm space-y-1">
											<li>
												<strong>Python</strong>:
												Standard Python environment with
												common libraries
											</li>
											<li>
												<strong>Pandas</strong>: Python
												with Pandas and related data
												analysis libraries
											</li>
											<li>
												<strong>SQL</strong>: For direct
												SQL queries against the selected
												database
											</li>
											<li>
												<strong>Text</strong>: For plain
												text notes and comments
											</li>
										</ul>
									</div>

									<div>
										<h3 className="text-lg font-semibold">
											Keyboard Shortcuts
										</h3>
										<ul className="list-disc pl-6 mt-2 text-sm">
											<li>
												<code className="bg-gray-100 px-1 py-0.5 rounded">
													Ctrl+Enter
												</code>
												: Run the code
											</li>
										</ul>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</ResizablePanel>

				<ResizableHandle className="w-1 bg-gray-50 hover:bg-gray-100 cursor-col-resize" />

				{/* Output panel */}
				<ResizablePanel
					defaultSize={50}
					minSize={30}
					className="h-full border rounded-md flex flex-col"
				>
					<div className="p-2 border-b bg-gray-50">
						<h1 className="text-lg font-semibold">Output</h1>
					</div>
					{memoizedOutput}
				</ResizablePanel>
			</ResizablePanelGroup>
			<Toaster />
		</div>
	);
}
