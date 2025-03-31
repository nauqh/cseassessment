import ExamContent from "@/app/exams/[examId]/ExamContent";
import Navigation from "@/components/Navigation";

const examTitles: { [key: string]: string } = {
	M11: "M1.1 Introduction to SQL",
	M12: "M1.2 Advanced SQL",
	M21: "M2.1 Python 101",
	M31: "M3.1 Pandas 101",
};

export default async function ExamPage({
	params,
}: {
	params: Promise<{ examId: string }>;
}) {
	const { examId } = await params;
	const examTitle = examTitles[examId] || "Exam";

	return (
		<>
			<Navigation />
			<main className="min-h-screen px-4 sm:px-6 lg:px-8">
				<ExamContent examId={examId} examTitle={examTitle} />
			</main>
		</>
	);
}
