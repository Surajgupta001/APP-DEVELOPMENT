import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Property } from '../../types'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../lib/utils';
import { useColorScheme } from 'nativewind';

export default function FeaturedCard({ property }: { property: Property }) {

    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <TouchableOpacity
            className='mr-2 overflow-hidden bg-white dark:bg-[#1E1E1E] w-72 rounded-3xl'
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.3 : 0.08,
                shadowRadius: 12,
                elevation: 4,
                opacity: property.is_sold ? 0.5 : 1,
            }}
            onPress={() => router.push(`/property/${property.id}`)}
        >
            {/* Image */}
            <Image
                source={{ uri: property.images[0] }}
                resizeMode='cover'
                className='w-full h-44'
            />

            {/* Type Badge */}
            <View className="absolute px-3 py-1 rounded-full top-3 left-3 bg-white/90 dark:bg-black/80">
                <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
                    {property.type}
                </Text>
            </View>
            {property.is_sold && (
                <View className="absolute px-3 py-1 bg-red-500 rounded-full top-3 right-3">
                    <Text className="text-xs font-semibold text-white">Sold</Text>
                </View>
            )}

            {/* Info */}
            <View className="p-4">
                <Text
                    className="mb-1 text-base font-bold text-gray-800 dark:text-gray-100"
                    numberOfLines={1}
                >
                    {property.title}
                </Text>

                <View className="flex-row items-center gap-1 mb-3">
                    <Ionicons name="location-outline" size={13} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={1}>
                        {property.address}, {property.city}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(property.price)}
                    </Text>
                    <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="bed-outline" size={13} color={isDark ? '#9CA3AF' : '#6B7280'} />
                            <Text className="text-xs text-gray-500 dark:text-gray-400">{property.bedrooms}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <Ionicons name="water-outline" size={13} color={isDark ? '#9CA3AF' : '#6B7280'} />
                            <Text className="text-xs text-gray-500 dark:text-gray-400">
                                {property.bathrooms}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}
