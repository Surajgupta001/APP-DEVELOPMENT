import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Property } from '../../types'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../lib/utils';
import { useSavedProperty } from '../../hooks/useSavedProperty';
import { useColorScheme } from 'nativewind';

export default function PropertyCard({ property, onUnsave, showSave }: { property: Property; onUnsave?: () => void; showSave?: boolean }) {

    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const { isSaved, saveLoading, toggleSave } = useSavedProperty({
        propertyId: property.id,
        onUnSave: onUnsave,
    });

    return (
        <TouchableOpacity
            onPress={() => router.push(`/property/${property.id}`)}
            className="flex-row mb-4 overflow-hidden bg-white dark:bg-[#1E1E1E] rounded-2xl"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isDark ? 0.3 : 0.06,
                shadowRadius: 8,
                elevation: 3,
                opacity: property.is_sold ? 0.5 : 1,
            }}
        >
            {/* Image */}
            <Image
                source={{ uri: property.images[0] }}
                className="w-28 h-28"
                resizeMode="cover"
            />
            <View className='justify-between flex-1 p-3'>
                <View>
                    <Text
                        className='mb-1 text-sm text-gray-800 dark:text-gray-100 font-bold'
                        numberOfLines={1}
                    >
                        {property.title}
                    </Text>
                    <View className='flex-row items-center gap-1'>
                        <Ionicons
                            name='location-outline'
                            size={11}
                            color={isDark ? '#9CA3AF' : '#6B7280'}
                        />
                        <Text
                            className='text-xs text-gray-500 dark:text-gray-400'
                            numberOfLines={1}
                        >
                            {property.city}
                        </Text>
                    </View>
                </View>
                <View className='flex-row items-center justify-between'>
                    <Text className='text-sm font-bold text-blue-600 dark:text-blue-400'>{formatPrice(property.price)}</Text>
                    {property.is_sold && (
                        <View className='bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full'>
                            <Text className='text-xs font-semibold text-red-500 dark:text-red-400'>Sold</Text>
                        </View>
                    )}
                    <View className='flex-row gap-3'>
                        <View className='flex-row items-center gap-1'>
                            <Ionicons
                                name='bed-outline'
                                size={11}
                                color={isDark ? '#9CA3AF' : '#6B7280'}
                            />
                            <Text className='text-xs text-gray-500 dark:text-gray-400'>{property.bedrooms} beds</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Ionicons
                            name="expand-outline"
                            size={11}
                            color={isDark ? '#9CA3AF' : '#6B7280'}
                        />
                        <Text className="text-xs text-gray-500 dark:text-gray-400">{property.area_sqft} ft²</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                onPress={toggleSave}
                disabled={saveLoading}
                className="items-center w-10 pt-3"
            >
                <Ionicons
                    name={isSaved ? "heart" : "heart-outline"}
                    size={18}
                    color={isSaved ? "#EF4444" : (isDark ? "#9CA3AF" : "#6B7280")}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}