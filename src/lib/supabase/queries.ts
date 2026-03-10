import { supabase } from './client';
import type {
  AgentRow,
  AirmanRow,
  CoachingLogRow,
  DoraMetricsRow,
  SprintVelocityRow,
  PipelineEventRow,
} from './types';

// ── Agents ──

export async function fetchAgents(): Promise<AgentRow[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('tier', { ascending: true })
    .order('slug', { ascending: true });

  if (error) throw error;
  return data as AgentRow[];
}

export async function updateAgentStatus(
  slug: string,
  status: AgentRow['status'],
): Promise<void> {
  const { error } = await supabase
    .from('agents')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('slug', slug);

  if (error) throw error;
}

// ── Airmen ──

export async function fetchAirmen(): Promise<AirmanRow[]> {
  const { data, error } = await supabase
    .from('airmen')
    .select('*')
    .order('callsign', { ascending: true });

  if (error) throw error;
  return data as AirmanRow[];
}

// ── Coaching Log ──

export async function fetchRecentCoachingLogs(limit = 20): Promise<CoachingLogRow[]> {
  const { data, error } = await supabase
    .from('coaching_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as CoachingLogRow[];
}

export async function insertCoachingLog(
  log: Omit<CoachingLogRow, 'id' | 'created_at'>,
): Promise<CoachingLogRow> {
  const { data, error } = await supabase
    .from('coaching_log')
    .insert(log)
    .select()
    .single();

  if (error) throw error;
  return data as CoachingLogRow;
}

// ── DORA Metrics ──

export async function fetchDoraMetrics(): Promise<DoraMetricsRow[]> {
  const { data, error } = await supabase
    .from('dora_metrics')
    .select('*')
    .order('recorded_date', { ascending: true });

  if (error) throw error;
  return data as DoraMetricsRow[];
}

// ── Sprint Velocity ──

export async function fetchSprintVelocity(): Promise<SprintVelocityRow[]> {
  const { data, error } = await supabase
    .from('sprint_velocity')
    .select('*')
    .order('sprint_number', { ascending: true });

  if (error) throw error;
  return data as SprintVelocityRow[];
}

// ── Pipeline Events ──

export async function fetchRecentPipelineEvents(limit = 50): Promise<PipelineEventRow[]> {
  const { data, error } = await supabase
    .from('pipeline_events')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as PipelineEventRow[];
}

// ── Realtime Subscriptions ──

export function subscribeToCoachingLog(
  callback: (log: CoachingLogRow) => void,
) {
  return supabase
    .channel('coaching_log_realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'coaching_log' },
      (payload) => callback(payload.new as CoachingLogRow),
    )
    .subscribe();
}

export function subscribeToAgentStatus(
  callback: (agent: AgentRow) => void,
) {
  return supabase
    .channel('agents_realtime')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'agents' },
      (payload) => callback(payload.new as AgentRow),
    )
    .subscribe();
}

export function subscribeToPipelineEvents(
  callback: (event: PipelineEventRow) => void,
) {
  return supabase
    .channel('pipeline_events_realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'pipeline_events' },
      (payload) => callback(payload.new as PipelineEventRow),
    )
    .subscribe();
}
