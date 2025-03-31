export function LoadingScreen() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="space-y-4 text-center">
				<div className="text-4xl font-bold animate-pulse">
					Loading...
				</div>
				<div className="text-muted-foreground">
					Please wait while we prepare your content
				</div>
			</div>
		</div>
	);
}
