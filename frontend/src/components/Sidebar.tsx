"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BsClock, BsGear, BsDiscord } from "react-icons/bs";
import { BiLogIn } from "react-icons/bi";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface NavButtonProps {
	href: string;
	icon: ReactNode;
	label: string;
	onClick?: () => void;
	className?: string;
	variant?: "ghost" | "default" | "outline";
}

const NavButton = ({
	href,
	icon,
	label,
	onClick,
	className = "",
	variant = "ghost",
}: NavButtonProps) => (
	<Link href={href}>
		<Button
			variant={variant}
			onClick={onClick}
			className={`w-full justify-center sm:justify-start text-base font-normal h-11 px-2 sm:px-3 transition-all ${className}`}
		>
			<span className="mr-0 sm:mr-2 md:mr-3 text-lg">{icon}</span>
			<span className="hidden sm:inline text-sm">{label}</span>
		</Button>
	</Link>
);

export default function Sidebar() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const { toast } = useToast();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentView = searchParams.get("view") || "history";

	const handleSignOut = () => {
		toast({
			description: "Signing out...",
		});
		signOut();
	};

	const navItems = [
		{
			href: "/profile?view=history",
			icon: <BsClock />,
			label: "Exam History",
			isActive: pathname === "/profile" && currentView === "history",
		},
		{
			href: "/profile?view=settings",
			icon: <BsGear />,
			label: "Settings",
			isActive: pathname === "/profile" && currentView === "settings",
		},
		{
			href: "https://discord.com/channels/957854915194126336/1081063200377806899",
			icon: <BsDiscord />,
			label: "Community",
		},
	];

	return (
		<div
			className="fixed mt-2 left-4 top-1/2 -translate-y-1/2 h-[60vh] rounded-lg w-64 border bg-white  
			shadow-lg transition-all duration-300 ease-in-out hidden md:flex flex-col"
		>
			<div className="p-2 sm:p-3 md:p-4 border-b">
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="w-full sm:w-auto flex justify-center sm:justify-start">
						<Link href={`/profile`}>
							<Avatar className="h-8 w-8 sm:h-10 sm:w-10">
								<AvatarImage src={user?.imageUrl} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</Link>
					</div>
					<div className="hidden sm:block text-sm">
						<p className="font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-[150px]">
							{user?.fullName}
						</p>
						<p className="text-gray-500 text-xs md:text-sm truncate max-w-[120px] md:max-w-[150px]">
							{user?.primaryEmailAddress?.emailAddress}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col flex-1 overflow-y-auto">
				<div className="px-2 md:px-4 py-2">
					<div className="flex flex-col gap-2">
						{navItems.map((item) => {
							const variant = item.isActive ? "default" : "ghost";
							return (
								<NavButton
									key={item.href}
									href={item.href}
									icon={item.icon}
									label={item.label}
									variant={variant}
								/>
							);
						})}
					</div>
				</div>

				<div className="mt-auto border-t p-2 ">
					<NavButton
						href=""
						icon={<BiLogIn />}
						label="Sign out"
						onClick={handleSignOut}
						className="hover:bg-gray-100 text-red-600 hover:text-red-700"
					/>
				</div>
				<Toaster />
			</div>
		</div>
	);
}
