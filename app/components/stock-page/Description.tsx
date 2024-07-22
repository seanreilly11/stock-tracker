import React, { useState } from "react";

type Props = {
    text: string;
};

const Description = ({ text }: Props) => {
    const [showReadMore, setShowReadMore] = useState(false);

    return text ? (
        <div>
            <p className="leading-7">
                {showReadMore ? text?.slice(0, 200) : text}
                {text?.length > 200 && (
                    <span onClick={() => setShowReadMore((prev) => !prev)}>
                        {showReadMore ? (
                            <>
                                ...{" "}
                                <span className="font-semibold cursor-pointer text-purple-900">
                                    Read more
                                </span>
                            </>
                        ) : (
                            <span className="font-semibold cursor-pointer text-purple-900">
                                {" "}
                                Show less
                            </span>
                        )}
                    </span>
                )}
            </p>
        </div>
    ) : null;
};

export default Description;
