import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import passageMaps from "@/data/passageMaps.json";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

const categories = [
  "Ancient Near East",
  "Patriarchs",
  "Exodus",
  "Twelve Tribes",
  "United Kingdom",
  "Divided Kingdom",
  "Exile & Return",
  "Yahshua's Ministry",
  "Acts & Paul's Journeys"
];

export default function AtlasScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Offline atlas</Text>
          <Text style={styles.title}>Maps that follow the story.</Text>
        </View>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <View key={category} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
        <View style={styles.list}>
          {passageMaps.map((map) => (
            <Link href={`/atlas/${map.id}`} key={map.id} asChild>
              <Pressable style={styles.mapCard}>
                <View>
                  <Text style={styles.mapCategory}>{map.category}</Text>
                  <Text style={styles.mapTitle}>{map.title}</Text>
                  <Text style={styles.mapSubtitle}>{map.passage}</Text>
                </View>
                <Ionicons color={colors.textMuted} name="chevron-forward" size={18} />
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1
  },
  container: {
    alignSelf: "center",
    gap: spacing.lg,
    maxWidth: 390,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    width: "100%"
  },
  header: {
    paddingTop: spacing.md
  },
  kicker: {
    ...typography.small,
    color: colors.gold,
    textTransform: "uppercase"
  },
  title: {
    ...typography.title,
    color: colors.text,
    flexShrink: 1,
    marginTop: spacing.xs
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  categoryPill: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  categoryText: {
    ...typography.small,
    color: colors.text
  },
  list: {
    gap: spacing.sm
  },
  mapCard: {
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing.lg
  },
  mapCategory: {
    ...typography.small,
    color: colors.olive
  },
  mapTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: "800",
    marginTop: 3
  },
  mapSubtitle: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2
  }
});
