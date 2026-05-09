import AuthWrapper from "@/components/common/AuthWrapper";
import Home from "@/components/common/Home";
import { getUidFromSession, getUserFromSession } from "@/lib/session";

const Page = async () => {
    const [uid, user] = await Promise.all([
        getUidFromSession(),
        getUserFromSession(),
    ]);
    return (
        <AuthWrapper>
            <Home uid={uid} userName={user?.user_metadata?.name ?? null} />
        </AuthWrapper>
    );
};

export default Page;
