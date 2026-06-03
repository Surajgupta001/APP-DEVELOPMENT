import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {

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