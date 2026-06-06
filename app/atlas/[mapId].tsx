import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AtlasMapView } from "@/components/AtlasMapView";
import { getMapById, getPlacesForMap } from "@/utils/mapHelpers";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { isSaved, toggleSavedItem } from "@/utils/storage";

export default function AtlasDetailScreen() {
  const { mapId } = useLocalSearchParams<{ mapId: string }>();
  const map = getMapById(mapId ?? "patriarchs") ?? getMapById("patriarchs")!;
  const places = getPlacesForMap(map);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    isSaved(map.id, "map").then(setSaved);
  }, [map.id]);

  async function toggleSaved() {
    const next = await toggleSavedItem({
      id: map.id,
      type: "map",
      title: map.title,
      subtitle: map.category
    });
    setSaved(next);
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <Stack.Screen options={{ title: map.title }} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.kicker}>{map.category}</Text>
            <Text style={styles.title}>{map.title}</Text>
            <Text style={styles.subtitle}>{map.passage}</Text>
          </View>
          <Pressable accessibilityLabel="Save map" onPress={toggleSaved} style={saved ? { ...styles.saveButton, ...styles.savedButton } : styles.saveButton}>
            <Ionicons color={saved ? colors.surface : colors.navy} name={saved ? "bookmark" : "bookmark-outline"} size={22} />
          </Pressable>
        </View>
        <AtlasMapView map={map} />
        <View style={styles.placeList}>
          <Text style={styles.sectionTitle}>Places on this map</Text>
          {places.map((place) => (
            <View key={place.id} style={styles.placeRow}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeRegion}>{place.region}</Text>
            </View>
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
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingTop: spacing.md
  },
  headerCopy: {
    flex: 1
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
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  savedButton: {
    backgroundColor: colors.navy,
    borderColor: colors.navy
  },
  placeList: {
    gap: spacing.sm
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text
  },
  placeRow: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: spacing.md
  },
  placeName: {
    ...typography.body,
    color: colors.text,
    fontWeight: "800"
  },
  placeRegion: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2
  }
});
