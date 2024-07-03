import Link from "next/link";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getStockNews } from "@/app/server/actions/stocks";
import { Skeleton } from "antd";

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
                                    ? article.description.substring(0, 120) +
                                      "..."
                                    : article.description}
                            </p>
                            <p
                                className="text-xs text-gray-500"
                                title={new Date(
                                    article.published_utc
                                ).toLocaleString("en-au")}
                            >
                                {moment(
                                    new Date(article.published_utc)
                                ).fromNow()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StockNews;
