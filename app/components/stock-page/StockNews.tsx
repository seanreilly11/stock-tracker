"use client";
import { Skeleton } from "antd";
import NewsItem from "./NewsItem";
import { TNewsArticle } from "@/lib/schemas/news/news.schema";
import useFetchStockNews from "@/lib/queries/useFetchStockNews";
import QueryError from "../common/QueryError";

const StockNews = ({ ticker }: { ticker: string }) => {
    const { data: news, isLoading, error } = useFetchStockNews(ticker);

    const renderContent = () => {
        if (isLoading)
            return (
                <>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </>
            );
        if (error) return <QueryError message="Failed to load news." />;
        if (!news?.results?.length)
            return (
                <p className="text-gray-400 text-sm">
                    No recent news available.
                </p>
            );
        return news.results.map((article: TNewsArticle) => (
            <NewsItem key={article.id} article={article} ticker={ticker} />
        ));
    };

    return (
        <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">News</h2>
            <div className="space-y-4">{renderContent()}</div>
        </div>
    );
};

export default StockNews;
