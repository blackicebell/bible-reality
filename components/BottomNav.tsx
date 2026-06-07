import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeMode } from "@/theme/themeMode";
import { premiumBottomNavWidth } from "@/utils/layout";

type IconName = keyof typeof Ionicons.glyphMap;
type MainRoute = "/" | "/search" | "/saved" | "/settings";

const items: Array<{ href: MainRoute; icon: IconName; label: string; match: MainRoute }> = [
  { href: "/", icon: "book-outline", label: "Home", match: "/" },
  { href: "/search", icon: "search-outline", label: "Search", match: "/search" },
  { href: "/saved", icon: "bookmark-outline", label: "Saved", match: "/saved" },
  { href: "/settings", icon: "settings-outline", label: "Settings", match: "/settings" }
];

export function BottomNav() {
  const pathname = usePathname();
  const { mode, palette } = useThemeMode();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const navWidth = premiumBottomNavWidth(width);
  const bottomOffset = Math.max(insets.bottom + 10, 18);
  const navBackground = mode === "dark" ? "#070605" : palette.ink;
  const activeColor = "#FFFDF8";
  const inactiveColor = mode === "dark" ? "rgba(255,253,248,0.72)" : "rgba(255,253,248,0.7)";

  return (
    <View style={[styles.nav, { backgroundColor: navBackground, borderColor: mode === "dark" ? "rgba(255,253,248,0.16)" : "rgba(255,253,248,0.08)", bottom: bottomOffset, shadowColor: palette.shadow, width: navWidth }]}>
      {items.map((item) => {
        const active = pathname === item.match;
        return (
          <Pressable key={item.href} onPress={() => router.replace(item.href as Href)} style={styles.item}>
            <Ionicons color={active ? activeColor : inactiveColor} name={item.icon} size={23} />
            <Text numberOfLines={1} style={[styles.label, { color: active ? activeColor : inactiveColor }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignItems: "center",
    alignSelf: "center",
    borderColor: "rgba(255,253,248,0.08)",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    height: 74,
    justifyContent: "space-around",
    paddingHorizontal: 10,
    position: "absolute",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 22
  },
  item: {
    alignItems: "center",
    flex: 1,
    gap: 5,
    justifyContent: "center",
    minWidth: 0
  },
  label: {
    color: "rgba(255,253,248,0.7)",
    fontSize: 10,
    fontWeight: "900",
    lineHeight: 14
  }
});
