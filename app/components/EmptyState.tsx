import { Empty } from "antd";
import React from "react";

const EmptyState = () => {
    return (
        <Empty
            description={
                <span>Add stock to your portfolio to see it here</span>
            }
        />
    );
};

export default EmptyState;
