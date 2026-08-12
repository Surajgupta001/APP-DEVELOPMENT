import { useRouter } from 'expo-router';
import { use, useState } from 'react';
import { Text, View } from 'react-native'
import { Transaction, TransactionType } from '../../../../types';
import { useTransactionsQuery } from '../../../../hooks/queries/useTransactionsQuery';
import { useAccountQuery } from '../../../../hooks/queries/useAccountsQuery';
import { useDeleteTransaction } from '../../../../hooks/mutations/useTransactionMutations';

export default function TransactionsScreen() {

  const FILTERS = ["All", "Income", "Expense"] as const;

  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>('All');
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  const typeFilter: TransactionType | null = activeFilter === "Income" ? "INCOME" : activeFilter === "Expense" ? "EXPENSE" : null;

  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isRefetching: transactionsRefetching,
    isError: transactionsError,
    refetch: refetchTransactions
  } = useTransactionsQuery({ type: typeFilter, accountId: activeAccountId });

  const { data: accounts = [], refetch: refetchAccounts } = useAccountQuery();

  const { mutateAsync: removeTransaction } = useDeleteTransaction();

  const loading = transactionsLoading;
  const refreshing = transactionsRefetching;
  const error = transactionsError;

  const loadData = () => {
    refetchTransactions();
    refetchAccounts();
  };

  const handleExport = async () => {

  };

  const handleDelete = async (tx: Transaction) => {

  };

  return (
    <View>
      <Text>transactions</Text>
    </View>
  )
}