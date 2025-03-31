import ProblemIntro from "./ProblemIntro";

export default async function ProblemPage({
	params,
}: {
	params: Promise<{ examId: string }>;
}) {
	const { examId } = await params;

	return <ProblemIntro examId={examId} />;
}
