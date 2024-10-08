import { Empty } from "antd";
import React from "react";

type Props = {
    page: "Home" | "Notes" | "NextToBuy";
};

const EmptyState = ({ page }: Props) => {
    return (
        <Empty
            // image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<EmptyText page={page} />}
        />
    );
};

export default EmptyState;

const EmptyText = ({ page }: Props) => {
    const text: Record<string, Record<string, string>> = {
        Home: {
            title: "Looking to buy the dip?",
            content: "Add some stocks to your portfolio now to track them here",
        },
        Notes: {
            title: "What do you think?",
            content:
                "Write your notes about this stock down below or add some AI-powered notes to get started",
        },
        NextToBuy: {
            title: "What will you buy next?",
            content: "Add some stocks that you are planning to buy next",
        },
    };

    {
        /* <h3 className="text-lg font-semibold ">
                Get some time in the market
        </h3>
        <h3 className="text-lg font-semibold ">
            Don&apos;t try timing the market
        </h3>
        <h3 className="text-lg font-semibold ">
            Time in the market beats timing the&nbsp;market
        </h3> */
    }
    return (
        <div className="text-gray-600">
            <h3 className="text-lg font-semibold ">{text[page].title}</h3>
            <span>{text[page].content}</span>
        </div>
    );
};
