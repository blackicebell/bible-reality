import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import people from "@/data/people.json";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

export function KeyPeopleCard({ peopleIds }: { peopleIds: string[] }) {
  const selected = peopleIds.map((id) => people.find((person) => person.id === id)).filter(Boolean) as typeof people;

  return (
    <StudyCard title="Key People" eyebrow="People involved">
      {selected.map((person) => (
        <View key={person.id} style={styles.person}>
          <Text style={styles.name}>{person.name}</Text>
          {person.facts.map((fact) => (
            <Text key={fact} style={styles.fact}>• {fact}</Text>
          ))}
        </View>
      ))}
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  person: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md
  },
  name: {
    ...typography.body,
    color: colors.text,
    fontWeight: "800",
    marginBottom: spacing.xs
  },
  fact: {
    ...typography.body,
    color: colors.textMuted
  }
});
