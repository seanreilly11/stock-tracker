import { Empty } from "antd";
import React from "react";

const EmptyState = () => {
    return (
        <Empty
            description={
                <span>Add some stocks to your portfolio to see them here</span>
            }
        />
    );
};

export default EmptyState;
