import React, { ReactElement } from "react";
import { TNewsArticle } from "@/utils/types";
import moment from "moment";
import Link from "next/link";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";

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

const NewsItem = ({ article, ticker }: Props) => {
    // console.log(article);
    const findInsights = () => {
        const insight = article?.insights?.find((i) => i.ticker === ticker);
        if (insight?.sentiment) return sentimentIcons[insight?.sentiment];
        return null;
    };
    return (
        <div>
            <Link
                className="text-md font-semibold"
                href={article.article_url}
                target="_blank"
                referrerPolicy="no-referrer"
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
                <p className="text-xs text-gray-500 mx-1">
                    {"\u00B7"} Sentiment:
                </p>
                <p className="text-base">{findInsights()}</p>
            </div>
        </div>
    );
};

export default NewsItem;
