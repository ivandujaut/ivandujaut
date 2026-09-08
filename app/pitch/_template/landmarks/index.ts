import type { LandmarkSetKey } from "@/pitches/types";
import type { LandmarkSet } from "./types";
import { obra } from "./obra";

export const landmarkSets: Record<LandmarkSetKey, LandmarkSet> = { obra };
export type { Landmark, LandmarkSet } from "./types";
