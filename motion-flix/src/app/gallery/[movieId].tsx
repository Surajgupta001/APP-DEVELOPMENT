import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { FloatingScreenHeader, palette, ScreenShell } from '@/components/movie-ui';
import { getMovie } from '@/data/movies';
import { TransitionFlatList } from '@/transitions/transition-components';

export default function GalleryScreen() {
    const { movieId, index } = useLocalSearchParams();
    const movie = getMovie(movieId);
    const { width } = useWindowDimensions();
    const requestedIndex = Number.isNaN(Number(index)) ? 0 : Number(index);
    const initialIndex = Math.min(movie.stills.length - 1, Math.max(0, requestedIndex));

    return (
        <ScreenShell>
            <FloatingScreenHeader title="Gallery" />
            <TransitionFlatList
                data={movie.stills}
                keyExtractor={(item) => item}
                horizontal
                initialScrollIndex={initialIndex}
                getItemLayout={(_, itemIndex) => ({
                    length: width,
                    offset: width * itemIndex,
                    index: itemIndex,
                })}
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                renderItem={({ item, index }) => (
                    <View style={[styles.slide, { width }]}>
                        <Image source={{ uri: item }} style={styles.image} contentFit="cover" />
                        <View style={styles.caption}>
                            <Text style={styles.count}>
                                {index + 1} / {movie.stills.length}
                            </Text>
                            <Text style={styles.title}>{movie.title} stills</Text>
                            <Text style={styles.body}>Swipe through cinematic stills from the movie.</Text>
                        </View>
                    </View>
                )}
            />
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 18,
        paddingTop: 6,
    },
    image: {
        aspectRatio: 3 / 4,
        backgroundColor: palette.panel,
        borderRadius: 24,
        overflow: 'hidden',
        width: '100%',
    },
    caption: {
        backgroundColor: palette.inkSoft,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        gap: 8,
        marginTop: 14,
        padding: 14,
    },
    count: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '900',
    },
    title: {
        color: palette.text,
        fontSize: 26,
        fontWeight: '900',
    },
    body: {
        color: palette.muted,
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 20,
    },
});