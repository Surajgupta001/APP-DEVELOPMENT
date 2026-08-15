import { Feather } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View, ViewBase } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Account, AccountType } from "../../../../types";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useSupabase } from "../../../../hooks/useSupabase";
import { useUserStore } from "../../../../store/userStore";
import { useState } from "react";
import { useAccountQuery } from "../../../../hooks/queries/useAccountsQuery";
import { useSetDefaultAccount } from "../../../../hooks/mutations/useAccountMutation";
import { formatPrice } from "../../../../lib/utils";
import * as ImagePicker from "expo-image-picker";
import AccountModal from "@/components/AccountModal";
import { CurrencyPicker } from "@/components/currencyPicker";

const ACCOUNT_ICON: Record<AccountType, keyof typeof Feather.glyphMap> = {
    CASH: "dollar-sign",
    BANK: "home",
    CREDIT_CARD: "credit-card",
    SAVINGS: "shield",
};

interface RowProps {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    danger?: boolean;
};

function Row({ icon, label, value, onPress, showChevron, danger }: RowProps) {

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className="flex-row items-center bg-white px-4 py-3.5 border-b border-[#F0EEE7] last:border-b-0"
        >
            <View className="w-8 h-8 rounded-full bg-[#F5F4F0] items-center justify-center mr-3">
                <Feather name={icon} size={15} color={danger ? "#FF6B4A" : "#5C5F68"} />
            </View>
            <Text
                className={`flex-1 text-sm ${danger ? "text-brand-coral" : "text-brand-bg"
                    }`}
            >
                {label}
            </Text>
            {value && (
                <Text className="mr-2 text-xs text-brand-text-secondary">{value}</Text>
            )}
            {showChevron && onPress && (
                <Feather name="chevron-right" size={16} color="#BDC3C7" />
            )}
        </TouchableOpacity>
    );
};

function SectionLabel({ children }: { children: string }) {
    return (
        <Text className='text-brand-text-muted text-[11px] uppercase trancking-wide mb-2 mt-6 mx-5'>
            {children}
        </Text>
    );
}

