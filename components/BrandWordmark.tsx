import { StyleSheet, Text, View } from "react-native";

type BrandWordmarkProps = {
  color: string;
};

export function BrandWordmark({ color }: BrandWordmarkProps) {
  return (
    <View accessibilityLabel="Bible Reality" style={styles.wordmark}>
      <Text numberOfLines={1} style={[styles.light, { color }]}>Bible</Text>
      <Text numberOfLines={1} style={[styles.strong, { color }]}>Reality</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wordmark: {
    alignItems: "baseline",
    flexDirection: "row",
    flexShrink: 0,
    gap: 4
  },
  light: {
    fontFamily: "Georgia",
    fontSize: 18,
    fontStyle: "italic",
    lineHeight: 24
  },
  strong: {
    fontFamily: "Georgia",
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "700",
    lineHeight: 24
  }
});
