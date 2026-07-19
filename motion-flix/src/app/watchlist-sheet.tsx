import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { movies } from '@/data/movies';
import { palette, Pill, PrimaryButton, ScreenShell, SectionHeader } from '@/components/movie-ui';

const lists = ['Tonight', 'Weekend Queue', 'Download for Flight'];
declare const require: (id: string) => { default?: { ScrollView: typeof ScrollView }; ScrollView?: typeof ScrollView };

const transitionModule = require('react-native-screen-transitions');
const SheetScrollView = (transitionModule.default ?? transitionModule).ScrollView ?? ScrollView;

export default function WatchlistSheetScreen() {
    const featured = movies[0];
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const topPadding = Platform.OS === 'android' ? insets.top + 20 : 20;

    return (
        <ScreenShell style={[styles.sheet, { paddingTop: topPadding }]}>
            <View style={styles.grabber} />
            <SheetScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 28 }]}
                showsVerticalScrollIndicator={false}>
                <View style={styles.headerCard}>
                    <Image source={{ uri: featured.poster }} style={styles.poster} contentFit="cover" />
                    <View style={styles.headerCopy}>
                        <Text style={styles.kicker}>Tonight queue</Text>
                        <Text style={styles.title}>Add to watchlist</Text>
                        <Text style={styles.body}>
                            Save this movie to a list and keep the night organized.
                        </Text>
                    </View>
                </View>

                <SectionHeader title="Choose a list" />
                <View style={styles.stack}>
                    {lists.map((list, index) => (
                        <View key={list} style={styles.optionCard}>
                            <View>
                                <Text style={styles.optionTitle}>{list}</Text>
                                <Text style={styles.optionBody}>
                                    {index === 0 ? '3 movies planned' : index === 1 ? '5 titles waiting' : 'Offline-ready picks'}
                                </Text>
                            </View>
                            <Pill tone={index === 0 ? 'red' : 'neutral'}>{index === 0 ? 'Default' : 'Add'}</Pill>
                        </View>
                    ))}
                </View>

                <SectionHeader title="Movie night tools" />
                <View style={styles.grid}>
                    {['Set reminder', 'Download', 'Invite friends', 'Create poll'].map((action) => (
                        <View key={action} style={styles.toolCard}>
                            <Text style={styles.toolTitle}>{action}</Text>
                        </View>
                    ))}
                </View>

                <PrimaryButton onPress={() => router.back()}>Save to Tonight</PrimaryButton>
            </SheetScrollView>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    sheet: {
        backgroundColor: palette.ink,
    },
    content: {
        gap: 24,
        padding: 20,
        paddingTop: 14,
    },
    grabber: {
        alignSelf: 'center',
        backgroundColor: 'rgba(23,19,15,0.18)',
        borderRadius: 999,
        height: 5,
        marginBottom: 4,
        width: 48,
    },
    headerCard: {
        backgroundColor: palette.inkSoft,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 14,
        padding: 12,
    },
    poster: {
        borderRadius: 18,
        height: 150,
        width: 102,
    },
    headerCopy: {
        flex: 1,
        gap: 8,
        justifyContent: 'center',
    },
    kicker: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    title: {
        color: palette.text,
        fontSize: 28,
        fontWeight: '900',
        lineHeight: 30,
    },
    body: {
        color: palette.muted,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
    stack: {
        gap: 10,
    },
    optionCard: {
        alignItems: 'center',
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    optionTitle: {
        color: palette.text,
        fontSize: 16,
        fontWeight: '900',
    },
    optionBody: {
        color: palette.muted,
        fontSize: 13,
        fontWeight: '700',
        marginTop: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    toolCard: {
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        minHeight: 78,
        minWidth: '47%',
        justifyContent: 'center',
        padding: 16,
    },
    toolTitle: {
        color: palette.text,
        fontSize: 14,
        fontWeight: '900',
    },
});