import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { CartItemProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {

    const imageUrl = item.product.images?.[0];

    return (
        <View className='flex-row p-3 mb-4 bg-white rounded-xl'>
            <View className='w-20 h-20 mr-3 overflow-hidden bg-gray-100 rounded-lg'>
                <Image source={{ uri: imageUrl }} className='w-full h-full' resizeMode='cover' />
            </View>
            <View className='justify-between flex-1'>
                {/* Product Details */}
                <View className='flex-row items-start justify-between'>
                    <View>
                        <Text className='mb-1 text-sm font-medium text-primary'>{item.product.name}</Text>
                        <Text className='text-xs text-secondary'>Size: {item.size}</Text>
                    </View>
                    <TouchableOpacity onPress={onRemove}>
                        <Ionicons name='close-circle-outline' size={20} color='red' />
                    </TouchableOpacity>
                </View>
                {/* Price and Quantity */}
                <View className='flex-row items-center justify-between mt-2'>
                    <Text className='text-base font-bold text-primary'>${item.product.price.toFixed(2)}</Text>
                    <View className='flex-row items-center px-2 py-1 rounded-full bg-surface'>
                        <TouchableOpacity onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity - 1)} className='p-1'>
                            <Ionicons name='remove' size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                        <Text className='mx-3 font-medium text-primary'>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity + 1)} className='p-1'>
                            <Ionicons name='add' size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}