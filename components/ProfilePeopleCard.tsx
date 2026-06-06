import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ProfilePerson = {
  name: string;
  role: string;
  relationships?: string[];
};

export function ProfilePeopleCard({ people }: { people: ProfilePerson[] }) {
  if (!people.length) {
    return null;
  }

  return (
    <StudyCard title="Who Is Involved">
      {people.map((person) => (
        <View key={`${person.name}-${person.role}`} style={styles.item}>
          <Text style={styles.name}>{person.name}</Text>
          <Text style={styles.role}>{person.role}</Text>
          {person.relationships?.length ? <Text style={styles.meta}>{person.relationships.join(" / ")}</Text> : null}
        </View>
      ))}
    </StudyCard>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomColor: colors.divider,
    borderBottomWidth: 1,
    paddingBottom: spacing.md
  },
  name: {
    ...typography.sectionTitle,
    color: colors.text,
    fontSize: 21,
    lineHeight: 27
  },
  role: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: 4
  },
  meta: {
    ...typography.small,
    color: colors.gold,
    marginTop: spacing.xs
  }
});
