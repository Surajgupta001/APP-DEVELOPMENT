import { Text, ScrollView } from 'react-native'
import React from 'react'

export default function ChatsTab() {
    return (
        <ScrollView
            className='bg-surface'
            contentInsetAdjustmentBehavior="automatic"
        >
            <Text className='text-white'>Chat Tab</Text>
        </ScrollView>
    )
};