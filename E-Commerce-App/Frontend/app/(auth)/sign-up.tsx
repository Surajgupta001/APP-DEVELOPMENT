import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";
import { type Href, useRouter, Link } from "expo-router";
import { COLORS } from "@/constants";
import { useSignUp } from "@clerk/expo";

export default function SignUpScreen() {
    const { signUp, fetchStatus } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [code, setCode] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);

    const finalizeSignUp = async () => {
        await signUp.finalize({
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

    const onSignUpPress = async () => {
        if (!emailAddress || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all fields'
            });
            return;
        }

        try {
            const { error } = await signUp.password({
                emailAddress,
                password,
                firstName,
                lastName,
            });

            if (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to Sign Up',
                    text2: error.message ?? "Something went wrong"
                });
                return;
            }

            await signUp.verifications.sendEmailCode();

            setPendingVerification(true);
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Sign Up',
                text2: err?.errors?.[0]?.message ?? "Something went wrong"
            });
        }
    };

    const onVerifyPress = async () => {
        if (!code) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Enter verification code'
            });
            return;
        }

        try {
            await signUp.verifications.verifyEmailCode({ code });

            if (signUp.status === "complete") {
                await finalizeSignUp();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Verification incomplete'
                });
            }
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Failed to Verify',
                text2: err?.errors?.[0]?.message ?? "Invalid code"
            });
        }
    };

    return (
        <SafeAreaView className="justify-center flex-1 bg-white" style={{ padding: 28 }}>
            {!pendingVerification ? (
                <>
                    <TouchableOpacity onPress={() => router.push("/")} className="absolute z-10 top-12">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="items-center mb-8">
                        <Text className="mb-2 text-3xl font-bold text-primary">Create Account</Text>
                        <Text className="text-secondary">Sign up to get started</Text>
                    </View>

                    {/* First Name */}
                    <View className="mb-4">
                        <Text className="mb-2 font-medium text-primary">First Name</Text>
                        <TextInput className="w-full p-4 bg-surface rounded-xl text-primary" placeholder="John" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} />
                    </View>

                    {/* Last Name */}
                    <View className="mb-6">
                        <Text className="mb-2 font-medium text-primary">Last Name</Text>
                        <TextInput className="w-full p-4 bg-surface rounded-xl text-primary" placeholder="Doe" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} />
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
                    <TouchableOpacity className={`items-center w-full py-4 mb-10 rounded-full ${fetchStatus === "fetching" ? "bg-gray-300" : "bg-primary"}`} onPress={onSignUpPress} disabled={fetchStatus === "fetching"}>
                        {fetchStatus === "fetching" ? <ActivityIndicator color="#fff" /> : <Text className="text-lg font-bold text-white">Continue</Text>}
                    </TouchableOpacity>

                    {/* Footer */}
                    <View className="flex-row justify-center">
                        <Text className="text-secondary">Already have an account? </Text>
                        <Link href="/sign-in">
                            <Text className="font-bold text-primary">Login</Text>
                        </Link>
                    </View>
                </>
            ) : (
                <>
                    <TouchableOpacity onPress={() => router.back()} className="absolute z-10 top-12">
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>

                    {/* Verification */}
                    <View className="items-center mb-8">
                        <Text className="mb-2 text-3xl font-bold text-primary">Verify Email</Text>
                        <Text className="text-center text-secondary">Enter the code sent to your email</Text>
                    </View>

                    <View className="mb-6">
                        <TextInput className="w-full p-4 tracking-widest text-center bg-surface rounded-xl text-primary" placeholder="123456" placeholderTextColor="#999" keyboardType="number-pad" value={code} onChangeText={setCode} />
                    </View>

                    <TouchableOpacity className={`items-center w-full py-4 rounded-full ${fetchStatus === "fetching" ? "bg-gray-300" : "bg-primary"}`} onPress={onVerifyPress} disabled={fetchStatus === "fetching"}>
                        {fetchStatus === "fetching" ? <ActivityIndicator color="#fff" /> : <Text className="text-lg font-bold text-white">Verify</Text>}
                    </TouchableOpacity>
                </>
            )}
        </SafeAreaView>
    );
}
