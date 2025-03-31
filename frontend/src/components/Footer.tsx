import Link from "next/link";

export default function Footer() {
	return (
		<footer className=" py-10">
			<div className="px-4 md:px-8 lg:px-16">
				<div className="mt-10 border-t border-gray-700 pt-4">
					<div className="flex justify-between items-center text-xs text-gray-500">
						<div>Copyright © {new Date().getFullYear()} Nauqh.</div>
						<div className="flex gap-4">
							<Link href="/" className="hover:text-white">
								Privacy Policy
							</Link>
							<Link href="/" className="hover:text-white">
								Terms of Use
							</Link>
							<Link href="/" className="hover:text-white">
								Cookies
							</Link>
							<Link href="/" className="hover:text-white">
								Preferences
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
