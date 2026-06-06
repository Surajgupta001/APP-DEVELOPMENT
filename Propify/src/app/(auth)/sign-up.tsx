import { useSignUp } from '@clerk/expo';
import { useAuth } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';

export default function signUp() {

    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();

    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    const isLoading = fetchStatus === 'fetching';

    if (signUp.status === 'complete' || isSignedIn) {
        return null;
    };

    const onSignUpPress = async () => {

        const { error } = await signUp.password({
            firstName,
            lastName,
            emailAddress: email,
            password,
        })

        if (error) {
            alert(error.message);
            return;
        }

        if (!error) {
            await signUp.verifications.sendEmailCode();
        }
    };

    const onVerifyPress = async () => {
        await signUp.verifications.verifyEmailCode({
            code,
        });

        if (signUp.status === 'complete') {
            await signUp.finalize({
                navigate: ({ decorateUrl }) => {
                    const url = decorateUrl('/');
                    router.push(url as any);
                },
            });
        }
    };

    // OTP verification screen
    if (
        signUp.status === "missing_requirements" &&
        signUp.unverifiedFields.includes("email_address") &&
        signUp.missingFields.length === 0
    ) {
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
                <Text className="mb-8 text-center text-gray-500 dark:text-gray-400">
                    We sent a code to {email}
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
                    onPress={() => signUp.verifications.sendEmailCode()}
                    className="py-2"
                >
                    <Text className="text-blue-600 dark:text-blue-400">I need a new code</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => signUp.reset()} className="py-2">
                    <Text className="text-blue-600 dark:text-blue-400">Start over</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Sign-up form
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps='handled'
            className="bg-white dark:bg-[#121212]"
        >
            <View className='justify-center flex-1 px-6 py-12'>
                <Image
                    source={require('../../../assets/images/kribb.png')}
                    style={{ tintColor: isDark ? '#ffffff' : undefined }}
                    resizeMode='contain'
                    className='w-32 h-16 mb-8'
                />
                <Text className='mb-2 text-3xl font-bold text-gray-800 dark:text-white'>
                    Create an account
                </Text>
                <Text className='mb-8 text-gray-500 dark:text-gray-400'>
                    Find your dream home today, with Propify. Sign up to get started!
                </Text>
                <View className='flex-row gap-3 mb-4'>
                    <TextInput
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white"
                        placeholder='First Name'
                        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize='words'
                    />
                    <TextInput
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white"
                        placeholder='Last Name'
                        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize='words'
                    />
                </View>
                <TextInput
                    className="w-full px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white"
                    placeholder='Email address'
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                {errors.fields.emailAddress && (
                    <Text className='mb-4 text-red-500'>
                        {errors.fields.emailAddress.message}
                    </Text>
                )}
                <TextInput
                    className="w-full px-4 py-3 mb-4 border border-gray-300 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-800 dark:text-white"
                    placeholder='Password'
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {errors.fields.password && (
                    <Text className='mb-4 text-red-500'>
                        {errors.fields.password.message}
                    </Text>
                )}
                <TouchableOpacity
                    onPress={onSignUpPress}
                    disabled={isLoading}
                    className="items-center w-full py-4 mb-4 bg-blue-600 rounded-xl"
                >
                    {isLoading ? (
                        <ActivityIndicator color='white' />
                    ) : (
                        <Text className='text-base font-bold text-white'>
                            Sign Up
                        </Text>
                    )}
                </TouchableOpacity>
                <View className='flex-row justify-center'>
                    <Text className='text-gray-500 dark:text-gray-400'>Already have an account? </Text>
                    <Link href='/sign-in'>
                        <Text className='font-bold text-blue-600 dark:text-blue-400'>Sign in</Text>
                    </Link>
                </View>
                <View nativeID='clerk-captcha' />
            </View>
        </ScrollView>
    );
}
