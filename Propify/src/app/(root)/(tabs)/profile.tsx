import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Platform, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MenuItem } from "@/components/MenuItem";
import { useColorScheme } from "nativewind";
import * as SecureStore from "expo-secure-store";

export default function Profile() {

  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isUpdating, setIsUpdating] = useState(false);

  const toggleTheme = async (value: boolean) => {
    const newTheme = value ? 'dark' : 'light';
    setColorScheme(newTheme);
    try {
      await SecureStore.setItemAsync('theme_preference', newTheme);
    } catch (e) {
      console.error("Failed to save theme preference", e);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white dark:bg-[#121212]">
        <ActivityIndicator size="large" color="#0E4D92" />
      </SafeAreaView>
    );
  }

  const handleUpdateProfileImage = async () => {
    try {
      const permissionsResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionsResult.granted) {
        Alert.alert(
          'Permission Required',
          'Permission to access the camera is required to update your profile image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const url = result.assets[0].uri;
      const fileName = url.split("/").pop() || `profile_${user.id}.jpg`;

      const match = /\.(\w+)$/.exec(fileName);
      const mimeType = match ? `image/${match[1]}` : 'image';
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert('Success', 'Your profile image has been updated.');
    } catch (error) {
      Alert.alert(
        'Error',
        'An error occurred while updating your profile image. Please try again.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#121212]">
      {/* Avatar + Name */}
      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 mb-4 rounded-full"
          />
          <TouchableOpacity
            className="absolute right-0 p-2 bg-blue-600 rounded-full bottom-3 items-center justify-center"
            disabled={isUpdating}
            onPress={handleUpdateProfileImage}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        <Text className="text-xl font-bold text-gray-800 dark:text-white">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="mt-1 text-gray-500 dark:text-gray-400">
          {user.emailAddresses[0]?.emailAddress}
        </Text>
      </View>
      <View className="gap-2 px-6">
        <MenuItem
          icon='heart-outline'
          label='Saved Properties'
          onPress={() => router.push('/saved')}
        />

        {/* Theme Settings Toggle */}
        <View className="flex-row items-center justify-between px-4 py-3.5 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
          <View className="flex-row items-center gap-4">
            <Ionicons name="moon-outline" size={22} color={isDark ? "#9CA3AF" : "#6B7280"} />
            <Text className="text-base font-medium text-gray-700 dark:text-gray-200">
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#D1D5DB", true: "#0E4D92" }}
            thumbColor={Platform.OS === 'ios' ? undefined : (isDark ? "#fff" : "#f4f3f4")}
          />
        </View>

        <MenuItem
          icon='notifications-outline'
          label='Notifications'
          onPress={() => Alert.alert('Notifications', 'This feature is coming soon!')}
        />
        <MenuItem
          icon='settings-outline'
          label='Settings'
          onPress={() => Alert.alert('Settings', 'This feature is coming soon!')}
        />
        <MenuItem
          icon='help-circle-outline'
          label='Help & Support'
          onPress={() =>
            Linking.openURL(
              "mailto:surajgupta7070031833@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App"
            )
          }
        />
      </View>
      <View className="px-6 mt-auto mb-8">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 py-4 border border-red-100 dark:border-red-950/20 bg-red-50 dark:bg-red-950/10 rounded-2xl"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-base font-semibold text-red-500">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
