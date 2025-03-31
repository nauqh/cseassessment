import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
	FaBook,
	FaDesktop,
	FaQuestion,
	FaHeadset,
	FaUser,
	FaClipboardList,
	FaRocket,
} from "react-icons/fa";

const Navigation = dynamic(() => import("@/components/Navigation"), {
	ssr: true,
});

const HeroSection = dynamic(() => import("@/components/Hero"), {
	ssr: true,
});

const supportCards = [
	{
		icon: <FaBook className="w-6 h-6" />,
		title: "Preparing for Exam",
		description:
			"Essential tips and guidelines to help you prepare effectively",
		href: "/guides/exam-prep",
	},
	{
		icon: <FaDesktop className="w-6 h-6" />,
		title: "Device and System Setup",
		description:
			"Step-by-step guide to configure your system for online exams",
		href: "/guides/system-setup",
	},
	{
		icon: <FaQuestion className="w-6 h-6" />,
		title: "Troubleshoot and Tips",
		description:
			"Common issues and their solutions for a smooth exam experience",
		href: "/guides/troubleshoot",
	},
	{
		icon: <FaHeadset className="w-6 h-6" />,
		title: "Getting Help and Support",
		description: "Access our support resources and contact assistance",
		href: "/support",
	},
	{
		icon: <FaBook className="w-6 h-6" />,
		title: "Practice Tests",
		description:
			"Access sample exams and practice questions to build confidence",
		href: "/practice-tests",
	},
	{
		icon: <FaDesktop className="w-6 h-6" />,
		title: "Technical Requirements",
		description:
			"Detailed specifications for hardware and software requirements",
		href: "/technical-requirements",
	},
];

const steps = [
	{
		icon: <FaUser className="w-6 h-6" />,
		title: "Sign Up & Register",
		description:
			"Create your profile and register for your upcoming exams easily.",
	},
	{
		icon: <FaClipboardList className="w-6 h-6" />,
		title: "Prepare & Practice",
		description:
			"Access study materials and practice exams to build your confidence.",
	},
	{
		icon: <FaRocket className="w-6 h-6" />,
		title: "Take Exams",
		description:
			"Sit for your exams with our secure, AI-powered proctoring system.",
	},
];

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navigation />

			<main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 flex-grow">
				<HeroSection />

				{/* How It Works Section */}
				<section className="mt-24 mb-24">
					<h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
						How It Works
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{steps.map((step, index) => (
							<div
								key={index}
								className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100"
							>
								<div className="flex justify-center items-center mb-4">
									<div className="p-3 rounded-xl bg-[#1d283a]/10 text-[#1d283a]">
										{step.icon}
									</div>
								</div>
								<h3 className="text-lg font-bold text-gray-800 mb-2">
									{step.title}
								</h3>
								<p className="text-sm text-gray-600 leading-relaxed">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Image and Info Section */}
				<section className="flex flex-col md:flex-row items-center max-w-6xl mx-auto my-24 gap-8">
					<div className="w-full md:w-1/2">
						<Image
							src="/main.jpeg"
							alt="Online Exams"
							width={500}
							height={300}
							className="rounded-2xl shadow-2xl"
							priority={true}
							loading="eager"
							placeholder="blur"
							blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4dHRsdHR4dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/2wBDAR4SEhwYHCoXFyodHRodHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR3/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
						/>
					</div>
					<div className="w-full md:w-1/2 space-y-6">
						<h2 className="text-4xl font-bold text-gray-800">
							Experience the Future of Assessments
						</h2>
						<p className="text-xl text-gray-600 leading-relaxed">
							Our platform leverages cutting-edge technology to
							deliver a seamless and secure online testing
							experience—so you can focus on your success.
						</p>
					</div>
				</section>

				{/* Exam Support Resources Section */}
				<section className="mt-24 mb-24">
					<h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
						Exam Support Resources
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{supportCards.map((card, index) => (
							<Link href={card.href} key={index}>
								<div className="group h-full p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
									{/* Card Icon and Title */}
									<div className="flex items-center gap-4 mb-4">
										<div className="p-3 rounded-xl bg-[#1d283a]/10 text-[#1d283a]">
											{card.icon}
										</div>
										<h3 className="text-lg font-bold text-gray-800">
											{card.title}
										</h3>
									</div>

									{/* Card Description */}
									<p className="text-gray-600 leading-relaxed">
										{card.description}
									</p>
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* Final Call to Action */}
				<section className="text-center max-w-3xl mx-auto p-12 rounded-2xl">
					<h2 className="text-4xl font-bold mb-6 text-gray-800">
						Ready to Get Started?
					</h2>
					<p className="text-xl text-gray-600 mb-8">
						Join thousands of students who are already advancing
						their careers with eExams.
					</p>
					<Link href="/exams">
						<Button className="text-lg px-10 py-6 bg-[#1d283a] hover:bg-[#2a3a52]">
							Attempt exams →
						</Button>
					</Link>
				</section>
			</main>

			<footer className="py-10 bg-gray-50">
				<div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div>
							<Link href="/" className="block">
								<Image
									src="/logo.png"
									alt="eExams Logo"
									width={200}
									height={100}
									loading="lazy"
									className="hover:opacity-90 transition-opacity"
								/>
							</Link>
						</div>

						<div className="hidden md:block"></div>

						<div className="md:justify-self-end">
							<h3 className="text-lg text-primary font-semibold">
								About
							</h3>
							<ul className="mt-4 space-y-2 text-gray-600 text-sm">
								<li>
									<Link
										href="/exams/results"
										className="hover:text-gray-800"
									>
										Exam Results
									</Link>
								</li>
								<li>
									<Link
										href="/exams/results"
										className="hover:text-gray-800"
									>
										FAQs
									</Link>
								</li>
								<li>
									<Link
										href="/exams/results"
										className="hover:text-gray-800"
									>
										Contact
									</Link>
								</li>
							</ul>
						</div>

						<div className="md:justify-self-end">
							<h3 className="text-primary text-lg font-semibold">
								Follow us on
							</h3>
							<ul className="mt-4 space-y-2 text-gray-600 text-sm">
								<li>
									<Link
										href="https://www.facebook.com"
										target="_blank"
										className="hover:text-gray-800"
									>
										Facebook
									</Link>
								</li>
								<li>
									<Link
										href="https://www.twitter.com"
										target="_blank"
										className="hover:text-gray-800"
									>
										Twitter
									</Link>
								</li>
								<li>
									<Link
										href="https://www.instagram.com"
										target="_blank"
										className="hover:text-gray-800"
									>
										Instagram
									</Link>
								</li>
								<li>
									<Link
										href="https://www.linkedin.com"
										target="_blank"
										className="hover:text-gray-800"
									>
										LinkedIn
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-10 border-t border-gray-300 pt-4">
						<div className="flex flex-col md:flex-row justify-between items-center md:space-y-0 space-y-4 text-xs text-gray-500">
							<div>
								Copyright © {new Date().getFullYear()} Nauqh.
							</div>
							<div className="flex flex-wrap justify-center gap-4">
								<Link href="/" className="hover:text-gray-800">
									Privacy Policy
								</Link>
								<Link href="/" className="hover:text-gray-800">
									Terms of Use
								</Link>
								<Link href="/" className="hover:text-gray-800">
									Cookies
								</Link>
								<Link href="/" className="hover:text-gray-800">
									Preferences
								</Link>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
