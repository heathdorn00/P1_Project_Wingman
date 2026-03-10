// ============================================================
// lib/ax-platform/webhooks.ts
// Webhook handlers — GitHub Actions → AX Platform → Agents
// ============================================================

export interface GitHubPushEvent {
  ref: string;
  commits: Array<{ id: string; message: string; author: { name: string } }>;
  repository: { full_name: string };
  pusher: { name: string };
}

export interface GitHubPREvent {
  action: string;
  number: number;
  pull_request: {
    title: string;
    body: string;
    user: { login: string };
    base: { ref: string };
    head: { ref: string; sha: string };
    additions: number;
    deletions: number;
  };
}

// Maps GitHub events to the right Wingman agent
export function resolveAgentForEvent(_eventType: string, _payload: unknown): string {
  const map: Record<string, string> = {
    push: 'git_coach',
    pull_request: 'code_reviewer',
    deployment: 'devsecops_lead',
    workflow_run: 'devsecops_lead',
    check_suite: 'test_engineer',
  };
  return map[_eventType] ?? 'scrum_coach';
}

export function buildCoachingPrompt(
  eventType: string,
  payload: GitHubPushEvent | GitHubPREvent,
  airmanCallsign: string,
): string {
  if (eventType === 'push') {
    const push = payload as GitHubPushEvent;
    const msgs = push.commits.map((c) => `- ${c.message}`).join('\n');
    return (
      `Airman ${airmanCallsign} just pushed to ${push.ref}:\n${msgs}\n\n` +
      `Review the commit messages for clarity and intent. ` +
      `Ask a Socratic question that guides them to improve their commit hygiene ` +
      `without telling them what to write.`
    );
  }

  if (eventType === 'pull_request') {
    const pr = payload as GitHubPREvent;
    return (
      `Airman ${airmanCallsign} opened PR #${pr.number}: "${pr.pull_request.title}"\n` +
      `+${pr.pull_request.additions} / -${pr.pull_request.deletions} lines\n` +
      `Base: ${pr.pull_request.base.ref} ← Head: ${pr.pull_request.head.ref}\n\n` +
      `Review this PR as a senior engineer mentor. Use the Socratic method. ` +
      `Identify the most important coaching opportunity — architecture, testing, or readability — ` +
      `and ask one powerful question that leads the Airman to discover the improvement themselves.`
    );
  }

  return `New ${eventType} event for Airman ${airmanCallsign}. Provide relevant coaching.`;
}
