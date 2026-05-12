export const VOTE_START_MS = Date.UTC(2026, 4, 12);
export const VOTE_DEADLINE_MS = Date.UTC(2026, 4, 27, 15, 59, 59);

export type DeadlineSnapshot = {
  startMs: number;
  endMs: number;
  nowMs: number;
  daysLeft: number;
  progress: number;
  ended: boolean;
};

export function getDeadlineSnapshot(now: number = Date.now()): DeadlineSnapshot {
  const span = VOTE_DEADLINE_MS - VOTE_START_MS;
  const elapsed = Math.max(0, now - VOTE_START_MS);
  const progress = Math.min(1, elapsed / span);
  const remainingMs = Math.max(0, VOTE_DEADLINE_MS - now);
  const daysLeft = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  return {
    startMs: VOTE_START_MS,
    endMs: VOTE_DEADLINE_MS,
    nowMs: now,
    daysLeft,
    progress,
    ended: now >= VOTE_DEADLINE_MS,
  };
}
