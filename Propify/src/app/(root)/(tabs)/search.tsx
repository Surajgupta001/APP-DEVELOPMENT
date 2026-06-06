import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Property } from "../../../../types";
import { useFilterStore } from "../../../../store/filterStore";
import { useLocalSearchParams } from "expo-router";
import { formatPrice } from "../../../../lib/utils";
import PropertyCard from "@/components/PropertyCard";
import FilterModal from "@/components/FilterModal";
import { supabase } from "../../../../lib/supabase";
import { useColorScheme } from "nativewind";

export default function Search() {

  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, []);

  const { search, type, bedrooms, minPrice, maxPrice, setSearch, setType, setBedrooms, setMinPrice, setMaxPrice } = useFilterStore();

  const activeFiltersCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null
  ].filter(Boolean).length;

  useEffect(() => {
    fetchResults();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  const fetchResults = async () => {
    setLoading(true);

    let query = supabase.from("properties").select("*");

    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (bedrooms) {
      query = query.eq("bedrooms", bedrooms);
    }

    if (minPrice) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    const { data } = await query.order("created_at", { ascending: false });

    setResults(data ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#121212]">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Find Property
        </Text>

        {/* Search Bar + Filter Button */}
        <View className="flex-row items-center gap-3">
          <View
            className="flex-row items-center flex-1 gap-3 px-4 bg-white dark:bg-[#1E1E1E] rounded-2xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 py-3 text-gray-800 dark:text-white"
              placeholder="Search by title or city..."
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              activeFiltersCount > 0 
                ? "bg-blue-600" 
                : "bg-white dark:bg-zinc-800"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFiltersCount > 0 ? "#fff" : (isDark ? "#fff" : "#374151")}
            />
            {activeFiltersCount > 0 && (
              <View className="absolute items-center justify-center w-4 h-4 bg-red-500 rounded-full -top-1 -right-1">
                <Text className="text-white text-[9px] font-bold">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {type && (
              <View className="flex-row items-center gap-1 px-3 py-1 border border-blue-200 dark:border-blue-800 rounded-full bg-blue-50 dark:bg-blue-950/20">
                <Text className="text-xs font-semibold text-blue-700 dark:text-blue-400 capitalize">
                  {type}
                </Text>
                <TouchableOpacity onPress={() => setType(null)}>
                  <Ionicons name="close" size={12} color={isDark ? "#60A5FA" : "#1D4ED8"} />
                </TouchableOpacity>
              </View>
            )}
            {bedrooms !== null && (
              <View className="flex-row items-center gap-1 px-3 py-1 border border-blue-200 dark:border-blue-800 rounded-full bg-blue-50 dark:bg-blue-950/20">
                <Ionicons name="bed-outline" size={11} color={isDark ? "#60A5FA" : "#1D4ED8"} />
                <Text className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  {bedrooms === 4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                </Text>
                <TouchableOpacity onPress={() => setBedrooms(null)}>
                  <Ionicons name="close" size={12} color={isDark ? "#60A5FA" : "#1D4ED8"} />
                </TouchableOpacity>
              </View>
            )}
            {(minPrice !== null || maxPrice !== null) && (
              <View className="flex-row items-center gap-1 px-3 py-1 border border-blue-200 dark:border-blue-800 rounded-full bg-blue-50 dark:bg-blue-950/20">
                <Text className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Up to ${formatPrice(maxPrice!)}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}
                >
                  <Ionicons name="close" size={12} color={isDark ? "#60A5FA" : "#1D4ED8"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={
          <Text className="mb-4 text-sm text-gray-400 dark:text-gray-500">
            {loading ? "Searching..." : `${results.length} properties found`}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-20">
              <Ionicons name="search-outline" size={48} color={isDark ? "#4B5563" : "#D1D5DB"} />
              <Text className="mt-4 text-base text-gray-400 dark:text-gray-400 font-semibold">
                No properties found
              </Text>
              <Text className="mt-1 text-sm text-gray-300 dark:text-gray-600">
                Try a different search or adjust filters
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#2563EB" className="py-20" />
          )
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}
