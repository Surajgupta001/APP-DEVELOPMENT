import { useAppThemeColor } from "@/theme/app-theme";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomTabLayout() {

    const insets = useSafeAreaInsets();
    const tabBackground = useAppThemeColor("tabBackground");
    const primary = useAppThemeColor("primary");
    const mutedForeground = useAppThemeColor("mutedForeground");
    const border = useAppThemeColor("border");

    const bottomSpace = Platform.OS === "android" ? 12 : 0;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: primary,
                tabBarInactiveTintColor: mutedForeground,
                tabBarLabelStyle: {
                    fontFamily: "Inter_500Medium",
                    fontSize: 10,
                },
                tabBarStyle: {
                    backgroundColor: tabBackground,
                    bottom: insets.bottom + bottomSpace,
                    height: 66,
                    left: 13,
                    paddingBottom: 7,
                    paddingTop: 6,
                    borderRadius: 50,
                    marginHorizontal: 12,
                    position: "relative",
                    shadowColor: "#333",
                    borderColor: border,
                    borderWidth: 0.5,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarAccessibilityLabel: "Home tab",
                    tabBarIcon: ({ color }) => (
                        <Feather
                            name="home"
                            color={color}
                            size={21}
                        />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="workout"
                options={{
                    title: "Workout",
                    tabBarAccessibilityLabel: "Workouts tab",
                    tabBarIcon: ({ color }) => (
                        <Feather
                            name="activity"
                            color={color}
                            size={21}
                        />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="create"
                options={{
                    title: "",
                    tabBarAccessibilityLabel: "Create workout",

                    tabBarButton: ({ onPress, accessibilityState }) => (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityState={accessibilityState}
                            accessibilityLabel="Create workout"
                            className="items-center justify-center flex-1"
                            onPress={onPress}
                        >
                            <View
                                className="items-center justify-center -mt-5 rounded-full shadow-lg h-14 w-14"
                                style={{
                                    backgroundColor: primary,
                                }}
                            >
                                <Feather
                                    name="plus"
                                    color="#FFFFFF"
                                    size={27}
                                />
                            </View>
                        </Pressable>
                    ),

                    tabBarLabel: () => null,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarAccessibilityLabel: "History tab",
                    tabBarIcon: ({ color }) => (
                        <Feather
                            name="calendar"
                            color={color}
                            size={21}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarAccessibilityLabel: "Profile tab",
                    tabBarIcon: ({ color }) => (
                        <Feather
                            name="user"
                            color={color}
                            size={21}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

function IOSTabLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="workout">
                <NativeTabs.Trigger.Label>Workout</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="figure.strengthtraining.traditional" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="create">
                <NativeTabs.Trigger.Label>Create</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="plus.circle.fill" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="history">
                <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="calendar" />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="person" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

export default function TabLayout() {
    return Platform.OS === "ios" ? (
        <IOSTabLayout />
    ) : (
        <CustomTabLayout />
    );
}