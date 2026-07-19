import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette, Pill, ScreenShell } from '@/components/movie-ui';
import { getMovie, trailerQueue } from '@/data/movies';
import { TransitionFlatList } from '@/transitions/transition-components';
import { useEffect, useState } from 'react';

export default function TrailerScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const selected = getMovie(id);
    const queue = [selected, ...trailerQueue.filter((movie) => movie.id !== selected.id)];
    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const [pageHeight, setPageHeight] = useState(0);
    const controlsProgress = useSharedValue(0);

    useEffect(() => {
        controlsProgress.value = withDelay(180, withTiming(1, { duration: 340 }));
    }, [controlsProgress]);

    const controlsStyle = useAnimatedStyle(() => {
        return {
            opacity: controlsProgress.value,
            transform: [{ translateY: 12 * (1 - controlsProgress.value) }],
        };
    });

    return (
        <ScreenShell
            onLayout={(event) => {
                setPageHeight(event.nativeEvent.layout.height);
            }}>
            <Animated.View style={[styles.header, { paddingTop: insets.top + 10 }, controlsStyle]}>
                <Pressable
                    accessibilityLabel="Go back"
                    onPress={() => router.back()}
                    style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                    <Text style={styles.backIcon}>‹</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Trailers</Text>
                <View style={styles.headerSpacer} />
            </Animated.View>
            <TransitionFlatList
                data={queue}
                keyExtractor={(item) => item.id}
                pagingEnabled
                decelerationRate="fast"
                snapToInterval={pageHeight || undefined}
                snapToAlignment="start"
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="never"
                bounces={false}
                renderItem={({ item }) => (
                    <View style={[styles.reel, { height: pageHeight || 1, width }]}>
                        <Image source={{ uri: item.trailerStill }} style={styles.image} contentFit="cover" />
                        <View style={styles.scrim} />
                        <Animated.View style={[styles.topBar, { paddingTop: insets.top + 82 }, controlsStyle]}>
                            <View style={styles.metaPills}>
                                <Pill tone="red">Trailer</Pill>
                                <Pill>{item.ageRating}</Pill>
                            </View>
                        </Animated.View>
                        <Animated.View style={controlsStyle}>
                            <Pressable style={({ pressed }) => [styles.playButton, pressed && styles.pressed]}>
                                <Text style={styles.playText}>Play</Text>
                            </Pressable>
                        </Animated.View>
                        <Animated.View style={[styles.copy, controlsStyle]}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.body}>{item.tagline}</Text>
                            <View style={styles.actionRow}>
                                <Pressable onPress={() => router.push(`/movie/${item.id}` as never)} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                                    <Text style={styles.actionText}>Details</Text>
                                </Pressable>
                                <Pressable onPress={() => router.push('/share-sheet' as never)} style={({ pressed }) => [styles.actionButton, styles.secondaryButton, pressed && styles.pressed]}>
                                    <Text style={styles.actionText}>Share</Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </View>
                )}
            />
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        left: 0,
        paddingBottom: 12,
        paddingHorizontal: 18,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 5,
    },
    backButton: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 999,
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
    headerTitle: {
        color: '#FFFFFF',
        flex: 1,
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 48,
    },
    reel: {
        justifyContent: 'space-between',
    },
    image: {
        ...StyleSheet.absoluteFill,
    },
    scrim: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.36)',
    },
    topBar: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
    },
    metaPills: {
        flexDirection: 'row',
        gap: 8,
    },
    playButton: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderColor: 'rgba(255,255,255,0.34)',
        borderRadius: 999,
        borderWidth: 1,
        height: 82,
        justifyContent: 'center',
        width: 82,
    },
    playText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '900',
    },
    copy: {
        gap: 10,
        padding: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 38,
        fontWeight: '900',
        lineHeight: 40,
    },
    body: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 22,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },
    actionButton: {
        alignItems: 'center',
        backgroundColor: palette.red,
        borderRadius: 24,
        justifyContent: 'center',
        minHeight: 48,
        minWidth: 118,
        paddingHorizontal: 16,
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.16)',
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
    },
    pressed: {
        opacity: 0.72,
    },
});