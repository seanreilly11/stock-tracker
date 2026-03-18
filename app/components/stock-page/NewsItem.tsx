"use client";
import { ReactElement } from "react";
import { TNewsArticle } from "@/lib/schemas/news/news.schema";
import Link from "next/link";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { logCustomEvent } from "@/lib/firebase";
import { timeSince, truncate } from "@/utils/helpers";

type Props = {
    article: TNewsArticle;
    ticker: string;
};

type Sentiment = "positive" | "neutral" | "negative";

const sentimentIcons: Record<Sentiment, ReactElement> = {
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

const SentimentIcon = ({ sentiment }: { sentiment: Sentiment | null }) => {
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
    const sentiment = getSentiment(article, ticker);

    const handleClick = () =>
        logCustomEvent("news_link_clicked", { ticker, sentiment });

    return (
        <div>
            <Link
                className="text-base font-semibold"
                href={article.article_url}
                target="_blank"
                referrerPolicy="no-referrer"
                onClick={handleClick}
            >
                {article.title}
            </Link>

            <p className="text-sm" title={article.description}>
                {truncate(article.description, 120)}
            </p>
            <div className="flex items-center">
                <p className="text-xs text-gray-500 mr-1">
                    {article.publisher.name} {"\u00B7"}
                </p>
                <p
                    className="text-xs text-gray-500"
                    title={new Date(article.published_utc).toLocaleString(
                        "en-au",
                    )}
                >
                    {timeSince(+new Date(article.published_utc))}
                </p>
                <SentimentIcon sentiment={sentiment} />
            </div>
        </div>
    );
};

export default NewsItem;
