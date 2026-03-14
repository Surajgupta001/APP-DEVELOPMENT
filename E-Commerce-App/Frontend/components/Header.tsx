import { Text, Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { HeaderProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useRouter } from 'expo-router'

export default function Header({ title, showBack, showSearch, showCart, showMenu, showLogo }: HeaderProps) {

    const router = useRouter();

    const { itemCount } = { itemCount: 6 }; // Replace with actual cart item count from state or context

    return (
        <View className='flex-row items-center justify-between px-4 py-3 bg-white'>
            {/* Left Side */}
            <View className='flex-row items-center flex-1'>
                {showBack && (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='arrow-back' size={24} color={COLORS.primary} className='mr-3' />
                    </TouchableOpacity>
                )}
                {showMenu && (
                    <TouchableOpacity>
                        <Ionicons name="menu-outline" size={28} color={COLORS.primary} className='mr-3' />
                    </TouchableOpacity>
                )}
                {showLogo ? (
                    <View className='flex-1'>
                        <Image source={require('@/assets/logo.png')} style={{ width: '100%', height: 24 }} resizeMode='contain' />
                    </View>
                ) : title && (
                    <Text className='flex-1 mr-8 text-xl font-bold text-center text-primary'>{title}</Text>
                )}
                {(!title && !showSearch) && <View className='flex-1' />}
            </View>
            {/* Right Side */}
            <View className='flex-row items-center gap-4'>
                {showSearch && (
                    <TouchableOpacity>
                        <Ionicons name="search-outline" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
                {showCart && (
                    <TouchableOpacity onPress={() => router.push('/(tabs)/cart')}>
                        <View className='relative'>
                            <Ionicons name='bag-outline' size={24} color={COLORS.primary} />
                            <View className='absolute items-center justify-center w-4 h-4 rounded-full -top-1 -right-1 bg-accent'>
                                <Text className='text-white text-[10px] font-bold'>{itemCount}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}