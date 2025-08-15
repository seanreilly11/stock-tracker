import React from "react";
import Spinner from "../ui/Spinner";
import AppName from "./AppName";

const LoaderFullscreen = () => {
    return (
        <div className="fixed w-full h-full top-0 left-0 z-50 bg-gray-50 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900 whitespace-nowrap text-nowrap">
                <AppName />
            </h1>
            <Spinner size="large" colour="primary" />
        </div>
    );
};

export default LoaderFullscreen;