export default function ProfileScreen() {

    const { user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();

    const supabase = useSupabase();
    const currency = useUserStore((state) => state.currency);
    const setCurrency = useUserStore((state) => state.setCurrency);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const {
        data: accounts = [],
        isLoading: loadingAccounts,
        isError: accountError,
    } = useAccountQuery();

    const { mutateAsync: setDefaultAccount } = useSetDefaultAccount();

    const handlePickAvatar = async () => {
        if (!user) return;

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission Denied", "Permission to access media library is required.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
        });

        if (result.canceled) return;

        setUploadingAvatar(true);

        try {
            const asset = result.assets[0];
            const filename = asset.uri.split('/').pop() || `avatar.jpg`;
            const match = /\.(\w+)$/.exec(filename);
            const mimType = match ? `image/${match[1]}` : `image/jpg`;
            const dataUrl = `data:${mimType};base64,${asset.base64}`;

            await user.setProfileImage({ file: dataUrl });
        } catch (error) {
            console.error("Error uploading avatar:", error);
            Alert.alert("Upload Failed", "There was an error uploading your avatar. Please try again.");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleMadeDefault = async () => {
        if (!editingAccount) return;

        try {
            await setDefaultAccount(editingAccount.id);
            closeModal();
        } catch (error) {
            console.error("Error setting default account:", error);
            Alert.alert("Error", "There was an error setting the default account. Please try again.");
        }
    };

    const handleCurrencySelect = async (selected: { code: string }) => {
        setCurrencyPickerOpen(false);
        if (!user) return;

        try {
            const { error } = await supabase
                .from('users')
                .update({ currency: selected.code })
                .eq('clerk_id', user.id);

            if (error) {
                console.error("Error updating currency:", error);
                throw new Error("Failed to update currency");
            }
            setCurrency(selected.code);
        } catch (error) {
            Alert.alert("Error", "There was an error updating your currency preference. Please try again.");
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace("/sign-in");
                    }
                }
            ]
        )
    };

    const closeModal = () => {
        setModalVisible(false);
        setEditingAccount(null);
    }

    return (
        <SafeAreaView className='flex-1 bg-brand-body' edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="px-5 pt-3 pb-2">
                    <Text className="text-xl font-semibold text-brand-bg">
                        Profile
                    </Text>
                </View>

                {/* User Card */}
                <View className="items-center px-5 py-6 mx-5 mt-2 bg-brand-bg rounded-2xl">
                    <TouchableOpacity
                        onPress={handlePickAvatar}
                        disabled={uploadingAvatar}
                        activeOpacity={0.8}
                        className="w-20 h-20 rounded-full bg-[#1A1D26] items-center justify-center overflow-hidden border-2 border-[#2A2E3A]"
                    >
                        {uploadingAvatar ? (
                            <ActivityIndicator color="#8A8D96" />
                        ) : user?.imageUrl && user.hasImage ? (
                            <Image
                                source={{ uri: user.imageUrl }}
                                style={{ width: 80, height: 80 }}
                                resizeMode="cover"
                            />
                        ) : (
                            <Feather name="user" size={30} color="#8A8D96" />
                        )}
                        <View className="absolute inset-x-0 bottom-0 items-center justify-center h-6 bg-black/50">
                            <Feather name="camera" size={13} color="#F2EFE9" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold mt-3.5">
                        {user?.firstName} {user?.lastName}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-1">
                        <Feather name="mail" size={11} color="#8A8D96" />
                        <Text
                            className="text-xs text-brand-text-secondary"
                            numberOfLines={1}
                        >
                            {user?.emailAddresses?.[0]?.emailAddress}
                        </Text>
                    </View>
                </View>

                {/* Accounts */}
                <SectionLabel>Accounts</SectionLabel>
                <View className="mx-5 rounded-2xl overflow-hidden border border-[#E8E6DF]">
                    {loadingAccounts ? (
                        <View className="items-center px-4 py-5 bg-white">
                            <ActivityIndicator color="#5C5F68" />
                        </View>
                    ) : accountError ? (
                        <View className="items-center px-4 py-5 bg-white">
                            <Text className="text-xs text-brand-text-muted">
                                Couldn&apos;t load your accounts.
                            </Text>
                        </View>
                    ) : (
                        accounts.map((account) => (
                            <Row
                                key={account.id}
                                icon={ACCOUNT_ICON[account.type]}
                                label={account.name + (account.is_default ? " (Default)" : "")}
                                value={formatPrice(account.balance, currency)}
                                onPress={() => {
                                    setEditingAccount(account);
                                    setModalVisible(true);
                                }}
                            />
                        ))
                    )}
                    <Row
                        icon="plus"
                        label="Add New Account"
                        onPress={() => {
                            setEditingAccount(null);
                            setModalVisible(true);
                        }}
                    />
                </View>

                {/* Prefrences */}
                <SectionLabel>Preferences</SectionLabel>
                <View className="mx-5 rounded-2xl overflow-hidden border border-[#E8E6DF]">
                    <Row
                        icon="dollar-sign"
                        label="Currency"
                        value={currency}
                        onPress={() => setCurrencyPickerOpen(true)}
                        showChevron
                    />
                </View>

                {/* Account Actions */}
                <SectionLabel>User Actions</SectionLabel>
                <View className="mx-5 overflow-hidden rounded-2xl border border-[#e8e6df]">
                    <Row
                        icon="log-out"
                        label="Sign Out"
                        onPress={handleSignOut}
                        showChevron={false}
                        danger
                    />
                </View>
            </ScrollView>

            {user && (
                <AccountModal
                    visible={modalVisible}
                    account={editingAccount}
                    onClose={closeModal}
                    onSaved={closeModal}
                    onDeleted={closeModal}
                    onMadeDefault={handleMadeDefault}
                />
            )}

            <CurrencyPicker
                visible={currencyPickerOpen}
                selectedCode={currency}
                onSelect={handleCurrencySelect}
                onClose={() => setCurrencyPickerOpen(false)}
            />
        </SafeAreaView>
    );
}