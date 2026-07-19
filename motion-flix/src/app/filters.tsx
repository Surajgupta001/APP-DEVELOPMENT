import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, PrimaryButton, ScreenShell, SectionHeader } from '@/components/movie-ui';
import { genres } from '@/data/movies';

const years = ['2026', '2025', '2024', 'Classics'];
const runtimes = ['Under 90m', '90-120m', 'Epic'];
const languages = ['English', 'Korean', 'Japanese', 'Spanish'];

export default function FiltersScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const topPadding = Platform.OS === 'android' ? insets.top + 20 : 20;

    return (
        <ScreenShell style={styles.screen}>
            <View style={[styles.drawer, { paddingTop: topPadding }]}>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.intro}>
                        <Text style={styles.kicker}>Filter drawer</Text>
                        <Text style={styles.title}>Refine the feed</Text>
                        <Text style={styles.body}>Slide in from the side, tune the list, then apply the filters to return home.</Text>
                    </View>

                    <SectionHeader title="Genres" />
                    <View style={styles.chipWrap}>
                        {genres.map((genre, index) => (
                            <Pressable
                                key={genre}
                                style={({ pressed }) => [styles.chip, index < 3 && styles.chipSelected, pressed && styles.pressed]}>
                                <Text style={[styles.chipText, index < 3 && styles.chipSelectedText]}>{genre}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <SectionHeader title="Release window" />
                    <View style={styles.chipWrap}>
                        {years.map((year, index) => (
                            <View key={year} style={[styles.chip, index === 1 && styles.chipSelected]}>
                                <Text style={[styles.chipText, index === 1 && styles.chipSelectedText]}>{year}</Text>
                            </View>
                        ))}
                    </View>

                    <SectionHeader title="Runtime" />
                    <View style={styles.cardGrid}>
                        {runtimes.map((runtime) => (
                            <View key={runtime} style={styles.infoCard}>
                                <Text style={styles.infoText}>{runtime}</Text>
                            </View>
                        ))}
                    </View>

                    <SectionHeader title="Language" />
                    <View style={styles.cardGrid}>
                        {languages.map((language) => (
                            <View key={language} style={styles.infoCard}>
                                <Text style={styles.infoText}>{language}</Text>
                            </View>
                        ))}
                    </View>

                    <PrimaryButton onPress={() => router.back()}>Apply filters</PrimaryButton>
                </ScrollView>
            </View>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    screen: {
        alignItems: 'flex-end',
        backgroundColor: 'transparent',
    },
    drawer: {
        backgroundColor: palette.ink,
        borderBottomLeftRadius: 34,
        borderTopLeftRadius: 34,
        flex: 1,
        overflow: 'hidden',
        width: '90%',
    },
    content: {
        gap: 24,
        padding: 20,
        paddingBottom: 44,
    },
    intro: {
        backgroundColor: palette.inkSoft,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        gap: 8,
        padding: 16,
    },
    kicker: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    title: {
        color: palette.text,
        fontSize: 34,
        fontWeight: '900',
        lineHeight: 36,
    },
    body: {
        color: palette.muted,
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 22,
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    chipSelected: {
        backgroundColor: palette.red,
        borderColor: palette.red,
    },
    chipText: {
        color: palette.text,
        fontSize: 14,
        fontWeight: '800',
    },
    chipSelectedText: {
        color: palette.text,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    infoCard: {
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        minWidth: '47%',
        padding: 16,
    },
    infoText: {
        color: palette.text,
        fontSize: 14,
        fontWeight: '900',
    },
    pressed: {
        opacity: 0.72,
    },
});