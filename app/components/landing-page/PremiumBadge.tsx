import { Badge } from "antd";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className: string;
    premium: boolean;
};

const PremiumBadge = ({ children, className, premium }: Props) => {
    return (
        <div className={className}>
            {premium ? (
                <Badge.Ribbon text="Premium">{children}</Badge.Ribbon>
            ) : (
                children
            )}
        </div>
    );
};

export default PremiumBadge;
