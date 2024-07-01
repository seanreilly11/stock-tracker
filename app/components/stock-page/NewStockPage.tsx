import React, { FormEvent } from "react";
import { AimOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Input, List, Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import { getUserStock } from "@/app/server/actions/db";
import { getStockNews } from "@/app/server/actions/stocks";
import Button from "../ui/Button";

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
            <div className="flex flex-col sm:flex-row gap-x-8 gap-y-6 sm:pt-8">
                <NotesSection ticker={ticker} />
                <StockNews ticker={ticker} />
            </div>
        </>
    );
};

export default NewStockPage;

const Banner = ({ prices, ticker, name, results }: Props) => {
    return (
        <div className="my-4 mb-8 sm:my-8">
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
                    <div className="text-center flex flex-col sm:text-right flex-1 basis-full">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {ticker}
                        </h1>
                        <p className="text-md w-3/4 self-end">{name}</p>
                    </div>
                    <h1 className="text-3xl sm:text-5xl my-3 sm:my-0 font-semibold tracking-tight text-indigo-600 ">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(parseFloat(prices?.results?.[0].c))}
                    </h1>
                    <div className="text-md flex-1 basis-full">2.5%</div>
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

    const handleNewNote = (e: FormEvent) => {
        e.preventDefault();
        console.log("Form");
    };

    const notesList = [
        "Add notes below",
        "Add notes below",
        "Add notes below",
        "Add notes below",
    ];

    return (
        <div className="flex-1">
            <h2 className="text-2xl mb-2">My notes</h2>
            <div className="space-y-2">
                {/* divide-y  divide-gray-200 dark:divide-gray-700 */}
                {notesList.length > 0 ? (
                    <ul className="max-w-md space-y-3 ">
                        {notesList.map((note, i) => (
                            <li key={i}>
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate ">
                                            {note}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                                        ...
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : null}
                {/* <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">
                        Click
                    </div>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                    >
                        <li>
                            <a>Item 1</a>
                        </li>
                        <li>
                            <a>Item 2</a>
                        </li>
                    </ul>
                </div> */}
                <form onSubmit={handleNewNote}>
                    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                        <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
                            <label className="sr-only">Your note</label>
                            <textarea
                                rows={4}
                                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800  dark:placeholder-gray-400"
                                placeholder="Write a note..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                            <Button text="Add note" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

type TNewsArticle = {
    id: string;
    title: string;
    description: string;
    article_url: string;
    published_utc: string;
    image_url: string;
};

const StockNews = ({ ticker }: { ticker: string }) => {
    const { data: news, isLoading } = useQuery({
        queryKey: ["stockNews", ticker],
        queryFn: () => getStockNews(ticker),
        staleTime: Infinity,
    });

    // news?.results.map((a) =>
    //     console.log(new Date(a.published_utc).getTime(), Date.now())
    // );

    return (
        <div className="flex-1">
            <h2 className="text-2xl mb-2">News</h2>
            <div className="space-y-4">
                {news?.results?.map((article: TNewsArticle) => (
                    <div key={article.id}>
                        {/* <div className="relative w-1/4 pb-16">
                            {article.image_url ? (
                                <Image
                                    src={article.image_url}
                                    alt={`logo`}
                                    // width={50}
                                    // height={50}
                                    layout="fill"
                                    objectFit="contain"
                                />
                            ) : null}
                        </div> */}
                        <p className="text-xs text-gray-500">
                            {new Date(article.published_utc).toLocaleDateString(
                                "en-au"
                            )}
                        </p>
                        {/* TODO: might move date after title or desc  */}
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
