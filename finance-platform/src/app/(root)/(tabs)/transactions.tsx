import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native'
import { Transaction, TransactionType } from '../../../../types';
import { useTransactionsQuery } from '../../../../hooks/queries/useTransactionsQuery';
import { useAccountQuery } from '../../../../hooks/queries/useAccountsQuery';
import { useDeleteTransaction } from '../../../../hooks/mutations/useTransactionMutations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { exportTransactionsToCSV } from '../../../../lib/utils';

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
    if (exporting) return;
    setExporting(true);

    try {
      const { count } = await exportTransactionsToCSV(transactions);
      if (count === 0) {
        Alert.alert(
          'Nothing to Export',
          'No transactions in the export window.',
        );
      }
    } catch (error) {
      console.error("Error exporting transactions:", error);
      Alert.alert(
        'Export Failed',
        'An error occurred while exporting transactions. Please try again.',
      );
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (tx: Transaction) => {

  };

  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <View className="px-5 pt-3 pb-2">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-semibold text-brand-bg">
            Transactions
          </Text>
          <TouchableOpacity
            onPress={handleExport}
            disabled={exporting}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E6DF] items-center justify-center"
          >
            {exporting ? (
              <ActivityIndicator size="small" color="#5C5F68" />
            ) : (
              <Feather name="download" size={15} color="#5C5F68" />
            )}
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  )
}