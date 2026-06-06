import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { spacing } from "@/theme/spacing";
import { useThemeMode } from "@/theme/themeMode";
import { typography } from "@/theme/typography";

export function AppearanceToggle() {
  const { mode, palette, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <View style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: palette.text }]}>Appearance</Text>
        <Text style={[styles.description, { color: palette.textMuted }]}>Switch between light paper and dark reading mode.</Text>
      </View>
      <Pressable
        accessibilityLabel="Toggle dark mode"
        accessibilityRole="switch"
        accessibilityState={{ checked: isDark }}
        onPress={toggleMode}
        style={styles.switch}
      >
        <Ionicons color={isDark ? palette.textMuted : palette.text} name="sunny-outline" size={14} />
        <View style={[styles.track, { backgroundColor: isDark ? palette.gold : palette.divider }]}>
          <View style={[styles.thumb, { backgroundColor: palette.surface }, isDark ? styles.thumbActive : null]} />
        </View>
        <Ionicons color={isDark ? palette.text : palette.textMuted} name="moon-outline" size={14} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.lg
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  title: {
    ...typography.body,
    fontWeight: "900"
  },
  description: {
    ...typography.small,
    marginTop: 4
  },
  switch: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  },
  track: {
    borderRadius: 999,
    height: 22,
    justifyContent: "center",
    padding: 3,
    width: 42
  },
  thumb: {
    borderRadius: 999,
    height: 16,
    width: 16
  },
  thumbActive: {
    alignSelf: "flex-end"
  }
});
