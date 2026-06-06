import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { useColorScheme } from 'nativewind';

export default function MapsScreen() {

    const { latitude, longitude, title, address } = useLocalSearchParams<{ latitude: string; longitude: string; title: string; address: string }>();

    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.001
        }%2C${lat - 0.001}%2C${lng + 0.001}%2C${lat + 0.001
        }&layer=mapnik&marker=${lat}%2C${lng}`;

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-[#121212]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-full w-9 h-9"
                >
                    <Ionicons name="arrow-back" size={20} color={isDark ? "#fff" : "#111827"} />
                </TouchableOpacity>

                <View className="flex-1 mx-3">
                    <Text
                        className="text-sm font-semibold text-gray-900 dark:text-white"
                        numberOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text className="text-xs text-gray-400 dark:text-gray-500" numberOfLines={1}>
                        {address}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL(`https://www.google.com/maps?q=${lat},${lng}`)
                    }
                    className="flex-row items-center gap-1 px-3 py-2 rounded-full bg-blue-50 dark:bg-blue-950/20"
                >
                    <Ionicons name="navigate-outline" size={14} color={isDark ? "#60A5FA" : "#2563EB"} />
                    <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                        Google Maps
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Full Screen Map */}
            <WebView source={{ uri: mapUrl }} style={{ flex: 1 }} />
        </SafeAreaView>
    );
}
