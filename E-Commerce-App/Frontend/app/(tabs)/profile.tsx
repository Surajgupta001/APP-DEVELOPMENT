import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PROFILE_MENU } from '@/constants';
import { dummyUser } from '@/assets/assets';

export default function Profile() {

    const { user } = { user: dummyUser };
    const router = useRouter();

    const handleLogout = async () => {
        router.push('/sign-in');
    };

    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='Profile' />
            <ScrollView
                className='flex-1 px-4'
                contentContainerStyle={!user ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : { paddingTop: 16 }}
            >
                {!user ? (
                    // Guest user Screen
                    <View className='items-center w-full'>
                        <View className='items-center justify-center w-24 h-24 mb-6 bg-gray-200 rounded-full'>
                            <Ionicons name='person' size={40} color={COLORS.primary} />
                        </View>
                        <Text className='mb-2 text-xl font-bold text-primary'>Guest User</Text>
                        <Text className='w-3/4 px-4 mb-8 text-base text-center text-secondary'>Log in to view profile, orders and addresses.</Text>
                        <TouchableOpacity onPress={() => router.push('/sign-in')} className='items-center w-3/5 py-3 rounded-full shadow-lg bg-primary'>
                            <Text className='text-lg font-bold text-white'>Login / Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Profile Info */}
                        <View className='items-center mb-8'>
                            <View className='mb-3'>
                                <Image source={{ uri: user.imageUrl }}
                                    className='border-2 border-white rounded-full shadow-sm size-20'
                                />
                            </View>
                            <Text className='text-xl font-bold text-primary'>{user.firstName + ' ' + user.lastName}</Text>
                            <Text className='text-sm text-secondary'>{user.emailAddresses[0].emailAddress}</Text>
                            {/* Admin panel Button if user is admin */}
                            {user.publicMetadata?.role === 'admin' && (
                                <TouchableOpacity
                                    onPress={() => router.push('/admin')}
                                    className='px-6 py-2 mt-4 rounded-full bg-primary'
                                >
                                    <Text className='font-bold text-white'>Admin Panel</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {/* Menu */}
                        <View className='p-2 mb-4 bg-white border rounded-xl border-gray-100/75'>
                            {PROFILE_MENU.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    className={`flex-row items-center p-4 ${index !== PROFILE_MENU.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    onPress={() => router.push(item.route as any)}
                                >
                                    <View className='items-center justify-center w-10 h-10 mr-4 rounded-full bg-surface'>
                                        <Ionicons name={item.icon as any} size={20} color={COLORS.primary} />
                                    </View>
                                    <Text className='flex-1 font-medium text-primary'>{item.title}</Text>
                                    <Ionicons name='chevron-forward' size={20} color={COLORS.secondary} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {/* Logout Button */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            className='items-center justify-center w-full py-3 mt-4 bg-red-500 rounded-full'
                        >
                            <Text className='text-xl font-bold text-white'>Logout</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}