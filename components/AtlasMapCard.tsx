import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AtlasMapView } from "@/components/AtlasMapView";
import { PassageMap } from "@/utils/mapHelpers";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function AtlasMapCard({ map }: { map: PassageMap }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Offline atlas</Text>
          <Text style={styles.title}>Places Mentioned</Text>
          <Text style={styles.subtitle}>{map.title}</Text>
        </View>
        <View style={styles.compass}>
          <Ionicons color={colors.gold} name="compass-outline" size={22} />
        </View>
      </View>
      <AtlasMapView compact map={map} />
      <Link href={`/atlas/${map.id}`} asChild>
        <Pressable style={styles.cta}>
          <Text style={styles.ctaText}>Open Atlas Map</Text>
          <Ionicons color={colors.surface} name="map-outline" size={18} />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: spacing.md,
    overflow: "hidden",
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 18,
    elevation: 2
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  eyebrow: {
    ...typography.small,
    color: colors.gold,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text,
    marginTop: 2
  },
  subtitle: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2
  },
  compass: {
    alignItems: "center",
    backgroundColor: colors.goldSoft,
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  cta: {
    alignItems: "center",
    backgroundColor: colors.navy,
    borderRadius: 10,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: spacing.md
  },
  ctaText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: "800"
  }
});
