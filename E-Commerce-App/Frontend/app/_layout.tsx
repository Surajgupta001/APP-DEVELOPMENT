import { Stack } from "expo-router";
import "../global.css";
import { WishlistProvider } from "@/context/WishListContext";
import { CartProvider } from "@/context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <WishlistProvider>
          <CartProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <Toast />
          </CartProvider>
        </WishlistProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
