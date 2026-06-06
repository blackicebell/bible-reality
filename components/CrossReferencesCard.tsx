import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import crossReferences from "@/data/crossReferences.json";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type CrossReference = {
  reference: string;
  label: string;
};

export function CrossReferencesCard({ passageId }: { passageId: string }) {
  const references = (crossReferences as Record<string, CrossReference[]>)[passageId] ?? [];

  return (
    <StudyCard title="Cross References" eyebrow="Connected passages">
      {references.map((reference) => (
        <View key={`${reference.reference}-${reference.label}`} style={styles.row}>
          <Text style={styles.reference}>{reference.reference}</Text>
          <Text style={styles.label}>{reference.label}</Text>
        </View>
      ))}
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 54,
    paddingHorizontal: spacing.md
  },
  reference: {
    ...typography.body,
    color: colors.text,
    fontWeight: "800"
  },
  label: {
    ...typography.small,
    color: colors.textMuted,
    flexShrink: 1,
    marginLeft: spacing.sm,
    textAlign: "right"
  }
});
