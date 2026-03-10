// ============================================================
// Database types — generated from Supabase schema
// ============================================================

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: AgentRow;
        Insert: Omit<AgentRow, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<AgentRow, 'id' | 'created_at' | 'updated_at'>>;
        Update: Partial<AgentRow>;
      };
      airmen: {
        Row: AirmanRow;
        Insert: Omit<AirmanRow, 'id' | 'enrolled_at' | 'updated_at'> & Partial<Pick<AirmanRow, 'id' | 'enrolled_at' | 'updated_at'>>;
        Update: Partial<AirmanRow>;
      };
      cfetp_tasks: {
        Row: CfetpTaskRow;
        Insert: Omit<CfetpTaskRow, 'id'> & Partial<Pick<CfetpTaskRow, 'id'>>;
        Update: Partial<CfetpTaskRow>;
      };
      airman_task_certifications: {
        Row: AirmanTaskCertificationRow;
        Insert: Omit<AirmanTaskCertificationRow, 'id' | 'certified_at'> & Partial<Pick<AirmanTaskCertificationRow, 'id' | 'certified_at'>>;
        Update: Partial<AirmanTaskCertificationRow>;
      };
      coaching_log: {
        Row: CoachingLogRow;
        Insert: Omit<CoachingLogRow, 'id' | 'created_at'> & Partial<Pick<CoachingLogRow, 'id' | 'created_at'>>;
        Update: Partial<CoachingLogRow>;
      };
      dora_metrics: {
        Row: DoraMetricsRow;
        Insert: Omit<DoraMetricsRow, 'id' | 'created_at'> & Partial<Pick<DoraMetricsRow, 'id' | 'created_at'>>;
        Update: Partial<DoraMetricsRow>;
      };
      sprint_velocity: {
        Row: SprintVelocityRow;
        Insert: Omit<SprintVelocityRow, 'id' | 'created_at'> & Partial<Pick<SprintVelocityRow, 'id' | 'created_at'>>;
        Update: Partial<SprintVelocityRow>;
      };
      pipeline_events: {
        Row: PipelineEventRow;
        Insert: Omit<PipelineEventRow, 'id' | 'occurred_at'> & Partial<Pick<PipelineEventRow, 'id' | 'occurred_at'>>;
        Update: Partial<PipelineEventRow>;
      };
    };
  };
}

// ── Row types ──

export interface AgentRow {
  id: string;
  slug: string;
  display_name: string;
  tier: 'TRAIN' | 'COACH' | 'CATCH';
  llm_provider: 'claude' | 'gemini' | 'gpt';
  llm_model: string;
  runtime: 'ax-cloud' | 'ax-moltworker' | 'ax-agent-studio';
  description: string | null;
  status: 'active' | 'idle' | 'offline';
  last_triggered_at: string | null;
  avg_response_ms: number | null;
  total_interactions: number;
  created_at: string;
  updated_at: string;
}

export interface AirmanRow {
  id: string;
  callsign: string;
  afsc: string;
  current_level: '3' | '5' | '7';
  rank: string;
  cfetp_tasks_total: number;
  cfetp_tasks_certified: number;
  cdc_volumes_complete: number;
  cdc_eoc_passed: boolean;
  sprint_stories_completed: number;
  satisfaction_score: number | null;
  enrolled_at: string;
  updated_at: string;
}

export interface CfetpTaskRow {
  id: string;
  task_number: string;
  description: string;
  cdc_volume: number | null;
  category: 'core' | 'supporting' | 'optional';
  required_for_5_level: boolean;
}

export interface AirmanTaskCertificationRow {
  id: string;
  airman_id: string;
  task_id: string;
  jira_story: string | null;
  certified_at: string;
  supervisor_signed: boolean;
}

export interface CoachingLogRow {
  id: string;
  airman_id: string | null;
  agent_id: string | null;
  channel: string | null;
  airman_message: string;
  agent_response: string;
  is_question: boolean;
  jira_story: string | null;
  triggered_by: 'mention' | 'webhook' | 'scheduled' | 'proactive' | null;
  created_at: string;
}

export interface DoraMetricsRow {
  id: string;
  recorded_date: string;
  deployment_frequency: number | null;
  lead_time_hours: number | null;
  change_failure_rate: number | null;
  mean_time_to_recover_hours: number | null;
  sprint_number: number | null;
  created_at: string;
}

export interface SprintVelocityRow {
  id: string;
  sprint_number: number;
  points_committed: number;
  points_completed: number;
  ai_coaching_interactions: number;
  code_review_findings: number;
  test_coverage_pct: number | null;
  sprint_start: string | null;
  sprint_end: string | null;
  created_at: string;
}

export interface PipelineEventRow {
  id: string;
  event_type: 'push' | 'merge_request' | 'pipeline' | 'deployment' | 'failed_check';
  airman_id: string | null;
  branch: string | null;
  commit_sha: string | null;
  jira_story: string | null;
  status: 'success' | 'failure' | 'pending' | 'running' | null;
  agent_triggered: string | null;
  details: Record<string, unknown> | null;
  occurred_at: string;
}
