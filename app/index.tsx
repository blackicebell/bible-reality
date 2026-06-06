import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/BottomNav";
import { spacing } from "@/theme/spacing";
import { useThemeMode } from "@/theme/themeMode";
import { typography } from "@/theme/typography";
import { getAllRealityProfiles, searchRealityProfiles } from "@/utils/realityProfiles";
import { getRecentProfiles, hasSeenOnboarding, type RecentProfile } from "@/utils/storage";

const allProfiles = getAllRealityProfiles();

const startingPoints = [
  {
    label: "Begin at the beginning",
    query: "Creation",
    note: "Start with the created world before people, nations, and cities."
  },
  {
    label: "Enter Eden",
    query: "Eden",
    note: "See the first human setting, relationships, and rupture."
  },
  {
    label: "Understand Babel",
    query: "Babel",
    note: "Watch Genesis move from one people to scattered nations."
  }
];

const guidedPaths = [
  {
    title: "Creation to Babel",
    subtitle: "The first world, the flood, nations, and the road toward Abram.",
    queries: ["Creation", "Flood", "Babel"]
  },
  {
    title: "People and Places",
    subtitle: "Follow the human names and ancient locations that shape the story.",
    queries: ["Cain", "Shinar", "Noah"]
  }
];

export default function StudyHomeScreen() {
  const [recent, setRecent] = useState<RecentProfile[]>([]);
  const { palette } = useThemeMode();
  const latestStudy = recent[0];

  const libraryCount = useMemo(() => allProfiles.length, []);

  useEffect(() => {
    hasSeenOnboarding().then((seen) => {
      if (!seen) {
        router.replace("/onboarding");
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      getRecentProfiles().then(setRecent);
    }, [])
  );

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.masthead, { borderBottomColor: palette.divider }]}>
          <Text style={[styles.brand, { color: palette.text }]}>Bible Reality</Text>
          <Text style={[styles.volume, { color: palette.textMuted }]}>HOME</Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.kicker, { color: palette.gold }]}>Start With Context</Text>
          <Text style={[styles.title, { color: palette.text }]}>Open the story with somewhere to stand.</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Pick a guided beginning, return to your last study, or search when you already know what you want.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Continue Where You Left Off</Text>
          {latestStudy ? (
            <Link href={`/study/${latestStudy.id}`} asChild>
              <Pressable style={{ ...styles.continueCard, backgroundColor: palette.surfaceElevated, borderColor: palette.border }}>
                <View style={styles.rowCopy}>
                  <Text style={[styles.rowTitle, { color: palette.text }]}>{latestStudy.title}</Text>
                  {latestStudy.subtitle ? <Text style={[styles.rowSubtitle, { color: palette.textMuted }]}>{latestStudy.subtitle}</Text> : null}
                </View>
                <Ionicons color={palette.gold} name="chevron-forward" size={18} />
              </Pressable>
            </Link>
          ) : (
            <View style={[styles.emptyRow, { borderColor: palette.border }]}>
              <Text style={[styles.emptyText, { color: palette.textMuted }]}>Pick a starting point below. Your most recent study will appear here next time.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Start Here</Text>
          {startingPoints.map((item) => {
            const profile = searchRealityProfiles(item.query)[0] ?? allProfiles[0];
            return (
              <Link href={`/study/${profile.id}`} key={item.label} asChild>
                <Pressable style={{ ...styles.studyCard, backgroundColor: palette.surfaceElevated, borderColor: palette.border }}>
                  <View style={styles.rowCopy}>
                    <Text style={[styles.cardLabel, { color: palette.gold }]}>{item.label}</Text>
                    <Text style={[styles.rowTitle, { color: palette.text }]}>{profile.title}</Text>
                    <Text style={[styles.cardNote, { color: palette.textMuted }]}>{item.note}</Text>
                  </View>
                  <Ionicons color={palette.gold} name="chevron-forward" size={18} />
                </Pressable>
              </Link>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: palette.text }]}>Guided Paths</Text>
            <Text style={[styles.sectionMeta, { color: palette.gold }]}>For First Visits</Text>
          </View>
          {guidedPaths.map((path) => (
            <Pressable
              key={path.title}
              onPress={() => {
                const first = searchRealityProfiles(path.queries[0])[0] ?? allProfiles[0];
                router.push(`/study/${first.id}`);
              }}
              style={{ ...styles.pathCard, borderColor: palette.border }}
            >
              <Text style={[styles.pathTitle, { color: palette.text }]}>{path.title}</Text>
              <Text style={[styles.pathSubtitle, { color: palette.textMuted }]}>{path.subtitle}</Text>
              <View style={styles.pathChips}>
                {path.queries.map((query) => (
                  <Text key={query} style={[styles.pathChip, { borderColor: palette.divider, color: palette.gold }]}>{query}</Text>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={[styles.libraryCard, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
          <View style={styles.libraryIcon}>
            <Ionicons color={palette.gold} name="search-outline" size={20} />
          </View>
          <Text style={[styles.cardLabel, { color: palette.gold }]}>Ready To Look Around?</Text>
          <Text style={[styles.pathTitle, { color: palette.text }]}>Search the library by passage, person, place, or book.</Text>
          <Text style={[styles.pathSubtitle, { color: palette.textMuted }]}>There are {libraryCount} studies available now, with more being added across Scripture.</Text>
          <Pressable onPress={() => router.push("/search")} style={[styles.libraryButton, { borderColor: palette.border }]}>
            <Text style={[styles.libraryButtonText, { color: palette.text }]}>Open Search</Text>
            <Ionicons color={palette.gold} name="arrow-forward" size={16} />
          </Pressable>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  container: {
    alignSelf: "center",
    gap: spacing.xl,
    maxWidth: 384,
    paddingBottom: 190,
    paddingHorizontal: 0,
    paddingTop: spacing.lg,
    width: "88%"
  },
  masthead: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl
  },
  brand: {
    fontFamily: "Georgia",
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 24
  },
  volume: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  header: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xl
  },
  kicker: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  title: {
    ...typography.display
  },
  subtitle: {
    ...typography.body
  },
  section: {
    gap: spacing.md
  },
  sectionHeaderRow: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    ...typography.sectionTitle
  },
  sectionMeta: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  continueCard: {
    alignItems: "center",
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.lg
  },
  emptyRow: {
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.lg
  },
  emptyText: {
    ...typography.body
  },
  studyCard: {
    alignItems: "center",
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.lg
  },
  rowCopy: {
    flex: 1,
    minWidth: 0
  },
  rowTitle: {
    ...typography.sectionTitle,
    fontSize: 21,
    lineHeight: 28
  },
  rowSubtitle: {
    ...typography.small,
    marginTop: 3
  },
  cardLabel: {
    ...typography.micro,
    marginBottom: spacing.xs,
    textTransform: "uppercase"
  },
  cardNote: {
    ...typography.small,
    marginTop: spacing.sm
  },
  pathCard: {
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.lg
  },
  pathTitle: {
    ...typography.sectionTitle,
    fontSize: 21,
    lineHeight: 28
  },
  pathSubtitle: {
    ...typography.body,
    marginTop: spacing.xs
  },
  pathChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md
  },
  pathChip: {
    ...typography.micro,
    borderBottomWidth: 1,
    paddingBottom: 3,
    textTransform: "uppercase"
  },
  libraryCard: {
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: spacing.lg,
    padding: spacing.lg
  },
  libraryIcon: {
    marginBottom: spacing.md
  },
  libraryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  libraryButtonText: {
    ...typography.small,
    fontWeight: "800"
  }
});
