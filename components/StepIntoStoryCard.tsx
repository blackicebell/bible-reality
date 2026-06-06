import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type StepIntoStoryCardProps = {
  narration: string;
  text: string;
};

export function StepIntoStoryCard({ narration, text }: StepIntoStoryCardProps) {
  const [playing, setPlaying] = useState(false);

  function toggleAudio() {
    if (playing) {
      Speech.stop();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    Speech.speak(narration, {
      pitch: 0.95,
      rate: 0.86,
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false)
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Step Into The Story</Text>
        </View>
        <Pressable accessibilityLabel={playing ? "Stop documentary narration" : "Play documentary narration"} onPress={toggleAudio} style={styles.playButton}>
          <Ionicons color={colors.ink} name={playing ? "stop" : "play"} size={18} />
        </Pressable>
      </View>
      <Text style={styles.copy}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2E261F",
    borderColor: "rgba(255,253,248,0.1)",
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    shadowColor: colors.shadow,
    shadowOpacity: 0.11,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 }
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  title: {
    ...typography.sectionTitle,
    color: colors.surface
  },
  playButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 48,
    justifyContent: "center",
    width: 48
  },
  copy: {
    ...typography.body,
    borderTopColor: "rgba(255,253,248,0.14)",
    borderTopWidth: 1,
    color: "rgba(255,253,248,0.82)",
    marginTop: spacing.lg,
    paddingTop: spacing.lg
  }
});
