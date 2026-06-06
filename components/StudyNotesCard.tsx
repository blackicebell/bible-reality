import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { StudyCard } from "@/components/StudyCard";
import { getStudyNote, saveStudyNote } from "@/utils/storage";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function StudyNotesCard({ passageId }: { passageId: string }) {
  const [text, setText] = useState("");
  const [lastSavedText, setLastSavedText] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const hasChanges = text !== lastSavedText;
  const hasSavedNote = Boolean(lastSavedText.trim());
  const saveLabel = status === "saved" || (!hasChanges && hasSavedNote) ? "Saved" : "Save Note";

  useEffect(() => {
    getStudyNote(passageId).then((note) => {
      setText(note.text);
      setLastSavedText(note.text);
      setUpdatedAt(note.updatedAt);
    });
  }, [passageId]);

  async function saveNote() {
    const note = await saveStudyNote(passageId, text);
    setLastSavedText(note.text);
    setUpdatedAt(note.updatedAt);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <StudyCard title="Study Notes">
      <TextInput
        multiline
        onChangeText={(value) => {
          setText(value);
          setStatus("idle");
        }}
        placeholder="Add a short note for this passage."
        placeholderTextColor={colors.textSoft}
        style={styles.input}
        textAlignVertical="top"
        value={text}
      />
      <View style={styles.footer}>
        <Text style={styles.timestamp}>{updatedAt ? `Last saved ${new Date(updatedAt).toLocaleString()}` : "Not saved yet"}</Text>
        <Pressable disabled={!hasChanges} onPress={saveNote} style={hasChanges ? styles.saveButton : { ...styles.saveButton, ...styles.saveButtonDisabled }}>
          <Ionicons color={hasChanges ? colors.surface : colors.textMuted} name={status === "saved" ? "checkmark" : "save-outline"} size={16} />
          <Text style={hasChanges ? styles.saveText : { ...styles.saveText, ...styles.saveTextDisabled }}>{saveLabel}</Text>
        </Pressable>
      </View>
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    minHeight: 130,
    padding: spacing.md
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  timestamp: {
    ...typography.small,
    color: colors.textMuted,
    flex: 1
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 999,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 38,
    paddingHorizontal: spacing.md
  },
  saveButtonDisabled: {
    backgroundColor: colors.raised
  },
  saveText: {
    ...typography.small,
    color: colors.surface,
    fontWeight: "800"
  },
  saveTextDisabled: {
    color: colors.textMuted
  }
});
