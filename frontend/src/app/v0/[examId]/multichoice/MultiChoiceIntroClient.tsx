"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle } from "react-icons/fa";

export default function MultiChoiceIntroClient({ examId }: { examId: string }) {
	const router = useRouter();

	const handleStart = () => {
		router.push(`/v0/${examId}/multichoice/1`);
	};

	return (
		<div className="w-[90vw] px-4 py-8">
			<div className="p-6 border border-gray-200 rounded-lg shadow-md flex flex-col space-y-4 justify-center">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold">I. Multiple Choices</h1>
					<p className="text-xl">
						Please read the instructions carefully before starting
					</p>
				</div>

				<div className="prose prose-lg max-w-none my-4">
					<div className="bg-muted p-6 rounded-lg space-y-4">
						<h2 className="text-2xl font-bold">Instructions:</h2>
						<ul className="list-disc list-inside space-y-2">
							<li>
								This section contains multiple choice questions
							</li>
							<li>
								Questions with circle options (⏺️) have{" "}
								<b>only one</b> correct answer
							</li>
							<li>
								Questions with square options (⏹️) may have{" "}
								<b>multiple</b> correct answers
							</li>
							<li>
								You can navigate between questions using the
								questions panel on the right
							</li>
						</ul>

						<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
							<p className="text-yellow-700 flex items-center">
								<FaExclamationTriangle className="mr-2 text-yellow-600" />{" "}
								Make sure you save your answers before moving to
								the next section!
							</p>
						</div>
					</div>

					<div className="text-center mt-8">
						<Button
							size="lg"
							className="px-8"
							onClick={handleStart}
						>
							Start multiple choices section
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
