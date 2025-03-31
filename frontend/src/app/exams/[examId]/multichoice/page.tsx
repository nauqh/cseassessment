import MultiChoiceIntroClient from "./MultiChoiceIntroClient";

export default async function MultiChoicePage({
	params,
}: {
	params: Promise<{ examId: string }>;
}) {
	const { examId } = await params;

	return <MultiChoiceIntroClient examId={examId} />;
}
