import { defaultCustomSacredNames, type SacredNameMap, type SacredNameStyle } from "@/utils/storage";

export const sacredNameStyles: Record<SacredNameStyle, { label: string; description: string; map: SacredNameMap }> = {
  traditional: {
    label: "Traditional",
    description: "LORD, God, Lord, Jesus",
    map: {
      LORD: "LORD",
      GOD: "GOD",
      God: "God",
      Lord: "Lord",
      Jesus: "Jesus",
      Christ: "Christ",
      "Holy Spirit": "Holy Spirit"
    }
  },
  hebrew: {
    label: "Hebrew Names",
    description: "Yahweh, Elohim, Adonai, Yahshua",
    map: defaultCustomSacredNames
  },
  custom: {
    label: "Custom",
    description: "Choose your preferred names",
    map: defaultCustomSacredNames
  }
};

function cleanValue(value: string | undefined, fallback: string) {
  return String(value || fallback).trim() || fallback;
}

function getSacredNameMap(style: SacredNameStyle, customNames: SacredNameMap = defaultCustomSacredNames) {
  const fallback = sacredNameStyles[style]?.map ?? sacredNameStyles.traditional.map;
  const base = style === "custom" ? customNames : fallback;

  return {
    LORD: cleanValue(base.LORD, fallback.LORD),
    GOD: cleanValue(base.GOD || base.God, fallback.GOD || fallback.God),
    God: cleanValue(base.God, fallback.God),
    Lord: cleanValue(base.Lord, fallback.Lord),
    Jesus: cleanValue(base.Jesus, fallback.Jesus),
    Christ: cleanValue(base.Christ, fallback.Christ),
    "Holy Spirit": cleanValue(base["Holy Spirit"], fallback["Holy Spirit"])
  };
}

function replacePhrase(text: string, phrase: string, replacement: string) {
  return text.replace(new RegExp(`\\b${phrase}\\b`, "g"), replacement);
}

function replacePossessive(text: string, term: string, replacement: string) {
  return text.replace(new RegExp(`\\b${term}(['']s)\\b`, "g"), `${replacement}$1`);
}

function replaceTerm(text: string, term: string, replacement: string) {
  return text.replace(new RegExp(`\\b${term}\\b`, "g"), replacement);
}

export function applySacredNames(
  text: string | undefined,
  styleOrEnabled: SacredNameStyle | boolean = "traditional",
  customNames: SacredNameMap = defaultCustomSacredNames
) {
  const original = text || "";
  const style: SacredNameStyle = typeof styleOrEnabled === "boolean" ? (styleOrEnabled ? "hebrew" : "traditional") : styleOrEnabled;

  if (style === "traditional") {
    return original;
  }

  const map = getSacredNameMap(style, customNames);
  let rendered = original;

  const phraseRules: Array<[string, string]> = [
    ["the LORD God", `${map.LORD} ${map.God}`],
    ["The LORD God", `${map.LORD} ${map.God}`],
    ["the Lord GOD", `${map.Lord} ${map.LORD}`],
    ["The Lord GOD", `${map.Lord} ${map.LORD}`],
    ["Lord GOD", `${map.Lord} ${map.LORD}`],
    ["LORD God", `${map.LORD} ${map.God}`],
    ["LORD GOD", `${map.LORD} ${map.GOD}`],
    ["of the LORD", `of ${map.LORD}`],
    ["unto the LORD", `unto ${map.LORD}`],
    ["before the LORD", `before ${map.LORD}`],
    ["from the LORD", `from ${map.LORD}`],
    ["to the LORD", `to ${map.LORD}`],
    ["in the LORD", `in ${map.LORD}`],
    ["O LORD", `O ${map.LORD}`],
    ["the LORD", map.LORD],
    ["The LORD", map.LORD],
    ["Holy Spirit", map["Holy Spirit"]]
  ];

  for (const [phrase, replacement] of phraseRules) {
    rendered = replacePhrase(rendered, phrase, replacement);
  }

  const termRules: Array<[string, string]> = [
    ["LORD", map.LORD],
    ["GOD", map.GOD],
    ["God", map.God],
    ["Lord", map.Lord],
    ["Jesus", map.Jesus],
    ["Christ", map.Christ]
  ];

  for (const [term, replacement] of termRules) {
    rendered = replacePossessive(rendered, term, replacement);
  }

  for (const [term, replacement] of termRules) {
    rendered = replaceTerm(rendered, term, replacement);
  }

  return rendered;
}
