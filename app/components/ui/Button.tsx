import React from "react";
import Spinner from "./Spinner";

interface Props extends React.HTMLProps<HTMLButtonElement> {
    loading?: boolean;
    outline?: "outline" | "filled" | "link";
    type?: "submit" | "button" | "reset" | undefined;
    className?: string;
    padding?: string;
    fontSize?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    children: React.ReactNode;
}

const Button = ({
    loading,
    outline = "filled",
    type = "button",
    className = "",
    padding = "px-3.5 py-2.5",
    fontSize = "text-sm",
    onClick,
    children,
    ...rest
}: Props) => {
    return (
        <button
            className={`rounded-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                outline === "outline"
                    ? `bg-transparent hover:bg-primary-hover border border-primary hover:border-transparent text-primary hover:text-white shadow-sm`
                    : outline === "link"
                    ? `bg-transparent hover:border-primary-hover border border-transparent text-primary hover:text-primary-hover`
                    : `text-white bg-primary hover:bg-primary-hover shadow-sm`
            } ${className} ${padding} ${fontSize}`}
            type={type}
            onClick={onClick}
            {...rest}
        >
            {loading ? <Spinner size="small" /> : children}
        </button>
    );
};

export default Button;
