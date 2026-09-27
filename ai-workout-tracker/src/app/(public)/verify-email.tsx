import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { authClient } from "@/lib/auth-client";
import { setOtpLoginPending } from "@/lib/otp-gate";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 45;

const VerifyEmail = () => {
    const router = useRouter();
    const { email, mode } = useLocalSearchParams<{
        email: string;
        mode?: "email-verification" | "sign-in";
    }>();
    const isSignInOtp = mode === "sign-in";

    const primary = useAppThemeColor("primary");
    const foreground = useAppThemeColor("foreground");
    const border = useAppThemeColor("border");
    const mutedForeground = useAppThemeColor("mutedForeground");
    const destructive = useAppThemeColor("destructive");

    const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    useEffect(() => {
        // Autofocus the first box shortly after mount (keyboard needs a beat).
        const timer = setTimeout(() => inputRefs.current[0]?.focus(), 300);
        return () => clearTimeout(timer);
    }, []);

    const verify = useCallback(async (otp: string) => {
        if (otp.length !== OTP_LENGTH || isVerifying) {
            return;
        }

        setIsVerifying(true);
        setErrorMessage(null);
        try {
            if (isSignInOtp) {
                // Sign-in OTP: verifies the code and signs the user in.
                const { error: signInError } = await authClient.signIn.emailOtp({
                    email,
                    otp,
                });

                if (signInError) {
                    setErrorMessage(
                        signInError.message || "Invalid or expired code.",
                    );
                    setDigits(Array(OTP_LENGTH).fill(""));
                    inputRefs.current[0]?.focus();
                    return;
                }

                // Code accepted and signed in — release the OTP gate so the
                // route guard lets (app) mount.
                setOtpLoginPending(false);
                router.replace("/");
                return;
            }

            const { error } = await authClient.emailOtp.verifyEmail({
                email,
                otp,
            });

            if (error) {
                setErrorMessage(error.message || "Invalid or expired code.");
                setDigits(Array(OTP_LENGTH).fill(""));
                inputRefs.current[0]?.focus();
                return;
            }

            // Verified: the verify-email endpoint returns a session token,
            // so the user is signed in — go straight into the app.
            router.replace("/");
        } finally {
            setIsVerifying(false);
        }
    }, [email, isVerifying, isSignInOtp, router]);

    const handleChange = (index: number, value: string) => {
        setErrorMessage(null);

        // Handle paste / autofill: spread digits across the boxes.
        const sanitized = value.replace(/[^0-9]/g, "");

        if (sanitized.length > 1) {
            const next = [...digits];
            let cursor = index;
            for (const char of sanitized) {
                if (cursor >= OTP_LENGTH) {
                    break;
                }
                next[cursor] = char;
                cursor += 1;
            }
            setDigits(next);

            const filled = next.filter(Boolean).length;
            if (filled === OTP_LENGTH) {
                verify(next.join(""));
            } else {
                inputRefs.current[Math.min(cursor, OTP_LENGTH - 1)]?.focus();
            }
            return;
        }

        const next = [...digits];
        next[index] = sanitized;
        setDigits(next);

        if (sanitized && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
            return;
        }

        if (sanitized && index === OTP_LENGTH - 1) {
            verify(next.join(""));
        }
    };

    const handleKeyPress = (index: number, key: string) => {
        if (key !== "Backspace") {
            return;
        }

        const next = [...digits];
        if (next[index]) {
            next[index] = "";
            setDigits(next);
            return;
        }

        if (index > 0) {
            next[index - 1] = "";
            setDigits(next);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = async () => {
        if (cooldown > 0 || isResending) {
            return;
        }

        setIsResending(true);
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: isSignInOtp ? "sign-in" : "email-verification",
            });

            if (error) {
                setErrorMessage(error.message || "Could not resend the code.");
                return;
            }

            setCooldown(RESEND_COOLDOWN_SECONDS);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
            >
                <View className="flex-1 px-5 pt-12">
                    <Pressable
                        accessibilityLabel="Go back to sign in"
                        className="absolute right-0 top-12 h-11 w-11 items-center justify-center"
                        onPress={() => {
                            setOtpLoginPending(false);
                            router.replace("/sign-in");
                        }}
                    >
                        <Feather color={mutedForeground} name="x" size={22} />
                    </Pressable>

                    <Text className="font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground">
                        {isSignInOtp ? "Confirm it's you" : "Verify your email"}
                    </Text>
                    <Text className="mt-2 font-inter text-[14px] leading-5 text-muted-foreground">
                        We sent a 6-digit code to{" "}
                        <Text className="font-inter-semibold text-foreground">{email}</Text>. Enter
                        it below{" "}
                        {isSignInOtp
                            ? "to securely finish signing in."
                            : "to activate your account."}
                    </Text>

                    <View className="mt-10 flex-row justify-between gap-3">
                        {digits.map((digit, index) => (
                            <View key={index} className="flex-1">
                                <TextInput
                                    accessibilityLabel={`Digit ${index + 1}`}
                                    className="h-14 w-full rounded-xl border text-center font-inter-bold text-[20px] text-foreground"
                                    keyboardType="number-pad"
                                    maxLength={OTP_LENGTH}
                                    ref={(ref) => {
                                        inputRefs.current[index] = ref;
                                    }}
                                    style={{
                                        borderColor: errorMessage ? destructive : border,
                                        color: foreground,
                                    }}
                                    value={digit}
                                    onChangeText={(value) => handleChange(index, value)}
                                    onKeyPress={(event) => handleKeyPress(index, event.nativeEvent.key)}
                                    testID={`otp-digit-${index}`}
                                />
                            </View>
                        ))}
                    </View>

                    {errorMessage && (
                        <Text className="mt-4 font-inter text-[13px] text-destructive">
                            {errorMessage}
                        </Text>
                    )}

                    <Button
                        className="mt-8"
                        disabled={isVerifying || digits.some((d) => !d)}
                        isLoading={isVerifying}
                        onPress={() => verify(digits.join(""))}
                    >
                        Verify & Continue
                    </Button>

                    <View className="mt-6 flex-row items-center justify-center">
                        <Text className="font-inter text-[13px] text-muted-foreground">
                            {"Didn't receive a code? "}
                        </Text>
                        {cooldown > 0 ? (
                            <Text
                                className="font-inter text-[13px]"
                                style={{ color: mutedForeground }}
                            >
                                Resend in {cooldown}s
                            </Text>
                        ) : (
                            <Pressable
                                accessibilityLabel="Resend verification code"
                                className="justify-center px-1 min-h-11"
                                disabled={isResending}
                                onPress={handleResend}
                            >
                                <Text
                                    className="font-inter-semibold text-[13px]"
                                    style={{ color: primary }}
                                >
                                    {isResending ? "Sending..." : "Resend"}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaScreen>
    );
};

export default VerifyEmail;