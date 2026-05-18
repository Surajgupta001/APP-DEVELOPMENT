import useSocialAuth from '@/hooks/useSocialAuth'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

export default function AuthScreen() {

    const { handleSocialAuth, loadingStrategy } = useSocialAuth();
    const isLoading = loadingStrategy !== null;

    return (
        <View className='flex-1 bg-background'>
            {/* Gradient Background */}
            <View className='absolute inset-0'>
                <LinearGradient
                    colors={["#0F0E17", "#1A1A2E", "#2D1B69", "#1A1A2E", "#0F0E17"]}
                    locations={[0, 0.25, 0.5, 0.75, 1]}
                    style={{ width: "100%", height: "100%" }}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>
            <SafeAreaView className='justify-between flex-1'>
                {/* TOP SECTION : LOGO + HERO */}
                <View>
                    <View className='items-center pt-10 pb-2'>
                        <View className="w-16 h-16 rounded-[20px] bg-primary/15 items-center justify-center border border-primary/20">
                            <Ionicons name="school" size={30} color="#A29BFE" />
                        </View>
                        <Text className="mt-4 font-mono text-3xl font-extrabold tracking-tight text-foreground">
                            EduSync
                        </Text>
                        <Text className="text-foreground-muted text-[15px] mt-1.5 tracking-wide">
                            Learn together, grow together
                        </Text>
                    </View>
                    <View className='items-center px-6 mt-4'>
                        <Image
                            source={require('@/assets/images/auth.png')}
                            style={{ width: 320, height: 350 }}
                            contentFit='cover'
                        />
                    </View>
                    {/* FEATURE CHIPS */}
                    <View className='flex-row flex-wrap justify-center gap-3 px-5 mt-5'>
                        {[
                            {
                                icon: "videocam" as const,
                                label: "Video Calls",
                                color: "#A29BFE",
                                bg: "bg-primary/12 border-primary/20",
                            },
                            {
                                icon: "chatbubbles" as const,
                                label: "Study Rooms",
                                color: "#FF6B6B",
                                bg: "bg-accent/12 border-accent/20",
                            },
                            {
                                icon: "people" as const,
                                label: "Find Partners",
                                color: "#00B894",
                                bg: "bg-accent-secondary/12 border-accent-secondary/20",
                            },
                        ].map((chip) => (
                            <View
                                key={chip.label}
                                className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border ${chip.bg}`}
                            >
                                <Ionicons name={chip.icon} size={14} color={chip.color} />
                                <Text className="text-xs font-semibold tracking-wide text-foreground-muted">
                                    {chip.label}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View className='px-8 pb-4'>
                    <View className='flex-row items-center gap-3 mb-6'>
                        <View className='flex-1 h-px bg-border' />
                        <Text className='text-xs font-medium tracking-widest uppercase text-foreground-subtle'>
                            Continue with
                        </Text>
                        <View className='flex-1 h-px bg-border' />
                    </View>
                    <View className='flex-row items-center justify-center gap-4 mb-5'>
                        {/* GOOGLE BUTTON */}
                        <Pressable
                            className='items-center justify-center bg-white shadow-lg size-20 rounded-2xl active:scale-95 shadow-white/10'
                            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                            disabled={isLoading}
                            onPress={() => !isLoading && handleSocialAuth('oauth_google')}
                        >
                            {loadingStrategy === 'oauth_google' ? (
                                <ActivityIndicator size={"small"} color={"#6C5CE7"} />
                            ) : (
                                <Image
                                    source={require("../../../assets/images/google.png")}
                                    style={{ width: 28, height: 28 }}
                                    contentFit="contain"
                                />
                            )}
                        </Pressable>
                        {/* APPLE BUTTON */}
                        <Pressable
                            className="items-center justify-center border size-20 rounded-2xl bg-surface border-border-light active:scale-95"
                            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                            disabled={isLoading}
                            accessibilityRole="button"
                            accessibilityLabel="Continue with Apple"
                            onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
                        >
                            {loadingStrategy === "oauth_apple" ? (
                                <ActivityIndicator size="small" color="#6C5CE7" />
                            ) : (
                                <Ionicons name="logo-apple" size={30} color="#FFFFFE" />
                            )}
                        </Pressable>
                        {/* GITHUB BUTTON */}
                        <Pressable
                            className="items-center justify-center border size-20 rounded-2xl bg-surface border-border-light active:scale-95"
                            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                            disabled={isLoading}
                            accessibilityRole="button"
                            accessibilityLabel="Continue with GitHub"
                            onPress={() => !isLoading && handleSocialAuth("oauth_github")}
                        >
                            {loadingStrategy === "oauth_github" ? (
                                <ActivityIndicator size="small" color="#6C5CE7" />
                            ) : (
                                <Ionicons name="logo-github" size={28} color="#FFFFFE" />
                            )}
                        </Pressable>
                    </View>
                    <Text className="text-foreground-subtle text-[11px] text-center leading-4">
                        By continuing, you agree to our{" "}
                        <Text className="text-primary-light">Terms of Service</Text> and{" "}
                        <Text className="text-primary-light">Privacy Policy</Text>
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    )
}