import cc from "currency-codes";
import getSymbol from "currency-symbol-map";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type CurrencyEntry = {
    code: string;
    name: string;
    symbol: string;
};

export function ALL_CURRENCIES(): CurrencyEntry[] {
    return cc
        .codes()
        .map((code) => ({
            code,
            name: cc.code(code)?.currency ?? code,
            symbol: getSymbol(code) ?? code,
        }))
        .filter((currency) => currency.symbol !== currency.code);
}

interface CurrencyPickerProps {
    visible: boolean;
    selectedCode: string;
    onSelect: (currency: CurrencyEntry) => void;
    onClose: () => void;
};

export function CurrencyPicker({ visible, selectedCode, onSelect, onClose }: CurrencyPickerProps) {

    const [search, setSearch] = useState("");

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView className="flex-1 bg-brand-body" edges={['top']}>
                <View className="flex-row items-center gap-3 px-5 pt-3 pb-2">
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search currency"
                        placeholderTextColor="#8A8D96"
                        autoFocus
                        className="flex-1 bg-white border border-[#e8e6df] rounded-full px-4 py-2.5 text-sm text-brand-bg"
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSearch("");
                            onClose();
                        }}
                    >
                        <Text className="text-brand-text-secondary texts-m">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
    )
};