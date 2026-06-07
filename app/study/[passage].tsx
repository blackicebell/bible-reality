import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AtlasMapCard } from "@/components/AtlasMapCard";
import { BottomNav } from "@/components/BottomNav";
import { CrossReferenceGroupsCard } from "@/components/CrossReferenceGroupsCard";
import { NoticeCard } from "@/components/NoticeCard";
import { ModernLocationCue } from "@/components/ModernLocationCue";
import { ProfilePeopleCard } from "@/components/ProfilePeopleCard";
import { ProfilePlacesCard } from "@/components/ProfilePlacesCard";
import { ShareCardSheet } from "@/components/ShareCardSheet";
import { StepIntoStoryCard } from "@/components/StepIntoStoryCard";
import { StudyCard } from "@/components/StudyCard";
import { StudyNotesCard } from "@/components/StudyNotesCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { getMapById } from "@/utils/mapHelpers";
import { applySacredNames } from "@/utils/sacredNames";
import { getAllRealityProfiles, getRealityProfileById } from "@/utils/realityProfiles";
import {
  defaultCustomSacredNames,
  getCustomSacredNames,
  getSacredNameStyle,
  isSaved,
  markProfileViewed,
  toggleSavedItem,
  type SacredNameMap,
  type SacredNameStyle
} from "@/utils/storage";

function toObservableNarrative(items: string[]) {
  if (!items.length) {
    return "";
  }

  const [first, second, third] = items;
  const opening = first.endsWith(".") ? first : `${first}.`;
  const middle = second ? ` ${second.endsWith(".") ? second : `${second}.`}` : "";
  const closing = third ? ` ${third.endsWith(".") ? third : `${third}.`}` : "";

  return `${opening}${middle}${closing}`;
}

export default function StudyDetailScreen() {
  const { openRef, passage } = useLocalSearchParams<{ openRef?: string; passage: string }>();
  const profile = getRealityProfileById(passage ?? "") ?? getAllRealityProfiles()[0];
  const map = profile.mapId ? getMapById(profile.mapId) : undefined;
  const [sacredNameStyle, setSacredNameStyle] = useState<SacredNameStyle>("traditional");
  const [customNames, setCustomNames] = useState<SacredNameMap>(defaultCustomSacredNames);
  const [saved, setSaved] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const sacred = (text: string | undefined) => applySacredNames(text, sacredNameStyle, customNames);
  const observableReality = sacred(toObservableNarrative(profile.notice));
  const primaryPlace = profile.placesDetails[0];

  useEffect(() => {
    getSacredNameStyle().then(setSacredNameStyle);
    getCustomSacredNames().then(setCustomNames);
    isSaved(profile.id, "passage").then(setSaved);
    markProfileViewed({
      id: profile.id,
      title: profile.title,
      subtitle: profile.reference
    });
  }, [profile.id]);

  async function toggleSaved() {
    const next = await toggleSavedItem({
      id: profile.id,
      type: "passage",
      title: profile.title,
      subtitle: profile.reference
    });
    setSaved(next);
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <Stack.Screen options={{ title: profile.title }} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.masthead}>
          <Text style={styles.brand}>Bible Reality</Text>
          <Text style={styles.volume}>{sacred(profile.reference)}</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.reference}>{sacred(profile.reference)}</Text>
            <Text style={styles.title}>{sacred(profile.title)}</Text>
            <Text style={styles.summary}>{sacred(profile.summary)}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable accessibilityLabel="Share passage" onPress={() => setShareVisible(true)} style={styles.saveButton}>
              <Ionicons color={colors.navy} name="share-outline" size={21} />
            </Pressable>
            <Pressable accessibilityLabel="Save passage" onPress={toggleSaved} style={saved ? { ...styles.saveButton, ...styles.savedButton } : styles.saveButton}>
              <Ionicons color={saved ? colors.surface : colors.navy} name={saved ? "bookmark" : "bookmark-outline"} size={22} />
            </Pressable>
          </View>
        </View>

        {primaryPlace ? <ModernLocationCue ancientPlace={primaryPlace.ancientName} modernRegion={primaryPlace.modernRegion} /> : null}
        <StepIntoStoryCard narration={sacred(profile.audioScript)} text={sacred(profile.stepIntoStory)} />
        <NoticeCard text={observableReality} />
        {profile.whyThisMattersInTheStory.length ? (
          <StudyCard title="Why It Matters In The Story">
            {profile.whyThisMattersInTheStory.map((item) => (
              <Text key={item} style={styles.passageText}>{sacred(item)}</Text>
            ))}
          </StudyCard>
        ) : null}
        <ProfilePlacesCard places={profile.placesDetails} />
        {map ? <AtlasMapCard map={map} /> : null}
        <ProfilePeopleCard people={profile.peopleDetails.map((person) => ({ ...person, name: sacred(person.name), role: sacred(person.role), relationships: person.relationships?.map((item) => sacred(item)) }))} />
        <CrossReferenceGroupsCard groups={profile.crossReferenceGroups} initialReference={typeof openRef === "string" ? openRef : undefined} />
        <StudyNotesCard passageId={profile.id} />
      </ScrollView>
      <ShareCardSheet
        body={sacred(profile.summary)}
        onClose={() => setShareVisible(false)}
        reference={sacred(profile.reference)}
        title={sacred(profile.title)}
        visible={shareVisible}
      />
      <BottomNav />
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
    gap: spacing.xl,
    maxWidth: 384,
    paddingHorizontal: 0,
    paddingTop: spacing.lg,
    paddingBottom: 104,
    width: "88%"
  },
  masthead: {
    alignItems: "center",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: spacing.lg,
    paddingTop: spacing.xl
  },
  brand: {
    color: colors.text,
    fontFamily: "Georgia",
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 24
  },
  volume: {
    ...typography.micro,
    color: colors.textMuted,
    textTransform: "uppercase"
  },
  header: {
    alignItems: "flex-start",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    paddingBottom: spacing.xl
  },
  headerCopy: {
    flex: 1
  },
  reference: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  title: {
    ...typography.display,
    color: colors.text,
    flexShrink: 1,
    marginTop: spacing.sm
  },
  summary: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.md
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  headerActions: {
    flexShrink: 0,
    gap: spacing.sm
  },
  savedButton: {
    backgroundColor: colors.ink,
    borderColor: colors.ink
  },
  passageText: {
    ...typography.body,
    color: colors.text
  }
});
