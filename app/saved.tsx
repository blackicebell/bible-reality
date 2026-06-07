import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { BottomNav } from "@/components/BottomNav";
import { BrandWordmark } from "@/components/BrandWordmark";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { premiumColumnWidth } from "@/utils/layout";
import { getAllRealityProfiles, getRealityProfileById } from "@/utils/realityProfiles";
import { deleteStudyNote, getSavedItems, getStudyNotes, removeSavedItem, SavedItem, StudyNote } from "@/utils/storage";

const allProfiles = getAllRealityProfiles();

function titleForNote(note: StudyNote) {
  const profile = getRealityProfileById(note.passageId);
  return profile?.title ?? note.passageId;
}

function subtitleForNote(note: StudyNote) {
  const profile = getRealityProfileById(note.passageId);
  return profile?.reference ?? "Study note";
}

export default function SavedScreen() {
  const [savedStudies, setSavedStudies] = useState<SavedItem[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const { width } = useWindowDimensions();
  const contentWidth = premiumColumnWidth(width);

  const refresh = useCallback(() => {
    getSavedItems().then((items) => setSavedStudies(items.filter((item) => item.type === "passage")));
    getStudyNotes().then(setNotes);
  }, []);

  useFocusEffect(refresh);

  async function deleteSavedStudy(item: SavedItem) {
    await removeSavedItem(item.id, item.type);
    refresh();
  }

  async function deleteNote(passageId: string) {
    await deleteStudyNote(passageId);
    refresh();
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.container, { width: contentWidth }]} showsVerticalScrollIndicator={false}>
        <View style={styles.masthead}>
          <BrandWordmark color={colors.text} />
          <Text style={styles.volume}>SAVED</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.kicker}>Your Library</Text>
          <Text style={styles.title}>Saved studies and notes.</Text>
          <Text style={styles.subtitle}>Return to what matters, edit notes, or remove anything you no longer need.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Studies</Text>
          {savedStudies.length ? (
            savedStudies.map((item) => (
              <View key={`${item.type}-${item.id}`} style={styles.itemRow}>
                <Pressable onPress={() => router.push(`/study/${item.id}`)} style={styles.itemMain}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  {item.subtitle ? <Text style={styles.rowSubtitle}>{item.subtitle}</Text> : null}
                </Pressable>
                <Pressable accessibilityLabel={`Remove ${item.title}`} onPress={() => deleteSavedStudy(item)} style={styles.iconButton}>
                  <Ionicons color={colors.textMuted} name="trash-outline" size={18} />
                </Pressable>
              </View>
            ))
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>Tap the bookmark on any study to save it here.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Notes</Text>
          {notes.length ? (
            notes.map((note) => (
              <View key={note.passageId} style={styles.noteRow}>
                <Pressable onPress={() => router.push(`/study/${note.passageId}`)} style={styles.itemMain}>
                  <Text style={styles.rowTitle}>{titleForNote(note)}</Text>
                  <Text style={styles.rowSubtitle}>{subtitleForNote(note)}</Text>
                  <Text numberOfLines={3} style={styles.noteText}>{note.text}</Text>
                  <Text style={styles.editHint}>Open study to edit</Text>
                </Pressable>
                <Pressable accessibilityLabel={`Delete note for ${titleForNote(note)}`} onPress={() => deleteNote(note.passageId)} style={styles.iconButton}>
                  <Ionicons color={colors.textMuted} name="trash-outline" size={18} />
                </Pressable>
              </View>
            ))
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>Notes you write inside a study will appear here.</Text>
            </View>
          )}
        </View>

        {!savedStudies.length && !notes.length ? (
          <Link href={`/study/${allProfiles[0].id}`} asChild>
            <Pressable style={styles.startButton}>
              <Text style={styles.startButtonText}>Open First Study</Text>
              <Ionicons color={colors.surface} name="arrow-forward" size={17} />
            </Pressable>
          </Link>
        ) : null}
      </ScrollView>
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
    maxWidth: 430,
    paddingBottom: 128,
    paddingHorizontal: 0,
    paddingTop: spacing.lg,
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
  volume: {
    ...typography.micro,
    color: colors.textMuted,
    textTransform: "uppercase"
  },
  header: {
    gap: spacing.sm
  },
  kicker: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  title: {
    ...typography.display,
    color: colors.text
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text
  },
  itemRow: {
    alignItems: "flex-start",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.md
  },
  noteRow: {
    alignItems: "flex-start",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    paddingBottom: spacing.md
  },
  itemMain: {
    flex: 1,
    minWidth: 0
  },
  rowTitle: {
    ...typography.sectionTitle,
    color: colors.text,
    fontSize: 20,
    lineHeight: 26
  },
  rowSubtitle: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 3
  },
  noteText: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm
  },
  editHint: {
    ...typography.micro,
    color: colors.gold,
    marginTop: spacing.sm,
    textTransform: "uppercase"
  },
  iconButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  emptyRow: {
    borderColor: colors.border,
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.lg
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted
  },
  startButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.ink,
    borderRadius: 999,
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  startButtonText: {
    ...typography.micro,
    color: colors.surface,
    textTransform: "uppercase"
  }
});
