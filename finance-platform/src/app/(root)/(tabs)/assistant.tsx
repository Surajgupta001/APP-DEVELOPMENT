import { useUser } from '@clerk/expo';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import { useUserStore } from '../../../../store/userStore';
import { useTransactionsQuery } from '../../../../hooks/queries/useTransactionsQuery';
import { useBudgetQuery } from '../../../../hooks/queries/useBudgetQuery';
import { useRef, useState } from 'react';
import { askAssistant } from '../../../../lib/services/assistant';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type ChatMessage = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const SUGGESTED_PROMPTS = [
    "How much did I spend on food this month?",
    "What's my biggest expense this week?",
    "Am I over budget anywhere?",
];

const INITIAL_MESSAGES: ChatMessage[] = [
    {
        id: "welcome",
        role: "assistant",
        content: "Hi! Ask me anything about your spending or budgets in last 30 days.",
    },
];

function MessageBubble({ message }: { message: ChatMessage }) {

    const isUser = message.role === "user";

    return (
        <View className={`mb-3 max-w-[85%] ${isUser ? "self-end" : "self-start"}`}>
            <View
                className={`rounded-2xl px-3.5 py-2.5 ${isUser ? "bg-brand-bg" : "bg-white border border-[#E8E6DF]"
                    }`}
            >
                <Text className={`text-sm ${isUser ? "text-white" : "text-brand-bg"}`}>
                    {message.content}
                </Text>
            </View>
        </View>
    );
}

export default function AssistantScreen() {

    const { user } = useUser();
    const currency = useUserStore((s) => s.currency);
    const { data: transactions = [], refetch: refetchTransactions } = useTransactionsQuery();
    const { data: budget = null, refetch: refetchBudget } = useBudgetQuery();

    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const sendingRef = useRef(false);

    const sendMessage = async (text: string) => {
        if (!text.trim() || sendingRef.current || !user) return;
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: text,
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setSending(true);
        sendingRef.current = true;

        try {
            const freshTransactions = transactions.length > 0 ? transactions : (await refetchTransactions()).data ?? [];
            const freshBudget = budget ?? (await refetchBudget()).data ?? null;
            const reply = await askAssistant(text, freshTransactions, freshBudget, currency);
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: "assistant", content: reply },
            ]);
        } catch (err) {
            console.error("Assistant error:", err);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Sorry, something went wrong answering that. Try again.",
                },
            ]);
        } finally {
            setSending(false);
            sendingRef.current = false;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
            <View className="px-5 pt-3 pb-2">
                <Text className="text-xl font-semibold text-brand-bg">Assistant</Text>
            </View>

            <View className="flex-1">
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MessageBubble message={item} />}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 8,
                        paddingBottom: 12,
                        flexGrow: 1,
                    }}
                    ListFooterComponent={
                        sending ? (
                            <View className="self-start mb-3 bg-white border border-[#E8E6DF] rounded-2xl px-3.5 py-2.5">
                                <ActivityIndicator size="small" color="#4A9EFF" />
                            </View>
                        ) : null
                    }
                    ListHeaderComponent={
                        messages.length <= 1 ? (
                            <View className="gap-2 pb-2">
                                {SUGGESTED_PROMPTS.map((prompt) => (
                                    <TouchableOpacity
                                        key={prompt}
                                        onPress={() => sendMessage(prompt)}
                                        className="bg-white rounded-xl border border-[#E8E6DF] px-3.5 py-2.5 self-start"
                                    >
                                        <Text className="text-xs text-brand-text-secondary">
                                            {prompt}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : null
                    }
                />

                <View
                    className="flex-row items-center gap-2 px-5 pt-2 pb-3"
                >
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask about your money..."
                        placeholderTextColor="#8A8D96"
                        editable={!sending}
                        className="flex-1 bg-white border border-[#E8E6DF] rounded-full px-4 py-3 text-sm text-brand-bg"
                        onSubmitEditing={() => sendMessage(input)}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        onPress={() => sendMessage(input)}
                        disabled={sending}
                        className="items-center justify-center rounded-full w-11 h-11 bg-brand-bg"
                        style={{ opacity: sending ? 0.6 : 1 }}
                    >
                        <Feather name="arrow-up" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}