import React, { ReactElement } from "react";
import { TNewsArticle } from "@/utils/types";
import moment from "moment";
import Link from "next/link";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { logCustomEvent } from "@/server/firebase";

type Props = {
    article: TNewsArticle;
    ticker: string;
};

const sentimentIcons: Record<string, ReactElement> = {
    positive: (
        <SmileOutlined className="text-green-500" title="Positive sentiment" />
    ),
    neutral: (
        <MehOutlined className="text-yellow-500" title="Neutral sentiment" />
    ),
    negative: (
        <FrownOutlined className="text-red-500" title="Negative sentiment" />
    ),
};

const getSentiment = (article: TNewsArticle, ticker: string) => {
    const insight = article?.insights?.find((a) => a.ticker === ticker);
    return insight?.sentiment || null;
};

const Sentiment = ({ article, ticker }: Props) => {
    const sentiment = getSentiment(article, ticker);
    if (sentiment)
        return (
            <>
                <p className="text-xs text-gray-500 mx-1">
                    {"\u00B7"} Sentiment:
                </p>
                <p className="text-base">{sentimentIcons[sentiment]}</p>
            </>
        );
    return null;
};

const NewsItem = ({ article, ticker }: Props) => {
    const handleClick = () =>
        logCustomEvent("news_link_clicked", {
            ticker,
            sentiment: getSentiment(article, ticker),
        });

    return (
        <div>
            <Link
                className="text-md font-semibold"
                href={article.article_url}
                target="_blank"
                referrerPolicy="no-referrer"
                onClick={handleClick}
            >
                {article.title}
            </Link>

            <p className="text-sm" title={article.description}>
                {article.description?.length > 120
                    ? article.description?.substring(0, 120) + "..."
                    : article.description}
            </p>
            <div className="flex items-center">
                <p className="text-xs text-gray-500 mr-1">
                    {article.publisher.name} {"\u00B7"}
                </p>
                <p
                    className="text-xs text-gray-500"
                    title={new Date(article.published_utc).toLocaleString(
                        "en-au"
                    )}
                >
                    {moment(new Date(article.published_utc)).fromNow()}
                </p>
                <Sentiment article={article} ticker={ticker} />
            </div>
        </div>
    );
};

export default NewsItem;
