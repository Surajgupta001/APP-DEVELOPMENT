import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Property } from '../../types'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../lib/utils';

export default function PropertyCard({ property, onUnsave, showSave }: { property: Property; onUnsave?: () => void; showSave?: boolean }) {

    const router = useRouter();

    const isSaved = true; // Placeholder for saved state, replace with actual logic

    return (
        <TouchableOpacity
            // onPress={() => router.push(`/(root)/property/${property.id}`)}
            className="flex-row mb-4 overflow-hidden bg-white rounded-2xl"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
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
                        className='mb-1 text-sm text-gray-800 font-bld'
                        numberOfLines={1}
                    >
                        {property.title}
                    </Text>
                    <View className='flex-row items-center gap-1'>
                        <Ionicons
                            name='location-outline'
                            size={11}
                            color='#6B7280'
                        />
                        <Text
                            className='text-xs text-gray-500'
                            numberOfLines={1}
                        >
                            {property.city}
                        </Text>
                    </View>
                </View>
                <View className='flex-row items-center justify-between'>
                    <Text className='text-sm font-bold text-blue-600'>{formatPrice(property.price)}</Text>
                    {property.is_sold && (
                        <View className='bg-red-50 px-2 py-0.5 rounded-full'>
                            <Text className='text-xs font-semibold text-red-500'>Sold</Text>
                        </View>
                    )}
                    <View className='flex-row gap-3'>
                        <View className='flex-row items-center gap-1'>
                            <Ionicons
                                name='bed-outline'
                                size={11}
                                color='#6B7280'
                            />
                            <Text className='text-xs text-gray-500'>{property.bedrooms} beds</Text>
                        </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Ionicons
                            name="expand-outline"
                            size={11}
                            color="#6B7280"
                        />
                        <Text className="text-xs text-gray-500">{property.area_sqft} ft²</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                className="items-center w-10 pt-3"
            >
                <Ionicons
                    name={isSaved ? "heart" : "heart-outline"}
                    size={18}
                    color={isSaved ? "#EF4444" : "#6B7280"}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}