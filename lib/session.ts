import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getUidFromSession = cache(async (): Promise<string | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
});

export const getUserFromSession = cache(async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
});
