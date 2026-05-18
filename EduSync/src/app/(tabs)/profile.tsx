import { COLORS } from '@/lib/theme';
import { useAuth, useUser } from '@clerk/expo';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Sentry from '@sentry/react-native';
import { Alert } from 'react-native';

const MENU_ITEMS = [
    { icon: "notifications-outline", label: "Notifications", color: COLORS.primary },
    { icon: "bookmark-outline", label: "Saved Resources", color: COLORS.accent },
    { icon: "time-outline", label: "Study History", color: COLORS.accentSecondary },
    { icon: "settings-outline", label: "Settings", color: COLORS.textMuted },
];

export default function ProfileScreen() {

    const { signOut } = useAuth();
    const { user } = useUser();

    return (
        <SafeAreaView className='flex-1 bg-background'>
            {/* HEADER */}
            <View className="px-5 py-3">
                <Text className="text-2xl font-bold text-foreground">Profile</Text>
            </View>
            {/* PROFILE CARD */}
            <View className="items-center py-5">
                <View className="mb-3.5 relative">
                    <Image
                        source={user?.imageUrl}
                        style={{ width: 88, height: 88, borderRadius: 44 }}
                        contentFit="contain"
                    />
                    <View className="absolute bottom-[2px] right-[2px] h-[18px] w-[18px] rounded-[9px] bg-accent-secondary border-[3px] border-background" />
                </View>
                <Text className="text-2xl font-bold text-foreground">
                    {user?.fullName || user?.username || "Student"}
                </Text>
                <Text className="mt-0.5 text-base text-foreground-muted">
                    {user?.primaryEmailAddress?.emailAddress}
                </Text>
                <View className="mt-3 flex-row items-center gap-1.5 rounded-full bg-[#FDCB6E1E] px-3.5 py-1.5">
                    <Ionicons name="flame" size={16} color="#FDCB6E" />
                    <Text className="text-sm font-semibold text-[#FDCB6E]">7 day study streak</Text>
                </View>
            </View>
            {/* STATS */}
            <View className="flex-row gap-3 px-5 mt-2 mb-6">
                <View className="items-center flex-1 px-4 py-4 border rounded-2xl border-border bg-surface">
                    <Text className="text-2xl font-bold text-primary">24</Text>
                    <Text className="mt-1 text-xs text-foreground-muted">Sessions</Text>
                </View>
                <View className="items-center flex-1 px-4 py-4 border rounded-2xl border-border bg-surface">
                    <Text className="text-2xl font-bold text-primary">12</Text>
                    <Text className="mt-1 text-xs text-foreground-muted">Partners</Text>
                </View>
                <View className="items-center flex-1 px-4 py-4 border rounded-2xl border-border bg-surface">
                    <Text className="text-2xl font-bold text-primary">48h</Text>
                    <Text className="mt-1 text-xs text-foreground-muted">Study Time</Text>
                </View>
            </View>
            {/* MENU ITEMS */}
            <View className="gap-1 px-5">
                {MENU_ITEMS.map((item, i) => (
                    <Pressable
                        key={i}
                        className="mb-1.5 flex-row items-center gap-3.5 rounded-xl border border-border bg-surface px-4 py-4"
                    >
                        <View
                            className="items-center justify-center w-10 h-10 rounded-xl"
                            style={{ backgroundColor: `${item.color}15` }}
                        >
                            <Ionicons name={item.icon as any} size={22} color={item.color} />
                        </View>
                        <Text className="flex-1 text-base font-medium text-foreground">{item.label}</Text>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.textSubtle} />
                    </Pressable>
                ))}
            </View>
            {/* SIGN OUT BTN */}
            <Pressable
                className="mt-6 mx-5 flex-row items-center justify-center gap-2 rounded-xl border border-[#FF6B6B33] bg-surface px-4 py-4"
                onPress={async () => {
                    try {
                        await signOut();
                        Sentry.logger.info("User signed out successfully", { userId: user?.id });
                    } catch (error) {
                        Sentry.logger.error("Error signing out", { error, userId: user?.id });
                        Sentry.captureException(error);
                        Alert.alert("Error", "An error occurred while signing out. Please try again.");
                    }
                }}
            >
                <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
                <Text className="text-base font-semibold text-danger">Sign Out</Text>
            </Pressable>
        </SafeAreaView>
    )
}
