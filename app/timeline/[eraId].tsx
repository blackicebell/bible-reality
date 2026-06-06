import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import timeline from "@/data/timeline.json";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { isSaved, toggleSavedItem } from "@/utils/storage";

export default function TimelineEraScreen() {
  const { eraId } = useLocalSearchParams<{ eraId: string }>();
  const era = timeline.find((item) => item.id === eraId) ?? timeline.find((item) => item.id === "patriarchs")!;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    isSaved(era.id, "timeline").then(setSaved);
  }, [era.id]);

  async function toggleSaved() {
    const next = await toggleSavedItem({
      id: era.id,
      type: "timeline",
      title: era.label,
      subtitle: era.range
    });
    setSaved(next);
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <Stack.Screen options={{ title: era.label }} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>{era.range}</Text>
            <Text style={styles.title}>{era.label}</Text>
            <Text style={styles.summary}>{era.summary}</Text>
          </View>
          <Pressable accessibilityLabel="Save timeline era" onPress={toggleSaved} style={saved ? { ...styles.saveButton, ...styles.savedButton } : styles.saveButton}>
            <Ionicons color={saved ? colors.surface : colors.navy} name={saved ? "bookmark" : "bookmark-outline"} size={22} />
          </Pressable>
        </View>
        <Section title="Key People" values={era.keyPeople} />
        <Section title="Places" values={era.places} />
        <Section title="Related Passages" values={era.relatedPassages} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, values }: { title: string; values: string[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {values.length ? (
        values.map((value) => (
          <View key={value} style={styles.row}>
            <Text style={styles.rowText}>{value}</Text>
          </View>
        ))
      ) : (
        <View style={styles.row}>
          <Text style={styles.rowText}>No MVP entries yet.</Text>
        </View>
      )}
    </View>
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
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingTop: spacing.md
  },
  headerCopy: {
    flex: 1
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
  summary: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  savedButton: {
    backgroundColor: colors.navy,
    borderColor: colors.navy
  },
  section: {
    gap: spacing.sm
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text
  },
  row: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md
  },
  rowText: {
    ...typography.body,
    color: colors.text
  }
});
