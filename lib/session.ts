import { createClient } from "@/lib/supabase/server";

export const getUidFromSession = async (): Promise<string | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
};

export const getUserFromSession = async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
};
