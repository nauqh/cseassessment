import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
	return (
		<section className="relative px-6">
			<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
				{/* LEFT SIDE – TEXT & CTA */}
				<div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
					<h1 className="text-5xl font-extrabold leading-tight text-primary">
						<span
							className="font-extrabold bg-clip-text text-transparent 
                       bg-gradient-to-r from-blue-500 to-teal-400"
						>
							eExams
						</span>{" "}
						is Here to Elevate Your Learning!
					</h1>
					<p className="text-lg text-gray-600">
						A next-gen platform for secure, AI-powered online
						assessments. Take exams confidently anytime, anywhere!
					</p>
					<div className="flex flex-wrap gap-6 justify-center md:justify-start">
						<Link href="/exams">
							<Button className="text-lg px-8 py-6 bg-[#1d283a] hover:bg-[#2a3a52]">
								Attempt exams
							</Button>
						</Link>
						<Link href="/about">
							<Button
								variant="outline"
								className="text-lg px-8 py-6"
							>
								Learn more
							</Button>
						</Link>
					</div>
				</div>

				{/* RIGHT SIDE – IMAGE */}
				<div className="w-full md:w-1/2 flex justify-end">
					<div className="relative w-80 h-80 md:w-96 md:h-96">
						{/* Decorative Paint Splash Background */}
						<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 to-teal-400 -rotate-6 z-0" />

						<Image
							src="https://static.vecteezy.com/system/resources/previews/035/194/617/non_2x/men-prepare-for-exams-by-reading-books-trconcept-flat-illustration-vector.jpg"
							alt="eExam Platform"
							fill
							className="rounded-3xl shadow-xl object-cover relative z-10"
							priority
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
