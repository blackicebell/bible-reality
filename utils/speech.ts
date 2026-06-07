import * as Speech from "expo-speech";
import type { SpeechOptions, Voice } from "expo-speech";

let preferredNarrationVoice: Promise<string | undefined> | undefined;

const maleVoiceHints = [
  "aaron",
  "alex",
  "arthur",
  "daniel",
  "david",
  "fred",
  "george",
  "gordon",
  "grandpa",
  "james",
  "john",
  "mark",
  "matthew",
  "nathan",
  "oliver",
  "paul",
  "ralph",
  "reed",
  "richard",
  "robert",
  "ryan",
  "thomas",
  "tom",
  "william"
];

const femaleVoiceHints = [
  "allison",
  "ava",
  "catherine",
  "grandma",
  "joanna",
  "karen",
  "kathy",
  "samantha",
  "sara",
  "susan",
  "tessa",
  "victoria",
  "zoe"
];

function voiceScore(voice: Voice) {
  const name = `${voice.name} ${voice.identifier}`.toLowerCase();
  const language = voice.language.toLowerCase();
  let score = 0;

  if (language.startsWith("en-us")) score += 40;
  else if (language.startsWith("en")) score += 26;

  if (maleVoiceHints.some((hint) => name.includes(hint))) score += 36;
  if (femaleVoiceHints.some((hint) => name.includes(hint))) score -= 30;
  if (String(voice.quality).toLowerCase().includes("enhanced")) score += 8;

  return score;
}

async function getPreferredNarrationVoice() {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const [best] = voices
      .filter((voice) => voice.language.toLowerCase().startsWith("en"))
      .sort((a, b) => voiceScore(b) - voiceScore(a));

    return best?.identifier;
  } catch {
    return undefined;
  }
}

export async function getNarrationSpeechOptions(): Promise<Pick<SpeechOptions, "language" | "pitch" | "rate" | "voice">> {
  preferredNarrationVoice ??= getPreferredNarrationVoice();
  const voice = await preferredNarrationVoice;

  return {
    language: "en-US",
    pitch: 0.82,
    rate: 0.84,
    voice
  };
}
