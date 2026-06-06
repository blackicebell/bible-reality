import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type SnapshotItem = {
  label: string;
  value: string;
};

export function RealitySnapshotCard({ items }: { items: SnapshotItem[] }) {
  return (
    <StudyCard title="Reality Snapshot" eyebrow="Instant orientation">
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={`${item.label}-${item.value}`} style={styles.item}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: spacing.md
  },
  item: {
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    gap: spacing.xs,
    paddingBottom: spacing.md
  },
  label: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  value: {
    ...typography.sectionTitle,
    color: colors.text,
    fontSize: 21,
    lineHeight: 27
  }
});
