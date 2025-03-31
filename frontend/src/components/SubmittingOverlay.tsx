export default function SubmittingOverlay() {
	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white rounded-xl shadow-2xl p-8 transform transition-all animate-in fade-in duration-300 flex flex-col items-center gap-6">
				<div className="relative">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
				</div>
				<p className="text-xl font-semibold text-gray-800">
					Submitting your exam...
				</p>
				<p className="text-sm text-gray-500">Please wait a moment</p>
			</div>
		</div>
	);
}
