import Home from "@/components/common/Home";
import { getUidFromSession, getUserFromSession } from "@/lib/session";

type Props = {
    searchParams: Promise<{ filter?: string; sort?: string; q?: string }>;
};

const Page = async ({ searchParams }: Props) => {
    const [uid, user, params] = await Promise.all([
        getUidFromSession(),
        getUserFromSession(),
        searchParams,
    ]);
    return (
        <Home
            uid={uid}
            userName={user?.user_metadata?.name ?? null}
            userEmail={user?.email ?? null}
            searchParams={params}
        />
    );
};

export default Page;
