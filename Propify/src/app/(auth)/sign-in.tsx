import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "nativewind";

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const isLoading = fetchStatus === "fetching";

  if (signIn.status === "needs_client_trust") {
    return (
      <View className="items-center justify-center flex-1 px-6 bg-white dark:bg-[#121212]">
        <Image
          source={require("../../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          style={{ tintColor: isDark ? '#ffffff' : undefined }}
          resizeMode="contain"
        />
        <Text className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
          Verify your account
        </Text>

        <TextInput
          className="w-full px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white"
          placeholder="Enter verification code"
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {errors.fields.code && (
          <Text className="mb-4 text-red-500">
            {errors.fields.code.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onVerifyPress}
          disabled={isLoading}
          className="items-center w-full py-4 mb-4 bg-blue-600 rounded-xl"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => signIn.mfa.sendEmailCode()}
          className="py-2 mb-2"
        >
          <Text className="text-blue-600 dark:text-blue-400">I need a new code</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => signIn.reset()} className="py-2">
          <Text className="text-blue-600 dark:text-blue-400">Start over</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white dark:bg-[#121212]"
      keyboardShouldPersistTaps="handled"
    >
      <View className="justify-center flex-1 px-6 py-12">
        <Image
          source={require("../../../assets/images/kribb.png")}
          className="h-16 mb-8 w-36"
          style={{ tintColor: isDark ? '#ffffff' : undefined }}
          resizeMode="contain"
        />
        <Text className="mb-2 text-3xl font-bold text-gray-800 dark:text-white">
          Welcome back
        </Text>
        <Text className="mb-8 text-gray-500 dark:text-gray-400">Sign in to your account</Text>

        <TextInput
          className="w-full px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white"
          placeholder="Email address"
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.fields.identifier && (
          <Text className="mb-4 text-red-500">
            {errors.fields.identifier.message}
          </Text>
        )}

        <TextInput
          className="w-full px-4 py-3 mb-6 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white"
          placeholder="Password"
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="mb-4 text-red-500">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSignInPress}
          disabled={isLoading}
          className="items-center w-full py-4 mb-4 bg-blue-600 rounded-xl"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500 dark:text-gray-400">Don&apos;t have an account? </Text>
          <Link href="/sign-up">
            <Text className="font-semibold text-blue-600 dark:text-blue-400">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}