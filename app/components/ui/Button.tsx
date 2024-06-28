import React from "react";
import Spinner from "./Spinner";

interface Props extends React.HTMLProps<HTMLButtonElement> {
    loading?: boolean;
    text: string;
    outline?: "outline" | "filled" | "link";
    type?: "submit" | "button" | "reset" | undefined;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
    loading,
    text,
    outline = "filled",
    type = "button",
    className,
    onClick,
}: Props) => {
    return (
        <button
            className={
                "rounded-md px-3.5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 " +
                (outline === "outline"
                    ? "bg-transparent hover:bg-indigo-500 border border-indigo-600 hover:border-transparent text-indigo-600 hover:text-white shadow-sm"
                    : outline === "link"
                    ? "bg-transparent hover:border-indigo-500 border border-transparent text-indigo-600 hover:text-indigo-500"
                    : "text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm") +
                " " +
                className
            }
            type={type}
            onClick={onClick}
        >
            {loading ? <Spinner /> : text}
        </button>
    );
};

export default Button;
