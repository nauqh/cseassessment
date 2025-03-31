import FinalClient from "./FinalClient";

export default async function FinalPage({
	params,
}: {
	params: Promise<{ examId: string }>;
}) {
	const { examId } = await params;
	return <FinalClient examId={examId} />;
}
