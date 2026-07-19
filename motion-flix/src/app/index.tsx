import { Image } from "expo-image";
import { Link } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Eyebrow, MovieRowCard, palette, Pill, PosterCard, PrimaryButton, ScreenShell, SectionHeader } from "@/components/movie-ui";
import { continueWatching,featuredMovies, movies, trailerQueue } from "@/data/movies";

const collections = [
  {
    title: "Space scale",
    body: "Big sci-fi rescues and impossible orbits",
    href: "/search",
  },
  {
    title: "Rainy mysteries",
    body: "Noir memory games and city secrets",
    href: "/filters",
  },
  {
    title: "Weekend queue",
    body: "Plan a softer movie-night lineup",
    href: "/watchlist-sheet",
  },
  {
    title: "Fast trailers",
    body: "Swipe through visual picks quickly",
    href: "/trailer/rogue-frequency",
  },
];

export default function HomeScreen() {
  const hero = featuredMovies[0];
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "android" ? insets.top + 14 : 14;

  return (
    <ScreenShell>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.logo}>MotionFlix</Text>
            <Text style={styles.subtitle}>Premium movie browsing</Text>
          </View>
          <Link href="/search" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.searchButton,
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Search"
            >
              <Ionicons
                name="search"
                color={palette.text}
                size={24}
              />
            </Pressable>
          </Link>
        </View>

        <View style={styles.heroWrap}>
          <View style={styles.hero}>
            <Image
              source={{ uri: hero.backdrop }}
              style={styles.heroImage}
              contentFit="cover"
            />
            <View style={styles.heroScrim} />
            <View style={styles.heroCopy}>
              <Eyebrow>Featured Premiere</Eyebrow>
              <Text style={styles.heroTitle}>{hero.title}</Text>
              <Text style={styles.heroText}>{hero.tagline}</Text>
              <View style={styles.pillRow}>
                <Pill tone="green">{hero.match}% match</Pill>
                <Pill>{hero.runtime}</Pill>
                <Pill tone="gold">{hero.ageRating}</Pill>
              </View>
              <View style={styles.heroActions}>
                <PrimaryButton href={`/movie/${hero.id}`}>
                  View details
                </PrimaryButton>
                <PrimaryButton href={`/trailer/${hero.id}`} tone="dark">
                  Watch trailer
                </PrimaryButton>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Link href="/filters" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.quickActionIcon}>Tune</Text>
              <Text style={styles.quickActionTitle}>Filters</Text>
              <Text style={styles.quickActionText}>
                Genres, rating, runtime
              </Text>
            </Pressable>
          </Link>
          <Link href="/watchlist-sheet" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.quickAction,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.quickActionIcon}>Queue</Text>
              <Text style={styles.quickActionTitle}>Watchlist</Text>
              <Text style={styles.quickActionText}>
                Plan tonight&apos;s lineup
              </Text>
            </Pressable>
          </Link>
        </View>

        <SectionHeader title="Trending now" />
        <FlatList
          horizontal
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PosterCard movie={item} />}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          showsHorizontalScrollIndicator={false}
        />

        <SectionHeader title="Trailers to swipe through" />
        <FlatList
          horizontal
          data={trailerQueue}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/trailer/${item.id}` as never} asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.trailerCard,
                  pressed && styles.pressed,
                ]}
              >
                <Image
                  source={{ uri: item.trailerStill }}
                  style={styles.trailerImage}
                  contentFit="cover"
                />
                <View style={styles.trailerOverlay}>
                  <Text style={styles.playBadge}>Play</Text>
                  <Text style={styles.trailerTitle}>{item.title}</Text>
                </View>
              </Pressable>
            </Link>
          )}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          showsHorizontalScrollIndicator={false}
        />

        <SectionHeader title="Continue watching" />
        <View style={styles.stack}>
          {continueWatching.map((movie) => (
            <MovieRowCard key={movie.id} movie={movie} />
          ))}
        </View>

        <SectionHeader title="Curated collections" />
        <View style={styles.collectionGrid}>
          {collections.map((collection, index) => (
            <Link
              key={collection.title}
              href={collection.href as never}
              asChild
            >
              <Pressable
                style={({ pressed }) => [
                  styles.collectionCard,
                  index === 0 && styles.collectionCardFeatured,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.collectionTitle}>{collection.title}</Text>
                <Text style={styles.collectionBody}>{collection.body}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
    paddingBottom: 48,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  logo: {
    color: palette.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
  },
  searchButton: {
    alignItems: "center",
    backgroundColor: palette.panel,
    borderColor: palette.line,
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  heroWrap: {
    paddingHorizontal: 18,
  },
  hero: {
    borderRadius: 32,
    height: 420,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
  },
  heroScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroCopy: {
    gap: 12,
    padding: 18,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 44,
    fontWeight: "900",
    lineHeight: 46,
  },
  heroText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
    maxWidth: 430,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 18,
  },
  quickAction: {
    backgroundColor: palette.inkSoft,
    borderColor: palette.line,
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    gap: 7,
    minHeight: 112,
    padding: 14,
  },
  quickActionIcon: {
    alignSelf: "flex-start",
    backgroundColor: palette.panelSoft,
    borderRadius: 999,
    color: palette.cyan,
    fontSize: 11,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  quickActionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "900",
  },
  quickActionText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  horizontalList: {
    paddingHorizontal: 18,
  },
  gap: {
    width: 12,
  },
  stack: {
    gap: 12,
    paddingHorizontal: 20,
  },
  trailerCard: {
    backgroundColor: palette.panel,
    borderRadius: 24,
    height: 164,
    overflow: "hidden",
    width: 252,
  },
  trailerImage: {
    ...StyleSheet.absoluteFill,
  },
  trailerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.24)",
    justifyContent: "space-between",
    padding: 14,
  },
  playBadge: {
    alignSelf: "flex-start",
    backgroundColor: palette.red,
    borderRadius: 999,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  trailerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  collectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 20,
  },
  collectionCard: {
    backgroundColor: palette.inkSoft,
    borderColor: palette.line,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    minHeight: 82,
    minWidth: "47%",
    justifyContent: "center",
    padding: 16,
  },
  collectionCardFeatured: {
    backgroundColor: "#FFF7E8",
    borderColor: "rgba(169,111,22,0.18)",
  },
  collectionTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "900",
  },
  collectionBody: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.72,
  },
});