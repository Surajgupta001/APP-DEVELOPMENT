import { COLORS } from '@/constants'
import { CategoryItemProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'

export default function CategoryItem({ item, isSelected, onPress }: CategoryItemProps) {
    return (
        <TouchableOpacity className='items-center mr-4' onPress={onPress}>
            <View className={`w-14 h-14 rounded-full items-center justify-center mb-2 ${isSelected ? 'bg-primary' : 'bg-surface'}`}>
                <Ionicons name={item.icon as any} size={24} color={isSelected ? '#FFF' : COLORS.primary} />
            </View>
            <Text className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-secondary'}`}>{item.name}</Text>
        </TouchableOpacity>
    )
}