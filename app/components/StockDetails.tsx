import { Card, Statistic } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
    details: {
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
                    <div className="flex items-center space-x-2 grow">
                        {details?.results.branding?.icon_url ? (
                            <Image
                                src={
                                    details?.results.branding.icon_url +
                                    "?apiKey=bZVZXz83pe0SFpRvjzubFtizArepCMs1"
                                }
                                alt="Logo"
                                width={50}
                                height={50}
                                priority
                            />
                        ) : null}
                        <div>
                            <h2 className="text-3xl font-bold">
                                {prices?.ticker}
                            </h2>
                            <Link
                                href={details.results.homepage_url || ""}
                                target="_blank"
                                referrerPolicy="no-referrer"
                            >
                                {details.results.name}
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <p className="text-green-500">1.25%</p>
                        {/* math will be replaced with actual value once paying for next tier  */}
                        <p className="text-lg font-medium ml-2">
                            ${prices?.results?.[0].c}
                        </p>
                    </div>
                </div>
                {/* <div>
                    <Link
                        href={details.results.homepage_url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                    >
                        {details.results.name}
                    </Link>
                </div> */}
            </div>
            <div className="mb-3">
                <p>{details.results.sic_description}</p>
            </div>
            <div>
                <p>{details.results.description}</p>
            </div>
        </Card>
    );
};

export default StockDetails;
