"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SubmissionSuccess() {
	const router = useRouter();
	const [counter, setCounter] = useState(5);

	useEffect(() => {
		if (counter === 0) {
			localStorage.clear();
			router.push("/");
			return;
		}
		const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [counter, router]);

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
					You will be redirected to the home page in{" "}
					<span className="font-semibold">{counter}</span> seconds.
				</p>
				<Button onClick={() => router.push("/")}>
					Return home now
				</Button>
			</div>
		</div>
	);
}
