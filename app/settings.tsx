import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppearanceToggle } from "@/components/AppearanceToggle";
import { BottomNav } from "@/components/BottomNav";
import { BrandWordmark } from "@/components/BrandWordmark";
import { SacredNamesToggle } from "@/components/SacredNamesToggle";
import { spacing } from "@/theme/spacing";
import { useThemeMode } from "@/theme/themeMode";
import { typography } from "@/theme/typography";
import { premiumColumnWidth } from "@/utils/layout";
import {
  defaultCustomSacredNames,
  getCustomSacredNames,
  getSacredNameStyle,
  setCustomSacredNames,
  setSacredNameStyle,
  type SacredNameMap,
  type SacredNameStyle
} from "@/utils/storage";

export default function SettingsScreen() {
  const [sacredNameStyle, setSacredNameStyleState] = useState<SacredNameStyle>("traditional");
  const [customNames, setCustomNames] = useState<SacredNameMap>(defaultCustomSacredNames);
  const { palette } = useThemeMode();
  const { width } = useWindowDimensions();
  const contentWidth = premiumColumnWidth(width);

  useEffect(() => {
    getSacredNameStyle().then(setSacredNameStyleState);
    getCustomSacredNames().then(setCustomNames);
  }, []);

  async function updateSacredNameStyle(style: SacredNameStyle) {
    setSacredNameStyleState(style);
    await setSacredNameStyle(style);
  }

  async function updateCustomName(key: keyof SacredNameMap, value: string) {
    const next = { ...customNames, [key]: value };
    setCustomNames(next);
    await setCustomSacredNames(next);
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { width: contentWidth }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.masthead, { borderBottomColor: palette.divider }]}>
          <BrandWordmark color={palette.text} />
          <Text style={[styles.volume, { color: palette.textMuted }]}>SETTINGS</Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.kicker, { color: palette.gold }]}>Preferences</Text>
          <Text style={[styles.title, { color: palette.text }]}>Reading settings.</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Adjust appearance, sacred names, and local study preferences.</Text>
        </View>

        <AppearanceToggle />
        <SacredNamesToggle
          customNames={customNames}
          onCustomNameChange={updateCustomName}
          onStyleChange={updateSacredNameStyle}
          styleMode={sacredNameStyle}
        />

        <View style={[styles.infoCard, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
          <Text style={[styles.infoTitle, { color: palette.text }]}>Privacy</Text>
          <Text style={[styles.infoCopy, { color: palette.textMuted }]}>Saved studies, notes, and reading preferences stay on this device. The app does not need an account or a live map service.</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
          <Text style={[styles.infoTitle, { color: palette.text }]}>Offline Study</Text>
          <Text style={[styles.infoCopy, { color: palette.textMuted }]}>Study content and connected passage previews are designed to work from local app data as the library grows.</Text>
        </View>
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  container: {
    alignSelf: "center",
    gap: spacing.xl,
    maxWidth: 430,
    paddingBottom: 128,
    paddingHorizontal: 0,
    paddingTop: spacing.lg,
    width: "88%"
  },
  masthead: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl
  },
  volume: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  header: {
    gap: spacing.sm
  },
  kicker: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  title: {
    ...typography.display
  },
  subtitle: {
    ...typography.body
  },
  infoCard: {
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.lg
  },
  infoTitle: {
    ...typography.sectionTitle,
    fontSize: 22,
    lineHeight: 28
  },
  infoCopy: {
    ...typography.body,
    marginTop: spacing.sm
  }
});
