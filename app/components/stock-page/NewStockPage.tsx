import React, { FormEvent, useState } from "react";
import {
    AimOutlined,
    EllipsisOutlined,
    FallOutlined,
    QuestionCircleOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input, List, Modal, Skeleton, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/app/hooks/useAuth";
import { addStock, getUserStock, updateStock } from "@/app/server/actions/db";
import { getStockNews } from "@/app/server/actions/stocks";
import Button from "../ui/Button";
import moment from "moment";
import { Stock } from "@/app/server/types";
import { NoticeType } from "antd/es/message/interface";
import StockOptionsButton from "./StockOptionsButton";

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
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();

    const [targetPrice, setTargetPrice] = useState("");
    const [editTarget, setEditTarget] = useState(false);
    const { data: savedStock, isLoading } = useQuery({
        queryKey: ["savedStocks", user?.uid, ticker],
        queryFn: () => getUserStock(ticker, user?.uid),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    const updateMutation = useMutation({
        mutationFn: (_stock: Partial<Stock>) => {
            loadingPopup("loading", "Updating...");
            return updateStock(_stock, ticker, user?.uid);
        },
        onSuccess: () => {
            successPopup("success", "Updated!");
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid, ticker],
            });
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });

    const submitTargetPrice = (e: FormEvent) => {
        e.preventDefault();
        if (!savedStock?.targetPrice)
            Modal.confirm({
                title: "Are you currently holding this stock?",
                icon: <QuestionCircleOutlined />,
                content:
                    "You will only be asked this once. If you would like to change this later, click on the three dots on the right.",
                okText: "Yes",
                onOk() {
                    updateMutation.mutate({
                        name,
                        holding: true,
                        ticker,
                        mostRecentPrice: parseFloat(prices?.results?.[0].c),
                        targetPrice:
                            parseFloat(targetPrice) ||
                            savedStock.targetPrice ||
                            0,
                    });
                },
                cancelText: "No",
                onCancel() {
                    updateMutation.mutate({
                        name,
                        holding: false,
                        ticker,
                        mostRecentPrice: parseFloat(prices?.results?.[0].c),
                        targetPrice:
                            parseFloat(targetPrice) ||
                            savedStock.targetPrice ||
                            0,
                    });
                },
            });
        else
            updateMutation.mutate({
                mostRecentPrice: parseFloat(prices?.results?.[0].c),
                targetPrice:
                    parseFloat(targetPrice) || savedStock.targetPrice || 0,
            });
        setTargetPrice("");
        setEditTarget(false);
    };

    const loadingPopup = (type: NoticeType, content: string) => {
        messageApi.open({
            key: "popup",
            type,
            content,
        });
    };
    const successPopup = (type: NoticeType, content: string) => {
        messageApi.open({
            key: "popup",
            type,
            content,
            duration: 2,
        });
    };

    return (
        <>
            {contextHolder}
            <div className="my-4 mb-8 sm:my-8 relative">
                <div className="absolute top-0 right-0">
                    <StockOptionsButton
                        name={name}
                        prices={prices}
                        savedStock={savedStock}
                        ticker={ticker}
                        updateMutation={updateMutation}
                        loadingPopup={loadingPopup}
                        successPopup={successPopup}
                        setEditTarget={setEditTarget}
                    />
                </div>
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
                            <p className="text-md w-3/4 self-center sm:self-end">
                                {name}
                            </p>
                        </div>
                        <h1 className="text-3xl sm:text-5xl my-3 sm:my-0 font-semibold min-w-fit tracking-tight text-indigo-600 ">
                            {prices?.results?.[0].c
                                ? new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                  }).format(parseFloat(prices?.results?.[0].c))
                                : "$--"}
                        </h1>
                        <div className="text-md flex-1 basis-full">2.5%</div>
                    </div>
                    <div className="flex sm:items-center justify-center gap-x-3">
                        <AimOutlined
                            className="text-3xl"
                            title="Target price"
                        />
                        {editTarget ? (
                            <form
                                onSubmit={submitTargetPrice}
                                className="flex items-center border-b border-indigo-600 py-2 max-w-[14rem]"
                            >
                                <input
                                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                    autoFocus
                                    type="text"
                                    maxLength={7}
                                    value={targetPrice}
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== "." &&
                                            e.key !== "Backspace" &&
                                            e.key !== "Enter"
                                        )
                                            e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        setTargetPrice(e.currentTarget.value);
                                    }}
                                    inputMode="numeric"
                                    pattern="^[1-9]\d*(\.\d+)?$"
                                    placeholder={
                                        savedStock?.targetPrice
                                            ? new Intl.NumberFormat("en-US", {
                                                  style: "currency",
                                                  currency: "USD",
                                              }).format(savedStock?.targetPrice)
                                            : "$0.00"
                                    }
                                    aria-label="Target price"
                                />
                                <Button className="flex-shrink-0" type="submit">
                                    Set target
                                </Button>
                            </form>
                        ) : savedStock?.targetPrice ? (
                            <>
                                <h2
                                    className="text-2xl cursor-pointer"
                                    title="Edit target price"
                                    onClick={() => setEditTarget(true)}
                                >
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(
                                        parseFloat(savedStock.targetPrice)
                                    )}
                                </h2>
                                {savedStock.holding ? (
                                    <RiseOutlined
                                        className="text-xl"
                                        title="Holding shares"
                                    />
                                ) : (
                                    <FallOutlined
                                        className="text-xl"
                                        title="Not holding shares"
                                    />
                                )}
                            </>
                        ) : (
                            <h2
                                className="text-lg cursor-pointer"
                                onClick={() => setEditTarget(true)}
                            >
                                Set your target price
                            </h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const NotesSection = ({ ticker }: { ticker: string }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [note, setNote] = useState("");
    const { data: savedStock, isLoading } = useQuery({
        queryKey: ["savedStocks", user?.uid, ticker],
        queryFn: () => getUserStock(ticker, user?.uid),
        staleTime: Infinity, // could be set to a minute ish to help with live but might just leave
    });
    const updateMutation = useMutation({
        mutationFn: (_stock: Partial<Stock>) => {
            return updateStock(_stock, ticker, user?.uid);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid, ticker],
            });
            queryClient.invalidateQueries({
                queryKey: ["savedStocks", user?.uid],
            });
        },
    });
    console.log(savedStock);
    // TODO: might make notes an object with date data as well as text. Not sure of any other data wanted
    const handleNewNote = (e: FormEvent) => {
        e.preventDefault();
        if (note.length > 0) {
            let _stock: Partial<Stock> = {
                notes: savedStock?.notes
                    ? [...savedStock?.notes, note]
                    : [note],
            };
            updateMutation.mutate(_stock);
            setNote("");
        }
    };

    return (
        <div className="flex-1">
            <h2 className="text-2xl mb-2">My notes</h2>
            <div>
                {/* divide-y  divide-gray-200 dark:divide-gray-700 */}
                {savedStock?.notes?.length > 0 ? (
                    <ul className="max-w-md space-y-3 mb-4">
                        {savedStock?.notes?.map((note: string, i: number) => (
                            <li key={i}>
                                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {note}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
                                        <EllipsisOutlined />
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
                    <div className="w-full mb-4 rounded-lg border bg-gray-700 border-gray-600">
                        <div className="px-4 py-2 rounded-t-lg bg-gray-800">
                            <label className="sr-only">Your note</label>
                            <textarea
                                rows={4}
                                className="w-full px-0 text-sm text-white border-0 bg-gray-800  placeholder-gray-400 focus:outline-none"
                                value={note}
                                onChange={(e) => setNote(e.currentTarget.value)}
                                placeholder="Write a note..."
                                required
                            ></textarea>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-600">
                            <Button type="submit">Add note</Button>
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
                        <p
                            className="text-xs text-gray-500"
                            title={new Date(
                                article.published_utc
                            ).toLocaleString("en-au")}
                        >
                            {moment(new Date(article.published_utc)).fromNow()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
