import { getExamQuestions } from "@/lib/questions";
import MultiChoiceClient from "./MultiChoiceClient";

export default async function MultiChoicePage({
	params,
}: {
	params: Promise<{ examId: string; id: string }>;
}) {
	const { examId, id } = await params;

	const data = await getExamQuestions(examId);

	if (data.content.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				No questions found
			</div>
		);
	}

	return (
		<MultiChoiceClient
			data={data}
			examId={examId}
			initialQuestionId={parseInt(id)}
		/>
	);
}
