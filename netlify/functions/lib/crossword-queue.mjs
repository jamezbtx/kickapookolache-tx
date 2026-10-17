// Bundled weekly crossword queue (data/crosswords/*.json), inlined by esbuild via static imports
// generated into crossword-queue-data.mjs by build.js.
import { QUEUE } from "./crossword-queue-data.mjs";
import { mondayOf } from "./crossword-gen.mjs";

/** Puzzle for the given Monday, or the newest one on/before it. */
export function currentPuzzle(date = new Date()) {
  const monday = mondayOf(date);
  const ids = Object.keys(QUEUE).filter((d) => d <= monday).sort();
  return ids.length ? QUEUE[ids[ids.length - 1]] : null;
}
