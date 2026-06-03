import { COLORS } from "@/constants";
import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { type Href, Link, useRouter } from "expo-router";
import * as React from "react";
import { Pressable, TextInput, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
    const { signIn, fetchStatus } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");
    const [showEmailCode, setShowEmailCode] = React.useState(false);

    const finalizeSignIn = async () => {
        await signIn.finalize({
            navigate: ({ session, decorateUrl }) => {
                if (session?.currentTask) return;

                const url = decorateUrl("/");
                if (url.startsWith("http")) {
                    window.location.href = url;
                } else {
                    router.push(url as Href);
                }
            },
        });
    };

    const onSignInPress = async () => {
        if (!emailAddress || !password) return;

        try {
            const { error } = await signIn.password({
                emailAddress,
                password,
            });

            if (error) {
                console.error(error);
                return;
            }

            if (signIn.status === "complete") {
                await finalizeSignIn();
            } else if (signIn.status === "needs_client_trust") {
                const emailCodeFactor = signIn.supportedSecondFactors.find((factor) => factor.strategy === "email_code");

                if (emailCodeFactor) {
                    await signIn.mfa.sendEmailCode();
                    setShowEmailCode(true);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onVerifyPress = async () => {
        if (!code) return;

        try {
            await signIn.mfa.verifyEmailCode({ code });

            if (signIn.status === "complete") {
                await finalizeSignIn();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <SafeAreaView className="justify-center flex-1 bg-white" style={{ padding: 28 }}>
            {!showEmailCode ? (
                <>
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute z-10 top-12">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="mb-2 text-3xl font-bold text-primary">Welcome Back</Text>
                        <Text className="text-secondary">Sign in to continue</Text>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="mb-2 font-medium text-primary">Email</Text>
                        <TextInput className="w-full p-4 bg-surface rounded-xl text-primary" placeholder="user@example.com" placeholderTextColor="#999" autoCapitalize="none" keyboardType="email-address" value={emailAddress} onChangeText={setEmailAddress} />
                    </View>

                    {/* Password */}
                    <View className="mb-6">
                        <Text className="mb-2 font-medium text-primary">Password</Text>
                        <TextInput className="w-full p-4 bg-surface rounded-xl text-primary" placeholder="********" placeholderTextColor="#999" secureTextEntry value={password} onChangeText={setPassword} />
                    </View>

                    {/* Submit */}
                    <Pressable className={`w-full py-4 rounded-full items-center mb-10 ${fetchStatus === "fetching" || !emailAddress || !password ? "bg-gray-300" : "bg-primary"}`} onPress={onSignInPress} disabled={fetchStatus === "fetching" || !emailAddress || !password}>
                        {fetchStatus === "fetching" ? <ActivityIndicator color="#fff" /> : <Text className="text-lg font-bold text-white">Sign In</Text>}
                    </Pressable>

                    {/* Footer */}
                    <View className="flex-row justify-center">
                        <Text className="text-secondary">Don&apos;t have an account? </Text>
                        <Link href="/sign-up">
                            <Text className="font-bold text-primary">Sign up</Text>
                        </Link>
                    </View>
                </>
            ) : (
                <>
                    {/* Verification */}
                    <View className="items-center mb-8">
                        <Text className="mb-2 text-3xl font-bold text-primary">Verify Email</Text>
                        <Text className="text-center text-secondary">Enter the code sent to your email</Text>
                    </View>

                    <View className="mb-6">
                        <TextInput className="w-full p-4 tracking-widest text-center bg-surface rounded-xl text-primary" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
                    </View>

                    <Pressable className={`items-center w-full py-4 rounded-full ${fetchStatus === "fetching" ? "bg-gray-300" : "bg-primary"}`} onPress={onVerifyPress} disabled={fetchStatus === "fetching"}>
                        {fetchStatus === "fetching" ? <ActivityIndicator color="#fff" /> : <Text className="text-lg font-bold text-white">Verify</Text>}
                    </Pressable>
                </>
            )}
        </SafeAreaView>
    );
}
