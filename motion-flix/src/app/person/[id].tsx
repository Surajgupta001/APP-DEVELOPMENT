import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FloatingScreenHeader, palette, Pill, PosterCard, ScreenShell, SectionHeader } from '@/components/movie-ui';
import { getPerson, movies } from '@/data/movies';

export default function PersonScreen() {
    const { id } = useLocalSearchParams();
    const person = getPerson(id);
    const appearances = movies.filter((movie) => movie.cast.some((member) => member.id === person.id));

    return (
        <ScreenShell>
            <FloatingScreenHeader title="Profile" />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Image source={{ uri: person.avatar }} style={styles.avatar} contentFit="cover" />
                    <View style={styles.copy}>
                        <Text style={styles.name}>{person.name}</Text>
                        <Text style={styles.role}>{person.role}</Text>
                        <View style={styles.pills}>
                            <Pill tone="gold">Cast</Pill>
                            <Pill>{appearances.length} titles</Pill>
                        </View>
                    </View>
                </View>

                <View style={styles.bioCard}>
                    <Text style={styles.bio}>{person.bio}</Text>
                </View>

                <SectionHeader title="Known for" />
                <View style={styles.knownFor}>
                    {person.knownFor.map((title) => (
                        <Text key={title} style={styles.knownForItem}>
                            {title}
                        </Text>
                    ))}
                </View>

                <SectionHeader title="In MotionFlix" />
                <FlatList
                    horizontal
                    data={appearances}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PosterCard movie={item} compact />}
                    contentContainerStyle={styles.horizontalList}
                    ItemSeparatorComponent={() => <View style={styles.gap} />}
                    showsHorizontalScrollIndicator={false}
                />
            </ScrollView>
        </ScreenShell>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 26,
        paddingBottom: 40,
        paddingTop: 20,
    },
    header: {
        alignItems: 'flex-end',
        backgroundColor: palette.inkSoft,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 16,
        marginHorizontal: 18,
        padding: 12,
    },
    avatar: {
        backgroundColor: palette.panel,
        borderRadius: 24,
        height: 160,
        overflow: 'hidden',
        width: 132,
    },
    copy: {
        flex: 1,
        gap: 10,
    },
    name: {
        color: palette.text,
        fontSize: 34,
        fontWeight: '900',
        lineHeight: 38,
    },
    role: {
        color: palette.muted,
        fontSize: 15,
        fontWeight: '800',
    },
    pills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    bioCard: {
        backgroundColor: palette.inkSoft,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        marginHorizontal: 18,
        padding: 16,
    },
    bio: {
        color: palette.text,
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
    },
    knownFor: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        paddingHorizontal: 18,
    },
    knownForItem: {
        backgroundColor: palette.panelSoft,
        borderRadius: 24,
        color: palette.text,
        fontSize: 14,
        fontWeight: '800',
        overflow: 'hidden',
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    horizontalList: {
        paddingHorizontal: 18,
    },
    gap: {
        width: 12,
    },
});