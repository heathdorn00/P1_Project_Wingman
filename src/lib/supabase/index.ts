export { supabase } from './client';

export {
  fetchAgents,
  updateAgentStatus,
  fetchAirmen,
  fetchRecentCoachingLogs,
  insertCoachingLog,
  fetchDoraMetrics,
  fetchSprintVelocity,
  fetchRecentPipelineEvents,
  subscribeToCoachingLog,
  subscribeToAgentStatus,
  subscribeToPipelineEvents,
} from './queries';

export type {
  Database,
  AgentRow,
  AirmanRow,
  CfetpTaskRow,
  AirmanTaskCertificationRow,
  CoachingLogRow,
  DoraMetricsRow,
  SprintVelocityRow,
  PipelineEventRow,
} from './types';
