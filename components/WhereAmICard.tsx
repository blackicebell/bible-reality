import { StyleSheet, Text, View } from "react-native";

import { StudyCard } from "@/components/StudyCard";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type WhereAmIData = {
  book: string;
  era: string;
  mainFigure: string;
  primaryRegion: string;
  timelinePosition: string;
  places: string[];
};

export function WhereAmICard({ data }: { data: WhereAmIData }) {
  return (
    <StudyCard title="Where Am I?" eyebrow="Story location">
      <View style={styles.heroRow}>
        <View>
          <Text style={styles.era}>{data.era}</Text>
          <Text style={styles.position}>{data.timelinePosition}</Text>
        </View>
      </View>
      <View style={styles.grid}>
        <Meta label="Book" value={data.book} />
        <Meta label="Main figure" value={data.mainFigure} />
        <Meta label="Region" value={data.primaryRegion} />
        <Meta label="Places" value={data.places.join(", ")} />
      </View>
    </StudyCard>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.meta}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroRow: {
    backgroundColor: colors.navy,
    borderRadius: 8,
    padding: spacing.lg
  },
  era: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.surface
  },
  position: {
    ...typography.body,
    color: colors.navySoft,
    marginTop: spacing.xs
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  meta: {
    backgroundColor: colors.background,
    borderRadius: 8,
    flexBasis: "48%",
    flexGrow: 1,
    padding: spacing.md
  },
  metaLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: 3
  },
  metaValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: "700"
  }
});
