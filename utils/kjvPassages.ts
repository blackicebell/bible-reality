import passages from "@/data/kjvPassages.json";

export type KjvPassage = {
  reference: string;
  translation: string;
  excerpt: string;
  note: string;
};

const passageMap = passages as Record<string, KjvPassage>;

export function getKjvPassage(reference: string): KjvPassage | undefined {
  return passageMap[reference];
}
