import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import { Alert, Modal, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";

import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";
import { typography } from "@/theme/typography";

type ShareFormat = "square" | "portrait";

type SharePalette = {
  name: string;
  background: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
};

const sharePalettes: SharePalette[] = [
  {
    name: "Parchment",
    background: "#FFF7EA",
    border: "rgba(120, 80, 42, 0.24)",
    text: "#281A12",
    muted: "#705F52",
    accent: "#9E7448"
  },
  {
    name: "Ink",
    background: "#17130F",
    border: "rgba(255, 253, 248, 0.22)",
    text: "#FFFDF8",
    muted: "#D8CBBB",
    accent: "#D6B17B"
  },
  {
    name: "Olive",
    background: "#EFF1E8",
    border: "rgba(67, 79, 54, 0.22)",
    text: "#202719",
    muted: "#65705A",
    accent: "#67705A"
  }
];

export function ShareCardSheet({
  body,
  onClose,
  reference,
  title,
  visible
}: {
  body: string;
  onClose: () => void;
  reference: string;
  title?: string;
  visible: boolean;
}) {
  const cardRef = useRef<View>(null);
  const [format, setFormat] = useState<ShareFormat>("portrait");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const palette = sharePalettes[paletteIndex];
  const plainMessage = `${title ? `${title}\n` : ""}${body}\n\n${reference} - Bible Reality`;

  async function shareCard() {
    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
        result: "tmpfile"
      });

      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          dialogTitle: "Share Bible Reality card",
          mimeType: "image/png",
          UTI: "public.png"
        });
        return;
      }

      await Share.share({ message: plainMessage });
    } catch {
      try {
        await Share.share({ message: plainMessage });
      } catch {
        Alert.alert("Share unavailable", "This card could not be prepared on this device.");
      }
    }
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.header}>
            <View style={styles.titleBlock}>
              <Text style={styles.label}>Share Card</Text>
              <Text style={styles.title}>{reference}</Text>
            </View>
            <Pressable accessibilityLabel="Close share card" onPress={onClose} style={styles.closeButton}>
              <Ionicons color={colors.text} name="close" size={20} />
            </Pressable>
          </View>

          <View
            ref={cardRef}
            collapsable={false}
            style={[
              styles.card,
              format === "portrait" ? styles.cardPortrait : styles.cardSquare,
              { backgroundColor: palette.background, borderColor: palette.border }
            ]}
          >
            <View style={[styles.cardRule, { backgroundColor: palette.accent }]} />
            {title ? <Text style={[styles.cardTitle, { color: palette.accent }]}>{title}</Text> : null}
            <Text style={[styles.cardBody, { color: palette.text }]} numberOfLines={format === "portrait" ? 9 : 7}>
              {body}
            </Text>
            <View style={[styles.cardFooter, { borderTopColor: palette.border }]}>
              <Text style={[styles.cardReference, { color: palette.accent }]}>{reference}</Text>
              <Text style={[styles.cardBrand, { color: palette.muted }]}>Bible Reality</Text>
            </View>
          </View>

          <View style={styles.paletteRow}>
            {sharePalettes.map((item, index) => (
              <Pressable
                accessibilityLabel={`Use ${item.name} share style`}
                key={item.name}
                onPress={() => setPaletteIndex(index)}
                style={[
                  styles.swatch,
                  { backgroundColor: item.background, borderColor: paletteIndex === index ? colors.ink : item.border }
                ]}
              />
            ))}
          </View>

          <View style={styles.formatRow}>
            {(["square", "portrait"] as ShareFormat[]).map((item) => (
              <Pressable
                accessibilityLabel={`Use ${item} share format`}
                key={item}
                onPress={() => setFormat(item)}
                style={[styles.formatOption, format === item ? styles.formatOptionActive : null]}
              >
                <Text style={[styles.formatText, format === item ? styles.formatTextActive : null]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable accessibilityRole="button" onPress={shareCard} style={styles.primaryAction}>
            <Ionicons color={colors.surface} name="share-outline" size={18} />
            <Text style={styles.primaryText}>Share</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(23,19,15,0.32)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxWidth: 430,
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
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.lg
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  label: {
    ...typography.micro,
    color: colors.gold,
    textTransform: "uppercase"
  },
  title: {
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
  card: {
    alignSelf: "center",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "space-between",
    maxWidth: "100%",
    overflow: "hidden",
    padding: spacing.xl,
    width: 304
  },
  cardSquare: {
    aspectRatio: 1
  },
  cardPortrait: {
    aspectRatio: 0.76
  },
  cardRule: {
    height: 3,
    width: 46
  },
  cardTitle: {
    ...typography.micro,
    marginTop: spacing.lg,
    textTransform: "uppercase"
  },
  cardBody: {
    ...typography.quote,
    flexShrink: 1,
    fontSize: 21,
    lineHeight: 31,
    marginTop: spacing.md
  },
  cardFooter: {
    borderTopWidth: 1,
    gap: spacing.xs,
    marginTop: spacing.xl,
    paddingTop: spacing.md
  },
  cardReference: {
    ...typography.small,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  cardBrand: {
    ...typography.small
  },
  paletteRow: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    marginTop: spacing.lg
  },
  swatch: {
    borderRadius: 999,
    borderWidth: 2,
    height: 32,
    width: 32
  },
  formatRow: {
    backgroundColor: colors.background,
    borderRadius: 8,
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.lg,
    padding: spacing.xs
  },
  formatOption: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  formatOptionActive: {
    backgroundColor: colors.surface
  },
  formatText: {
    ...typography.small,
    color: colors.textMuted,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  formatTextActive: {
    color: colors.text
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: colors.ink,
    borderRadius: 8,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
    marginTop: spacing.md,
    minHeight: 52
  },
  primaryText: {
    ...typography.small,
    color: colors.surface,
    fontWeight: "800",
    textTransform: "uppercase"
  }
});
