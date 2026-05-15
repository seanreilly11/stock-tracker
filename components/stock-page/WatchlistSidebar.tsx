import { getUidFromSession } from "@/lib/session";
import { getUserStocks, getTargetCountsByUser } from "@/lib/data";
import WatchlistSidebarInteractive from "./WatchlistSidebarInteractive";

interface WatchlistSidebarProps {
    currentTicker: string;
}

const WatchlistSidebar = async ({ currentTicker }: WatchlistSidebarProps) => {
    const uid = await getUidFromSession();
    const [stocks, targetCounts] = await Promise.all([
        getUserStocks(uid),
        getTargetCountsByUser(uid),
    ]);

    return (
        <WatchlistSidebarInteractive
            stocks={stocks}
            currentTicker={currentTicker}
            triggeredCounts={targetCounts.triggered}
        />
    );
};

export default WatchlistSidebar;
