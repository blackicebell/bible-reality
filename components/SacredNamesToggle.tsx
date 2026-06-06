import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { spacing } from "@/theme/spacing";
import { useThemeMode } from "@/theme/themeMode";
import { typography } from "@/theme/typography";
import { sacredNameStyles } from "@/utils/sacredNames";
import { type SacredNameMap, type SacredNameStyle } from "@/utils/storage";

type SacredNamesToggleProps = {
  customNames: SacredNameMap;
  onCustomNameChange: (key: keyof SacredNameMap, value: string) => void;
  onStyleChange: (style: SacredNameStyle) => void;
  styleMode: SacredNameStyle;
};

const customFields: Array<{ key: keyof SacredNameMap; label: string }> = [
  { key: "LORD", label: "LORD" },
  { key: "God", label: "God" },
  { key: "Lord", label: "Lord" },
  { key: "Jesus", label: "Jesus" },
  { key: "Christ", label: "Christ" },
  { key: "Holy Spirit", label: "Holy Spirit" }
];

export function SacredNamesToggle({ customNames, onCustomNameChange, onStyleChange, styleMode }: SacredNamesToggleProps) {
  const { palette } = useThemeMode();
  const sample = styleMode === "traditional"
    ? "The LORD God is near."
    : `${styleMode === "custom" ? customNames.LORD : "Yahweh"} ${styleMode === "custom" ? customNames.God : "Elohim"} is near.`;

  return (
    <View style={[styles.card, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: palette.text }]}>Sacred Names</Text>
        <Text style={[styles.description, { color: palette.textMuted }]}>Choose how divine names appear in study text and passage previews.</Text>
      </View>

      <View style={styles.options}>
        {(Object.keys(sacredNameStyles) as SacredNameStyle[]).map((style) => {
          const active = styleMode === style;
          return (
            <Pressable
              accessibilityRole="button"
              key={style}
              onPress={() => onStyleChange(style)}
              style={{
                ...styles.option,
                backgroundColor: active ? palette.ink : palette.surface,
                borderColor: active ? palette.ink : palette.border
              }}
            >
              <Text style={[styles.optionLabel, { color: active ? "#FFFDF8" : palette.text }]}>{sacredNameStyles[style].label}</Text>
              <Text style={[styles.optionDescription, { color: active ? "rgba(255, 253, 248, 0.72)" : palette.textMuted }]}>
                {sacredNameStyles[style].description}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {styleMode === "custom" ? (
        <View style={styles.customGrid}>
          {customFields.map((field) => (
            <View key={field.key} style={styles.field}>
              <Text style={[styles.fieldLabel, { color: palette.gold }]}>{field.label}</Text>
              <TextInput
                onChangeText={(value) => onCustomNameChange(field.key, value)}
                placeholder={field.label}
                placeholderTextColor={palette.textSoft}
                style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.border, color: palette.text }]}
                value={customNames[field.key]}
              />
            </View>
          ))}
        </View>
      ) : null}

      <View style={[styles.sample, { borderTopColor: palette.divider }]}>
        <Text style={[styles.sampleLabel, { color: palette.gold }]}>Preview</Text>
        <Text style={[styles.sampleText, { color: palette.text }]}>{sample}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 2,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg
  },
  copy: {
    gap: spacing.xs
  },
  title: {
    ...typography.sectionTitle,
    fontSize: 22,
    lineHeight: 28
  },
  description: {
    ...typography.body
  },
  options: {
    gap: spacing.sm
  },
  option: {
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.md
  },
  optionLabel: {
    ...typography.body,
    fontWeight: "800"
  },
  optionDescription: {
    ...typography.small,
    marginTop: 3
  },
  customGrid: {
    gap: spacing.md
  },
  field: {
    gap: spacing.xs
  },
  fieldLabel: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  input: {
    ...typography.body,
    borderRadius: 2,
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  sample: {
    borderTopWidth: 1,
    paddingTop: spacing.md
  },
  sampleLabel: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  sampleText: {
    ...typography.quote,
    fontSize: 21,
    lineHeight: 30,
    marginTop: spacing.xs
  }
});
