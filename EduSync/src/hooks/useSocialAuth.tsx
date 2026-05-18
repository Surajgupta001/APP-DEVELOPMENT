import { useState } from "react"
import { useSSO } from "@clerk/expo"
import { Alert } from "react-native";

export default function useSocialAuth() {

    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: 'oauth_google' | 'oauth_apple' | 'oauth_github') => {
        if (loadingStrategy) return; // Prevent multiple clicks
        setLoadingStrategy(strategy);

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });

            if (!createdSessionId || !setActive) {
                const provider = strategy === 'oauth_google' ? 'Google' : strategy === 'oauth_apple' ? 'Apple' : 'GitHub';
                Alert.alert('Authentication Error', `Failed to authenticate with ${provider}. Please try again.`)
                return;
            };

            await setActive({ session: createdSessionId });
        } catch (error) {
            console.log('✨ Social auth error:', error);
            const provider = strategy === 'oauth_google' ? 'Google' : strategy === 'oauth_apple' ? 'Apple' : 'GitHub';
            Alert.alert('Authentication Error', `An error occurred during ${provider} authentication. Please try again.`)
        } finally {
            setLoadingStrategy(null);
        }
    };

    return {
        handleSocialAuth,
        loadingStrategy,
    }
}