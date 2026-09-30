import raw from "@/data/artists.json";
import { TIERS, type TierId } from "./config";
import { baseValue } from "./market";
import type { Artist, Dataset } from "./types";

export const dataset = raw as Dataset;
export const artists: Artist[] = dataset.artists;

const byId = new Map(artists.map((a) => [a.id, a]));

export function getArtist(id: string): Artist | undefined {
  return byId.get(id);
}

export function baseThen(a: Artist): number {
  return baseValue(a.listenersThen);
}

export function baseNow(a: Artist): number {
  return baseValue(a.listenersNow);
}

/** Listener growth over the six months before Then, from the oldest history point. */
export function priorGrowth(a: Artist): number {
  const first = a.history[0];
  return first ? a.listenersThen / first - 1 : 0;
}

export function tierLabel(id: TierId): string {
  return TIERS.find((t) => t.id === id)?.label ?? id;
}

export const genres = [...new Set(artists.flatMap((a) => a.genres))].sort();
