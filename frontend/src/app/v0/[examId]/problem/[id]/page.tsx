import { getExamProblemQuestions } from "@/lib/questions";
import ProblemClient from "./ProblemClient";

export default async function ProblemPage({
	params,
}: {
	params: Promise<{ examId: string; id: string }>;
}) {
	const { examId, id } = await params;
	const data = await getExamProblemQuestions(examId);

	if (data.content.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				No problems found
			</div>
		);
	}

	return (
		<ProblemClient
			data={data}
			examId={examId}
			initialProblemId={parseInt(id)}
		/>
	);
}
