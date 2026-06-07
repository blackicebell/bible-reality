import { kjvBooks, type KjvBook, type KjvVerse } from "@/utils/kjvBible";

export type KjvPassage = {
  reference: string;
  translation: string;
  excerpt: string;
  note: string;
};

type ParsedReference = {
  book: KjvBook;
  startChapter: number;
  startVerse?: number;
  endChapter: number;
  endVerse?: number;
};

const bookAliases = new Map<string, KjvBook>();

function normalizeBookName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

for (const book of kjvBooks) {
  bookAliases.set(normalizeBookName(book.book), book);
  bookAliases.set(normalizeBookName(book.englishName), book);
}

function parseReference(reference: string): ParsedReference | undefined {
  const match = reference.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?(?:-(?:(\d+):)?(\d+))?$/);
  if (!match) {
    return undefined;
  }

  const [, bookName, startChapterRaw, startVerseRaw, endChapterRaw, endValueRaw] = match;
  const book = bookAliases.get(normalizeBookName(bookName));
  if (!book) {
    return undefined;
  }

  const startChapter = Number(startChapterRaw);
  const startVerse = startVerseRaw ? Number(startVerseRaw) : undefined;
  let endChapter = startChapter;
  let endVerse = endValueRaw ? Number(endValueRaw) : undefined;

  if (endChapterRaw) {
    endChapter = Number(endChapterRaw);
  } else if (!startVerseRaw && endValueRaw) {
    endChapter = Number(endValueRaw);
    endVerse = undefined;
  }

  return { book, startChapter, startVerse, endChapter, endVerse };
}

function chapterVerses(book: KjvBook, chapterNumber: number) {
  return book.chapters.find((chapter) => chapter.chapter === chapterNumber)?.verses ?? [];
}

function selectVerses(parsed: ParsedReference) {
  const selected: Array<{ chapter: number; verse: KjvVerse }> = [];

  for (let chapter = parsed.startChapter; chapter <= parsed.endChapter; chapter += 1) {
    const verses = chapterVerses(parsed.book, chapter);
    const firstVerse = chapter === parsed.startChapter && parsed.startVerse ? parsed.startVerse : 1;
    const lastVerse = chapter === parsed.endChapter && parsed.endVerse ? parsed.endVerse : verses[verses.length - 1]?.number;

    for (const verse of verses) {
      if (verse.number >= firstVerse && (!lastVerse || verse.number <= lastVerse)) {
        selected.push({ chapter, verse });
      }
    }
  }

  return selected;
}

export function getKjvPassage(reference: string): KjvPassage | undefined {
  const parsed = parseReference(reference);
  if (!parsed) {
    return undefined;
  }

  const selected = selectVerses(parsed);
  if (!selected.length) {
    return undefined;
  }

  const excerpt = selected
    .map(({ chapter, verse }) => `${parsed.book.englishName} ${chapter}:${verse.number} ${verse.text}`)
    .join("\n\n");

  return {
    reference,
    translation: "KJV",
    excerpt,
    note: "King James Version text is stored locally for offline reading."
  };
}
