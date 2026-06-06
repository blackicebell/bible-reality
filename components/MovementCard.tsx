import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function MovementCard({ movement }: { movement: string[] }) {
  return (
    <StudyCard title="Movement" eyebrow="How the story moves">
      <View style={styles.route}>
        {movement.map((step, index) => (
          <View key={`${step}-${index}`} style={styles.stepWrap}>
            <View style={styles.step}>
              <Text style={styles.stepText}>{step}</Text>
            </View>
            {index < movement.length - 1 ? <Text style={styles.arrow}>→</Text> : null}
          </View>
        ))}
      </View>
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  route: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  stepWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  step: {
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  stepText: {
    ...typography.small,
    color: colors.text,
    fontWeight: "900"
  },
  arrow: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "900"
  }
});
