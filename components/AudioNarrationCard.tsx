import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";
import { getNarrationSpeechOptions } from "@/utils/speech";

export function AudioNarrationCard({ script, title }: { script: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  async function toggleAudio() {
    if (playing) {
      Speech.stop();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    const narrationOptions = await getNarrationSpeechOptions();
    Speech.speak(script, {
      ...narrationOptions,
      onDone: () => setPlaying(false),
      onStopped: () => setPlaying(false),
      onError: () => setPlaying(false)
    });
  }

  return (
    <StudyCard title="Audio" eyebrow="Documentary narration">
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>Device text-to-speech. Offline, factual, and non-interpretive.</Text>
        </View>
        <Pressable accessibilityLabel={playing ? "Stop audio narration" : "Play audio narration"} onPress={toggleAudio} style={styles.button}>
          <Ionicons color={colors.surface} name={playing ? "stop" : "play"} size={18} />
        </Pressable>
      </View>
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  copy: {
    flex: 1
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontWeight: "900"
  },
  description: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 3
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.navy,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    width: 48
  }
});
