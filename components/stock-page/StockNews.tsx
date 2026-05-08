import { Skeleton } from "antd";
import NewsItem from "@/components/stock-page/NewsItem";
import { TNewsArticle } from "@/types";
import useFetchStockNews from "@/lib/queries/useFetchStockNews";

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
