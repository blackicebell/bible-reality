import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const attachmentPath = process.argv[2];

if (!attachmentPath) {
  throw new Error("Pass the pasted-text attachment path as the first argument.");
}

const input = fs.readFileSync(attachmentPath, "utf8");
const targetPath = path.join(root, "data", "realityProfiles.json");
const existing = JSON.parse(fs.readFileSync(targetPath, "utf8"));

function cleanMarker(value) {
  return String(value || "")
    .replace(/\s*(?:←|â†)\s*YOU ARE HERE\s*/g, "")
    .trim();
}

function toParagraphs(items) {
  return Array.isArray(items) ? items.join("\n\n") : String(items || "");
}

function snapshotFrom(raw) {
  const snapshot = raw.realitySnapshot || {};
  const rows = [
    ["Main Person", snapshot.mainPerson],
    ["Age", snapshot.approximateAge],
    ["Location", snapshot.currentLocation],
    ["Modern Region", snapshot.modernRegion],
    ["Timeline", snapshot.timelineEra || raw.timelineEra],
    ["Scene Scale", snapshot.sceneScale],
    ["Time Anchor", snapshot.timeAnchor]
  ];

  return rows
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim())
    .map(([label, value]) => ({ label, value: String(value) }));
}

function contextFrom(raw) {
  const story = raw.storyPosition || {};
  const context = raw.realityContext || {};
  const rows = [
    ["Before", story.whatHappenedBefore],
    ["Now", story.whatIsHappeningNow],
    ["Next", story.whatHappensAfter],
    ...(context.biblicalContext || []).map((value) => ["Biblical Context", value]),
    ...(context.geographicContext || []).map((value) => ["Geographic Context", value]),
    ...(context.dailyLifeContext || []).map((value) => ["Daily Life Context", value])
  ];

  return rows
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim())
    .map(([label, value]) => ({ label, value: String(value) }));
}

function termsFrom(raw) {
  const search = raw.search || {};
  return [
    ...(raw.people || []).map((person) => person.name),
    ...(raw.places || []).map((place) => place.ancientName),
    ...(search.people || []),
    ...(search.places || []),
    ...(search.events || []),
    ...(search.timelineEra || []),
    ...(search.alternateNames || []),
    ...(raw.eventType || []),
    raw.storyTitle,
    raw.reference,
    raw.timelineEra,
    raw.realitySummary
  ]
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);
}

function mapIdFor(raw) {
  if (raw.id === "genesis-12-abram-leaves-haran") {
    return "patriarchs";
  }
  return null;
}

function normalize(raw, sourceFile) {
  const strip = (raw.storyPosition?.storyPositionStrip || []).map(cleanMarker);
  const currentStory = strip.find((item, index) => raw.storyPosition?.storyPositionStrip?.[index]?.includes("YOU ARE HERE"))
    || cleanMarker(raw.storyTitle)
    || strip[0]
    || "";
  const crossReferences = raw.crossReferences || {};

  return {
    id: raw.id,
    sourceFile,
    searchTerms: termsFrom(raw),
    title: raw.storyTitle,
    reference: raw.reference,
    kicker: "Study",
    eventType: raw.eventType || [],
    summary: raw.realitySummary || raw.storyTitle,
    snapshot: snapshotFrom(raw),
    situation: raw.realityContext?.dailyLifeContext?.[0] || raw.realitySummary || "",
    storyPosition: strip,
    currentStory,
    stepIntoStory: toParagraphs(raw.stepIntoTheStory),
    notice: raw.documentaryObservations || [],
    realityContext: contextFrom(raw),
    whyThisMattersInTheStory: raw.whyThisMattersInTheStory || [],
    peopleDetails: raw.people || [],
    placesDetails: raw.places || [],
    people: (raw.people || []).map((person) => person.name),
    places: (raw.places || []).map((place) => place.ancientName),
    movement: raw.movementJourney?.route || [],
    movementDetails: raw.movementJourney || { startingPoint: null, destination: null, route: [], majorStops: [] },
    mapId: mapIdFor(raw),
    audioScript: raw.audioScript || "",
    crossReferences: Object.values(crossReferences).flat(),
    crossReferenceGroups: {
      earlierBackground: crossReferences.earlierBackground || [],
      directlyRelatedEvents: crossReferences.directlyRelatedEvents || [],
      laterReferences: crossReferences.laterReferences || [],
      newTestamentReferences: crossReferences.newTestamentReferences || []
    },
    series: raw.series || null,
    source: raw
  };
}

const blocks = [...input.matchAll(/FILE:\s*([^\r\n]+)\s*([\s\S]*?)(?=\nFILE:|\s*$)/g)];
const imported = blocks.map(([, fileName, jsonText]) => normalize(JSON.parse(jsonText), fileName.trim()));

const byId = new Map(existing.map((profile) => [profile.id, profile]));
for (const profile of imported) {
  byId.set(profile.id, profile);
}

const merged = existing
  .filter((profile) => !imported.some((next) => next.id === profile.id))
  .concat(imported);

fs.writeFileSync(targetPath, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Imported ${imported.length} profiles into ${path.relative(root, targetPath)}.`);
