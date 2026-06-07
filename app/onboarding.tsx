import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { spacing } from "@/theme/spacing";
import { useThemeMode } from "@/theme/themeMode";
import { typography } from "@/theme/typography";
import { getAllRealityProfiles, searchRealityProfiles } from "@/utils/realityProfiles";
import { markOnboardingSeen } from "@/utils/storage";

const slides = [
  {
    kicker: "Bible Reality",
    title: "Read with the world of the passage in view.",
    copy: "Each study gives you people, places, modern orientation, connected passages, and notes without needing a live map."
  },
  {
    kicker: "Start Anywhere",
    title: "Choose a clear beginning.",
    copy: "Begin at Creation, step into Eden, follow Babel, or search by passage, person, place, or book when you already know what you want."
  },
  {
    kicker: "Keep Your Place",
    title: "Save, note, and return.",
    copy: "Your studies, notes, reading style, and sacred-name preferences stay on this device."
  }
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const { palette } = useThemeMode();
  const slide = slides[index];
  const creation = searchRealityProfiles("Creation")[0] ?? getAllRealityProfiles()[0];

  async function finish(destination: "home" | "search" | "creation") {
    await markOnboardingSeen();
    if (destination === "search") {
      router.replace("/search");
      return;
    }
    if (destination === "creation") {
      router.replace(`/study/${creation.id}`);
      return;
    }
    router.replace("/");
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={[styles.safe, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.masthead, { borderBottomColor: palette.divider }]}>
          <Text style={[styles.brand, { color: palette.text }]}>Bible Reality</Text>
          <Pressable onPress={() => finish("home")}>
            <Text style={[styles.skip, { color: palette.textMuted }]}>SKIP</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={[styles.kicker, { color: palette.gold }]}>{slide.kicker}</Text>
          <Text style={[styles.title, { color: palette.text }]}>{slide.title}</Text>
          <Text style={[styles.copy, { color: palette.textMuted }]}>{slide.copy}</Text>
        </View>

        <View style={[styles.contextCard, { backgroundColor: palette.surfaceElevated, borderColor: palette.border }]}>
          <View style={[styles.iconSeal, { borderColor: palette.border }]}>
            <Ionicons color={palette.gold} name={index === 0 ? "map-outline" : index === 1 ? "compass-outline" : "bookmark-outline"} size={24} />
          </View>
          <Text style={[styles.cardTitle, { color: palette.text }]}>{index === 0 ? "Context before commentary." : index === 1 ? "A first step is always visible." : "Your study stays local."}</Text>
          <Text style={[styles.cardCopy, { color: palette.textMuted }]}>
            {index === 0
              ? "The app is built to help the passage feel located, inhabited, and understandable."
              : index === 1
                ? "Home is for starting points. Search is for finding the exact shelf."
                : "No account is needed for saved studies, notes, preferences, or progress."}
          </Text>
        </View>

        <View style={styles.dots}>
          {slides.map((item, dotIndex) => (
            <View
              key={item.title}
              style={{
                ...styles.dot,
                backgroundColor: dotIndex === index ? palette.gold : palette.divider,
                width: dotIndex === index ? 28 : 8
              }}
            />
          ))}
        </View>

        {index < slides.length - 1 ? (
          <Pressable onPress={() => setIndex(index + 1)} style={[styles.primaryButton, { backgroundColor: palette.ink }]}>
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Ionicons color="#FFFDF8" name="arrow-forward" size={17} />
          </Pressable>
        ) : (
          <View style={styles.actions}>
            <Pressable onPress={() => finish("creation")} style={[styles.primaryButton, { backgroundColor: palette.ink }]}>
              <Text style={styles.primaryButtonText}>Begin At Creation</Text>
              <Ionicons color="#FFFDF8" name="arrow-forward" size={17} />
            </Pressable>
            <Pressable onPress={() => finish("search")} style={[styles.secondaryButton, { borderColor: palette.border }]}>
              <Text style={[styles.secondaryButtonText, { color: palette.text }]}>Open Search</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
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
    maxWidth: 384,
    minHeight: "100%",
    paddingBottom: spacing.xxl,
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
  brand: {
    fontFamily: "Georgia",
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 24
  },
  skip: {
    ...typography.micro
  },
  hero: {
    gap: spacing.sm,
    paddingTop: spacing.xxl
  },
  kicker: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  title: {
    ...typography.display
  },
  copy: {
    ...typography.body
  },
  contextCard: {
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.lg
  },
  iconSeal: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    height: 52,
    justifyContent: "center",
    marginBottom: spacing.lg,
    width: 52
  },
  cardTitle: {
    ...typography.sectionTitle,
    fontSize: 23,
    lineHeight: 29
  },
  cardCopy: {
    ...typography.body,
    marginTop: spacing.sm
  },
  dots: {
    flexDirection: "row",
    gap: spacing.xs
  },
  dot: {
    borderRadius: 999,
    height: 8
  },
  actions: {
    gap: spacing.md
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 2,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    minHeight: 54,
    paddingHorizontal: spacing.lg
  },
  primaryButtonText: {
    ...typography.small,
    color: "#FFFDF8",
    fontWeight: "800",
    textTransform: "uppercase"
  },
  secondaryButton: {
    alignItems: "center",
    borderRadius: 2,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg
  },
  secondaryButtonText: {
    ...typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  }
});
