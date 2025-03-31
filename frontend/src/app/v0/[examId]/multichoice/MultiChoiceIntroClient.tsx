"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
								This section contains 20 multiple choice
								questions
							</li>
							<li>Each question has only one correct answer</li>
							<li>
								You can navigate between questions using the
								questions panel on the right
							</li>
							<li>
								You can review your answers before final
								submission
							</li>
							<li>
								Once you submit this section, you cannot return
								to it
							</li>
						</ul>

						<div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
							<p className="text-yellow-700">
								⚠️ Make sure you save your answers before moving
								to the next section!
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
