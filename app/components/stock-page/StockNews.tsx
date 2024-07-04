import { useQuery } from "@tanstack/react-query";
import { getStockNews } from "@/app/server/actions/stocks";
import { Skeleton } from "antd";
import NewsItem from "./NewsItem";
import { TNewsArticle } from "@/app/server/types";

const StockNews = ({ ticker }: { ticker: string }) => {
    const { data: news, isLoading } = useQuery({
        queryKey: ["stockNews", ticker],
        queryFn: () => getStockNews(ticker),
        staleTime: Infinity,
    });

    return (
        <div className="flex-1">
            <h2 className="text-2xl mb-2">News</h2>
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
