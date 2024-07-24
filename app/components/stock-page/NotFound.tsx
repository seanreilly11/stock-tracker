import { Result } from "antd";
import React from "react";
import Button from "../ui/Button";
import Link from "next/link";

type Props = {
    error: any;
};

const NotFound = ({ error }: Props) => {
    return error.status === "NOT_FOUND" ? (
        <Result
            status={404}
            title={error.message}
            subTitle="Oops, looks like we don't know about that stock."
            extra={
                <Link href="/">
                    <Button>Back Home</Button>
                </Link>
            }
        />
    ) : (
        <Result
            status={500}
            title={error?.message || "500"}
            subTitle="Oops, we've had an issue."
            extra={
                <Link href="/">
                    <Button>Back Home</Button>
                </Link>
            }
        />
    );
};

export default NotFound;
