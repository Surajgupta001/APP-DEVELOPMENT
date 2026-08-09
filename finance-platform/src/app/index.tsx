import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";

export default function Index() {

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <Redirect href="/(root)/(tabs)" />;
}
