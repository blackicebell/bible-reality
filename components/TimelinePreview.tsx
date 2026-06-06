import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

import timeline from "@/data/timeline.json";
import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function TimelinePreview({ selectedEraId }: { selectedEraId: string }) {
  return (
    <StudyCard title="Timeline" eyebrow="Story sequence">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeline}>
        {timeline.map((era) => {
          const selected = era.id === selectedEraId;
          return (
            <Link key={era.id} href={`/timeline/${era.id}`} asChild>
              <Pressable style={selected ? { ...styles.era, ...styles.selectedEra } : styles.era}>
                <View style={[styles.dot, selected && styles.selectedDot]} />
                <Text style={[styles.eraLabel, selected && styles.selectedText]}>{era.label}</Text>
                <Text style={[styles.range, selected && styles.selectedRange]}>{era.range}</Text>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  timeline: {
    gap: spacing.sm,
    paddingRight: spacing.md
  },
  era: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 118,
    padding: spacing.md,
    width: 146
  },
  selectedEra: {
    backgroundColor: colors.navy,
    borderColor: colors.navy
  },
  dot: {
    backgroundColor: colors.goldSoft,
    borderRadius: 7,
    height: 14,
    marginBottom: spacing.sm,
    width: 14
  },
  selectedDot: {
    backgroundColor: colors.gold
  },
  eraLabel: {
    ...typography.small,
    color: colors.text,
    fontWeight: "800"
  },
  selectedText: {
    color: colors.surface
  },
  range: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4
  },
  selectedRange: {
    color: colors.navySoft
  }
});
