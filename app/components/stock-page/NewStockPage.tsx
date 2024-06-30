import useAuth from "@/app/hooks/useAuth";
import { getUserStock } from "@/app/server/actions/db";
import { getStockNews } from "@/app/server/actions/stocks";
import { AimOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
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
            <div className="flex gap-x-4 sm:pt-8">
                <NotesSection ticker={ticker} />
                <StockNews ticker={ticker} />
            </div>
        </>
    );
};

export default NewStockPage;

const Banner = ({ prices, ticker, name, results }: Props) => {
    return (
        <div className="my-4 sm:my-8">
            <div className="flex flex-col items-center">
                <div className="mb-6">
                    {results?.branding?.icon_url ? (
                        <Image
                            src={
                                results.branding.icon_url +
                                "?apiKey=" +
                                process.env.NEXT_PUBLIC_POLYGON_API_KEY
                            }
                            alt={`${name} logo`}
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
                    <div className="text-3xl sm:text-5xl my-3 sm:my-0 font-semibold tracking-tight text-indigo-600 ">
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

const NotesSection = ({ ticker }: { ticker: string }) => {
    const { user } = useAuth();
    const { data: savedStock, isLoading } = useQuery({
        queryKey: ["savedStocks", user?.uid, ticker],
        queryFn: () => getUserStock(ticker, user?.uid),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    console.log(savedStock);

    return (
        <div className="flex-1">
            <h2 className="text-2xl">My notes</h2>
        </div>
    );
};

type TNewsArticle = {
    id: string;
    title: string;
    description: string;
    article_url: string;
    published_utc: Date;
};

const StockNews = ({ ticker }: { ticker: string }) => {
    const { data: news, isLoading } = useQuery({
        queryKey: ["stockNews", ticker],
        queryFn: () => getStockNews(ticker),
        staleTime: Infinity,
    });
    console.log(news?.results);

    return (
        <div className="flex-1">
            <h2 className="text-2xl">News</h2>
            <div className="space-y-4">
                {news?.results?.map((article: TNewsArticle) => (
                    <div key={article.id}>
                        <Link
                            className="text-md font-semibold"
                            href={article.article_url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                        >
                            {article.title}
                        </Link>
                        <p className="text-sm" title={article.description}>
                            {article.description.length > 120
                                ? article.description.substring(0, 120) + "..."
                                : article.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

{
    /* <dt className="text-base leading-7 text-gray-600">
            {results?.name}
        </dt> */
}
