import ExploreUserCard from "@/components/ExploreUserCard";
import ListEmptyComponent from "@/components/ListEmptyComponent";
import { useAppContext } from "@/contexts/AppProvider";
import useStartChat from "@/hooks/useStartChat";
import useStreamUsers from "@/hooks/useStreamUsers";
import { COLORS } from "@/lib/theme";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { UserResponse } from "stream-chat";

const isExpoGo = Constants.appOwnership === "expo";

// Conditionally load stream-chat-expo to avoid TurboModule crash in Expo Go
let useChatContext: any = null;
if (!isExpoGo) {
    try {
        useChatContext = require("stream-chat-expo").useChatContext;
    } catch (error) {
        console.warn("[ExploreScreen] Failed to load stream-chat-expo:", error);
    }
}

// Full explore screen — only rendered when stream-chat-expo is available
const ExploreScreenFull = () => {
    const { setChannel } = useAppContext();
    const { user } = useUser();
    const chatContext = useChatContext ? useChatContext() : null;
    const client = chatContext ? chatContext.client : null;
    const userId = user?.id ?? "";

    const [creating, setCreating] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const { loading, users } = useStreamUsers(client, userId);

    const { handleStartChat } = useStartChat({ client, userId, setChannel, setCreating });

    const filteredUsers = !search.trim()
        ? users
        : users.filter(
            (u) =>
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.id.toLowerCase().includes(search.toLowerCase()),
        );

    const renderUserItem = ({ item }: { item: UserResponse }) => (
        <ExploreUserCard item={item} creating={creating} onStartChat={handleStartChat} />
    );

    return (
        <SafeAreaView className="flex-1 bg-background">
            {/* Header */}
            <View className="px-5 pt-3 pb-1">
                <Text className="text-[28px] font-bold text-foreground">Explore</Text>
                <Text className="mt-1 text-sm text-foreground-muted">Find people and start chatting</Text>
            </View>

            {/* Search bar */}
            <View className="flex-row items-center bg-surface mx-5 my-4 px-3.5 py-3 rounded-[14px] gap-2.5 border border-border">
                <Ionicons name="search" size={18} color={COLORS.textMuted} />

                <TextInput
                    className="flex-1 text-[15px] text-foreground"
                    placeholder="Search people..."
                    placeholderTextColor={COLORS.textMuted}
                    value={search}
                    onChangeText={setSearch}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")}>
                        <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                    </Pressable>
                )}
            </View>

            {/* USERS LISTS */}
            {loading ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderUserItem}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<ListEmptyComponent />}
                />
            )}
        </SafeAreaView>
    );
};

// Exported component — picks the right version based on environment
const ExploreScreen = () => {
    return <ExploreScreenFull />;
};

export default ExploreScreen;