import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ProfilePlace = {
  ancientName: string;
  modernRegion: string;
  description: string;
};

export function ProfilePlacesCard({ places }: { places: ProfilePlace[] }) {
  if (!places.length) {
    return null;
  }

  return (
    <StudyCard title="Where This Happens">
      {places.map((place) => (
        <View key={`${place.ancientName}-${place.modernRegion}`} style={styles.item}>
          <Text style={styles.name}>{place.ancientName}</Text>
          <Text style={styles.region}>{place.modernRegion}</Text>
          <Text style={styles.description}>{place.description}</Text>
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
  region: {
    ...typography.micro,
    color: colors.gold,
    marginTop: spacing.xs,
    textTransform: "uppercase"
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs
  }
});
