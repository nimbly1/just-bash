/**
 * Detects control messages that Node's `--watch` mode relays from worker
 * threads. When `WATCH_REPORT_DEPENDENCIES` is set in a watched process,
 * Node's loader posts `{ "watch:import": [url] }` (ESM) and
 * `{ "watch:require": [...] }` (CJS) from every worker thread, and `Worker`
 * forwards those messages to main-thread listeners. They are Node internals,
 * not command responses.
 */
export function isNodeWatchModeMessage(msg: unknown): boolean {
  if (!msg || typeof msg !== "object" || Array.isArray(msg)) {
    return false;
  }
  const candidate = msg as { "watch:import"?: unknown; "watch:require"?: unknown };
  return (
    Object.hasOwn(candidate, "watch:import") ||
    Object.hasOwn(candidate, "watch:require")
  );
}
