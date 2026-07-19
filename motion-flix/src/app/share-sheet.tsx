import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { movies } from '@/data/movies';
import { palette, PrimaryButton, ScreenShell } from '@/components/movie-ui';

const actions = ['Copy link', 'Send poster', 'Share trailer', 'Invite friends'];
declare const require: (id: string) => { default?: { ScrollView: typeof ScrollView }; ScrollView?: typeof ScrollView };

const transitionModule = require('react-native-screen-transitions');
const SheetScrollView = (transitionModule.default ?? transitionModule).ScrollView ?? ScrollView;

export default function ShareSheetScreen() {
    const movie = movies[0];
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
                <View style={styles.preview}>
                    <Image source={{ uri: movie.poster }} style={styles.poster} contentFit="cover" />
                    <View style={styles.copy}>
                        <Text style={styles.kicker}>Share movie</Text>
                        <Text style={styles.title}>{movie.title}</Text>
                        <Text style={styles.body}>Send this pick to friends or save it for movie night.</Text>
                    </View>
                </View>

                <View style={styles.stack}>
                    {actions.map((action) => (
                        <View key={action} style={styles.actionCard}>
                            <Text style={styles.actionText}>{action}</Text>
                        </View>
                    ))}
                </View>

                <PrimaryButton onPress={() => router.back()}>Share now</PrimaryButton>
            </SheetScrollView>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    sheet: {
        backgroundColor: palette.ink,
    },
    content: {
        gap: 20,
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
    preview: {
        alignItems: 'center',
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
        height: 132,
        width: 90,
    },
    copy: {
        flex: 1,
        gap: 8,
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
        fontWeight: '700',
        lineHeight: 20,
    },
    stack: {
        gap: 10,
    },
    actionCard: {
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        minHeight: 58,
        justifyContent: 'center',
        padding: 16,
    },
    actionText: {
        color: palette.text,
        fontSize: 16,
        fontWeight: '900',
    },
});