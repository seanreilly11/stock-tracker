import React from "react";
import Spinner from "../ui/Spinner";

type Props = {};

const LoaderFullscreen = (props: Props) => {
    return (
        <div className="fixed w-full h-full top-0 left-0 bg-gray-50 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-6 text-gray-900 whitespace-nowrap text-nowrap">
                <span className="text-indigo-600">bull</span>
                <span className="text-emerald-500">rush</span>
            </h1>
            <Spinner size="large" colour="indigo-600" />
        </div>
    );
};

export default LoaderFullscreen;
