import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";
import { useAppThemeColor } from "@/theme/app-theme";
import { SignUpFormValues, signUpSchema } from "@/lib/validations/auth-validation";
import { getOnboardingAnswers, resetOnboardingAnswers } from "@/constants/onboarding";
import { authClient } from "@/lib/auth-client";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Button from "@/components/ui/button";

const googleLogo = require("../../../assets/images/app-images/google-logo.png");

export default function SignUp() {
    const router = useRouter();

    const foreground = useAppThemeColor("foreground");
    const iconColor = useAppThemeColor("mutedForeground");

    const [isPending, setIsPending] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const { control, handleSubmit, formState: { errors } } = useForm<SignUpFormValues>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
        resolver: zodResolver(signUpSchema),
        shouldFocusError: true,
    });

    const onSubmit = handleSubmit(async ({ fullName, email, password }) => {
        const result = getOnboardingAnswers();

        if (!result.success) {
            router.replace("/welcome");
            return;
        }
        setIsPending(true);

        try {
            const { error } = await authClient.signUp.email({
                name: fullName,
                email,
                password,
                ...result.data,
            });

            if (error) {
                console.error("Better Auth signup error:", error.message);

                Alert.alert("Error during sign up", error.message,);
                return;
            }

            await resetOnboardingAnswers();
        } catch (error) {
            console.error("Signup error:", error);

            Alert.alert("Could not create account", "An unexpected error occurred. Please try again later.");
        } finally {
            setIsPending(false);
        }
    });

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);

        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });

            if (error) {
                console.error("Google sign-up error:", error);

                Alert.alert("Error during Google sign up", error.message);
                return;
            }
        } catch (error) {
            console.error("Google sign-up error:", error);

            Alert.alert("Could not sign up with Google", "An unexpected error occurred. Please try again later.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <SafeAreaScreen edges={["top", "bottom"]}>
            <KeyboardAwareScrollView
                contentContainerClassName="flex-grow"
                contentContainerStyle={{ paddingBottom: 24 }}
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-grow px-5 pt-12 pb-5">
                    <View>
                        <Text className="font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground">
                            Create account
                        </Text>
                        <Text className="mt-1 font-inter text-[14px] leading-5 text-muted-foreground">
                            Sign up to get started
                        </Text>
                    </View>
                    <View className="gap-5 mt-9">
                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field: { value, onBlur, onChange } }) => (
                                <View className="gap-2">
                                    <Text className="font-inter-medium text-[14px] text-foreground">
                                        Full Name
                                    </Text>
                                    <TextInput
                                        textContentType="name"
                                        autoComplete="name"
                                        autoCapitalize="words"
                                        value={value}
                                        className={`h-14 rounded-xl border bg-input px-4 font-inter text-[14px] text-foreground ${errors.fullName ? "border-destructive" : "border-input-border"}`}
                                        placeholder="John Doe"
                                        placeholderTextColor={iconColor}
                                        selectionColor={foreground}
                                        returnKeyType="next"
                                        onSubmitEditing={() => emailInputRef.current?.focus()}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                    />
                                    {errors.fullName && (
                                        <Text className="font-inter text-[12px] text-destructive">
                                            {errors.fullName.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onBlur, onChange, value } }) => (
                                <View className="gap-2">
                                    <Text className="font-inter-medium text-[14px] text-foreground">
                                        Email
                                    </Text>
                                    <TextInput
                                        ref={emailInputRef}
                                        autoCapitalize="none"
                                        textContentType="emailAddress"
                                        autoComplete="email"
                                        className={`h-14 rounded-xl border bg-input px-4 font-inter text-[14px] text-foreground ${errors.email ? "border-destructive" : "border-input-border"}`}
                                        value={value}
                                        inputMode="email"
                                        placeholder="you@example.com"
                                        placeholderTextColor={iconColor}
                                        selectionColor={foreground}
                                        returnKeyType="next"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                                    />
                                    {errors.email && (
                                        <Text className="font-inter text-[12px] text-destructive">
                                            {errors.email.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onBlur, onChange, value } }) => (
                                <View className="gap-2">
                                    <Text className="font-inter-medium text-[14px] text-foreground">
                                        Password
                                    </Text>
                                    <View className={`h-14 flex-row items-center rounded-xl border bg-input px-4 ${errors.password ? "border-destructive" : "border-input-border"}`} >
                                        <TextInput
                                            ref={passwordInputRef}
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            textContentType="newPassword"
                                            className="h-full flex-1 font-inter text-[14px] text-foreground"
                                            value={value}
                                            placeholder="Create a password"
                                            placeholderTextColor={iconColor}
                                            returnKeyType="done"
                                            secureTextEntry={!isPasswordVisible}
                                            selectionColor={foreground}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            onSubmitEditing={onSubmit}
                                        />
                                        <Pressable
                                            accessibilityLabel={
                                                isPasswordVisible ? "Hide password" : "Show password"
                                            }
                                            accessibilityRole="button"
                                            className="items-center justify-center -mr-3 h-11 w-11"
                                            hitSlop={4}
                                            onPress={() =>
                                                setIsPasswordVisible((current) => !current)
                                            }
                                        >
                                            <Feather
                                                color={iconColor}
                                                name={isPasswordVisible ? "eye-off" : "eye"}
                                                size={22}
                                            />
                                        </Pressable>
                                    </View>
                                    {errors.password && (
                                        <Text className="font-inter text-[12px] text-destructive">
                                            {errors.password.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>

                    <Button
                        className="mt-10"
                        disabled={isPending || isGoogleLoading}
                        isLoading={isPending}
                        onPress={onSubmit}
                    >
                        Sign Up
                    </Button>

                    <View className="flex-row items-center gap-4 my-7">
                        <View className="flex-1 h-px bg-border" />
                        <Text className="font-inter text-[12px] text-muted-foreground">
                            or continue with
                        </Text>
                        <View className="flex-1 h-px bg-border" />
                    </View>

                    <View className="gap-3">
                        <Button
                            variant="outline"
                            disabled={isGoogleLoading || isPending}
                            leftIcon={
                                <View className="absolute w-5 h-5 left-5">
                                    <Image
                                        className="w-5 h-5"
                                        resizeMode="contain"
                                        source={googleLogo}
                                    />
                                </View>
                            }
                            rightIcon={
                                isGoogleLoading && (
                                    <ActivityIndicator
                                        className="absolute right-5"
                                        color={foreground}
                                    />
                                )
                            }
                            onPress={handleGoogleSignUp}
                        >
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            disabled={isGoogleLoading || isPending}
                            leftIcon={
                                <View className="absolute w-5 h-6 left-5">
                                    <FontAwesome color={foreground} name="apple" size={22} />
                                </View>
                            }
                            onPress={() => alert("Apple Comming Soon")}
                        >
                            Continue with Apple
                        </Button>
                    </View>

                    <View className="flex-row items-center justify-center pt-10 mt-auto">
                        <Text className="font-inter text-[13px] text-muted-foreground">
                            Already have an account?{" "}
                        </Text>
                        <Link href="/sign-in" asChild replace>
                            <Pressable
                                accessibilityLabel="Sign in to your account"
                                className="justify-center px-1 -my-3 min-h-11"
                            >
                                <Text className="font-inter-semibold text-[13px] text-primary">
                                    Sign In
                                </Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <KeyboardToolbar />
        </SafeAreaScreen>
    );
}