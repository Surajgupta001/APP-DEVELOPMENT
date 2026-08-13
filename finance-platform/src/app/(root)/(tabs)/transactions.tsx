import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Transaction, TransactionType } from '../../../../types';
import { useTransactionsQuery } from '../../../../hooks/queries/useTransactionsQuery';
import { useAccountQuery } from '../../../../hooks/queries/useAccountsQuery';
import { useDeleteTransaction } from '../../../../hooks/mutations/useTransactionMutations';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { currentMonthDays, dayKey, exportTransactionsToCSV } from '../../../../lib/utils';
import TransactionRow from '@/components/TransactionRow';
import { RefreshControl } from 'react-native-gesture-handler';
import { BarChart } from 'react-native-gifted-charts';

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

  const handleDelete = async (tsx: Transaction) => {
    Alert.alert(
      "Delete transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error: deleteError } = await removeTransaction(tsx);
            if (deleteError) {
              Alert.alert("Error", "Couldn't delete this transaction.");
            }
          },
        },
      ]
    );
  };

  const filteredTransactions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;

    return transactions.filter((tsx) => (
      tsx.description?.toLowerCase().includes(q) ||
      tsx.category.toLowerCase().includes(q)
    ));
  }, [transactions, search]);

  const dailyIncomeExpense = useMemo(() => {
    const days = currentMonthDays();

    return days.flatMap(({ key, label }) => {
      const income = transactions.filter((tsx) => tsx.type === 'INCOME' && dayKey(new Date(tsx.date)) === key).reduce((sum, tsx) => sum + tsx.amount, 0);

      const expense = transactions.filter((tsx) => tsx.type === 'EXPENSE' && dayKey(new Date(tsx.date)) === key).reduce((sum, tsx) => sum + tsx.amount, 0);

      return [
        { value: income, label, frontColor: "#3DDC84" },
        { value: expense, frontColor: "#FF6B4A" },
      ]
    });
  }, [transactions]);

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
        <View className='flex-row items-center gap-2 bg-white rounded-xl border border-[#E8E6DF] px-3.5 py-2.5 mb-2.5'>
          <Feather name="search" size={15} color="#8A8D96" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search Transactions...."
            placeholderTextColor="#8A8D96"
            className="flex-1 text-xs text-brand-bg"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={15} color="#8A8D96" />
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row gap-2 mb-2.5">
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full border ${activeFilter === filter
                ? "bg-brand-bg border-brand-bg"
                : "bg-white border-[#E8E6DF]"
                }`}
            >
              <Text
                className={`text-xs ${activeFilter === filter
                  ? "text-white"
                  : "text-brand-text-secondary"
                  }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View className='flex-row gap-2'>
            <TouchableOpacity
              onPress={() => setActiveAccountId(null)}
              className={`px-3.5 py-1.5 rounded-full border ${activeAccountId === null
                ? "bg-brand-bg border-brand-bg"
                : "bg-white border-[#E8E6DF]"
                }`}
            >
              <Text
                className={`text-xs ${activeAccountId === null
                  ? "text-white"
                  : "text-brand-text-secondary"
                  }`}
              >
                All Accounts
              </Text>
            </TouchableOpacity>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                onPress={() => setActiveAccountId(account.id)}
                className={`px-3.5 py-1.5 rounded-full border ${activeAccountId === account.id
                  ? "bg-brand-bg border-brand-bg"
                  : "bg-white border-[#E8E6DF]"
                  }`}
              >
                <Text
                  className={`text-xs ${activeAccountId === account.id
                    ? "text-white"
                    : "text-brand-text-secondary"
                    }`}
                >
                  {account.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator color="#4A9EFF" />
        </View>
      ) : error ? (
        <View className="items-center justify-center flex-1 px-10">
          <Feather name="alert-circle" size={32} color="#FF6B4A" />
          <Text className="mt-3 text-sm text-center text-brand-text-muted">
            Couldn&apos;t load transactions.
          </Text>
          <TouchableOpacity
            onPress={() => loadData()}
            className="px-4 py-2 mt-4 rounded-full bg-brand-bg"
          >
            <Text className="text-xs font-medium text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionRow tx={item} onDelete={() => handleDelete(item)} />
          )}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 100,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadData}
            />
          }
          ListHeaderComponent={
            transactions.length > 0 ? (
              <View className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-xs font-medium text-brand-bg">
                    Daily income vs expense
                  </Text>
                  <View className="flex-row gap-3">
                    <View className="flex-row items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-brand-success" />
                      <Text className="text-[10px] text-brand-text-secondary">
                        Income
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <View className="w-2 h-2 rounded-full bg-brand-coral" />
                      <Text className="text-[10px] text-brand-text-secondary">
                        Expense
                      </Text>
                    </View>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                    data={dailyIncomeExpense}
                    width={Math.max(dailyIncomeExpense.length * 9, 280)}
                    height={120}
                    barWidth={6}
                    spacing={4}
                    hideYAxisText
                    xAxisColor="#E8E6DF"
                    yAxisColor="transparent"
                    rulesColor="#F0EEE7"
                    noOfSections={3}
                    xAxisLabelTextStyle={{ color: "#8A8D96", fontSize: 7 }}
                    isThreeD={false}
                    roundedTop
                  />
                </ScrollView>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Feather name="inbox" size={32} color="#BDC3C7" />
              <Text className="mt-3 text-sm text-brand-text-muted">
                {search ? "No matching transactions" : "No transactions yet"}
              </Text>
            </View>
          }
        />
      )}
      {/* Add transaction FAB - navigates to the Add tab */}
      <TouchableOpacity
        onPress={() => router.push("/(root)/(tabs)/add-transaction")}
        className="absolute items-center justify-center rounded-full shadow-lg right-5 w-14 h-14 bg-brand-bg"
        style={{ bottom: 90 }}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}