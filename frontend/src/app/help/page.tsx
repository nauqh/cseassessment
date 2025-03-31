"use client";

import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Loader2, X } from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";

export default function HelpPage() {
	const { toast } = useToast();
	const { user } = useUser();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [images, setImages] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);

	const [formData, setFormData] = useState({
		category: "",
		subject: "",
		description: "",
	});

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			// if (images.length + files.length > 4) {
			// 	toast({
			// 		title: "Too many files",
			// 		description: "Maximum 4 files allowed",
			// 		variant: "destructive",
			// 	});
			// 	return;
			// }

			setImages((prev) => [...prev, ...files]);
			const newPreviews = files.map((file) => URL.createObjectURL(file));
			setPreviews((prev) => [...prev, ...newPreviews]);
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
		setPreviews((prev) => {
			const newPreviews = prev.filter((_, i) => i !== index);
			URL.revokeObjectURL(prev[index]);
			return newPreviews;
		});
		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Simulate API call with file upload
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast({
				title: "Report Submitted",
				description: "We'll get back to you as soon as possible.",
			});

			// Reset form and images
			setFormData({
				category: "",
				subject: "",
				description: "",
			});
			setImages([]);
			setPreviews((prev) => {
				prev.forEach((url) => URL.revokeObjectURL(url));
				return [];
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to submit report. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Navigation />
			<main className="container mx-auto px-4 py-12 max-w-4xl">
				<div className="space-y-8">
					{/* Header Section */}
					<div className="text-center space-y-4 mb-8">
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
							Help Center
						</h1>
						<p className="text-gray-600 max-w-2xl mx-auto">
							Having issues? Fill out the form below and we'll
							help you resolve it. Alternatively, you can post a
							question on our{" "}
							<Link
								href="https://discord.com/channels/957854915194126336/1081063200377806899"
								className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
								target="_blank"
								rel="noopener noreferrer"
							>
								Discord forum
							</Link>
							.
						</p>
					</div>

					{/* Info Box */}
					<div className="bg-white rounded-xl border shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow">
						<h2 className="font-semibold text-xl text-primary">
							Who Should Use This Form?
						</h2>
						<ul className="grid grid-cols-1 gap-4 text-gray-600">
							<li className="flex items-center space-x-2">
								<div className="h-2 w-2 rounded-full bg-primary"></div>
								<span>
									Students experiencing technical difficulties
									during exams
								</span>
							</li>
							<li className="flex items-center space-x-2">
								<div className="h-2 w-2 rounded-full bg-primary"></div>
								<span>
									Users having trouble with account access
								</span>
							</li>
							<li className="flex items-center space-x-2">
								<div className="h-2 w-2 rounded-full bg-primary"></div>
								<span>
									Students with questions about exam
									procedures
								</span>
							</li>
							<li className="flex items-center space-x-2">
								<div className="h-2 w-2 rounded-full bg-primary"></div>
								<span>
									Users needing immediate platform assistance
								</span>
							</li>
						</ul>
					</div>

					{/* Form Section */}
					<div className="bg-white rounded-xl border shadow-sm p-8 space-y-8">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700">
									Issue Category
								</label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										setFormData({
											...formData,
											category: value,
										})
									}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="technical">
											Technical Issue
										</SelectItem>
										<SelectItem value="exam">
											Exam Related
										</SelectItem>
										<SelectItem value="account">
											Account Problem
										</SelectItem>
										<SelectItem value="billing">
											Billing Issue
										</SelectItem>
										<SelectItem value="other">
											Other
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Subject
								</label>
								<Input
									placeholder="Brief description of the issue"
									value={formData.subject}
									onChange={(e) =>
										setFormData({
											...formData,
											subject: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Description
								</label>
								<Textarea
									placeholder="Please provide as much detail as possible..."
									className="min-h-[150px]"
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium">
										Attach Images (Optional)
									</label>
									<span className="text-sm text-gray-500">
										{images.length}/4 files
									</span>
								</div>
								<Input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageUpload}
									className="cursor-pointer"
									disabled={images.length >= 4}
								/>
								{previews.length > 0 && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
										{previews.map((preview, index) => (
											<div
												key={index}
												className="relative group"
											>
												<ZoomableImage src={preview} />
												<button
													type="button"
													onClick={() =>
														removeImage(index)
													}
													className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<X className="h-4 w-4" />
												</button>
												<div className="text-sm text-gray-500 mt-1">
													{images[index].name} (
													{Math.round(
														images[index].size /
															1024
													)}
													KB)
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="pt-6">
								<Button
									type="submit"
									className="w-full sm:w-auto px-8 py-2.5 hover:scale-105 transition-transform duration-200"
									disabled={isSubmitting}
								>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isSubmitting
										? "Submitting..."
										: "Submit Report"}
								</Button>
							</div>
						</form>

						<div className="border-t pt-8">
							<h3 className="font-medium text-lg text-primary mb-4">
								Contact Information
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
								<div className="flex items-center space-x-2">
									<span className="font-medium">Email:</span>
									<span>apply@coderschool.vn</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="font-medium">Phone:</span>
									<span>085 469 0015</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="font-medium">Hours:</span>
									<span>Mon-Fri, 9AM-5PM EST</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="text-center space-y-4 my-16">
					<p className="text-gray-600">Need additional assistance?</p>
					<Button
						variant="outline"
						className="px-8 py-2.5 rounded-full border-primary text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200"
						onClick={() =>
							(window.location.href =
								"mailto:staff@coderschool.vn")
						}
					>
						Contact Coderschool Staff
					</Button>
				</div>
			</main>
		</>
	);
}
