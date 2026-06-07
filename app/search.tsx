import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/BottomNav";
import { BrandWordmark } from "@/components/BrandWordmark";
import { bibleBooks } from "@/data/bibleBooks";
import { spacing } from "@/theme/spacing";
import { useThemeMode } from "@/theme/themeMode";
import { typography } from "@/theme/typography";
import { premiumColumnWidth } from "@/utils/layout";
import { getAllRealityProfiles, searchRealityProfiles } from "@/utils/realityProfiles";

const examples = ["Babel", "Noah", "Eden", "Abram"];
const allProfiles = getAllRealityProfiles();

function getBookName(reference: string) {
  const match = reference.match(/^(\d\s)?[A-Za-z ]+/);
  return match ? match[0].trim() : reference.split(" ")[0];
}

function getReferenceDetail(reference: string, bookName: string) {
  return reference.replace(bookName, "").trim();
}

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [bookQuery, setBookQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const { palette } = useThemeMode();
  const { width } = useWindowDimensions();
  const contentWidth = premiumColumnWidth(width);
  const results = query.trim() ? searchRealityProfiles(query) : allProfiles;
  const visibleResults = results.slice(0, query.trim() ? 12 : 6);
  const hasSearchQuery = query.trim().length > 0;
  const studiesByBook = allProfiles.reduce<Record<string, typeof allProfiles>>((acc, profile) => {
    const bookName = getBookName(profile.reference);
    acc[bookName] = [...(acc[bookName] ?? []), profile];
    return acc;
  }, {});
  const filteredBooks = bibleBooks.filter((book) => book.toLowerCase().includes(bookQuery.trim().toLowerCase()));
  const visibleBooks = bookQuery.trim() ? filteredBooks : filteredBooks.slice(0, 18);
  const selectedStudies = studiesByBook[selectedBook] ?? [];
  const browseByBookSection = (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: palette.text }]}>Browse By Book</Text>
        <Text style={[styles.sectionMeta, { color: palette.gold }]}>Library Shelf</Text>
      </View>
      <View style={[styles.inputRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Ionicons color={palette.textMuted} name="book-outline" size={20} />
        <TextInput
          onChangeText={setBookQuery}
          placeholder="Find a book"
          placeholderTextColor={palette.textSoft}
          style={[styles.input, { color: palette.text }]}
          value={bookQuery}
        />
        {bookQuery ? (
          <Pressable accessibilityLabel="Clear book search" onPress={() => setBookQuery("")}>
            <Ionicons color={palette.textMuted} name="close-circle" size={18} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.bookGrid}>
        {visibleBooks.map((book) => {
          const count = studiesByBook[book]?.length ?? 0;
          const isSelected = selectedBook === book;
          return (
            <Pressable
              key={book}
              onPress={() => setSelectedBook(book)}
              style={{
                ...styles.bookTile,
                backgroundColor: isSelected ? palette.ink : palette.surfaceElevated,
                borderColor: isSelected ? palette.ink : palette.border
              }}
            >
              <Text style={[styles.bookName, { color: isSelected ? "#FFFDF8" : palette.textMuted }]}>{book}</Text>
              <Text style={[styles.bookCount, { color: palette.gold }]}>{count ? `${count}` : "Soon"}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.bookPanel, { borderColor: palette.border }]}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.bookPanelTitle, { color: palette.text }]}>{selectedBook}</Text>
          <Text style={[styles.sectionMeta, { color: palette.textMuted }]}>{selectedStudies.length ? `${selectedStudies.length} Studies` : "Coming Soon"}</Text>
        </View>
        {selectedStudies.length ? (
          <>
            <Text style={[styles.bookPanelIntro, { color: palette.textMuted }]}>Select any study in this book.</Text>
            {selectedStudies.map((profile, index) => (
            <Link href={`/study/${profile.id}`} key={profile.id} asChild>
              <Pressable style={{ ...styles.bookStudyRow, borderTopColor: palette.divider }}>
                <Text style={[styles.studyNumber, { color: palette.gold }]}>{String(index + 1).padStart(2, "0")}</Text>
                <View style={styles.rowCopy}>
                  <Text style={[styles.bookStudyReference, { color: palette.gold }]}>{getReferenceDetail(profile.reference, selectedBook)}</Text>
                  <Text style={[styles.bookStudyTitle, { color: palette.text }]}>{profile.title}</Text>
                </View>
                <Ionicons color={palette.gold} name="chevron-forward" size={17} />
              </Pressable>
            </Link>
            ))}
          </>
        ) : (
          <Text style={[styles.emptyText, { color: palette.textMuted }]}>This book is on the shelf, but studies have not been added here yet.</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={[styles.safe, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={[styles.container, { width: contentWidth }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.masthead, { borderBottomColor: palette.divider }]}>
          <BrandWordmark color={palette.text} />
          <Text style={[styles.volume, { color: palette.textMuted }]}>SEARCH</Text>
        </View>

        <View style={styles.header}>
          <Text style={[styles.kicker, { color: palette.gold }]}>Find A Study</Text>
          <Text style={[styles.title, { color: palette.text }]}>Search the growing library.</Text>
          <Text style={[styles.subtitle, { color: palette.textMuted }]}>Look up a passage, person, place, event, or modern region.</Text>
        </View>

        <View style={[styles.searchPanel, { borderColor: palette.border }]}>
          <View style={[styles.inputRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Ionicons color={palette.textMuted} name="search-outline" size={20} />
            <TextInput
              onChangeText={setQuery}
              placeholder="Search studies"
              placeholderTextColor={palette.textSoft}
              style={[styles.input, { color: palette.text }]}
              value={query}
            />
            {query ? (
              <Pressable accessibilityLabel="Clear search" onPress={() => setQuery("")}>
                <Ionicons color={palette.textMuted} name="close-circle" size={18} />
              </Pressable>
            ) : null}
          </View>
          <View style={styles.chips}>
            {examples.map((example) => (
              <Pressable key={example} onPress={() => setQuery(example)} style={[styles.chip, { borderBottomColor: palette.divider }]}>
                <Text style={[styles.chipText, { color: palette.text }]}>{example}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {!hasSearchQuery ? browseByBookSection : null}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>{hasSearchQuery ? "Matching Studies" : "Recent Studies"}</Text>
          <Text style={[styles.sectionNote, { color: palette.textMuted }]}>{hasSearchQuery ? `${results.length} studies found` : "A small starting shelf if you want to jump right in."}</Text>
          {visibleResults.length ? (
            visibleResults.map((profile) => (
              <Link href={`/study/${profile.id}`} key={profile.id} asChild>
                <Pressable style={{ ...styles.row, backgroundColor: palette.surfaceElevated, borderColor: palette.border }}>
                  <View style={styles.rowCopy}>
                    <Text style={[styles.rowTitle, { color: palette.text }]}>{profile.title}</Text>
                    <Text style={[styles.rowSubtitle, { color: palette.gold }]}>{profile.reference}</Text>
                    <Text style={[styles.rowContext, { color: palette.textMuted }]}>{profile.currentStory}</Text>
                  </View>
                  <Ionicons color={palette.gold} name="chevron-forward" size={18} />
                </Pressable>
              </Link>
            ))
          ) : (
            <View style={[styles.emptyRow, { borderColor: palette.border }]}>
              <Text style={[styles.emptyText, { color: palette.textMuted }]}>No studies match that search yet.</Text>
            </View>
          )}
        </View>

        {hasSearchQuery ? browseByBookSection : null}
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
  searchPanel: {
    borderRadius: 2,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  inputRow: {
    alignItems: "center",
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 54,
    paddingHorizontal: spacing.md
  },
  input: {
    ...typography.body,
    flex: 1
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  chip: {
    borderBottomWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  chipText: {
    ...typography.small,
    fontWeight: "800"
  },
  section: {
    gap: spacing.md
  },
  sectionHeaderRow: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    ...typography.sectionTitle
  },
  sectionMeta: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  sectionNote: {
    ...typography.small,
    marginTop: -8
  },
  row: {
    alignItems: "flex-start",
    borderRadius: 2,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    minHeight: 112,
    padding: spacing.lg
  },
  rowCopy: {
    flex: 1,
    minWidth: 0
  },
  rowTitle: {
    ...typography.sectionTitle,
    fontSize: 21,
    lineHeight: 28
  },
  rowSubtitle: {
    ...typography.micro,
    marginTop: spacing.sm,
    textTransform: "uppercase"
  },
  rowContext: {
    ...typography.small,
    marginTop: 3
  },
  emptyRow: {
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.lg
  },
  emptyText: {
    ...typography.body
  },
  bookGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  bookTile: {
    borderRadius: 2,
    borderWidth: 1,
    minHeight: 58,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    width: "31.5%"
  },
  bookName: {
    ...typography.small,
    fontWeight: "800"
  },
  bookCount: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 14,
    marginTop: spacing.xs,
    textTransform: "uppercase"
  },
  bookPanel: {
    borderRadius: 2,
    borderWidth: 1,
    padding: spacing.lg
  },
  bookPanelTitle: {
    ...typography.sectionTitle,
    fontSize: 22,
    lineHeight: 28
  },
  bookPanelIntro: {
    ...typography.small,
    marginTop: -6
  },
  bookStudyRow: {
    alignItems: "flex-start",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.md
  },
  studyNumber: {
    ...typography.micro,
    minWidth: 18,
    paddingTop: 3,
    textTransform: "uppercase"
  },
  bookStudyReference: {
    ...typography.micro,
    textTransform: "uppercase"
  },
  bookStudyTitle: {
    ...typography.body,
    fontFamily: "Georgia",
    fontSize: 18,
    lineHeight: 24
  }
});
