import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { getCategoryConfig } from '../../constants/categories';
import { formatPrice } from '../../lib/utils';
import { Transaction } from '../../types';
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const INPUT_METHOD_ICON: Record<Transaction['input_method'], keyof typeof Feather.glyphMap> = {
    MANUAL: 'edit-3',
    RECEIPT_SCAN: 'camera',
    VOICE: 'mic'
};

interface TransactionRowProps {
    tx: Transaction,
    onDelete?: () => void
};

export default function TransactionRow({ tx, onDelete }: TransactionRowProps) {

    const config = getCategoryConfig(tx.category);
    const isIncome = tx.type === 'INCOME';

    const row = (
        <View
            className="flex-row items-center bg-white rounded-2xl border border-[#E8E6DF] pl-3 pr-3.5 py-4"
            style={{ borderLeftWidth: 3, borderLeftColor: config.color }}
        >
            <View
                className="items-center justify-center w-10 h-10 mr-3 rounded-full"
                style={{ backgroundColor: `${config.color}22` }}
            >
                <Text className="text-lg">{config.icon}</Text>
            </View>

            <View className="flex-1">
                <Text className="text-sm font-medium text-brand-bg" numberOfLines={1}>
                    {tx.description || config.label}
                </Text>
                <View className="flex-row items-center gap-1.5 mt-0.5">
                    <Feather
                        name={INPUT_METHOD_ICON[tx.input_method]}
                        size={11}
                        color="#8A8D96"
                    />
                    <View
                        className="px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${config.color}1A` }}
                    >
                        <Text className="text-[10px] font-medium" style={{ color: config.color }}>
                            {config.label}
                        </Text>
                    </View>
                    {tx.is_flagged && (
                        <View className="flex-row items-center gap-1 ml-1">
                            <Feather name="alert-triangle" size={11} color="#FF6B4A" />
                            <Text className="text-brand-coral text-[11px]">Flagged</Text>
                        </View>
                    )}
                </View>
            </View>

            <Text
                className={`text-sm font-medium ${isIncome ? "text-brand-success" : "text-brand-coral"
                    }`}
            >
                {isIncome ? "+" : "-"}
                {formatPrice(tx.amount)}
            </Text>
        </View>
    );

    if (!onDelete) {
        return <View className="mb-2.5">{row}</View>;
    }

    return (
        <View className="mb-2.5">
            <ReanimatedSwipeable
                overshootRight={false}
                renderRightActions={() => (
                    <TouchableOpacity
                        onPress={onDelete}
                        className="items-center justify-center w-16 ml-2 bg-brand-coral rounded-2xl"
                    >
                        <Feather name="trash-2" size={18} color="#fff" />
                    </TouchableOpacity>
                )}
            >
                {row}
            </ReanimatedSwipeable>
        </View>
    );
}