// ============================================================
// lib/ax-platform/index.ts — Public API surface
// ============================================================

export {
  listAgents,
  getAgentStatus,
  sendToAgent,
  createTask,
  listTasks,
  getContext,
  setContext,
} from './client';

export { resolveAgentForEvent, buildCoachingPrompt } from './webhooks';

export type {
  AXAgent,
  AXTask,
  AXPlatformConfig,
  CoachingMessage,
  SendMessagePayload,
  SendMessageResult,
} from './client';

export type { GitHubPushEvent, GitHubPREvent } from './webhooks';
