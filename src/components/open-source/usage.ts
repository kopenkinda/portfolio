// Writes usage.json: how much agent work went into each open source project, from the session logs
// Codex, Claude Code and Pi keep on this machine (the projects were built with them, in T3 Code).
// Run it by hand to refresh the numbers: `node src/components/open-source/usage.ts`.
//
// Only the projects in projects.ts are counted, and only totals leave the machine: tokens per day,
// sessions, and each model's share. No prompts, replies, paths or other projects.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { projects } from "./projects.ts";

const home = homedir();
const ZONE = "Europe/Andorra"; // days are counted in local time

type Usage = { sessions: Set<string>; tokens: number; days: Record<string, number>; models: Record<string, number> };
const usage = new Map<string, Usage>(projects.map((p) => [p.repo, { sessions: new Set(), tokens: 0, days: {}, models: {} }]));

/** The project a session ran in: its folder, a T3 worktree of it, or a Codex worktree of it. */
const projectOf = (cwd = "") =>
  projects.find((p) => new RegExp(`/(projects|worktrees)/${p.repo}(/|$)|/\\.codex/worktrees/[^/]+/${p.repo}(/|$)`).test(cwd))?.repo;

const count = (repo: string, session: string, timestamp: string, tokens: number, model: string) => {
  const u = usage.get(repo)!;
  const day = new Date(timestamp).toLocaleDateString("sv-SE", { timeZone: ZONE });
  u.sessions.add(session);
  u.tokens += tokens;
  u.days[day] = (u.days[day] ?? 0) + tokens;
  u.models[model] = (u.models[model] ?? 0) + tokens;
};

const logs = (dir: string): string[] => {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? logs(join(dir, e.name)) : e.name.endsWith(".jsonl") ? [join(dir, e.name)] : [],
    );
  } catch {
    return []; // that agent isn't installed
  }
};
const lines = function* (file: string) {
  for (const line of readFileSync(file, "utf8").split("\n")) {
    try {
      if (line) yield JSON.parse(line);
    } catch {
      // a line cut short while the session was writing
    }
  }
};

// Codex: the session's folder comes first; then each token count carries the session's running
// total, so the growth since the last one is what that request used. A forked session's total
// starts from its parent's, which is already counted, so it starts from there.
for (const file of [...logs(join(home, ".codex/sessions")), ...logs(join(home, ".codex/archived_sessions"))]) {
  let repo: string | undefined;
  let forked = false;
  let model = "unknown";
  let total = 0;
  for (const line of lines(file)) {
    if (line.type === "session_meta") [repo, forked] = [projectOf(line.payload?.cwd), Boolean(line.payload?.forked_from_id)];
    if (!repo) break;
    if (line.type === "turn_context" && line.payload?.model) model = line.payload.model;
    const info = line.payload?.type === "token_count" ? line.payload.info : undefined;
    const now = info?.total_token_usage?.total_tokens;
    if (forked && now) [total, forked] = [now - (info.last_token_usage?.total_tokens ?? 0), false];
    if (now > total) {
      count(repo, file, line.timestamp, now - total, model);
      total = now;
    }
  }
}

// Claude Code: one entry per reply, repeated for each part of the reply, and again in the log of a
// session resumed from it, so each reply is counted once across all logs.
const seen = new Set<string>();
for (const file of [...logs(join(home, ".claude/projects")), ...logs(join(home, ".t3/.profiles"))]) {
  for (const line of lines(file)) {
    const u = line.type === "assistant" ? line.message?.usage : undefined;
    const repo = u && projectOf(line.cwd);
    const id = `${line.message?.id}${line.requestId}`;
    if (!repo || seen.has(id) || line.message.model === "<synthetic>") continue;
    seen.add(id);
    const tokens = (u.input_tokens ?? 0) + (u.output_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0);
    count(repo, file, line.timestamp, tokens, line.message.model);
  }
}

// Pi: the folder is in the first line, and each reply has its total.
for (const file of logs(join(home, ".pi/agent/sessions"))) {
  let repo: string | undefined;
  for (const line of lines(file)) {
    if (line.type === "session") repo = projectOf(line.cwd);
    if (!repo) break;
    const u = line.message?.role === "assistant" ? line.message.usage : undefined;
    if (u?.totalTokens) count(repo, file, line.timestamp, u.totalTokens, line.message.model);
  }
}

/** "gpt-6.1-sol" → "GPT-6.1 Sol", "claude-opus-5-5" → "Claude Opus 5.5". */
const modelName = (id: string) => {
  const claude = /^claude-([a-z]+)-(\d+)-(\d+)/.exec(id);
  if (claude) return `Claude ${claude[1][0].toUpperCase()}${claude[1].slice(1)} ${claude[2]}.${claude[3]}`;
  const gpt = /^gpt-([\d.]+)-([a-z]+)/.exec(id);
  if (gpt) return `GPT-${gpt[1]} ${gpt[2][0].toUpperCase()}${gpt[2].slice(1)}`;
  return id;
};

const out = {
  until: new Date().toLocaleDateString("sv-SE", { timeZone: ZONE }),
  projects: Object.fromEntries(
    [...usage].map(([repo, u]) => {
      const models: Record<string, number> = {};
      for (const [id, tokens] of Object.entries(u.models)) models[modelName(id)] = (models[modelName(id)] ?? 0) + tokens;
      return [
        repo,
        {
          sessions: u.sessions.size,
          tokens: u.tokens,
          days: Object.fromEntries(Object.entries(u.days).sort()),
          models: Object.entries(models).sort((a, b) => b[1] - a[1]),
        },
      ];
    }),
  ),
};
writeFileSync(new URL("./usage.json", import.meta.url), `${JSON.stringify(out, null, 2)}\n`);
for (const [repo, p] of Object.entries(out.projects)) {
  console.log(repo.padEnd(10), `${(p.tokens / 1e6).toFixed(1)}M tokens`, `${p.sessions} sessions`, `${Object.keys(p.days).length} days`);
}
