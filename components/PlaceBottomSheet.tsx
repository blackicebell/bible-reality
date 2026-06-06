import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Place } from "@/utils/mapHelpers";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type PlaceBottomSheetProps = {
  place: Place | null;
  onClose: () => void;
};

export function PlaceBottomSheet({ place, onClose }: PlaceBottomSheetProps) {
  if (!place) {
    return null;
  }

  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.region}>{place.region}</Text>
        </View>
        <Pressable accessibilityLabel="Close place details" onPress={onClose} style={styles.closeButton}>
          <Ionicons color={colors.text} name="close" size={20} />
        </Pressable>
      </View>
      <Text style={styles.description}>{place.description}</Text>
      {"modernContext" in place && place.modernContext ? (
        <View style={styles.modernBox}>
          <Text style={styles.label}>Today</Text>
          <Text style={styles.references}>{place.modernContext}</Text>
        </View>
      ) : null}
      <Text style={styles.label}>Related passages</Text>
      <Text style={styles.references}>{place.references.join("  ·  ")}</Text>
      <Text style={styles.label}>Where else this place appears</Text>
      <Text style={styles.references}>{place.otherAppearances.join("  ·  ")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    bottom: spacing.md,
    left: spacing.md,
    padding: spacing.lg,
    position: "absolute",
    right: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm
  },
  name: {
    ...typography.sectionTitle,
    color: colors.text
  },
  region: {
    ...typography.small,
    color: colors.textMuted
  },
  closeButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 20,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md
  },
  modernBox: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: spacing.sm,
    padding: spacing.md
  },
  label: {
    ...typography.small,
    color: colors.olive,
    marginTop: spacing.sm
  },
  references: {
    ...typography.body,
    color: colors.text
  }
});
