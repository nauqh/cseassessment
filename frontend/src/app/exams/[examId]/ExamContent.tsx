"use client";

import { LoadingScreen } from "@/components/ui/loading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExamContent({
	examId,
	examTitle,
}: {
	examId: string;
	examTitle: string;
}) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	const handleStartExam = () => {
		router.push(`/exams/${examId}/multichoice`);
	};

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<section className="max-w-6xl mx-auto p-12 space-y-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">{examTitle} Final Exam</h1>
				<p className="text-2xl text-primary">
					Congratulations! You are at the last step of {examTitle}! 🎉
				</p>
			</div>

			<section className="prose prose-lg max-w-none">
				<div className="bg-muted p-4 rounded-lg mb-8 space-y-4 text-xl">
					<p>
						This is a 2-hour exam. The timing is automatically
						logged as soon as you submit your email.
					</p>
					<p>The passing grade for this exam is 80%.</p>

					<p>
						Make sure to create a copy of the exam notebook to work
						on, and use your correct email to submit.
					</p>

					<p>
						Exam will be graded within 1 working day. For sooner
						grading, please send your request (including your email
						and exam title) to{" "}
						<Link
							href="https://discord.com/channels/957854915194126336/1081063200377806899"
							className="text-blue-500 hover:text-blue-700 underline"
						>
							#question-center
						</Link>
						.
					</p>
				</div>

				<h2 className="text-2xl font-bold mt-8 mb-4">EXAM POLICY</h2>
				<ol className="space-y-4 list-decimal list-inside text-lg">
					<li>
						You may request to retake an exam multiple times. To
						retake an exam, simply make a new copy of the exam
						notebook and resubmit using the /submit command on
						Discord. You will be able to re-attempt the exam once
						the result of your previous submission has been
						released.
					</li>
					<li>
						The exam begins once you submit your email. Submissions
						made after the time limit will not be processed. Your
						final grade will be based on the total score of all
						correctly submitted answers. Answers that are not
						submitted or are submitted in the wrong format will be
						marked as incorrect.
					</li>
					<li>
						It is your responsibility to ensure that all answers are
						included in the submission summary generated at the end
						of the notebook.
					</li>
					<li>
						After finishing all of the sections in the module and
						passing the exam, you will be able to claim the
						certificate, which will automatically allow you to
						access the next Module.
					</li>
					<li>
						Opening the exam notebook is your acknowledgement that
						you have carefully read and understood these policies,
						and that you shall accept your grade as a fair result of
						your performance on the exam.
					</li>
				</ol>

				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8">
					<p className="text-yellow-700 font-semibold text-center">
						⚠️ READ THE POLICIES ABOVE CAREFULLY BEFORE PROCEEDING
						TO THE EXAM! ⚠️
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
	);
}
