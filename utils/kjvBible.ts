import Book_Gen from "@/data/bibles/books/kjv/Gen.json";
import Book_Exod from "@/data/bibles/books/kjv/Exod.json";
import Book_Lev from "@/data/bibles/books/kjv/Lev.json";
import Book_Num from "@/data/bibles/books/kjv/Num.json";
import Book_Deut from "@/data/bibles/books/kjv/Deut.json";
import Book_Josh from "@/data/bibles/books/kjv/Josh.json";
import Book_Judg from "@/data/bibles/books/kjv/Judg.json";
import Book_Ruth from "@/data/bibles/books/kjv/Ruth.json";
import Book_1Sam from "@/data/bibles/books/kjv/1Sam.json";
import Book_2Sam from "@/data/bibles/books/kjv/2Sam.json";
import Book_1Kgs from "@/data/bibles/books/kjv/1Kgs.json";
import Book_2Kgs from "@/data/bibles/books/kjv/2Kgs.json";
import Book_1Chr from "@/data/bibles/books/kjv/1Chr.json";
import Book_2Chr from "@/data/bibles/books/kjv/2Chr.json";
import Book_Ezra from "@/data/bibles/books/kjv/Ezra.json";
import Book_Neh from "@/data/bibles/books/kjv/Neh.json";
import Book_Esth from "@/data/bibles/books/kjv/Esth.json";
import Book_Job from "@/data/bibles/books/kjv/Job.json";
import Book_Ps from "@/data/bibles/books/kjv/Ps.json";
import Book_Prov from "@/data/bibles/books/kjv/Prov.json";
import Book_Eccl from "@/data/bibles/books/kjv/Eccl.json";
import Book_Song from "@/data/bibles/books/kjv/Song.json";
import Book_Isa from "@/data/bibles/books/kjv/Isa.json";
import Book_Jer from "@/data/bibles/books/kjv/Jer.json";
import Book_Lam from "@/data/bibles/books/kjv/Lam.json";
import Book_Ezek from "@/data/bibles/books/kjv/Ezek.json";
import Book_Dan from "@/data/bibles/books/kjv/Dan.json";
import Book_Hos from "@/data/bibles/books/kjv/Hos.json";
import Book_Joel from "@/data/bibles/books/kjv/Joel.json";
import Book_Amos from "@/data/bibles/books/kjv/Amos.json";
import Book_Obad from "@/data/bibles/books/kjv/Obad.json";
import Book_Jonah from "@/data/bibles/books/kjv/Jonah.json";
import Book_Mic from "@/data/bibles/books/kjv/Mic.json";
import Book_Nah from "@/data/bibles/books/kjv/Nah.json";
import Book_Hab from "@/data/bibles/books/kjv/Hab.json";
import Book_Zeph from "@/data/bibles/books/kjv/Zeph.json";
import Book_Hag from "@/data/bibles/books/kjv/Hag.json";
import Book_Zech from "@/data/bibles/books/kjv/Zech.json";
import Book_Mal from "@/data/bibles/books/kjv/Mal.json";
import Book_Matt from "@/data/bibles/books/kjv/Matt.json";
import Book_Mark from "@/data/bibles/books/kjv/Mark.json";
import Book_Luke from "@/data/bibles/books/kjv/Luke.json";
import Book_John from "@/data/bibles/books/kjv/John.json";
import Book_Acts from "@/data/bibles/books/kjv/Acts.json";
import Book_Rom from "@/data/bibles/books/kjv/Rom.json";
import Book_1Cor from "@/data/bibles/books/kjv/1Cor.json";
import Book_2Cor from "@/data/bibles/books/kjv/2Cor.json";
import Book_Gal from "@/data/bibles/books/kjv/Gal.json";
import Book_Eph from "@/data/bibles/books/kjv/Eph.json";
import Book_Phil from "@/data/bibles/books/kjv/Phil.json";
import Book_Col from "@/data/bibles/books/kjv/Col.json";
import Book_1Thess from "@/data/bibles/books/kjv/1Thess.json";
import Book_2Thess from "@/data/bibles/books/kjv/2Thess.json";
import Book_1Tim from "@/data/bibles/books/kjv/1Tim.json";
import Book_2Tim from "@/data/bibles/books/kjv/2Tim.json";
import Book_Titus from "@/data/bibles/books/kjv/Titus.json";
import Book_Phlm from "@/data/bibles/books/kjv/Phlm.json";
import Book_Heb from "@/data/bibles/books/kjv/Heb.json";
import Book_Jas from "@/data/bibles/books/kjv/Jas.json";
import Book_1Pet from "@/data/bibles/books/kjv/1Pet.json";
import Book_2Pet from "@/data/bibles/books/kjv/2Pet.json";
import Book_1John from "@/data/bibles/books/kjv/1John.json";
import Book_2John from "@/data/bibles/books/kjv/2John.json";
import Book_3John from "@/data/bibles/books/kjv/3John.json";
import Book_Jude from "@/data/bibles/books/kjv/Jude.json";
import Book_Rev from "@/data/bibles/books/kjv/Rev.json";
import Book_1Esd from "@/data/bibles/books/kjv/1Esd.json";
import Book_2Esd from "@/data/bibles/books/kjv/2Esd.json";
import Book_Tob from "@/data/bibles/books/kjv/Tob.json";
import Book_Jdt from "@/data/bibles/books/kjv/Jdt.json";
import Book_Wis from "@/data/bibles/books/kjv/Wis.json";
import Book_Sir from "@/data/bibles/books/kjv/Sir.json";
import Book_Bar from "@/data/bibles/books/kjv/Bar.json";
import Book_EpJer from "@/data/bibles/books/kjv/EpJer.json";
import Book_PrAzar from "@/data/bibles/books/kjv/PrAzar.json";
import Book_Sus from "@/data/bibles/books/kjv/Sus.json";
import Book_Bel from "@/data/bibles/books/kjv/Bel.json";
import Book_PrMan from "@/data/bibles/books/kjv/PrMan.json";
import Book_1Macc from "@/data/bibles/books/kjv/1Macc.json";
import Book_2Macc from "@/data/bibles/books/kjv/2Macc.json";

