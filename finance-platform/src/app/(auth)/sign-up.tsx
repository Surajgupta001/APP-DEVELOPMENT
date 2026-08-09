import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useAuth, useSignUp } from '@clerk/expo'
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { codeSchema, SignUpFormSchema, signUpSchema } from '../../../lib/schemas/auth';

export default function SignUpScreen() {

    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const isLoading = fetchStatus === 'fetching';

    const [email, setEmail] = useState('');

    const {
        control,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpSchema),
        mode: 'onBlur',
        defaultValues: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            password: '',
        }
    });

    const {
        control: codeControl,
        handleSubmit: handleCodeSubmit,
        formState: { errors: codeErrors },
    } = useForm<{ code: string }>({
        resolver: zodResolver(codeSchema),
        mode: 'onBlur',
        defaultValues: {
            code: '',
        }
    });

    const onSignUpPress = async (value: SignUpFormSchema) => {
        setEmail(value.emailAddress);

        const { error } = await signUp.password({
            emailAddress: value.emailAddress,
            password: value.password,
            firstName: value.firstName,
            lastName: value.lastName,
        });

        if (error) {
            console.error(JSON.stringify(error, null, 2));
        }

        if (!error) {
            await signUp.verifications.sendEmailCode();
        }
    };

    const onVerifyPress = async ({ code }: { code: string }) => {
        await signUp.verifications.verifyEmailCode({ code });

        if (signUp.status === 'complete') {
            await signUp.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) return;
                    const url = decorateUrl('/');
                    router.replace(url as any);
                },
            });
        } else {
            console.error('Verification failed:', signUp);
        }
    };

    if (signUp.status === 'complete' || isSignedIn) {
        return null;
    };

    if (signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address') && signUp.missingFields.length === 0) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-brand-body"
            >
                <View className="justify-center flex-1 px-6 -mt-16">
                    <Image
                        source={require('../../../assets/images/welth.png')}
                        className="h-16 mb-8 w-36"
                        resizeMode="contain"
                    />
                    <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
                        Verify your account
                    </Text>
                    <Text className="mb-8 text-base text-brand-text-muted">
                        We sent a verification code to {email}. Please enter it below to verify your account.
                    </Text>
                    <Controller
                        control={codeControl}
                        name="code"
                        render={({ field: { value, onChange } }) => {
                            return (
                                <TextInput
                                    className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 mb-2 text-[#1A1D26]"
                                    placeholder="Enter verification code"
                                    placeholderTextColor="#8A8D96"
                                    value={value}
                                    onChangeText={onChange}
                                />
                            );
                        }}
                    />
                    {codeErrors.code && (
                        <Text className="mb-4 text-sm text-brand-coral">
                            {codeErrors.code.message}
                        </Text>
                    )}
                    {errors.fields.code && (
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
                            <Text className="text-base font-semibold text-white">Verify</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => signUp.verifications.sendEmailCode()}
                        className="py-2"
                    >
                        <Text className="text-sm text-brand-blue">
                            I didn't receive a code. Resend code
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => signUp.reset()} className="py-2">
                        <Text className="text-sm text-brand-blue">Start over</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-brand-body"
        >
            <View className="justify-center flex-1 px-6 -mt-16">
                <Image
                    source={require('../../../assets/images/welth.png')}
                    className="h-16 mb-8 w-36"
                    resizeMode="contain"
                />
                <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
                    Create Account
                </Text>
                <Text className='mb-8 text-base text-brand-text-muted'>
                    Track your money, powered by AI
                </Text>
                <View className='flex-row gap-3 mb-2'>
                    <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { value, onChange } }) => {
                            return (
                                <TextInput
                                    className="flex-1 border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
                                    placeholder="First name"
                                    placeholderTextColor="#8A8D96"
                                    value={value}
                                    onChangeText={onChange}
                                    autoCapitalize="words"
                                />
                            )
                        }}
                    />
                    <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { value, onChange } }) => {
                            return (
                                <TextInput
                                    className="flex-1 border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
                                    placeholder="Last name"
                                    placeholderTextColor="#8A8D96"
                                    value={value}
                                    onChangeText={onChange}
                                    autoCapitalize="words"
                                />
                            )
                        }}
                    />
                </View>
                {(formErrors.firstName || formErrors.lastName) && (
                    <Text className='mb-4 text-sm text-brand-coral'>
                        {formErrors.firstName?.message || formErrors.lastName?.message}
                    </Text>
                )}
                <Controller
                    control={control}
                    name="emailAddress"
                    render={({ field: { value, onChange } }) => {
                        return (
                            <TextInput
                                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26] mb-2"
                                placeholder="Email address"
                                placeholderTextColor="#8A8D96"
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        )
                    }}
                />
                {formErrors.emailAddress && (
                    <Text className='mb-4 text-sm text-brand-coral'>
                        {formErrors.emailAddress.message}
                    </Text>
                )}
                {errors.fields.emailAddress && (
                    <Text className='mb-4 text-sm text-brand-coral'>
                        {errors.fields.emailAddress.longMessage}
                    </Text>
                )}
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange } }) => {
                        return (
                            <TextInput
                                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26] mb-2"
                                placeholder="Password"
                                placeholderTextColor="#8A8D96"
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize="none"
                                secureTextEntry
                            />
                        )
                    }}
                />
                {formErrors.password && (
                    <Text className='mb-4 text-sm text-brand-coral'>
                        {formErrors.password.message}
                    </Text>
                )}
                {errors.fields.password && (
                    <Text className='mb-4 text-sm text-brand-coral'>
                        {errors.fields.password.longMessage}
                    </Text>
                )}
                <TouchableOpacity
                    onPress={handleSubmit(onSignUpPress)}
                    disabled={isLoading}
                    className='items-center w-full py-4 mb-4 bg-brand-blue rounded-xl'
                >
                    {isLoading ? (
                        <ActivityIndicator color='white' />
                    ) : (
                        <Text className='text-base font-semibold text-white'>Sign Up</Text>
                    )}
                </TouchableOpacity>
                <View className='flex-row justify-center'>
                    <Text className='text-brand-text-muted'>
                        Already have an account?{' '}
                    </Text>
                    <Link href="/sign-in">
                        <Text className='font-semibold text-brand-blue'>Sign in</Text>
                    </Link>
                </View>
                {/* required by Clerk for bot protection */}
                <View nativeID='clerk-captcha' />
            </View>
        </KeyboardAvoidingView>
    );
};
