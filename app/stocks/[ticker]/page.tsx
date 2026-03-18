import type { Metadata } from "next";
import { APP_NAME, NEWS_FETCH_LIMIT } from "@/utils/constants";
import StockPageContent from "@/app/components/stock-page/StockPageContent";
import { fetchStockDetails, fetchStockNews } from "@/lib/api";
import { getUidFromSession } from "@/lib/session";
import { getUserStockServer } from "@/lib/db.server";
import { TStock } from "@/lib/schemas/stocks/stock.schema";

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
    const uid = await getUidFromSession();

    const [details, news, savedStockResult] = await Promise.all([
        fetchStockDetails(ticker),
        fetchStockNews(ticker, String(NEWS_FETCH_LIMIT)),
        uid ? getUserStockServer(ticker, uid) : Promise.resolve(null),
    ]);

    const savedStock: TStock | null =
        savedStockResult?.success ? savedStockResult.data! : null;

    return (
        <StockPageContent
            ticker={ticker}
            details={details}
            news={news}
            savedStock={savedStock}
        />
    );
};

export default Page;
