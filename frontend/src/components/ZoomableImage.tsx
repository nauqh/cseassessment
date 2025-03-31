import { useState } from "react";
import Image from "next/image";
import { MdZoomIn } from "react-icons/md";
import { createPortal } from "react-dom";

export default function ZoomableImage({ src }: { src: string }) {
	const [isZoomed, setIsZoomed] = useState(false);

	const toggleZoom = () => {
		setIsZoomed(!isZoomed);
	};

	return (
		<>
			<span
				className="relative inline-block cursor-pointer group"
				onClick={toggleZoom}
			>
				<Image
					src={src}
					alt="Question diagram"
					width={800}
					height={600}
					className="max-w-full h-auto"
				/>
				<span className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center pointer-events-none">
					<MdZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</span>
			</span>

			{isZoomed &&
				typeof document !== "undefined" &&
				createPortal(
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
						onClick={toggleZoom}
					>
						<div className="relative max-w-[90vw] max-h-[90vh]">
							<Image
								src={src}
								alt="Zoomed diagram"
								width={1600}
								height={1200}
								className="max-w-full max-h-[90vh] object-contain rounded-sm"
							/>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
