import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type StudyCardProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export function StudyCard({ title, eyebrow, children }: StudyCardProps) {
  return (
    <View style={styles.card}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={eyebrow ? { ...styles.title, ...styles.titleWithEyebrow } : styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    shadowColor: colors.shadow,
    shadowOpacity: 0.045,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 1
  },
  eyebrow: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text
  },
  titleWithEyebrow: {
    marginTop: spacing.xs
  },
  content: {
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.lg
  }
});
