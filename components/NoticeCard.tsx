import { StyleSheet, Text } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export function NoticeCard({ text }: { text: string }) {
  return (
    <StudyCard title="What Would Stand Out">
      <Text style={styles.text}>{text}</Text>
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.body,
    color: colors.text
  }
});
