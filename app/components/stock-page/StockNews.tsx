import NewsItem from "./NewsItem";
import { TNewsArticle, TNewsList } from "@/lib/schemas/news/news.schema";

type Props = {
    news: TNewsList;
    ticker: string;
};

const StockNews = ({ news, ticker }: Props) => {
    return (
        <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">News</h2>
            <div className="space-y-4">
                {!news?.results?.length ? (
                    <p className="text-gray-400 text-sm">
                        No recent news available.
                    </p>
                ) : (
                    news.results.map((article: TNewsArticle) => (
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
