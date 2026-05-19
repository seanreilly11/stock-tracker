import Home from "@/components/common/Home";
import Landing from "@/components/landing-page/Landing";
import JsonLd from "@/components/seo/JsonLd";
import { getUidFromSession, getUserFromSession } from "@/lib/session";
import { APP_TITLE } from "@/lib/utils/constants";

type Props = {
    searchParams: Promise<{ filter?: string; sort?: string; q?: string }>;
};

const Page = async ({ searchParams }: Props) => {
    const [uid, user, params] = await Promise.all([
        getUidFromSession(),
        getUserFromSession(),
        searchParams,
    ]);

    if (!uid)
        return (
            <>
                <JsonLd
                    data={{
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: APP_TITLE,
                        url: process.env.NEXT_PUBLIC_BASE_URL,
                        description:
                            "Track stock intentions and keep personal notes alongside real-time data.",
                    }}
                />
                <Landing />
            </>
        );

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
