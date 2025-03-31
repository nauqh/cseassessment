"use client";

import { useEffect } from "react";

export default function SubmissionSuccess() {

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
				<h1 className="text-2xl font-bold mb-4 text-green-600">
					Submission Successful!
				</h1>
				<p className="text-gray-700 mb-6">
					Your submission has been successfully saved.
					<br />
					Congratulations on completing the exam!
				</p>
				<p className="text-gray-500 mb-4">
					You can safely close this window at any time.
				</p>
			</div>
		</div>
	);
}
