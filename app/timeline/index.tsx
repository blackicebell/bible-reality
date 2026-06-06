import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import timeline from "@/data/timeline.json";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export default function TimelineScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Bible timeline</Text>
          <Text style={styles.title}>Find your place in the larger story.</Text>
        </View>
        <View style={styles.line}>
          {timeline.map((era) => (
            <Link href={`/timeline/${era.id}`} key={era.id} asChild>
              <Pressable style={era.id === "patriarchs" ? { ...styles.eraCard, ...styles.highlighted } : styles.eraCard}>
                <View style={styles.dot} />
                <View style={styles.eraCopy}>
                  <Text style={styles.eraLabel}>{era.label}</Text>
                  <Text style={styles.eraRange}>{era.range}</Text>
                  <Text style={styles.eraSummary}>{era.summary}</Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1
  },
  container: {
    alignSelf: "center",
    gap: spacing.lg,
    maxWidth: 390,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    width: "100%"
  },
  header: {
    paddingTop: spacing.md
  },
  kicker: {
    ...typography.small,
    color: colors.gold,
    textTransform: "uppercase"
  },
  title: {
    ...typography.title,
    color: colors.text,
    flexShrink: 1,
    marginTop: spacing.xs
  },
  line: {
    gap: spacing.sm
  },
  eraCard: {
    alignItems: "flex-start",
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg
  },
  highlighted: {
    borderColor: colors.gold,
    borderWidth: 2
  },
  dot: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    height: 16,
    marginTop: 4,
    width: 16
  },
  eraCopy: {
    flex: 1
  },
  eraLabel: {
    ...typography.sectionTitle,
    color: colors.text
  },
  eraRange: {
    ...typography.small,
    color: colors.olive,
    marginTop: 2
  },
  eraSummary: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs
  }
});
