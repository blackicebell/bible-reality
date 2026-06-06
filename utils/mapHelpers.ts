import passageMaps from "@/data/passageMaps.json";
import places from "@/data/places.json";

export type Place = (typeof places)[number];
export type PassageMap = (typeof passageMaps)[number];

export function getPlaceById(id: string): Place | undefined {
  return places.find((place) => place.id === id);
}

export function getMapById(id: string): PassageMap | undefined {
  return passageMaps.find((map) => map.id === id);
}

export function getMapForPassage(passageId: string): PassageMap | undefined {
  return passageMaps.find((map) => map.passageId === passageId);
}

export function getPlacesForMap(map: PassageMap): Place[] {
  return map.places.map(getPlaceById).filter(Boolean) as Place[];
}

export function getRoutePoints(map: PassageMap): Place[] {
  return map.route.map(getPlaceById).filter(Boolean) as Place[];
}
