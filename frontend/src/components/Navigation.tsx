"use client";

import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	BiUser,
	BiSearch,
	BiHelpCircle,
	BiLogIn,
	BiChevronRight,
	BiMenu,
	BiX,
} from "react-icons/bi";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export default function Navigation() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const { toast } = useToast();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const router = useRouter();
	const pathname = usePathname();

	const searchPaths = {
		profile: "/profile",
		settings: "/settings",
		help: "/help",
		exams: "/exams",
		courses: "https://www.coderschool.vn",
		home: "/",
	};

	const handleSignOut = () => {
		toast({
			description: "Signing out...",
		});
		signOut();
	};

	const handleSearch = () => {
		if (!searchQuery.trim()) {
			toast({
				description: "Blank space? I'm no Taylor Swift - fill it up!",
				duration: 3000,
			});
			return;
		}

		const query = searchQuery
			.toLowerCase()
			.trim() as keyof typeof searchPaths;
		const path = searchPaths[query];

		if (path) {
			setIsSearchOpen(false);
			setSearchQuery("");

			if (path.startsWith("http")) {
				window.location.href = path;
			} else {
				router.push(path);
			}

			toast({
				description: `Navigating to ${query}...`,
				duration: 2000,
			});
		} else {
			toast({
				description: "No matching page found!",
				duration: 3000,
			});
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const generateBreadcrumbs = () => {
		if (!pathname || pathname === "/") return [];

		const segments = pathname.split("/").filter((segment) => segment);
		let path = "";

		return segments.map((segment, index) => {
			path += `/${segment}`;
			const formattedSegment = segment
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");

			return {
				label: formattedSegment,
				href: path,
				isLast: index === segments.length - 1,
			};
		});
	};

	return (
		<>
			<nav className="sticky top-0 w-full bg-white/90 backdrop-blur-sm z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col gap-2">
						<div className="flex justify-between items-center h-16 text-gray-700">
							{/* Left Section: Hamburger, Logo & Navigation Links */}
							<div className="flex items-center gap-4">
								<div
									className="relative w-6 h-6 sm:hidden cursor-pointer"
									onClick={() =>
										setIsMobileNavOpen(!isMobileNavOpen)
									}
								>
									<BiMenu
										className={`absolute h-6 w-6 transition-all duration-300 ease-in-out
          ${
				isMobileNavOpen
					? "opacity-0 transform rotate-90"
					: "opacity-100 transform rotate-0"
			}`}
									/>
									<BiX
										className={`absolute h-6 w-6 transition-all duration-300 ease-in-out
          ${
				isMobileNavOpen
					? "opacity-100 transform rotate-0"
					: "opacity-0 transform -rotate-90"
			}`}
									/>
								</div>
								<Link href="/">
									<Image
										src="/logo.png"
										alt="eExams Logo"
										width={150}
										height={50}
										className="hover:opacity-90 transition-opacity"
									/>
								</Link>
								<div className="hidden sm:flex items-center gap-8 ml-8">
									<Link
										href="/"
										className="hover:text-primary"
									>
										Home
									</Link>
									<Link
										href="/exams"
										className="hover:text-primary"
									>
										Exams
									</Link>
									<Link
										href="/courses"
										className="hover:text-primary"
									>
										Courses
									</Link>
								</div>
							</div>

							{/* Right Section: Search & User */}
							<div className="flex items-center gap-4">
								<div className="hidden sm:flex items-center">
									<div
										className="flex items-center w-full border border-gray-200 rounded-lg transition-colors cursor-pointer group hover:border-primary bg-gray-50/50"
										onClick={() =>
											setIsSearchOpen(!isSearchOpen)
										}
									>
										<input
											type="text"
											placeholder="Search..."
											className="w-full px-3 py-1.5 bg-transparent rounded-lg focus:outline-none text-sm placeholder:text-gray-400 group-hover:placeholder:text-primary hover:cursor-pointer"
											value={searchQuery}
											onChange={(e) =>
												setSearchQuery(e.target.value)
											}
										/>
										<div className="px-2 text-gray-400 group-hover:text-primary">
											<BiSearch className="h-4 w-4" />
										</div>
									</div>
								</div>

								{/* Mobile Search Button */}

								<BiSearch
									className="sm:hidden h-6 w-6"
									onClick={() => setIsSearchOpen(true)}
								/>

								{/* User Section */}
								<SignedIn>
									<DropdownMenu modal={false}>
										<DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 rounded-full p-1.5 transition-colors outline-none">
											<Avatar className="h-7 w-7">
												<AvatarImage
													src={user?.imageUrl}
												/>
												<AvatarFallback>
													CN
												</AvatarFallback>
											</Avatar>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="min-w-max p-2 rounded-md shadow-lg bg-white border border-gray-200"
										>
											<DropdownMenuLabel className="px-3 py-2">
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src={user?.imageUrl}
														/>
														<AvatarFallback>
															CN
														</AvatarFallback>
													</Avatar>
													<div className="flex flex-col">
														<span className="font-semibold text-primary">
															{user?.fullName ||
																"User"}
														</span>
														<span className="text-xs text-primary/50">
															{user
																?.emailAddresses[0]
																.emailAddress ||
																"email"}
														</span>
													</div>
												</div>
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<Link href="/profile">
												<DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer group">
													<BiUser className="h-5 w-5 text-gray-600" />
													View profile
													<BiChevronRight className="h-5 w-5 text-gray-600 ml-auto transform transition-transform group-hover:translate-x-1" />
												</DropdownMenuItem>
											</Link>
											<Link href="/help">
												<DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer group">
													<BiHelpCircle className="h-5 w-5 text-gray-600" />
													Help
													<BiChevronRight className="h-5 w-5 text-gray-600 ml-auto transform transition-transform group-hover:translate-x-1" />
												</DropdownMenuItem>
											</Link>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600 rounded-lg cursor-pointer group"
												onClick={handleSignOut}
											>
												<BiLogIn className="h-5 w-5" />
												Sign out
												<BiChevronRight className="h-5 w-5 ml-auto transform transition-transform group-hover:translate-x-1" />
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</SignedIn>

								<SignedOut>
									<Link href="/auth/sign-in">
										<Button>Sign in</Button>
									</Link>
								</SignedOut>
							</div>
						</div>

						{/* Dynamic Breadcrumb */}
						{pathname !== "/" && (
							<div className="pb-2">
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem>
											<BreadcrumbLink href="/">
												Home
											</BreadcrumbLink>
										</BreadcrumbItem>
										{generateBreadcrumbs().map(
											(breadcrumb) => (
												<Fragment key={breadcrumb.href}>
													<BreadcrumbSeparator />
													<BreadcrumbItem>
														{breadcrumb.isLast ? (
															<BreadcrumbPage>
																{
																	breadcrumb.label
																}
															</BreadcrumbPage>
														) : (
															<BreadcrumbLink
																href={
																	breadcrumb.href
																}
															>
																{
																	breadcrumb.label
																}
															</BreadcrumbLink>
														)}
													</BreadcrumbItem>
												</Fragment>
											)
										)}
									</BreadcrumbList>
								</Breadcrumb>
							</div>
						)}
					</div>
				</div>
			</nav>

			{/* Mobile Navigation Dropdown */}
			<div
				className={`sm:hidden fixed top-16 left-0 w-full bg-white/95 backdrop-blur-sm transition-all duration-200 ease-in-out z-50 ${
					isMobileNavOpen
						? "opacity-100 visible"
						: "opacity-0 invisible"
				}`}
			>
				<div className="px-4 py-3 space-y-1">
					<Link
						href="/"
						onClick={() => setIsMobileNavOpen(false)}
						className="block py-2.5 px-4 text-gray-700 hover:bg-gray-50 rounded-lg hover:text-primary transition-colors"
					>
						Home
					</Link>
					<Link
						href="/exams"
						onClick={() => setIsMobileNavOpen(false)}
						className="block py-2.5 px-4 text-gray-700 hover:bg-gray-50 rounded-lg hover:text-primary transition-colors"
					>
						Exams
					</Link>
					<Link
						href="/courses"
						onClick={() => setIsMobileNavOpen(false)}
						className="block py-2.5 px-4 text-gray-700 hover:bg-gray-50 rounded-lg hover:text-primary transition-colors"
					>
						Courses
					</Link>
				</div>
			</div>

			{/* Full Screen Search Overlay */}
			<div
				className={`fixed inset-0 w-full h-full bg-white/95 backdrop-blur-sm z-[60] transition-all duration-300 ease-in-out ${
					isSearchOpen
						? "opacity-100 visible scale-100"
						: "opacity-0 invisible scale-95"
				}`}
				onClick={() => setIsSearchOpen(false)}
			>
				<div className="container mx-auto p-8 max-w-5xl h-full">
					<div className="max-w-2xl mx-auto mt-20">
						<div
							className="relative"
							onClick={(e) => e.stopPropagation()}
						>
							<input
								type="text"
								placeholder="Type something..."
								className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-[hsl(var(--secondary-color))] bg-white"
								autoFocus={isSearchOpen}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onKeyDown={handleKeyPress}
							/>
							<button
								className="absolute right-0 top-0 h-full px-6 rounded-r-lg bg-transparent hover:bg-primary text-primary hover:text-white transition-all"
								onClick={() => {
									handleSearch();
								}}
							>
								Search
							</button>
						</div>
						<div
							className="mt-8"
							onClick={(e) => e.stopPropagation()}
						>
							<h3 className="font-semibold mb-4">Popular tags</h3>
							<div className="flex flex-wrap gap-3">
								{[
									"sql",
									"python",
									"pandas",
									"multichoices",
									"problems",
								].map((tag) => (
									<button
										key={tag}
										className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transform transition-all duration-200 ease-in-out hover:shadow-md active:scale-95"
										onClick={() => setSearchQuery(tag)}
									>
										#{tag}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			<Toaster />
		</>
	);
}
