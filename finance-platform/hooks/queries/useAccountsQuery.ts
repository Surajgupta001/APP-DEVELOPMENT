import { useUser } from "@clerk/expo";
import { useSupabase } from "../useSupabase";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "../../lib/services/account";
import { querykeys } from "../../lib/query/key";

export function useAccountQuery() {
    const { user } = useUser();
    const supabse = useSupabase();

    return useQuery({
        queryKey: querykeys.accounts(user?.id!),
        queryFn: () => getAccounts(supabse, user!.id),
        enabled: !!user,
    });
};