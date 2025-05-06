"use client";

import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

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
				<div className="flex justify-center mb-6">
					<div className="bg-green-100 p-3 rounded-full">
						<FaCheckCircle className="h-10 w-10 text-green-600" />
					</div>
				</div>

				<h1 className="text-2xl font-bold mb-6 text-green-600">
					Submission Successful!
				</h1>

				<div className="space-y-5">
					<div className="border-l-4 border-green-500 pl-4 py-2 text-left bg-green-50 rounded">
						Your submission has been saved.
					</div>

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
				</div>

				<p className="text-gray-500 mt-6">
					You can safely close this window.
				</p>
			</div>
		</div>
	);
}
