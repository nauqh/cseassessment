import { ClerkProvider, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { LoadingScreen } from "@/components/ui/loading";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
	subsets: ["latin"],
	variable: "--font-manrope",
});

export const metadata: Metadata = {
	title: "Coderschool e-Exam",
	description: "Final Assessment Platform for Coderschool Students",
	icons: {
		icon: "/favicon.png",
	},
	openGraph: {
		title: "Coderschool e-Exam",
		description: "Final Assessment Platform for Coderschool Students",
		type: "website",
		url: "https://csassessment.it.com",
		images: [
			{
				url: "https://csassessment.it.com/banner.png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "csassessment.it.com",
		creator: "@nauqh",
		images: ["https://csassessment.it.com/banner.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={`${manrope.variable} antialiased`}>
					<ClerkLoading>
						<LoadingScreen />
					</ClerkLoading>
					<ClerkLoaded>{children}</ClerkLoaded>
				</body>
			</html>
		</ClerkProvider>
	);
}
