"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle, FaCopy } from "react-icons/fa";

export default function SubmissionSuccess() {
	const searchParams = useSearchParams();
	const submissionId = searchParams.get("submission_id") || "";
	const [copied, setCopied] = useState(false);
	
	const copyToClipboard = () => {
		navigator.clipboard.writeText(submissionId);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	useEffect(() => {
		// Prevent going back to previous pages
		if (window.history && window.history.pushState) {
			// Clear existing history
			window.history.pushState(null, "", window.location.href);

			// Prevent user from navigating back
			const handlePopState = () => {
				window.history.pushState(null, "", window.location.href);
			};

			window.addEventListener("popstate", handlePopState);

			return () => {
				window.removeEventListener("popstate", handlePopState);
			};
		}
	}, []);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
			<div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-xl transform 2xl:scale-150">
				<div className="flex justify-center mb-6">
					<div className="bg-green-100 p-3 rounded-full">
						<FaCheckCircle className="h-10 w-10 text-green-600" />
					</div>
				</div>

				<h1 className="text-2xl font-bold mb-6 text-green-600">
				Your submission has been saved!
				</h1>

				<div className="space-y-5">
					<div className="border-l-4 border-blue-500 pl-4 py-2 text-left bg-blue-50 rounded">
						A copy of your submission has been downloaded.
						<br />
						Please keep it for future reference.
					</div>

					<div className="border-l-4 border-yellow-500 pl-4 py-2 text-left bg-yellow-50 rounded">
						Please use{" "}
						<span className="font-semibold">/submit</span> on
						Discord to request marking.
					</div>

					{submissionId && (
						<div className="border-l-4 border-green-500 pl-4 py-2 text-left bg-green-50 rounded">
							<p className="text-sm text-gray-600 mb-2">Your submission ID:</p>
							<div className="flex items-center space-x-2">
								<code className="bg-white px-2 py-1 rounded font-mono text-sm font-semibold">
									{submissionId}
								</code>
								<button
									onClick={copyToClipboard}
									className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${copied ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
									title="Copy to clipboard"
								>
									<FaCopy className="h-4 w-4" />
								</button>
							</div>
							<p className="text-sm text-gray-600 mt-2">
								Copy this and paste it when using /submit on Discord.
							</p>
						</div>
					)}
				</div>

				<p className="text-gray-500 mt-6">
					You can safely close this window.
				</p>
			</div>
		</div>
	);
}
