import { CastMember, Movie } from '@/data/movies';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const palette = {
    ink: '#F7F4EE',
    inkSoft: '#FFFDF8',
    panel: '#FFFFFF',
    panelSoft: '#ECE7DE',
    line: 'rgba(45, 37, 27, 0.1)',
    text: '#17130F',
    muted: '#746B5F',
    red: '#E44755',
    gold: '#A96F16',
    cyan: '#087A8E',
    green: '#15834F',
};

export function ScreenShell({
    children,
    style,
    onLayout,
}: {
    children: React.ReactNode;
} & Pick<ViewProps, 'onLayout' | 'style'>) {
    return <View onLayout={onLayout} style={[styles.screen, style]}>{children}</View>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
    return <Text style={styles.eyebrow}>{children}</Text>;
}

export function SectionHeader({
    title,
    action,
}: {
    title: string;
    action?: React.ReactNode;
}) {
    return (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {action}
        </View>
    );
}

export function FloatingScreenHeader({ title }: { title: string }) {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.floatingHeader, { paddingTop: insets.top + 10 }]}>
            <Pressable
                accessibilityLabel="Go back"
                onPress={() => router.back()}
                style={({ pressed }) => [styles.floatingBackButton, pressed && styles.pressed]}>
                <Text style={styles.floatingBackIcon}>‹</Text>
            </Pressable>
            <Text style={styles.floatingTitle}>{title}</Text>
            <View style={styles.floatingHeaderSpacer} />
        </View>
    );
}

export function Pill({
    children,
    tone = 'neutral',
}: {
    children: React.ReactNode;
    tone?: 'neutral' | 'red' | 'gold' | 'green';
}) {
    const backgroundColor =
        tone === 'red'
            ? 'rgba(228,71,85,0.12)'
            : tone === 'gold'
                ? 'rgba(169,111,22,0.12)'
                : tone === 'green'
                    ? 'rgba(21,131,79,0.12)'
                    : 'rgba(23,19,15,0.08)';
    const color =
        tone === 'red' ? palette.red : tone === 'gold' ? palette.gold : tone === 'green' ? palette.green : palette.text;

    return (
        <View style={[styles.pill, { backgroundColor }]}>
            <Text style={[styles.pillText, { color }]}>{children}</Text>
        </View>
    );
}

export function PrimaryButton({
    children,
    onPress,
    href,
    tone = 'red',
}: {
    children: React.ReactNode;
    onPress?: () => void;
    href?: string;
    tone?: 'red' | 'dark';
}) {
    const router = useRouter();

    return (
        <Pressable
            onPress={href ? () => router.push(href as never) : onPress}
            style={({ pressed }) => [
                styles.primaryButton,
                tone === 'red' ? styles.primaryButtonRed : styles.primaryButtonDark,
                pressed && styles.pressed,
            ]}>
            <Text style={[styles.primaryButtonText, tone === 'dark' && styles.primaryButtonTextDark]}>{children}</Text>
        </Pressable>
    );
}

export function PosterCard({ movie, compact = false }: { movie: Movie; compact?: boolean }) {
    const router = useRouter();

    return (
        <Pressable
            onPress={() =>
                router.push(`/movie/${movie.id}` as never)
            }
            style={({ pressed }) => [styles.posterCard, compact && styles.posterCardCompact, pressed && styles.pressed]}>
            <Image source={{ uri: movie.poster }} style={styles.posterImage} contentFit="cover" />
            <View style={styles.posterGradient} />
            <View style={styles.posterCopy}>
                <Text numberOfLines={1} style={styles.posterTitle}>
                    {movie.title}
                </Text>
                <Text style={styles.posterMeta}>
                    {movie.year} · {movie.rating.toFixed(1)}
                </Text>
            </View>
        </Pressable>
    );
}

export function MovieRowCard({ movie }: { movie: Movie }) {
    const router = useRouter();

    return (
        <Pressable
            onPress={() =>
                router.push(`/movie/${movie.id}` as never)
            }
            style={({ pressed }) => [styles.rowCard, pressed && styles.pressed]}>
            <Image source={{ uri: movie.poster }} style={styles.rowPoster} contentFit="cover" />
            <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{movie.title}</Text>
                <Text style={styles.rowText} numberOfLines={2}>
                    {movie.tagline}
                </Text>
                <View style={styles.rowPills}>
                    <Pill tone="green">{movie.match}% match</Pill>
                    <Pill>{movie.runtime}</Pill>
                </View>
            </View>
        </Pressable>
    );
}

