import { ScrollView, StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function StoryPositionStrip({ currentStory, items }: { currentStory: string; items: string[] }) {
  return (
    <StudyCard title="Story Position">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item, index) => {
          const active = item === currentStory;
          return (
            <View key={`${item}-${index}`} style={styles.stepWrap}>
              <View style={active ? { ...styles.step, ...styles.stepActive } : styles.step}>
                <Text style={active ? { ...styles.stepText, ...styles.stepTextActive } : styles.stepText}>{item}</Text>
              </View>
              {index < items.length - 1 ? <Text style={styles.arrow}>/</Text> : null}
            </View>
          );
        })}
      </ScrollView>
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    paddingRight: spacing.md
  },
  stepWrap: {
    alignItems: "center",
    flexDirection: "row"
  },
  step: {
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  stepActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink
  },
  stepText: {
    ...typography.small,
    color: colors.text,
    fontWeight: "800"
  },
  stepTextActive: {
    color: colors.surface
  },
  arrow: {
    color: colors.gold,
    fontFamily: "Georgia",
    fontSize: 18,
    marginHorizontal: spacing.sm
  }
});
