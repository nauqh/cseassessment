import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { MdZoomIn } from "react-icons/md";
import { createPortal } from "react-dom";

export default function ZoomableImage({ src }: { src: string }) {
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const dragStartRef = useRef({ x: 0, y: 0 });
	const panStartRef = useRef({ x: 0, y: 0 });

	const toggleZoom = () => {
		setIsZoomed(!isZoomed);
		// Reset zoom level and pan position when toggling zoom
		setZoomLevel(1);
		setPanPosition({ x: 0, y: 0 });
	};

	const handleWheel = useCallback((e: React.WheelEvent) => {
		e.stopPropagation();

		// Prevent default to avoid page scrolling while zooming
		e.preventDefault();

		// Adjust zoom level based on scroll direction
		const delta = e.deltaY > 0 ? -0.1 : 0.1;

		// Keep zoom level within reasonable bounds
		setZoomLevel((prevZoom) => {
			const newZoom = prevZoom + delta;
			return Math.max(0.5, Math.min(newZoom, 3)); // Limit zoom between 0.5x and 3x
		});
	}, []);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			// Only enable dragging if zoomed in beyond 1
			if (zoomLevel > 1) {
				setIsDragging(true);
				dragStartRef.current = { x: e.clientX, y: e.clientY };
				panStartRef.current = { ...panPosition };
				e.preventDefault();
			}
		},
		[zoomLevel, panPosition]
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (isDragging) {
				const dx = e.clientX - dragStartRef.current.x;
				const dy = e.clientY - dragStartRef.current.y;

				setPanPosition({
					x: panStartRef.current.x + dx,
					y: panStartRef.current.y + dy,
				});
				e.preventDefault();
			}
		},
		[isDragging]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	return (
		<>
			<span
				className="relative inline-block cursor-pointer group p-4 rounded-lg border"
				onClick={toggleZoom}
			>
				<Image
					src={src}
					alt="Question diagram"
					width={800}
					height={600}
					className="max-w-full h-auto"
				/>
				<span className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center pointer-events-none rounded-lg">
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
						<div
							className="relative max-w-[90vw] max-h-[90vh] overflow-hidden bg-white rounded-md shadow-lg p-6"
							onClick={(e) => e.stopPropagation()}
							onWheel={handleWheel}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
							style={{
								cursor:
									zoomLevel > 1
										? isDragging
											? "grabbing"
											: "grab"
										: "default",
							}}
						>
							<div
								style={{
									transform: `scale(${zoomLevel}) translate(${
										panPosition.x / zoomLevel
									}px, ${panPosition.y / zoomLevel}px)`,
									transformOrigin: "center",
									transition: isDragging
										? "none"
										: "transform 0.1s ease-out",
								}}
							>
								<Image
									src={src}
									alt="Zoomed diagram"
									width={1600}
									height={1200}
									className="max-w-full max-h-[90vh] object-contain"
									draggable="false"
								/>
							</div>
							<div className="absolute bottom-4 right-4 text-center text-black bg-white bg-opacity-70 py-1 px-3 rounded-full text-sm shadow-sm">
								{Math.round(zoomLevel * 100)}%
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	);
}
