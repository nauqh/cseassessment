import ReviewClient, { Submission } from "./ReviewClient";
import { getExamQuestions, getExamProblemQuestions } from "@/lib/questions";

export default async function ReviewPage({
	params,
}: {
	params: Promise<{ submissionId: number }>;
}) {
	const { submissionId } = await params;

	// First fetch the submission using submissionId
	const submissionResponse = await fetch(
		`https://cspyclient.up.railway.app/submissions/${submissionId}`
	);

	if (!submissionResponse.ok) {
		return (
			<div className="flex justify-center items-center h-screen text-red-500">
				Failed to fetch submission data
			</div>
		);
	}

	const submission: Submission = await submissionResponse.json();

	// Use the exam_id from the submission to fetch exam content
	const [multichoiceData, problemData] = await Promise.all([
		getExamQuestions(submission.exam_id),
		getExamProblemQuestions(submission.exam_id),
	]);

	const combinedData = {
		name: multichoiceData.name,
		language: multichoiceData.language,
		content: [...multichoiceData.content, ...problemData.content],
	};

	if (combinedData.content.length === 0) {
		return (
			<div className="flex justify-center items-center h-screen">
				No questions found
			</div>
		);
	}
	return <ReviewClient data={combinedData} submission={submission} />;
}
