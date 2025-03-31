import { useRouter, useParams } from "next/navigation";

export interface Assignment {
	id: string;
	title: string;
	description: string;
	totalProblems: number;
	solvedProblems: number;
}

export function AssignmentCard({ assignment }: { assignment: Assignment }) {
	const router = useRouter();
	const params = useParams();
	const courseId = params.courseId as string;

	const handleClick = () => {
		router.push(`/courses/${courseId}/assignments`);
	};

	const progressPercentage = Math.round(
		(assignment.solvedProblems / assignment.totalProblems) * 100
	);

	// SVG circle parameters
	const size = 64;
	const strokeWidth = 4;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDashoffset =
		circumference - (progressPercentage / 100) * circumference;

	return (
		<div
			onClick={handleClick}
			className="flex flex-col p-6 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer"
		>
			<div className="flex justify-between items-start mb-4">
				<div className="flex-grow">
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						{assignment.title}
					</h3>
					<p className="text-gray-600 text-sm mb-3">
						{assignment.description}
					</p>
				</div>
				<div className="flex-shrink-0 relative">
					<svg
						className="transform -rotate-90 w-16 h-16"
						viewBox={`0 0 ${size} ${size}`}
					>
						<circle
							className="text-gray-200"
							strokeWidth={strokeWidth}
							stroke="currentColor"
							fill="transparent"
							r={radius}
							cx={size / 2}
							cy={size / 2}
						/>
						<circle
							className="text-green-500"
							strokeWidth={strokeWidth}
							strokeDasharray={circumference}
							strokeDashoffset={strokeDashoffset}
							strokeLinecap="round"
							stroke="currentColor"
							fill="transparent"
							r={radius}
							cx={size / 2}
							cy={size / 2}
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-sm font-semibold">
							{progressPercentage}%
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
