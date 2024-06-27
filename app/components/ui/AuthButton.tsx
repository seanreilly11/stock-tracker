import React, { ReactElement } from "react";

interface Props extends React.HTMLProps<HTMLButtonElement> {
    text: string;
    icon: ReactElement;
    onClick?: () => void;
}

const AuthButton = ({ text, icon, onClick }: Props) => {
    return (
        <button
            className="rounded-md px-3.5 py-2.5 flex items-center justify-center w-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
            onClick={onClick}
            type="button"
        >
            {icon} <span className="ml-2">{text}</span>
        </button>
    );
};

export default AuthButton;
