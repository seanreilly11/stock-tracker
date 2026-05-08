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
            // className="rounded-md px-3.5 py-2.5 flex items-center justify-center w-full text-sm font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary "
            className={`rounded-md px-3.5 py-2.5 flex items-center justify-center w-full text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                outline === "outline"
                    ? `bg-transparent hover:bg-primary-hover border border-primary hover:border-transparent text-primary hover:text-white shadow-sm`
                    : outline === "link"
                    ? `bg-transparent hover:border-primary border border-transparent text-primary hover:text-primary-hover`
                    : `text-white bg-primary hover:bg-primary-hover shadow-sm`
            }`}
            onClick={onClick}
            type="button"
        >
            {icon} <span className="ml-2">{text}</span>
        </button>
    );
};

export default AuthButton;
