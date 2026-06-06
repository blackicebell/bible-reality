import profiles from "@/data/realityProfiles.json";

export type RealityProfile = (typeof profiles)[number];

export function getRealityProfileById(id: string): RealityProfile | undefined {
  return profiles.find((profile) => profile.id === id);
}

export function searchRealityProfiles(query: string): RealityProfile[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return profiles;
  }

  return profiles
    .map((profile) => {
      const title = profile.title.toLowerCase();
      const reference = profile.reference.toLowerCase();
      const currentStory = profile.currentStory.toLowerCase();
      const searchTerms = profile.searchTerms.join(" ").toLowerCase();
      const primaryFields = [profile.title, profile.reference, profile.currentStory, ...profile.searchTerms].join(" ").toLowerCase();
      const peoplePlaces = [...profile.places, ...profile.people].join(" ").toLowerCase();
      const secondaryFields = [profile.summary, ...profile.snapshot.map((item) => item.value)].join(" ").toLowerCase();
      const haystack = [
        primaryFields,
        peoplePlaces,
        secondaryFields
      ].join(" ");

      if (!haystack.includes(normalized)) {
        return { profile, score: 0 };
      }

      let score = 1;
      if (title === normalized || currentStory === normalized) score += 100;
      if (title.includes(normalized)) score += 50;
      if (searchTerms.split(" ").includes(normalized)) score += 35;
      if (searchTerms.includes(normalized)) score += 25;
      if (reference.includes(normalized)) score += 20;
      if (peoplePlaces.includes(normalized)) score += 12;
      if (secondaryFields.includes(normalized)) score += 4;

      return { profile, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.profile);
}

export function getAllRealityProfiles(): RealityProfile[] {
  return profiles;
}
