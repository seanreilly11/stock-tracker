"use client";

type Props = {
    error: Error;
    reset: () => void;
};

const Error = ({ error, reset }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-gray-500">{error.message}</p>
            <button
                className="text-primary hover:underline"
                onClick={reset}
            >
                Try again
            </button>
        </div>
    );
};

export default Error;
