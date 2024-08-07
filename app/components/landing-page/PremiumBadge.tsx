import { Badge } from "antd";
import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
    premium?: boolean;
    text?: string;
};

const PremiumBadge = ({
    children,
    className,
    premium,
    text = "Premium",
}: Props) => {
    return (
        <div className={className}>
            {premium ? (
                <Badge.Ribbon text={text}>{children}</Badge.Ribbon>
            ) : (
                children
            )}
        </div>
    );
};

export default PremiumBadge;
