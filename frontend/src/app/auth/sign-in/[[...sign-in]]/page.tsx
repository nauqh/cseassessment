"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LoadingScreen } from "@/components/ui/loading";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return <LoadingScreen />;
	}

	return (
		<div className="grid md:grid-cols-2 min-h-screen bg-gradient-to-br from-blue-500/40 via-purple-400/30 to-pink-300/30 place-items-center">
			{/* Sign In Section */}
			<div className="flex flex-col justify-center items-center">
				<SignIn
					appearance={{
						layout: {
							logoImageUrl: "/logo.png",
						},
						elements: {
							main: "gap-2",
							logoBox: "justify-start",
							logoImage: "w-50 h-50",
							header: "text-left",
							headerTitle: "text-2xl font-bold text-gray-900",
							headerSubtitle: "text-gray-700 text-sm",
							card: "backdrop-blur-md bg-white/30 gap-6",
							socialButtonsBlockButton:
								"px-3 py-2 bg-white/70 backdrop-blur-sm text-sm mb-2",
							footer: "hidden",
							form: "gap-6",
							formFieldInput:
								"px-3 py-2 bg-white/70 backdrop-blur-sm text-sm text-gray-900 placeholder-gray-500",
							formButtonPrimary: "px-3 py-2",
						},
						variables: {
							colorPrimary: "#1D283A",
						},
					}}
				/>
				<p className="text-center mt-4 text-sm text-slate-600">
					Don't have an account?{" "}
					<Link
						href="/auth/sign-up"
						className="text-blue-600 hover:text-blue-800 font-medium"
					>
						Sign up
					</Link>
				</p>
			</div>

			{/* eAssessment Info Section */}
			<div className="hidden md:flex flex-col justify-center p-12 bg-white shadow-lg border border-slate-100 m-6 rounded-lg 2xl:w-[800px] 2xl:h-[1000px] 2xl:my-auto">
				<div>
					<h1 className="text-4xl font-bold text-slate-800 mb-6">
						eAssessment Platform
					</h1>
					<p className="text-lg text-slate-600 mb-8">
						A secure and modern platform for academic assessments
					</p>

					<div className="space-y-6">
						<div className="border-l-4 border-blue-600 pl-4">
							<h3 className="font-semibold text-slate-800 mb-2">
								Key Features
							</h3>
							<ul className="space-y-3 text-slate-600">
								<li className="flex items-center">
									<span className="mr-2 text-blue-600">
										•
									</span>
									AI-Powered Monitoring
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-blue-600">
										•
									</span>
									Live Code Execution
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-blue-600">
										•
									</span>
									Instant Results and Feedback
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-blue-600">
										•
									</span>
									Multi-Language Support
								</li>
							</ul>
						</div>

						<div className="border-l-4 border-green-600 pl-4">
							<h3 className="font-semibold text-slate-800 mb-2">
								Exam Rules
							</h3>
							<ul className="space-y-3 text-slate-600">
								<li className="flex items-center">
									<span className="mr-2 text-green-600">
										•
									</span>
									No additional screens or devices allowed
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">
										•
									</span>
									No unauthorized materials allowed
								</li>
								<li className="flex items-center">
									<span className="mr-2 text-green-600">
										•
									</span>
									Stable internet connection needed
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="mt-8 p-4 bg-blue-50 rounded-lg">
					<p className="text-sm text-blue-800">
						Need help? Visit our{" "}
						<Link
							href="https://discord.com/channels/957854915194126336/1081063200377806899"
							className="underline hover:text-blue-600"
						>
							Discord support forum
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
