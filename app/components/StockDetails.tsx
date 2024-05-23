import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Price from "./Price";

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
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    {details?.results.branding?.icon_url ? (
                        <Image
                            src={
                                details?.results.branding.icon_url +
                                "?apiKey=" +
                                process.env.NEXT_PUBLIC_POLYGON_API_KEY
                            }
                            alt="Logo"
                            width={50}
                            height={50}
                            priority
                        />
                    ) : null}
                    <div>
                        <h2 className="text-3xl font-bold">{prices?.ticker}</h2>
                        {details.results.homepage_url ? (
                            <Link
                                href={details.results.homepage_url || ""}
                                target="_blank"
                                referrerPolicy="no-referrer"
                            >
                                {details.results.name}
                            </Link>
                        ) : (
                            <p>{details.results.name}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-end">
                    <Price
                        value={parseFloat(prices?.results?.[0].c)}
                        margin="r"
                    />
                    <p className="text-green-500">1.25%</p>
                    {/* math will be replaced with actual value once paying for next tier  */}
                </div>
                <div className="space-y-2">
                    <div>
                        <p>{details.results.sic_description}</p>
                    </div>
                    <div>
                        <p>{details.results.description}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StockDetails;
