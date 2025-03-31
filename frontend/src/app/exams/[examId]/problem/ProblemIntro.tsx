"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import PandasProblemIntro from "@/components/problem/intro/PandasProblemIntro";
import PythonProblemIntro from "@/components/problem/intro/PythonProblemIntro";
import SQLProblemIntro from "@/components/problem/intro/SQLProblemIntro";

export default function ProblemIntro({ examId }: { examId: string }) {
	const router = useRouter();

	const handleStart = () => {
		router.push(`/exams/${examId}/problem/1`);
	};

	return (
		<div className="w-[90vw] px-4 py-8">
			<div className="p-6 border border-gray-200 rounded-lg shadow-md flex flex-col space-y-4 justify-center">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold">II. Problem Section</h1>
					<p className="text-xl text-primary">
						Please read the instructions carefully before starting
					</p>
				</div>

				<div className="prose prose-lg max-w-none">
					{examId === "M11" ? (
						<SQLProblemIntro />
					) : examId === "M12" ? (
						<SQLProblemIntro />
					) : examId === "M21" ? (
						<PythonProblemIntro />
					) : examId === "M31" ? (
						<PandasProblemIntro />
					) : null}
					<div className="text-center mt-8">
						<Button
							size="lg"
							className="px-8 uppercase"
							onClick={handleStart}
						>
							Start Problem Section
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
