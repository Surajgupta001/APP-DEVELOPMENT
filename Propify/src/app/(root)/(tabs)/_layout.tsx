import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useUserStore } from "../../../../store/userStore";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

function AndroidTabs() {
    const isAdmin = useUserStore((state) => state.isAdmin);

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='home' color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='search' color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Add Property',
                    href: isAdmin ? undefined : null,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='add-circle' color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: 'Saved',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='heart' color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='person' color={color} size={size} />
                    )
                }}
            />
        </Tabs>
    );
}

function IOSTabs() {
    const isAdmin = useUserStore((state) => state.isAdmin);

    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'house', selected: 'house.fill' }}
                    md="home"
                />
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="search">
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }}
                    md="search"
                />
                <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            {/* Admin-only tab - Create Property */}
            {isAdmin && (
                <NativeTabs.Trigger name="create">
                    <NativeTabs.Trigger.Icon
                        sf={{ default: 'plus', selected: 'plus.circle.fill' }}
                        md="add"
                    />
                    <NativeTabs.Trigger.Label>Add Property</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>
            )}

            <NativeTabs.Trigger name="saved">
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'heart', selected: 'heart.fill' }}
                    md="favorite"
                />
                <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'person', selected: 'person.fill' }}
                    md="person"
                />
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

export default function TabsLayout() {
    return (
        Platform.OS === 'android' ? <AndroidTabs /> : <IOSTabs />
    )
}
