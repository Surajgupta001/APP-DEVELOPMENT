import { Stack } from "expo-router";
import "../global.css";
import { WishlistProvider } from "@/context/WishListContext";
import { CartProvider } from "@/context/CartContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
