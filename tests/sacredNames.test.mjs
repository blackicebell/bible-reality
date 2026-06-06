import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../utils/sacredNames.ts", import.meta.url), "utf8");
const runnable = source
  .replace(": Array<[RegExp, string]>", "")
  .replace(/: string/g, "")
  .replace(/: boolean/g, "")
  .replace("export function applySacredNames", "function applySacredNames")
  .concat("\napplySacredNames;");

const applySacredNames = vm.runInNewContext(runnable);

assert.equal(applySacredNames("The LORD said to Abram.", true), "Yahweh said to Abram.");
assert.equal(applySacredNames("the LORD appeared.", true), "Yahweh appeared.");
assert.equal(applySacredNames("Lord God", true), "Adonai Elohim");
assert.equal(applySacredNames("Jesus went to Galilee.", true), "Yahshua went to Galilee.");
assert.equal(applySacredNames("The LORD said to Abram.", false), "The LORD said to Abram.");

console.log("Sacred Names replacement tests passed.");
