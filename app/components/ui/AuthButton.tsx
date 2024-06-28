import React, { ReactElement } from "react";

interface Props extends React.HTMLProps<HTMLButtonElement> {
    text: string;
    icon: ReactElement;
    outline?: "outline" | "filled" | "link";
    onClick?: () => void;
}

const AuthButton = ({ text, icon, outline, onClick }: Props) => {
    return (
        <button
            // className="rounded-md px-3.5 py-2.5 flex items-center justify-center w-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
            className={
                "rounded-md px-3.5 py-2.5 flex items-center justify-center w-full text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 " +
                (outline === "outline"
                    ? "bg-transparent hover:bg-indigo-500 border border-indigo-600 hover:border-transparent text-indigo-600 hover:text-white shadow-sm"
                    : outline === "link"
                    ? "bg-transparent hover:border-indigo-600 border border-transparent text-indigo-600 hover:text-indigo-500"
                    : "text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm")
            }
            onClick={onClick}
            type="button"
        >
            {icon} <span className="ml-2">{text}</span>
        </button>
    );
};

export default AuthButton;
