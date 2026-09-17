import { useRouter } from 'expo-router'
import { Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {

    const router = useRouter();

    return (
        <SafeAreaView>
            <Text>Index</Text>
            <Pressable onPress={() => router.push({
                pathname: '/(public)/welcome',
                params: { name: 'John Doe' },
            })}>
                <Text>Go to Welcome</Text>
            </Pressable>
        </SafeAreaView>
    )
}
