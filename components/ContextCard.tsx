import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ContextData = {
  before: string;
  during: string;
  after: string;
  movement: string;
};

export function ContextCard({ context }: { context: ContextData }) {
  return (
    <StudyCard title="Context" eyebrow="Factual movement">
      <ContextRow label="Before" value={context.before} />
      <ContextRow label="This passage" value={context.during} />
      <ContextRow label="After" value={context.after} />
      <View style={styles.movement}>
        <Text style={styles.movementLabel}>Major movement</Text>
        <Text style={styles.value}>{context.movement}</Text>
      </View>
    </StudyCard>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    paddingBottom: spacing.sm
  },
  label: {
    ...typography.small,
    color: colors.olive,
    marginBottom: 3
  },
  value: {
    ...typography.body,
    color: colors.text
  },
  movement: {
    backgroundColor: colors.oliveSoft,
    borderRadius: 8,
    padding: spacing.md
  },
  movementLabel: {
    ...typography.small,
    color: colors.olive,
    marginBottom: 3
  }
});
