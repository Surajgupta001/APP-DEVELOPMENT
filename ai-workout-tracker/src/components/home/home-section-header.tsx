import { Pressable, Text, View } from "react-native";

type HomeSectionHeaderProps = {
    title: string;
    showViewAll?: boolean;
    onViewAll?: () => void;
};

export default function HomeSectionHeader({
    onViewAll,
    title,
    showViewAll = true,
}: HomeSectionHeaderProps) {
    return (
        <View className="flex-row items-center justify-between mb-2">
            <Text className="font-inter-bold text-[16px] text-foreground">
                {title}
            </Text>
            {showViewAll ? (
                <Pressable
                    accessibilityLabel={`View all ${title.toLowerCase()}`}
                    accessibilityRole="button"
                    className="justify-center px-1 h-7"
                    hitSlop={8}
                    onPress={onViewAll}
                >
                    <Text className="font-inter-semibold text-[11px] text-primary">
                        View All
                    </Text>
                </Pressable>
            ) : null}
        </View>
    );
}
