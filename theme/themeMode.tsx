import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { colors } from "@/theme/colors";
import { getThemeMode, setThemeMode as persistThemeMode, type ThemeMode } from "@/utils/storage";

const lightPalette = {
  background: "#F6F0E8",
  surface: "#FFFDF8",
  surfaceElevated: "#FBF6EE",
  raised: "#EFE6DA",
  text: "#241915",
  textMuted: "#6F625B",
  textSoft: "#A19790",
  border: "rgba(36, 25, 21, 0.14)",
  divider: "rgba(36, 25, 21, 0.12)",
  gold: "#9E7448",
  goldSoft: "rgba(158, 116, 72, 0.12)",
  olive: "#67705A",
  oliveSoft: "rgba(103, 112, 90, 0.13)",
  ink: "#17130F",
  inkSoft: "rgba(23, 19, 15, 0.72)",
  navy: "#241915",
  navySoft: "#F2E9DD",
  route: "#B58C5A",
  danger: "#A45144",
  whiteWash: "rgba(255, 255, 255, 0.78)",
  shadow: "#241915"
};

const darkPalette = {
  background: "#11100E",
  surface: "#181613",
  surfaceElevated: "#1F1C18",
  raised: "#29251F",
  text: "#F2ECE3",
  textMuted: "#B8AEA3",
  textSoft: "#80776E",
  border: "rgba(242, 236, 227, 0.15)",
  divider: "rgba(242, 236, 227, 0.13)",
  gold: "#C7A16D",
  goldSoft: "rgba(199, 161, 109, 0.16)",
  olive: "#A8AD8D",
  oliveSoft: "rgba(168, 173, 141, 0.16)",
  ink: "#070605",
  inkSoft: "rgba(244, 237, 228, 0.76)",
  navy: "#F4EDE4",
  navySoft: "#241F1A",
  route: "#C7A16D",
  danger: "#D48A7B",
  whiteWash: "rgba(255, 255, 255, 0.07)",
  shadow: "#000000"
};

export const palettes = {
  light: lightPalette,
  dark: darkPalette
};

type ThemeContextValue = {
  mode: ThemeMode;
  palette: typeof lightPalette;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyPalette(mode: ThemeMode) {
  Object.assign(colors, palettes[mode]);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    getThemeMode().then((storedMode) => {
      applyPalette(storedMode);
      setModeState(storedMode);
    });
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    palette: palettes[mode],
    async setMode(nextMode) {
      applyPalette(nextMode);
      setModeState(nextMode);
      await persistThemeMode(nextMode);
    },
    async toggleMode() {
      const nextMode = mode === "dark" ? "light" : "dark";
      applyPalette(nextMode);
      setModeState(nextMode);
      await persistThemeMode(nextMode);
    }
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return value;
}
