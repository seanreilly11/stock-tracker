"use client";

type Props = {
    error: Error;
    reset: () => void;
};

const StockError = ({ error, reset }: Props) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <h2 className="text-xl font-semibold">Failed to load stock</h2>
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

export default StockError;
