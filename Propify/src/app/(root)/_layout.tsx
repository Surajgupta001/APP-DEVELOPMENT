import { useAuth } from "@clerk/expo";
import { Redirect, Slot } from "expo-router";

export default function _layout() {
    const { isSignedIn, isLoaded } = useAuth()

    // Sync CLerk user -> Supabase (we will build this later)

    if (!isLoaded) return null;

    if (!isSignedIn) return <Redirect href='/sign-up' />

    return <Slot />
}
