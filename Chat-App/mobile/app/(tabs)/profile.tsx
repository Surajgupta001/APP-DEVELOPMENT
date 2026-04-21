import { Pressable, ScrollView, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo'

export default function ProfileTab() {

    const { signOut } = useAuth();

    return (
        <ScrollView
            className='bg-surface'
            contentInsetAdjustmentBehavior="automatic"
        >
            <Text className='text-white'>Profile Tab</Text>
            <Pressable
                onPress={() => signOut()}
                className='px-4 py-2 mt-4 bg-red-600 rounded-lg'
            >
                <Text>Signout</Text>
            </Pressable>
        </ScrollView>
    )
};