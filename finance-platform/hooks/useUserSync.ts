import { useUser } from "@clerk/expo";
import { useUserStore } from "../store/userStore";
import { useSupabase } from "./useSupabase";
import { useEffect } from "react";

export const useUserSync = () => {
    const { user } = useUser();
    const setCurrency = useUserStore((state) => state.setCurrency);
    const setNeedsOnboarding = useUserStore((state) => state.setNeedsOnboarding);
    const authSupabase = useSupabase();

    useEffect(() => {
        if (!user) return;

        const syncuser = async () => {
            try {
                // Check if the user already exists in Supabase
                const { data: existingUser, error: fetchError } = await authSupabase
                    .from("users")
                    .select('clerk_id, currency')
                    .eq('clerk_id', user.id)
                    .single();

                // Handle the case where the user does not exist or there was an error fetching the user
                if (fetchError && fetchError.code !== 'PGRST116') {
                    console.error("Error fetching user from Supabase:", fetchError);
                    setNeedsOnboarding(true);
                    return;
                }

                // If the user exists, update the store with their currency and onboarding status
                if (existingUser) {
                    setCurrency(existingUser.currency ?? 'INR');
                    setNeedsOnboarding(!existingUser.currency);
                    return;
                }

                // If the user does not exist, insert them into Supabase
                const email = user.emailAddresses[0]?.emailAddress;

                // If email is not available, log an error and set onboarding status to true
                if (!email) {
                    console.error("User email is not available.");
                    setNeedsOnboarding(true);
                    return;
                }

                // Upsert the user into Supabase
                const { data: newUser, error: insertError } = await authSupabase
                    .from('users')
                    .upsert({
                        clerk_id: user.id,
                        email,
                        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
                        image_url: user.imageUrl,
                    }, {
                        onConflict: 'clerk_id', ignoreDuplicates: false
                    })
                    .select('currency')
                    .single();

                // Handle the case where there was an error inserting the user
                if (insertError) {
                    console.error("Error inserting user into Supabase:", insertError);
                    setNeedsOnboarding(true);
                    return;
                }

                // Update the store with the new user's currency and onboarding status
                setCurrency(newUser?.currency ?? 'INR');
                setNeedsOnboarding(!newUser?.currency);

                // Create a default account for the new user
                const { error: accountError } = await authSupabase
                    .from('accounts')
                    .insert({
                        user_id: user.id,
                        name: 'CASH',
                        type: 'CASH',
                        balance: 0,
                        is_default: true,
                    });

                // Handle the case where there was an error creating the default account
                if (accountError) {
                    console.error("Error creating default account:", accountError);
                    // Retry once — the first attempt may race with RLS propagation
                    const { error: retryError } = await authSupabase
                        .from('accounts')
                        .insert({
                            user_id: user.id,
                            name: 'CASH',
                            type: 'CASH',
                            balance: 0,
                            is_default: true,
                        });
                    if (retryError) {
                        console.error("Retry also failed:", retryError);
                    }
                }
            } catch (error) {
                console.error("Unexpected error during user sync:", error);
                setNeedsOnboarding(true);
            }
        };
        syncuser();
    }, [user?.id]);
};