export type KjvVerse = { number: number; text: string };
export type KjvChapter = { chapter: number; verses: KjvVerse[] };
export type KjvBook = { book: string; bookId: number; englishName: string; testament: string; chapters: KjvChapter[] };

export const kjvBooks = [
  Book_Gen,
  Book_Exod,
  Book_Lev,
  Book_Num,
  Book_Deut,
  Book_Josh,
  Book_Judg,
  Book_Ruth,
  Book_1Sam,
  Book_2Sam,
  Book_1Kgs,
  Book_2Kgs,
  Book_1Chr,
  Book_2Chr,
  Book_Ezra,
  Book_Neh,
  Book_Esth,
  Book_Job,
  Book_Ps,
  Book_Prov,
  Book_Eccl,
  Book_Song,
  Book_Isa,
  Book_Jer,
  Book_Lam,
  Book_Ezek,
  Book_Dan,
  Book_Hos,
  Book_Joel,
  Book_Amos,
  Book_Obad,
  Book_Jonah,
  Book_Mic,
  Book_Nah,
  Book_Hab,
  Book_Zeph,
  Book_Hag,
  Book_Zech,
  Book_Mal,
  Book_Matt,
  Book_Mark,
  Book_Luke,
  Book_John,
  Book_Acts,
  Book_Rom,
  Book_1Cor,
  Book_2Cor,
  Book_Gal,
  Book_Eph,
  Book_Phil,
  Book_Col,
  Book_1Thess,
  Book_2Thess,
  Book_1Tim,
  Book_2Tim,
  Book_Titus,
  Book_Phlm,
  Book_Heb,
  Book_Jas,
  Book_1Pet,
  Book_2Pet,
  Book_1John,
  Book_2John,
  Book_3John,
  Book_Jude,
  Book_Rev,
  Book_1Esd,
  Book_2Esd,
  Book_Tob,
  Book_Jdt,
  Book_Wis,
  Book_Sir,
  Book_Bar,
  Book_EpJer,
  Book_PrAzar,
  Book_Sus,
  Book_Bel,
  Book_PrMan,
  Book_1Macc,
  Book_2Macc
] as KjvBook[];

export const kjvBookByCode = new Map(kjvBooks.map((book) => [book.book, book]));
