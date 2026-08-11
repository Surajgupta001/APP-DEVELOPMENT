import { Transactionfilter } from "../../types";

export const querykeys = {
    accounts: (userId: string) => ['accounts', userId] as const,
    transactions: (userId: string, filters: Transactionfilter = {}) => ['transactions', userId, filters] as const,
    budget: (userId: string) => ['budget', userId] as const
};