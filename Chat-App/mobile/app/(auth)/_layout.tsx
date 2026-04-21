import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/expo';

export default function AuthLayout() {

    const { isSignedIn, isLoaded } = useAuth();

    if (isSignedIn) {
        return <Redirect href="/(tabs)" />
    }

  return (
    <Stack screenOptions={{
      headerShown: false
    }} />
  )
}