export function CastCard({ person }: { person: CastMember }) {
    const router = useRouter();

    return (
        <Pressable
            onPress={() => router.push(`/person/${person.id}` as never)}
            style={({ pressed }) => [styles.castCard, pressed && styles.pressed]}>
            <Image source={{ uri: person.avatar }} style={styles.castAvatar} contentFit="cover" />
            <View style={styles.castCopy}>
                <Text style={styles.castName} numberOfLines={1}>
                    {person.name}
                </Text>
                <Text style={styles.castRole} numberOfLines={1}>
                    {person.role}
                </Text>
                <Text style={styles.castAction}>View profile</Text>
            </View>
        </Pressable>
    );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
    return (
        <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{title}</Text>
            <Text style={styles.emptyBody}>{body}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: palette.ink,
    },
    eyebrow: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0,
        textTransform: 'uppercase',
    },
    sectionHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: palette.text,
        fontSize: 22,
        fontWeight: '900',
    },
    floatingHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 12,
        paddingBottom: 12,
        paddingHorizontal: 18,
    },
    floatingBackButton: {
        alignItems: 'center',
        backgroundColor: palette.panel,
        borderRadius: 999,
        height: 48,
        justifyContent: 'center',
        width: 48,
    },
    floatingBackIcon: {
        color: palette.text,
        fontSize: 34,
        fontWeight: '700',
        lineHeight: 38,
        marginTop: -2,
    },
    floatingTitle: {
        color: palette.text,
        flex: 1,
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },
    floatingHeaderSpacer: {
        width: 48,
    },
    pill: {
        alignItems: 'center',
        borderRadius: 999,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    pillText: {
        fontSize: 12,
        fontWeight: '800',
    },
    primaryButton: {
        alignItems: 'center',
        borderRadius: 999,
        justifyContent: 'center',
        minHeight: 52,
        paddingHorizontal: 20,
    },
    primaryButtonRed: {
        backgroundColor: palette.red,
    },
    primaryButtonDark: {
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderWidth: 1,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '800',
    },
    primaryButtonTextDark: {
        color: palette.text,
    },
    pressed: {
        opacity: 0.72,
    },
    posterCard: {
        borderRadius: 24,
        height: 226,
        overflow: 'hidden',
        width: 152,
        backgroundColor: palette.panel,
    },
    posterCardCompact: {
        height: 188,
        width: 126,
    },
    posterImage: {
        ...StyleSheet.absoluteFill,
    },
    posterGradient: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0,0,0,0.16)',
    },
    posterCopy: {
        bottom: 0,
        gap: 4,
        left: 0,
        padding: 12,
        position: 'absolute',
        right: 0,
    },
    posterTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '900',
    },
    posterMeta: {
        color: 'rgba(255,255,255,0.78)',
        fontSize: 12,
        fontWeight: '700',
    },
    rowCard: {
        alignItems: 'center',
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        minHeight: 124,
        padding: 12,
    },
    rowPoster: {
        borderRadius: 18,
        height: 104,
        overflow: 'hidden',
        width: 82,
    },
    rowCopy: {
        flex: 1,
        gap: 8,
    },
    rowTitle: {
        color: palette.text,
        fontSize: 18,
        fontWeight: '900',
    },
    rowText: {
        color: palette.muted,
        fontSize: 13,
        fontWeight: '600',
        lineHeight: 18,
    },
    rowPills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    castCard: {
        alignItems: 'center',
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        padding: 10,
        width: 264,
    },
    castAvatar: {
        backgroundColor: palette.panel,
        borderRadius: 20,
        height: 82,
        overflow: 'hidden',
        width: 82,
    },
    castCopy: {
        flex: 1,
        gap: 4,
    },
    castName: {
        color: palette.text,
        fontSize: 16,
        fontWeight: '900',
    },
    castRole: {
        color: palette.muted,
        fontSize: 13,
        fontWeight: '700',
    },
    castAction: {
        color: palette.cyan,
        fontSize: 12,
        fontWeight: '900',
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        backgroundColor: palette.panel,
        borderColor: palette.line,
        borderRadius: 24,
        borderWidth: 1,
        gap: 8,
        padding: 18,
    },
    emptyTitle: {
        color: palette.text,
        fontSize: 18,
        fontWeight: '900',
        textAlign: 'center',
    },
    emptyBody: {
        color: palette.muted,
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
        textAlign: 'center',
    },
});