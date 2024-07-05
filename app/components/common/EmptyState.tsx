import { Empty } from "antd";
import React from "react";

const EmptyState = () => {
    return (
        <Empty
            // image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<EmptyText />}
        />
    );
};

export default EmptyState;

const EmptyText = () => {
    return (
        <div className="text-gray-600">
            <h3 className="text-lg font-semibold ">Looking to buy the dip?</h3>
            {/* <h3 className="text-lg font-semibold ">
                Get some time in the market
            </h3> */}
            {/* <h3 className="text-lg font-semibold ">
                Don&apos;t try timing the market
            </h3> */}
            {/* <h3 className="text-lg font-semibold ">
                Time in the market beats timing the&nbsp;market
            </h3> */}
            <span>
                Add some stocks to your portfolio now to track them&nbsp;here
            </span>
        </div>
    );
};
