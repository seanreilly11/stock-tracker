import { Card } from "antd";
import Link from "next/link";
import React from "react";

type Props = {
    details: {
        results: {
            homepage_url: string;
            name: string;
            description: string;
            sic_description: string;
        };
    };
    prices: {
        ticker: string;
        results: [
            {
                c: string;
                o: string;
            }
        ];
    };
};

const StockDetails = ({ details, prices }: Props) => {
    return (
        <Card className="md:basis-3/5">
            <div className="mb-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">{prices?.ticker}</h2>
                    <div className="flex items-center">
                        <p className="text-red-500">
                            1.35%
                            {/* math will be replaced with actual value once paying for next tier  */}
                        </p>
                        <p className="text-lg font-medium ml-2">
                            ${prices?.results?.[0].c}
                        </p>
                    </div>
                </div>
                <div>
                    <Link
                        href={details.results.homepage_url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                    >
                        {details.results.name}
                    </Link>
                </div>
            </div>
            <div className="mb-3">
                <p>{details.results.sic_description}</p>
            </div>
            <div>
                <p>{details.results.description}</p>
            </div>
            {/* <Image
                src={
                    details?.results.branding.logo_url +
                    "?apiKey=bZVZXz83pe0SFpRvjzubFtizArepCMs1"
                }
                alt="Logo"
                width={100}
                height={100}
                priority
            /> */}
        </Card>
    );
};

export default StockDetails;
