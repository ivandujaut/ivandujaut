import type { LandmarkSetKey } from "@/pitches/types";
import type { LandmarkSet } from "./types";
import { obra } from "./obra";
import { datos } from "./datos";

export const landmarkSets: Record<LandmarkSetKey, LandmarkSet> = { obra, datos };
export type { Landmark, LandmarkSet } from "./types";
