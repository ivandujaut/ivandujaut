import type { IllustrationKey } from "@/pitches/types";
import type { Illustration } from "./types";
import { obra } from "./obra";
import { datos } from "./datos";

export const illustrations: Record<IllustrationKey, Illustration> = { obra, datos };
export type { Illustration, ThreadStart } from "./types";
