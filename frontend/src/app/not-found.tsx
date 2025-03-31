"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
	const router = useRouter();

	return (
		<div className="h-[calc(100vh-70px)] flex flex-col items-center justify-center px-4">
			<div className="text-center space-y-6">
				<h1 className="text-6xl font-bold text-primary">404</h1>
				<h2 className="text-3xl font-semibold">Page Not Found</h2>
				<p className="text-lg text-muted-foreground">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<Button
					size="lg"
					className="px-8"
					onClick={() => router.push("/")}
				>
					Go Back Home
				</Button>
			</div>
		</div>
	);
}
