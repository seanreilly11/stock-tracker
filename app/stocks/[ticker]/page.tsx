import type { Metadata } from "next";
import { APP_NAME } from "@/utils/constants";
import StockPageContent from "@/app/components/stock-page/StockPageContent";

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
    return <StockPageContent ticker={ticker} />;
};

export default Page;
