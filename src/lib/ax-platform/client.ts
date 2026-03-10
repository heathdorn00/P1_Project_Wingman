// ============================================================
// lib/ax-platform/client.ts
// AX Platform MCP Client — Agent Status + Coaching Integration
// ============================================================

export interface AXAgent {
  id: string;
  slug: string;
  display_name: string;
  tier: 'TRAIN' | 'COACH' | 'CATCH';
  llm_provider: 'claude' | 'gemini' | 'gpt';
  llm_model: string;
  runtime: 'ax-cloud' | 'ax-moltworker' | 'ax-agent-studio';
  status: 'active' | 'idle' | 'offline';
  last_triggered_at: string | null;
  avg_response_ms: number | null;
  total_interactions: number;
}

export interface CoachingMessage {
  id: string;
  airman_callsign: string;
  agent_slug: string;
  agent_display_name: string;
  tier: 'TRAIN' | 'COACH' | 'CATCH';
  airman_message: string;
  agent_response: string;
  is_question: boolean;
  jira_story: string | null;
  triggered_by: 'mention' | 'webhook' | 'scheduled' | 'proactive';
  created_at: string;
}

export interface AXPlatformConfig {
  baseUrl: string;
  apiKey: string;
  spaceId?: string;
}

const DEFAULT_CONFIG: AXPlatformConfig = {
  baseUrl: process.env.AX_PLATFORM_URL ?? 'https://paxai.app',
  apiKey: process.env.AX_PLATFORM_API_KEY ?? '',
  spaceId: process.env.AX_PLATFORM_SPACE_ID,
};

// ============================================================
// Core MCP Tool Callers
// Maps to AX Platform's 6-tool framework
// ============================================================

async function axFetch<T>(
  endpoint: string,
  options?: RequestInit,
  config: AXPlatformConfig = DEFAULT_CONFIG,
): Promise<T> {
  const url = `${config.baseUrl}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'X-Space-ID': config.spaceId ?? '',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AX Platform API error ${res.status}: ${err}`);
  }

  return res.json() as Promise<T>;
}

// ──────────────────────────────────────────────────────────
// AGENTS tool — list agents and their status
// ──────────────────────────────────────────────────────────
export async function listAgents(scope: 'my' | 'team' | 'public' = 'team'): Promise<AXAgent[]> {
  return axFetch<AXAgent[]>(`/api/v1/agents?scope=${scope}`);
}

export async function getAgentStatus(slug: string): Promise<AXAgent> {
  return axFetch<AXAgent>(`/api/v1/agents/${slug}`);
}

// ──────────────────────────────────────────────────────────
// MESSAGES tool — send coaching prompts to agents
// ──────────────────────────────────────────────────────────
export interface SendMessagePayload {
  agent_slug: string;
  content: string;
  context?: Record<string, unknown>;
  reply_to?: string;
}

export interface SendMessageResult {
  message_id: string;
  agent_slug: string;
  content: string;
  created_at: string;
}

export async function sendToAgent(payload: SendMessagePayload): Promise<SendMessageResult> {
  return axFetch<SendMessageResult>('/api/v1/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ──────────────────────────────────────────────────────────
// TASKS tool — link Jira stories to AX Platform tasks
// ──────────────────────────────────────────────────────────
export interface AXTask {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  jira_id?: string;
  assigned_agent?: string;
  links?: string[];
}

export async function createTask(task: Omit<AXTask, 'id'>): Promise<AXTask> {
  return axFetch<AXTask>('/api/v1/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
}

export async function listTasks(
  filter: 'my_tasks' | 'available' | 'all' = 'all',
): Promise<AXTask[]> {
  return axFetch<AXTask[]>(`/api/v1/tasks?filter=${filter}`);
}

// ──────────────────────────────────────────────────────────
// CONTEXT tool — read shared memory (agent knowledge store)
// ──────────────────────────────────────────────────────────
export async function getContext(key: string): Promise<unknown> {
  return axFetch(`/api/v1/context/${encodeURIComponent(key)}`);
}

export async function setContext(key: string, value: unknown): Promise<void> {
  await axFetch('/api/v1/context', {
    method: 'POST',
    body: JSON.stringify({ key, value }),
  });
}
