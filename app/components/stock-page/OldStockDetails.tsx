import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Price from "../ui/Price";

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

const OldStockDetails = ({ details: { results }, prices }: Props) => {
    const [showReadMore, setShowReadMore] = useState(true);
    return (
        <Card className="md:basis-3/5">
            <div className="space-y-3">
                <div className="flex items-center space-x-2">
                    {results.branding?.icon_url ? (
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
                    <div>
                        <h2 className="text-3xl font-bold">{prices?.ticker}</h2>
                        {results.homepage_url ? (
                            <Link
                                href={results.homepage_url || ""}
                                target="_blank"
                                referrerPolicy="no-referrer"
                            >
                                {results.name}
                            </Link>
                        ) : (
                            <p>{results.name}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-end">
                    <Price value={parseFloat(prices?.results?.[0].c)} />
                    <p className="text-emerald-500">1.25%</p>
                    {/* math will be replaced with actual value once paying for next tier  */}
                </div>
                <div className="space-y-2">
                    <div>
                        <p>{results.sic_description}</p>
                    </div>
                    {results?.description ? (
                        <div>
                            <p className="leading-7">
                                {showReadMore
                                    ? results?.description.slice(0, 200)
                                    : results?.description}
                                {results?.description.length > 200 && (
                                    <span
                                        onClick={() =>
                                            setShowReadMore((prev) => !prev)
                                        }
                                    >
                                        {showReadMore ? (
                                            <>
                                                ...{" "}
                                                <span className="font-semibold cursor-pointer text-purple-900">
                                                    Read more
                                                </span>
                                            </>
                                        ) : (
                                            <span className="font-semibold cursor-pointer text-purple-900">
                                                {" "}
                                                Show less
                                            </span>
                                        )}
                                    </span>
                                )}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </Card>
    );
};

export default OldStockDetails;
