export const VOTE_START_MS = Date.UTC(2026, 4, 13, 16, 0, 0);
export const VOTE_DEADLINE_MS = Date.UTC(2026, 4, 29, 15, 59, 59);

export type DeadlineSnapshot = {
  startMs: number;
  endMs: number;
  nowMs: number;
  remainingMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  daysLeft: number;
  progress: number;
  ended: boolean;
};

export function getDeadlineSnapshot(now: number = Date.now()): DeadlineSnapshot {
  const span = VOTE_DEADLINE_MS - VOTE_START_MS;
  const elapsed = Math.max(0, now - VOTE_START_MS);
  const progress = Math.min(1, elapsed / span);
  const remainingMs = Math.max(0, VOTE_DEADLINE_MS - now);
  const totalSec = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const daysLeft = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  return {
    startMs: VOTE_START_MS,
    endMs: VOTE_DEADLINE_MS,
    nowMs: now,
    remainingMs,
    days,
    hours,
    minutes,
    seconds,
    daysLeft,
    progress,
    ended: now >= VOTE_DEADLINE_MS,
  };
}
