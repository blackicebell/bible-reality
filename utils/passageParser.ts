import passages from "@/data/passages.json";

export type Passage = (typeof passages)[number];

export function slugifyPassage(reference: string): string {
  return reference
    .toLowerCase()
    .replace(/:/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function findPassage(query: string): Passage | undefined {
  const normalized = query.trim().toLowerCase();
  return passages.find((passage) => {
    return passage.reference.toLowerCase() === normalized || passage.id === slugifyPassage(normalized);
  });
}

export function getPassageById(id: string): Passage | undefined {
  return passages.find((passage) => passage.id === id);
}
