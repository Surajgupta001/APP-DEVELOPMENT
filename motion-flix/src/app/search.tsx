import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MovieRowCard, palette, ScreenShell, SectionHeader } from '@/components/movie-ui';
import { movies } from '@/data/movies';

const recentSearches = ['space thriller', 'rainy city', 'short runtime', 'coastal drama'];

export default function SearchScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const topPadding = Platform.OS === 'android' ? insets.top + 16 : 20;

    return (
        <ScreenShell>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <View style={styles.topBar}>
                    <Pressable
                        accessibilityLabel="Go back"
                        onPress={() => router.back()}
                        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>
                </View>

                <View style={styles.hero}>
                    <Text style={styles.kicker}>Find something cinematic</Text>
                    <TextInput
                        placeholder="Movies, cast, trailers"
                        placeholderTextColor={palette.muted}
                        style={styles.input}
                        autoCapitalize="none"
                    />
                </View>

                <SectionHeader title="Recent searches" />
                <View style={styles.chipWrap}>
                    {recentSearches.map((search) => (
                        <Text key={search} style={styles.recentChip}>
                            {search}
                        </Text>
                    ))}
                </View>

                <SectionHeader title="Top results" />
                <View style={styles.stack}>
                    {movies.map((movie) => (
                        <MovieRowCard key={movie.id} movie={movie} />
                    ))}
                </View>
            </ScrollView>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 24,
        padding: 20,
        paddingBottom: 44,
    },
    topBar: {
        alignItems: 'flex-start',
    },
    backButton: {
        alignItems: 'center',
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 999,
        borderWidth: 1,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    backIcon: {
        color: palette.text,
        fontSize: 34,
        fontWeight: '700',
        lineHeight: 38,
        marginTop: -2,
    },
    hero: {
        backgroundColor: palette.inkSoft,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        gap: 12,
        padding: 16,
    },
    kicker: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    input: {
        color: palette.text,
        fontSize: 24,
        fontWeight: '900',
        minHeight: 48,
    },
    chipWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    recentChip: {
        backgroundColor: palette.panelSoft,
        borderRadius: 999,
        color: palette.text,
        fontSize: 14,
        fontWeight: '800',
        overflow: 'hidden',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    stack: {
        gap: 12,
    },
    pressed: {
        opacity: 0.72,
    },
});