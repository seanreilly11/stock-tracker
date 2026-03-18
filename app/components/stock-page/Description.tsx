"use client";
import React, { useState } from "react";
import { DESCRIPTION_EXPAND_LENGTH } from "@/utils/constants";

type Props = {
    text: string;
};

const Description = ({ text }: Props) => {
    const [showReadMore, setShowReadMore] = useState(false);

    return text ? (
        <div>
            <p className="leading-7">
                {showReadMore ? text : text?.slice(0, DESCRIPTION_EXPAND_LENGTH)}
                {text?.length > DESCRIPTION_EXPAND_LENGTH && (
                    <span onClick={() => setShowReadMore((prev) => !prev)}>
                        {showReadMore ? (
                            <span className="font-semibold cursor-pointer text-purple-900">
                                {" "}
                                Show less
                            </span>
                        ) : (
                            <>
                                ...{" "}
                                <span className="font-semibold cursor-pointer text-purple-900">
                                    Read more
                                </span>
                            </>
                        )}
                    </span>
                )}
            </p>
        </div>
    ) : null;
};

export default Description;
