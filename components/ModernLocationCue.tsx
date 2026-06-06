import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ModernLocationCueProps = {
  ancientPlace: string;
  modernRegion: string;
};

export function ModernLocationCue({ ancientPlace, modernRegion }: ModernLocationCueProps) {
  if (!ancientPlace || !modernRegion) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <Ionicons color={colors.gold} name="location-outline" size={17} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>Today&apos;s Map Context</Text>
        <Text style={styles.text}>{ancientPlace} is placed in {modernRegion}.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.goldSoft,
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  label: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  text: {
    ...typography.small,
    color: colors.text,
    marginTop: 1
  }
});
