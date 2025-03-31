import MarkingClient from "./MarkingClient";

export default async function MarkingPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <MarkingClient submissionId={id} />;
}
