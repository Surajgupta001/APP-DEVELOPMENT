import { useAuth } from "@clerk/expo";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSupabase } from "../../../../hooks/useSupabase";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Property } from "../../../../types";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyCard from "@/components/PropertyCard";
import { Ionicons } from "@expo/vector-icons";

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
};

export default function Saved() {

  const { userId } = useAuth();
  const authSupabase = useSupabase();
  const router = useRouter();

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (!userId) return;

    setLoading(true);

    const { data } = await authSupabase
      .from("saved_properties")
      .select("id, property_id, properties(*)")
      .eq("user_clerk_id", userId)
      .order('id', { ascending: false });

    setSaved((data as unknown as SavedProperty[]) ?? []);
    setLoading(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved])
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">

      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900">Saved</Text>
        {!loading && (
          <Text className="mt-1 text-sm text-gray-400">
            {saved.length} {saved.length === 1 ? "property" : "properties"}
            Saved
          </Text>
        )}
      </View>
      {loading ?
        (<View className="items-center flex-1">
          <ActivityIndicator
            size="large"
            color="#4B5563"
          />
        </View>)
        :
        (<FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertyCard
              property={item.properties}
              onUnsave={() => setSaved((prev) => prev.filter((s) => s.id != item.id))}
              showSave
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center flex-1 py-24">
              <View className="items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-50">
                <Ionicons name="heart-outline" size={36} color="#EF4444" />
              </View>
              <Text className="mb-1 text-lg font-bold text-gray-700">
                No saved properties
              </Text>
              <Text className="px-8 text-sm text-center text-gray-400">
                Tap the heart icon on any property to save it here
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/search")}
                className="px-6 py-3 mt-6 bg-blue-600 rounded-2xl"
              >
                <Text className="font-semibold text-white">
                  Browse Properties
                </Text>
              </TouchableOpacity>
            </View>
          }
        />)
      }
    </SafeAreaView>
  );
}
