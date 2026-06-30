"use client";

interface LoadingStateProps {
	message: string;
	showSpinner?: boolean;
}

const LoadingState = ({ message, showSpinner = true }: LoadingStateProps) => {
	return (
		<div
			className="flex min-h-48 w-full flex-col items-center justify-center gap-4 rounded-lg border border-zinc-200 bg-white p-8 text-center"
			role="status"
			aria-live="polite"
		>
			{showSpinner ? (
				<div
					className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
					aria-hidden="true"
				/>
			) : null}
			<p className="text-sm font-medium text-zinc-700">{message}</p>
		</div>
	);
};

export default LoadingState;
