import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CastCard, palette, Pill, PrimaryButton, ScreenShell, SectionHeader } from '@/components/movie-ui';
import { getMovie } from '@/data/movies';
import { TransitionScrollView } from '@/transitions/transition-components';

export default function MovieDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const movie = getMovie(id);
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const heroPosterWidth = Math.min(138, width * 0.32);

    return (
        <ScreenShell>
            <TransitionScrollView
                contentInsetAdjustmentBehavior="never"
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Image source={{ uri: movie.backdrop }} style={styles.backdrop} contentFit="cover" />
                    <View style={styles.scrim} />
                    <Pressable
                        accessibilityLabel="Go back"
                        onPress={() => router.back()}
                        style={({ pressed }) => [styles.backButton, { top: insets.top + 10 }, pressed && styles.pressed]}>
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>
                    <View style={styles.heroContent}>
                        <Image source={{ uri: movie.poster }} style={[styles.poster, { width: heroPosterWidth }]} contentFit="cover" />
                        <View style={styles.heroCopy}>
                            <Text style={styles.kicker}>Now streaming</Text>
                            <Text style={styles.title}>{movie.title}</Text>
                            <Text style={styles.tagline}>{movie.tagline}</Text>
                            <View style={styles.pills}>
                                <Pill tone="green">{movie.match}% match</Pill>
                                <Pill tone="gold">{movie.rating.toFixed(1)}</Pill>
                                <Pill>{movie.year}</Pill>
                                <Pill>{movie.runtime}</Pill>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.actions}>
                    <PrimaryButton href={`/trailer/${movie.id}`}>Watch trailer</PrimaryButton>
                    <View style={styles.secondaryActions}>
                        <PrimaryButton href="/watchlist-sheet" tone="dark">
                            Watchlist
                        </PrimaryButton>
                        <PrimaryButton href="/share-sheet" tone="dark">
                            Share
                        </PrimaryButton>
                    </View>
                </View>

                <View style={styles.synopsisBlock}>
                    <Text style={styles.sectionKicker}>Story</Text>
                    <Text style={styles.synopsis}>{movie.synopsis}</Text>
                    <View style={styles.genreRow}>
                        {movie.genres.map((genre) => (
                            <Text key={genre} style={styles.genre}>
                                {genre}
                            </Text>
                        ))}
                    </View>
                </View>

                <SectionHeader title="Cast" />
                <TransitionScrollView
                    horizontal
                    contentContainerStyle={styles.horizontalList}
                    showsHorizontalScrollIndicator={false}
                    style={styles.castRail}>
                    {movie.cast.map((person) => (
                        <View key={person.id} style={styles.railItem}>
                            <CastCard person={person} />
                        </View>
                    ))}
                </TransitionScrollView>

                <SectionHeader
                    title="Stills"
                    action={
                        <Pressable
                            onPress={() => router.push(`/gallery/${movie.id}` as never)}
                            style={({ pressed }) => pressed && styles.pressed}>
                            <Text style={styles.actionText}>Open gallery</Text>
                        </Pressable>
                    }
                />
                <TransitionScrollView
                    horizontal
                    contentContainerStyle={styles.stillsRailContent}
                    showsHorizontalScrollIndicator={false}
                    style={styles.stillsRail}>
                    {movie.stills.map((item, index) => (
                        <Pressable
                            key={item}
                            onPress={() =>
                                router.push({
                                    pathname: '/gallery/[movieId]',
                                    params: { movieId: movie.id, index: String(index) },
                                } as never)
                            }
                            style={({ pressed }) => [styles.stillCard, pressed && styles.pressed]}>
                            <Image source={{ uri: item }} style={styles.stillImage} contentFit="cover" />
                        </Pressable>
                    ))}
                </TransitionScrollView>

                <SectionHeader title="Critic notes" />
                <View style={styles.reviewStack}>
                    {movie.reviews.map((review) => (
                        <View key={review.source} style={styles.reviewCard}>
                            <Text style={styles.reviewSource}>{review.source}</Text>
                            <Text style={styles.reviewQuote}>{review.quote}</Text>
                        </View>
                    ))}
                </View>
            </TransitionScrollView>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 20,
        paddingBottom: 44,
    },
    hero: {
        minHeight: 430,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
    },
    scrim: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.44)',
    },
    backButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 999,
        height: 48,
        justifyContent: 'center',
        left: 18,
        position: 'absolute',
        width: 48,
        zIndex: 2,
    },
    backIcon: {
        color: palette.text,
        fontSize: 34,
        fontWeight: '700',
        lineHeight: 38,
        marginTop: -2,
    },
    heroContent: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 16,
        padding: 18,
    },
    poster: {
        backgroundColor: palette.panel,
        borderRadius: 24,
        aspectRatio: 2 / 3,
        overflow: 'hidden',
    },
    heroCopy: {
        flex: 1,
        gap: 9,
        justifyContent: 'flex-end',
    },
    kicker: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 34,
        fontWeight: '900',
        lineHeight: 36,
    },
    tagline: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
    },
    pills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    actions: {
        gap: 10,
        paddingHorizontal: 20,
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 10,
    },
    synopsisBlock: {
        backgroundColor: palette.inkSoft,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        gap: 14,
        marginHorizontal: 20,
        padding: 16,
    },
    sectionKicker: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    synopsis: {
        color: palette.text,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    genreRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    genre: {
        color: palette.muted,
        fontSize: 13,
        fontWeight: '800',
    },
    horizontalList: {
        paddingHorizontal: 20,
        gap: 12,
    },
    castRail: {
        minHeight: 106,
    },
    railItem: {
        width: 264,
    },
    stillsRail: {
        height: 124,
    },
    stillsRailContent: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
    },
    actionText: {
        color: palette.cyan,
        fontSize: 13,
        fontWeight: '900',
    },
    stillCard: {
        backgroundColor: palette.panel,
        borderRadius: 24,
        height: 124,
        overflow: 'hidden',
        width: 188,
    },
    stillImage: {
        height: '100%',
        width: '100%',
    },
    reviewStack: {
        gap: 12,
        paddingHorizontal: 20,
    },
    reviewCard: {
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        gap: 8,
        padding: 16,
    },
    reviewSource: {
        color: palette.gold,
        fontSize: 12,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    reviewQuote: {
        color: palette.text,
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 22,
    },
    pressed: {
        opacity: 0.72,
    },
});