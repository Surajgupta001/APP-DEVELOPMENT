import { useAuth, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {

    const { user } = useUser();
    const { signOut, isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    // Redirect to sign-in if not authenticated
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/sign-in');
        }
    }, [isLoaded, isSignedIn, router]);

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Sign Out',
                onPress: async () => {
                    await signOut();
                    router.replace('/sign-in');
                }
            }
        ])
    };

    // Show loading state while checking authentication
    if (!isLoaded) {
        return (
            <SafeAreaView className='flex-1 bg-brand-body' edges={['top']}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-brand-body' edges={['top']}>
            <TouchableOpacity onPress={handleSignOut}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}