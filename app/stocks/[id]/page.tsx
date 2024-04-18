import React from "react";

type Props = {
    params: {
        id: string;
    };
};

const Page = ({ params }: Props) => {
    console.log(params);
    return <div>Stocks {params.id}</div>;
};

export default Page;
