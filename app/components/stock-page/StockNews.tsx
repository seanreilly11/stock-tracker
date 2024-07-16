import { useQuery } from "@tanstack/react-query";
import { getStockNews } from "@/server/actions/stocks";
import { Skeleton } from "antd";
import NewsItem from "./NewsItem";
import { TNewsArticle } from "@/utils/types";
import useFetchStockNews from "@/hooks/useFetchStockNews";

const StockNews = ({ ticker }: { ticker: string }) => {
    const { data: news, isLoading } = useFetchStockNews(ticker);

    return (
        <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">News</h2>
            <div className="space-y-4">
                {isLoading ? (
                    <>
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </>
                ) : (
                    news?.results?.map((article: TNewsArticle) => (
                        <NewsItem
                            key={article.id}
                            article={article}
                            ticker={ticker}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default StockNews;
