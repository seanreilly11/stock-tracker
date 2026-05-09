import TopBar from "@/components/common/TopBar";
import SearchBar from "@/components/stock-list/SearchBar";
import NextToBuy from "@/components/stock-list/NextToBuy";
import StockList from "@/components/stock-list/StockList";
import MenuDropdown from "@/components/ui/MenuDropdown";
import Header from "../stock-list/Header";
import {
  getUserStocks,
  getUserNextBuyStocks,
} from "@/lib/data";
import { TStock } from "@/types";
import { APP_TITLE } from "@/lib/utils/constants";

interface HomeProps {
  uid: string | null;
  userName: string | null;
}

const Home = async ({ uid, userName }: HomeProps) => {
  const now = new Date();

  const [stocks, nextStocks] = await Promise.all([
    getUserStocks(uid),
    getUserNextBuyStocks(uid),
  ]);
  console.log(stocks);

  const savedTickers = stocks.map((s: TStock) => s.ticker);

  return (
    <div className="flex flex-col h-full bg-[var(--paper)]">
      <TopBar
        breadcrumbs={[
          <span key="brand">{APP_TITLE}</span>,
          <span key="date">
            {now.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>,
          <span key="time">
            {now.toLocaleString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </span>,
        ]}
        actions={<MenuDropdown />}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 pb-20">
          <Header stockCount={stocks.length} userName={userName} />

          <div className="mb-2">
            <SearchBar savedTickers={savedTickers} />
          </div>

          <NextToBuy nextStocks={nextStocks} />

          <section className="mt-10">
            <div className="flex items-end justify-between border-b border-[var(--rule)] pb-0 mb-0 gap-4">
              <div className="flex gap-4">
                <button className="font-[family-name:var(--mono)] text-[11px] uppercase tracking-[0.06em] pb-3 text-[var(--ink)] border-b border-[var(--ink)]">
                  All
                </button>
              </div>
            </div>
            <StockList stocks={stocks} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
