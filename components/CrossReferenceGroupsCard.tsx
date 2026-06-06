import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { getKjvPassage, type KjvPassage } from "@/utils/kjvPassages";

type CrossReferenceGroups = Record<string, string[]>;

const labels: Record<string, string> = {
  earlierBackground: "Earlier Background",
  directlyRelatedEvents: "Directly Related Events",
  laterReferences: "Later References",
  newTestamentReferences: "New Testament References"
};

export function CrossReferenceGroupsCard({ groups, initialReference }: { groups: CrossReferenceGroups; initialReference?: string }) {
  const [selected, setSelected] = useState<KjvPassage | null>(null);
  const entries = Object.entries(groups).filter(([, refs]) => refs.length);

  useEffect(() => {
    if (initialReference) {
      openReference(initialReference);
    }
  }, [initialReference]);

  if (!entries.length) {
    return null;
  }

  function openReference(ref: string) {
    setSelected(
      getKjvPassage(ref) ?? {
        reference: ref,
        translation: "KJV",
        excerpt: "This passage is ready to connect once the full offline KJV dataset is added.",
        note: "The tap behavior is wired. The remaining work is adding the complete KJV text file."
      }
    );
  }

  return (
    <>
      <StudyCard title="Connected Passages">
        {entries.map(([group, refs]) => (
          <View key={group} style={styles.group}>
            <Text style={styles.groupTitle}>{labels[group] ?? group}</Text>
            <View style={styles.refs}>
              {refs.map((ref) => (
                <Pressable
                  accessibilityLabel={`Open ${ref}`}
                  key={`${group}-${ref}`}
                  onPress={() => openReference(ref)}
                  style={({ pressed }) => [styles.refPill, pressed ? styles.refPillPressed : null]}
                >
                  <Text style={styles.refText}>{ref}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </StudyCard>

      <Modal animationType="slide" onRequestClose={() => setSelected(null)} transparent visible={Boolean(selected)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleBlock}>
                <Text style={styles.sheetLabel}>{selected?.translation}</Text>
                <Text style={styles.sheetTitle}>{selected?.reference}</Text>
              </View>
              <Pressable accessibilityLabel="Close passage" onPress={() => setSelected(null)} style={styles.closeButton}>
                <Ionicons color={colors.text} name="close" size={20} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.scripture}>{selected?.excerpt}</Text>
              <Text style={styles.note}>{selected?.note}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm
  },
  groupTitle: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  refs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  refPill: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  refPillPressed: {
    backgroundColor: colors.goldSoft,
    borderColor: colors.gold
  },
  refText: {
    ...typography.small,
    color: colors.text,
    fontWeight: "800"
  },
  modalBackdrop: {
    backgroundColor: "rgba(23,19,15,0.32)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "72%",
    maxWidth: 430,
    overflow: "hidden",
    padding: spacing.lg,
    width: "100%"
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: 999,
    height: 4,
    marginBottom: spacing.lg,
    width: 44
  },
  sheetHeader: {
    alignItems: "flex-start",
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingBottom: spacing.md
  },
  sheetTitleBlock: {
    flex: 1,
    minWidth: 0
  },
  sheetLabel: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  sheetTitle: {
    ...typography.sectionTitle,
    color: colors.text,
    marginTop: spacing.xs
  },
  closeButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 0,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  scripture: {
    ...typography.quote,
    color: colors.text,
    fontSize: 22,
    flexShrink: 1,
    lineHeight: 33
  },
  note: {
    ...typography.small,
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    color: colors.textMuted,
    marginTop: spacing.lg,
    paddingTop: spacing.md
  }
});
