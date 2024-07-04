import React from "react";

type Props = {
    size?: "small" | "large";
    colour?: string;
};

const Spinner = ({ size = "small", colour = "white" }: Props) => {
    const width = size === "small" ? 5 : 12;
    return (
        <div className={`h-${width} w-${width} mx-auto`}>
            <svg
                className={`animate-spin h-${width} w-${width} text-${colour}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
        </div>
    );
};

export default Spinner;
