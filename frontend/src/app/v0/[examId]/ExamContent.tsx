"use client";

import { LoadingScreen } from "@/components/ui/loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function ExamContent({
	examId,
	examTitle,
}: {
	examId: string;
	examTitle: string;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	useEffect(() => {
		localStorage.clear();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	const handleStartExam = () => {
		setIsDialogOpen(true);
	};

	const handleEmailSubmit = () => {
		if (!email) {
			setEmailError("Please enter your email address");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address");
			return;
		}

		localStorage.setItem("examUserEmail", email);
		setIsDialogOpen(false);
		router.push(`/v0/${examId}/multichoice`);
	};

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<>
			<section className="max-w-6xl mx-auto p-12 space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold">
						{examTitle} Final Exam
					</h1>
					<p className="text-2xl text-primary">
						Congratulations! You are at the last step of {examTitle}
						! 🎉
					</p>
				</div>

				<section className="prose prose-lg max-w-none">
					<h2 className="text-2xl font-bold mt-8 mb-4">
						EXAM INFORMATION
					</h2>
					<div className="bg-muted p-4 rounded-lg mb-8 space-y-4 text-xl">
						<p>
							This is a 2-hour exam. The timing is automatically
							logged as soon as you submit your email.
						</p>
						<p>
							The passing grade for this exam is 80%. 
						</p>
						<p>
							Your submission will be graded and return within 1
							working day.
						</p>
					</div>

					<h2 className="text-2xl font-bold mt-8 mb-4">
						EXAM POLICY
					</h2>
					<ol className="space-y-4 list-decimal list-inside text-lg">
						<li>
							The exam begins once you submit your email.
							Submissions made after the time limit will not be
							processed. Your final grade will be based on the
							total score of all <b>correctly submitted</b>{" "}
							answers. Answers that are not submitted or are
							submitted in the wrong format will be marked as
							incorrect.
						</li>
						<li>
							Once you completed your exam, a{" "}
							<b>copy of your submission</b> will be made
							available. Please ensure you keep this record for
							future reference, as we will not be responsible for
							any submission-related issues without it.
						</li>
						<li>
							You may request to retake an exam multiple times. To
							retake an exam, simply click on the exam link to
							proceed and resubmit using the{" "}
							<code className="bg-gray-100 rounded px-1">
								/submit
							</code>{" "}
							command on Discord. You will be able to re-attempt
							the exam once the result of your previous submission
							has been released.
						</li>
						<li>
							After finishing all of the sections in the module
							and passing the exam, you will be able to claim the
							certificate, which will automatically allow you to
							access the next module.
						</li>
						<li>
							By clicking on the{" "}
							<code className="bg-gray-100 rounded px-1">
								START EXAM
							</code>{" "}
							button, you acknowledge that you have carefully read
							and understood these policies, and that you shall
							accept your grade as a fair result of your
							performance on the exam.
						</li>
					</ol>

					<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8">
						<p className="text-yellow-700 font-semibold text-center">
							⚠️ READ THE POLICIES ABOVE CAREFULLY BEFORE
							PROCEEDING TO THE EXAM! ⚠️
						</p>
					</div>

					<div className="text-center mt-8">
						<Button
							size="lg"
							className="px-8 uppercase"
							onClick={handleStartExam}
						>
							start exam
						</Button>
					</div>
				</section>
			</section>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Enter your email</DialogTitle>
					</DialogHeader>
					<div className="space-y-2">
						<Input
							type="email"
							placeholder="your.email@example.com"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setEmailError("");
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleEmailSubmit();
								}
							}}
							className={emailError ? "border-red-500" : ""}
						/>
						{emailError && (
							<p className="text-red-500 text-sm">{emailError}</p>
						)}
						<Button
							className="w-full mt-4"
							onClick={handleEmailSubmit}
						>
							Continue to exam
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
