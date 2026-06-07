import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../utils/sacredNames.ts", import.meta.url), "utf8");
const runnable = source
  .replace(/import .*?;\n/, "")
  .replace(
    /export const sacredNameStyles[\s\S]*?function cleanValue/,
    `const defaultCustomSacredNames = {
  LORD: "Yahweh",
  GOD: "Elohim",
  God: "Elohim",
  Lord: "Adonai",
  Jesus: "Yahshua",
  Christ: "Messiah",
  "Holy Spirit": "Ruach HaKodesh"
};

const sacredNameStyles = {
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

function cleanValue`
  )
  .replace(/\s*\|\s*undefined/g, "")
  .replace(": Array<[RegExp, string]>", "")
  .replace(/: Array<\[string, string\]>/g, "")
  .replace(/: SacredNameStyle \| boolean/g, "")
  .replace(/: SacredNameStyle/g, "")
  .replace(/: SacredNameMap/g, "")
  .replace(/: string/g, "")
  .replace(/: boolean/g, "")
  .replace("export function applySacredNames", "function applySacredNames")
  .concat("\napplySacredNames;");

const applySacredNames = vm.runInNewContext(runnable);

assert.equal(applySacredNames("The LORD said to Abram.", true), "Yahweh said to Abram.");
assert.equal(applySacredNames("the LORD appeared.", true), "Yahweh appeared.");
assert.equal(applySacredNames("Lord God", true), "Adonai Elohim");
assert.equal(applySacredNames("The Lord GOD spoke.", true), "Adonai Yahweh spoke.");
assert.equal(applySacredNames("The LORD God planted a garden.", true), "Yahweh Elohim planted a garden.");
assert.equal(applySacredNames("Jesus went to Galilee.", true), "Yahshua went to Galilee.");
assert.equal(applySacredNames("The LORD said to Abram.", false), "The LORD said to Abram.");

console.log("Sacred Names replacement tests passed.");
