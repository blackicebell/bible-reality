import fs from "node:fs";
import path from "node:path";

const dir = "data/bibles/books/kjv";
const files = fs
  .readdirSync(dir)
  .filter((file) => file.endsWith(".json"))
  .sort((left, right) => {
    const leftBook = JSON.parse(fs.readFileSync(path.join(dir, left), "utf8"));
    const rightBook = JSON.parse(fs.readFileSync(path.join(dir, right), "utf8"));
    return leftBook.bookId - rightBook.bookId;
  });

function variableName(file) {
  return `Book_${path.basename(file, ".json").replace(/[^A-Za-z0-9_]/g, "_")}`;
}

const imports = files
  .map((file) => `import ${variableName(file)} from "@/data/bibles/books/kjv/${file}";`)
  .join("\n");
const entries = files.map(variableName).join(",\n  ");

const output = `${imports}

export type KjvVerse = { number: number; text: string };
export type KjvChapter = { chapter: number; verses: KjvVerse[] };
export type KjvBook = { book: string; bookId: number; englishName: string; testament: string; chapters: KjvChapter[] };

export const kjvBooks = [
  ${entries}
] as KjvBook[];

export const kjvBookByCode = new Map(kjvBooks.map((book) => [book.book, book]));
`;

fs.writeFileSync("utils/kjvBible.ts", output);
console.log(`generated ${files.length} KJV book imports`);
