import { useAuth } from "@clerk/expo";
import { useSupabase } from "./useSupabase";
import { useEffect, useState } from "react";

interface Props {
    propertyId: string;
    onUnSave?: () => void;
};

export function useSavedProperty({ propertyId, onUnSave }: Props) {
    const { userId } = useAuth();
    const authSupabase = useSupabase();

    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const checkIfSaved = async () => {
        if (!userId) return;

        const { data } = await authSupabase
            .from("saved_properties")
            .select("*")
            .eq("user_clerk_id", userId)
            .eq("property_id", propertyId)
            .single();

        setIsSaved(!!data);
    };

    useEffect(() => {
        checkIfSaved();
    }, [userId, propertyId]);

    const toggleSave = async () => {
        if (!userId || !propertyId) return;

        if (isSaved) {
            await authSupabase
                .from("saved_properties")
                .delete()
                .eq("user_clerk_id", userId)
                .eq("property_id", propertyId);

            setIsSaved(false);
            onUnSave?.();
        } else {
            await authSupabase
                .from("saved_properties")
                .insert({
                    user_clerk_id: userId,
                    property_id: propertyId
                });

            setIsSaved(true);
        }

        setSaveLoading(false);
    };

    return {
        isSaved,
        toggleSave,
        saveLoading
    }
};