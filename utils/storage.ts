import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTE_PREFIX = "study-note:";
const SAVED_KEY = "saved-items";
const SACRED_NAMES_KEY = "sacred-names-mode";
const SACRED_NAME_STYLE_KEY = "sacred-name-style";
const CUSTOM_SACRED_NAMES_KEY = "custom-sacred-names";
const RECENT_PROFILES_KEY = "recent-reality-profiles";
const THEME_MODE_KEY = "theme-mode";
const ONBOARDING_SEEN_KEY = "onboarding-seen";

export type SavedItemType = "passage" | "place" | "timeline" | "map";

export type SavedItem = {
  id: string;
  type: SavedItemType;
  title: string;
  subtitle?: string;
  savedAt: string;
};

export type StudyNote = {
  passageId: string;
  text: string;
  updatedAt: string | null;
};

export type RecentProfile = {
  id: string;
  title: string;
  subtitle?: string;
  viewedAt: string;
};

export type ThemeMode = "light" | "dark";
export type SacredNameStyle = "traditional" | "hebrew" | "custom";

export type SacredNameMap = {
  LORD: string;
  GOD: string;
  God: string;
  Lord: string;
  Jesus: string;
  Christ: string;
  "Holy Spirit": string;
};

export const defaultCustomSacredNames: SacredNameMap = {
  LORD: "Yahweh",
  GOD: "Elohim",
  God: "Elohim",
  Lord: "Adonai",
  Jesus: "Yahshua",
  Christ: "Messiah",
  "Holy Spirit": "Ruach HaKodesh"
};

export async function getStudyNote(passageId: string): Promise<StudyNote> {
  const raw = await AsyncStorage.getItem(`${NOTE_PREFIX}${passageId}`);
  if (!raw) {
    return { passageId, text: "", updatedAt: null };
  }
  return JSON.parse(raw) as StudyNote;
}

export async function getStudyNotes(): Promise<StudyNote[]> {
  const keys = await AsyncStorage.getAllKeys();
  const noteKeys = keys.filter((key) => key.startsWith(NOTE_PREFIX));
  if (!noteKeys.length) {
    return [];
  }

  const entries = await AsyncStorage.multiGet(noteKeys);
  return entries
    .map(([, value]) => (value ? (JSON.parse(value) as StudyNote) : null))
    .filter((note): note is StudyNote => Boolean(note?.text.trim()))
    .sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bTime - aTime;
    });
}

export async function saveStudyNote(passageId: string, text: string): Promise<StudyNote> {
  const note = { passageId, text, updatedAt: new Date().toISOString() };
  await AsyncStorage.setItem(`${NOTE_PREFIX}${passageId}`, JSON.stringify(note));
  return note;
}

export async function deleteStudyNote(passageId: string): Promise<void> {
  await AsyncStorage.removeItem(`${NOTE_PREFIX}${passageId}`);
}

export async function getSavedItems(): Promise<SavedItem[]> {
  const raw = await AsyncStorage.getItem(SAVED_KEY);
  return raw ? (JSON.parse(raw) as SavedItem[]) : [];
}

export async function toggleSavedItem(item: Omit<SavedItem, "savedAt">): Promise<boolean> {
  const saved = await getSavedItems();
  const exists = saved.some((entry) => entry.id === item.id && entry.type === item.type);
  const next = exists
    ? saved.filter((entry) => !(entry.id === item.id && entry.type === item.type))
    : [{ ...item, savedAt: new Date().toISOString() }, ...saved];

  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return !exists;
}

export async function removeSavedItem(id: string, type: SavedItemType): Promise<void> {
  const saved = await getSavedItems();
  await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(saved.filter((entry) => !(entry.id === id && entry.type === type))));
}

export async function isSaved(id: string, type: SavedItemType): Promise<boolean> {
  const saved = await getSavedItems();
  return saved.some((entry) => entry.id === id && entry.type === type);
}

export async function getSacredNamesMode(): Promise<boolean> {
  const style = await getSacredNameStyle();
  return style !== "traditional";
}

export async function setSacredNamesMode(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(SACRED_NAMES_KEY, String(enabled));
  await setSacredNameStyle(enabled ? "hebrew" : "traditional");
}

export async function getSacredNameStyle(): Promise<SacredNameStyle> {
  const stored = await AsyncStorage.getItem(SACRED_NAME_STYLE_KEY);
  if (stored === "hebrew" || stored === "custom" || stored === "traditional") {
    return stored;
  }

  return (await AsyncStorage.getItem(SACRED_NAMES_KEY)) === "true" ? "hebrew" : "traditional";
}

export async function setSacredNameStyle(style: SacredNameStyle): Promise<void> {
  await AsyncStorage.setItem(SACRED_NAME_STYLE_KEY, style);
  await AsyncStorage.setItem(SACRED_NAMES_KEY, String(style !== "traditional"));
}

export async function getCustomSacredNames(): Promise<SacredNameMap> {
  const raw = await AsyncStorage.getItem(CUSTOM_SACRED_NAMES_KEY);
  if (!raw) {
    return defaultCustomSacredNames;
  }

  return { ...defaultCustomSacredNames, ...(JSON.parse(raw) as Partial<SacredNameMap>) };
}

export async function setCustomSacredNames(names: SacredNameMap): Promise<void> {
  await AsyncStorage.setItem(CUSTOM_SACRED_NAMES_KEY, JSON.stringify(names));
}

export async function getThemeMode(): Promise<ThemeMode> {
  return (await AsyncStorage.getItem(THEME_MODE_KEY)) === "dark" ? "dark" : "light";
}

export async function setThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(THEME_MODE_KEY, mode);
}

export async function markProfileViewed(profile: Omit<RecentProfile, "viewedAt">): Promise<void> {
  const current = await getRecentProfiles();
  const next = [
    { ...profile, viewedAt: new Date().toISOString() },
    ...current.filter((item) => item.id !== profile.id)
  ].slice(0, 8);

  await AsyncStorage.setItem(RECENT_PROFILES_KEY, JSON.stringify(next));
}

export async function getRecentProfiles(): Promise<RecentProfile[]> {
  const raw = await AsyncStorage.getItem(RECENT_PROFILES_KEY);
  return raw ? (JSON.parse(raw) as RecentProfile[]) : [];
}

export async function hasSeenOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_SEEN_KEY)) === "true";
}

export async function markOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");
}
