import type { Metadata } from "next";
import { APP_NAME, NEWS_FETCH_LIMIT } from "@/utils/constants";
import StockPageContent from "@/app/components/stock-page/StockPageContent";
import { fetchStockDetails, fetchStockNews } from "@/lib/api";

type Props = {
    params: Promise<{
        ticker: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { ticker } = await params;
    return { title: `${ticker} | ${APP_NAME}` };
}

const Page = async ({ params }: Props) => {
    const { ticker } = await params;
    const [details, news] = await Promise.all([
        fetchStockDetails(ticker),
        fetchStockNews(ticker, String(NEWS_FETCH_LIMIT)),
    ]);
    return <StockPageContent ticker={ticker} details={details} news={news} />;
};

export default Page;
