import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import ZoomableImage from "../ZoomableImage";

const ProblemDescriptionFormatter = ({ content }: { content: string }) => {
	const processedContent = content.replace(/<br\/>/g, "\n\n");
	const parts = processedContent.split(/(```[^`]*```)/g);

	return (
		<div className="prose dark:prose-invert max-w-none">
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
								blockquote: ({ children }) => (
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
									src && <ZoomableImage src={src} />,

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
	);
};

export default ProblemDescriptionFormatter;
