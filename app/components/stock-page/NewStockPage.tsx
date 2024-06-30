import { AimOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import Image from "next/image";
import React from "react";

type Props = {
    name: string;
    ticker: string;
    prices: {
        ticker: string;
        results: [
            {
                c: string;
                o: string;
            }
        ];
    };
    results: {
        homepage_url: string;
        name: string;
        description: string;
        sic_description: string;
        branding: {
            logo_url: string;
            icon_url: string;
        };
    };
};

const NewStockPage = ({ name, prices, ticker, results }: Props) => {
    /** 
     
    ticker
    name
    icon
    price
    change
    description

    target price 
    holding
    notes

    delete 
    submit

    **/
    return (
        <>
            <Banner
                ticker={ticker}
                name={name}
                prices={prices}
                results={results}
            />
        </>
    );
};

export default NewStockPage;

const Banner = ({ prices, ticker, name, results }: Props) => {
    return (
        <div className="my-6">
            <div className="flex flex-col items-center">
                <div className="mb-6">
                    {results?.branding?.icon_url ? (
                        <Image
                            src={
                                results.branding.icon_url +
                                "?apiKey=" +
                                process.env.NEXT_PUBLIC_POLYGON_API_KEY
                            }
                            alt="Logo"
                            width={50}
                            height={50}
                            priority
                        />
                    ) : null}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-x-6 mb-6 w-full">
                    <div className="text-center sm:text-right flex-1 basis-full">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {ticker}
                        </h1>
                        <p className="text-md">{name}</p>
                    </div>
                    <div className="text-3xl sm:text-5xl my-3 sm:my-0 font-semibold tracking-tight text-gray-900 ">
                        ${prices?.results?.[0].c}
                    </div>
                    <div className="flex-1 basis-full">2.5%</div>
                </div>
                <div className="flex sm:items-center gap-x-3">
                    <AimOutlined className="text-3xl" title="Target price" />
                    <h2 className="text-2xl">$300</h2>
                </div>
            </div>
        </div>
    );
};

{
    /* <dt className="text-base leading-7 text-gray-600">
            {results?.name}
        </dt> */
}
