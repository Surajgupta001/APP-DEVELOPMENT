import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { View, Text, KeyboardAvoidingView, Platform, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeSchema, SignInFormSchema, signInSchema } from "../../../lib/schemas/auth";

export default function SignInScreen() {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const isLoading = fetchStatus === "fetching";

    const {
        control,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm<SignInFormSchema>({
        resolver: zodResolver(signInSchema),
        mode: "onBlur",
        defaultValues: {
            emailAddress: "",
            password: "",
        },
    });

    const {
        control: codeControl,
        handleSubmit: handleCodeSubmit,
        formState: { errors: codeErrors },
    } = useForm<{ code: string }>({
        resolver: zodResolver(codeSchema),
        mode: "onBlur",
        defaultValues: {
            code: "",
        },
    });

    const onSignInPress = async (value: SignInFormSchema) => {
        try {
            console.log("Starting sign in...");

            // Create the sign-in attempt with the email/identifier
            await signIn.create({
                identifier: value.emailAddress,
            });

            console.log("Sign-in created:", signIn.status);

            // Submit the password
            await signIn.password({
                password: value.password,
            });

            console.log("Password submitted:", signIn.status);

            // Successful sign in
            if (signIn.status === "complete") {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) {
                            return;
                        }

                        const url = decorateUrl("/");
                        router.replace(url as any);
                    },
                });

                return;
            }

            // Second factor required
            if (signIn.status === "needs_second_factor") {
                const emailCodeFactor =
                    signIn.supportedSecondFactors?.find(
                        (factor) => factor.strategy === "email_code"
                    );

                if (emailCodeFactor) {
                    await signIn.mfa.sendEmailCode();
                }

                return;
            }

            // Client trust required
            if (signIn.status === "needs_client_trust") {
                await signIn.mfa.sendEmailCode();
                return;
            }

            console.log("Unhandled sign-in status:", signIn.status);
        } catch (error: any) {
            console.error("Sign-in error:", error);

            if (error?.errors) {
                console.error("Clerk errors:", error.errors);
            }
        }
    };

    const onVerifyPress = async ({ code }: { code: string }) => {
        try {
            await signIn.mfa.verifyEmailCode({
                code,
            });

            if (signIn.status === "complete") {
                await signIn.finalize({
                    navigate: ({ session, decorateUrl }) => {
                        if (session?.currentTask) {
                            return;
                        }

                        const url = decorateUrl("/");
                        router.replace(url as any);
                    },
                });
            } else {
                console.error(
                    "Verification completed with status:",
                    signIn.status
                );
            }
        } catch (error: any) {
            console.error("Verification error:", error);

            if (error?.errors) {
                console.error("Clerk errors:", error.errors);
            }
        }
    };

    /*
     * Client trust / verification screen
     */
    if (signIn.status === "needs_client_trust") {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-brand-body"
            >
                <View className="justify-center flex-1 px-6 -mt-16">
                    <Image
                        source={require("../../../assets/images/welth.png")}
                        className="h-16 mb-8 w-36"
                        resizeMode="contain"
                    />

                    <Text className="mb-2 text-3xl font-bold leading-tight text-[#1A1D26]">
                        Verify your account
                    </Text>

                    <Controller
                        control={codeControl}
                        name="code"
                        render={({ field: { value, onChange } }) => (
                            <TextInput
                                className="px-4 py-3 mb-2 text-[#1A1D26] bg-white border border-[#E8E6DF] rounded-xl"
                                placeholder="Enter verification code"
                                placeholderTextColor="#8A8D96"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="number-pad"
                            />
                        )}
                    />

                    {codeErrors.code && (
                        <Text className="mb-4 text-sm text-brand-coral">
                            {codeErrors.code.message}
                        </Text>
                    )}

                    {errors.fields?.code && (
                        <Text className="mb-4 text-sm text-brand-coral">
                            {errors.fields.code.message}
                        </Text>
                    )}

                    <TouchableOpacity
                        onPress={handleCodeSubmit(onVerifyPress)}
                        disabled={isLoading}
                        className="items-center w-full py-4 mb-4 bg-brand-blue rounded-xl"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-base font-semibold text-white">
                                Verify
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => signIn.mfa.sendEmailCode()}
                        disabled={isLoading}
                        className="py-2"
                    >
                        <Text className="text-sm text-brand-blue">
                            I didn't receive a code. Resend code
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => signIn.reset()}
                        className="py-2"
                    >
                        <Text className="text-sm text-brand-blue">
                            Start over
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

    /*
     * Main sign-in screen
     */
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-brand-body"
        >
            <View className="justify-center flex-1 px-6 -mt-16">
                <Image
                    source={require("../../../assets/images/welth.png")}
                    className="h-16 mb-8 w-36"
                    resizeMode="contain"
                />

                <Text className="mb-2 text-3xl font-bold leading-tight text-[#1A1D26]">
                    Welcome back 🙋‍♂️
                </Text>

                <Text className="mb-8 text-base text-brand-text-muted">
                    Sign in to your account to continue managing your finances.
                </Text>

                <Controller
                    control={control}
                    name="emailAddress"
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            className="px-4 py-3 mb-2 text-[#1A1D26] bg-white border border-[#E8E6DF] rounded-xl"
                            placeholder="Email address"
                            placeholderTextColor="#8A8D96"
                            value={value}
                            onChangeText={onChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    )}
                />

                {formErrors.emailAddress && (
                    <Text className="mb-4 text-sm text-brand-coral">
                        {formErrors.emailAddress.message}
                    </Text>
                )}

                {errors.fields?.identifier && (
                    <Text className="mb-4 text-sm text-brand-coral">
                        {errors.fields.identifier.longMessage}
                    </Text>
                )}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            className="px-4 py-3 mb-2 text-[#1A1D26] bg-white border border-[#E8E6DF] rounded-xl"
                            placeholder="Password"
                            placeholderTextColor="#8A8D96"
                            value={value}
                            onChangeText={onChange}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry
                        />
                    )}
                />

                {formErrors.password && (
                    <Text className="mb-4 text-sm text-brand-coral">
                        {formErrors.password.message}
                    </Text>
                )}

                {errors.fields?.password && (
                    <Text className="mb-4 text-sm text-brand-coral">
                        {errors.fields.password.longMessage}
                    </Text>
                )}

                <TouchableOpacity
                    onPress={handleSubmit(onSignInPress)}
                    disabled={isLoading}
                    className="items-center w-full py-4 mb-4 bg-brand-blue rounded-xl"
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-base font-semibold text-white">
                            Sign In
                        </Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center">
                    <Text className="text-brand-text-muted">
                        Don't have an account?{" "}
                    </Text>

                    <Link href="/sign-up">
                        <Text className="font-semibold text-brand-blue">
                            Sign up
                        </Text>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}