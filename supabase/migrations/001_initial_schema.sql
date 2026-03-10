-- ============================================================
-- PROJECT WINGMAN — Supabase Schema
-- Digital Transformations LLC · AX Platform
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- AGENTS TABLE
-- Tracks the 15 AI mentors and their live status
-- ============================================================
create table agents (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,          -- e.g. 'scrum_coach'
  display_name  text not null,                  -- e.g. '@scrum_coach'
  tier          text not null check (tier in ('TRAIN', 'COACH', 'CATCH')),
  llm_provider  text not null check (llm_provider in ('claude', 'gemini', 'gpt')),
  llm_model     text not null,                  -- e.g. 'claude-opus-4-6'
  runtime       text not null check (runtime in ('ax-cloud', 'ax-moltworker', 'ax-agent-studio')),
  description   text,
  status        text not null default 'idle' check (status in ('active', 'idle', 'offline')),
  last_triggered_at timestamptz,
  avg_response_ms   integer,
  total_interactions integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Seed: all 15 agents
insert into agents (slug, display_name, tier, llm_provider, llm_model, runtime, description) values
  ('career_progression', '@career_progression', 'TRAIN',  'claude',  'claude-opus-4-6',          'ax-cloud',       'CFETP task mapping, 3→5 level upgrade tracking, EPR bullet drafting'),
  ('cdc_tutor',          '@cdc_tutor',          'TRAIN',  'claude',  'claude-sonnet-4-5',         'ax-cloud',       'Socratic CDC study coach, knowledge gap tracking, practice exams'),
  ('epr_writer',         '@epr_writer',         'TRAIN',  'gpt',     'gpt-5-mini',                'ax-cloud',       'EPR bullets in Action; Impact--Result Air Force format'),
  ('scrum_coach',        '@scrum_coach',        'COACH',  'claude',  'claude-opus-4-6',           'ax-cloud',       'PhD-level Agile/DevSecOps coach; 9 frameworks; military culture specialist'),
  ('product_coach',      '@product_coach',      'COACH',  'claude',  'claude-sonnet-4-5',         'ax-cloud',       'User story quality, backlog health, INVEST criteria'),
  ('architect',          '@architect',          'COACH',  'claude',  'claude-opus-4-6',           'ax-agent-studio','System design coaching; ADRs; TypeScript/K8s patterns'),
  ('frontend_dev',       '@frontend_dev',       'COACH',  'claude',  'claude-sonnet-4-5',         'ax-cloud',       'React/TypeScript mentorship, Section 508 accessibility'),
  ('backend_dev',        '@backend_dev',        'COACH',  'claude',  'claude-sonnet-4-5',         'ax-cloud',       'REST API design, Node.js patterns, database coaching'),
  ('ai_mentor',          '@ai_mentor',          'COACH',  'gemini',  'gemini-2.5-pro',            'ax-cloud',       'AI fundamentals, MCP protocol, AX Platform education'),
  ('git_coach',          '@git_coach',          'COACH',  'gemini',  'gemini-2.5-flash',          'ax-moltworker',  'Real-time GitLab webhook coaching on commits/branching'),
  ('code_reviewer',      '@code_reviewer',      'CATCH',  'claude',  'claude-opus-4-6',           'ax-moltworker',  'Automated MR review on every merge request'),
  ('test_engineer',      '@test_engineer',      'CATCH',  'claude',  'claude-sonnet-4-5',         'ax-cloud',       'Test coverage review, TDD coaching'),
  ('devsecops_lead',     '@devsecops_lead',     'CATCH',  'claude',  'claude-sonnet-4-5',         'ax-moltworker',  'Pipeline health, DORA metrics, DevSecOps coaching'),
  ('security_engineer',  '@security_engineer',  'CATCH',  'gpt',     'gpt-5',                     'ax-cloud',       'OWASP, STIG compliance, SAST/DAST remediation'),
  ('license_compliance', '@license_compliance', 'CATCH',  'gemini',  'gemini-2.5-flash',          'ax-moltworker',  'Daily automated npm license and CVE scanning');

-- ============================================================
-- AIRMEN TABLE
-- 4 junior enlisted Airmen (anonymized for pilot)
-- ============================================================
create table airmen (
  id              uuid primary key default uuid_generate_v4(),
  callsign        text unique not null,          -- Alpha, Bravo, Charlie, Delta
  afsc            text not null default '1D7X1Z',
  current_level   text not null default '3' check (current_level in ('3','5','7')),
  rank            text not null default 'A1C',   -- A1C, SrA, SSgt
  cfetp_tasks_total    integer not null default 47,
  cfetp_tasks_certified integer not null default 0,
  cdc_volumes_complete  integer not null default 0,  -- out of 6
  cdc_eoc_passed       boolean default false,
  sprint_stories_completed integer default 0,
  satisfaction_score   numeric(3,1),              -- 0.0–10.0
  enrolled_at     timestamptz default now(),
  updated_at      timestamptz default now()
);

insert into airmen (callsign, rank, cfetp_tasks_certified, cdc_volumes_complete, sprint_stories_completed) values
  ('Alpha',   'A1C', 12, 2, 8),
  ('Bravo',   'SrA', 18, 3, 11),
  ('Charlie', 'A1C', 9,  1, 6),
  ('Delta',   'A1C', 14, 2, 9);

-- ============================================================
-- CFETP_TASKS TABLE
-- 1D7X1Z core task list mapped to CDC volumes
-- ============================================================
create table cfetp_tasks (
  id          uuid primary key default uuid_generate_v4(),
  task_number text not null,                     -- e.g. '2.1.3'
  description text not null,
  cdc_volume  integer check (cdc_volume between 1 and 6),
  category    text not null check (category in ('core','supporting','optional')),
  required_for_5_level boolean default false
);

-- ============================================================
-- AIRMAN_TASK_CERTIFICATIONS TABLE
-- Junction: which Airman certified which task, when, via what sprint story
-- ============================================================
create table airman_task_certifications (
  id          uuid primary key default uuid_generate_v4(),
  airman_id   uuid references airmen(id) on delete cascade,
  task_id     uuid references cfetp_tasks(id) on delete cascade,
  jira_story  text,                              -- e.g. 'PW-42'
  certified_at timestamptz default now(),
  supervisor_signed boolean default false,
  unique(airman_id, task_id)
);

-- ============================================================
-- COACHING_LOG TABLE
-- Every @mention interaction — the Socratic method in action
-- ============================================================
create table coaching_log (
  id            uuid primary key default uuid_generate_v4(),
  airman_id     uuid references airmen(id) on delete set null,
  agent_id      uuid references agents(id) on delete set null,
  channel       text,                            -- e.g. 'ax-wingman-sprint3'
  airman_message text not null,
  agent_response text not null,
  is_question   boolean default true,            -- true = Socratic (good), false = directive answer
  jira_story    text,                            -- linked story if applicable
  triggered_by  text check (triggered_by in ('mention','webhook','scheduled','proactive')),
  created_at    timestamptz default now()
);

-- ============================================================
-- DORA_METRICS TABLE
-- Daily snapshot of the 4 DORA key metrics
-- ============================================================
create table dora_metrics (
  id                      uuid primary key default uuid_generate_v4(),
  recorded_date           date not null default current_date,
  deployment_frequency    numeric(5,2),          -- deployments per week
  lead_time_hours         numeric(6,1),          -- commit to production (hours)
  change_failure_rate     numeric(5,2),          -- % of deployments causing failure
  mean_time_to_recover_hours numeric(6,1),
  sprint_number           integer,
  created_at              timestamptz default now(),
  unique(recorded_date)
);

insert into dora_metrics (recorded_date, deployment_frequency, lead_time_hours, change_failure_rate, mean_time_to_recover_hours, sprint_number) values
  (current_date - 14, 1.0, 72.0, 25.0, 48.0, 1),
  (current_date - 7,  2.5, 38.0, 15.0, 24.0, 2),
  (current_date,      4.0, 18.0,  8.0, 12.0, 3);

-- ============================================================
-- SPRINT_VELOCITY TABLE
-- Points committed vs completed per sprint
-- ============================================================
create table sprint_velocity (
  id              uuid primary key default uuid_generate_v4(),
  sprint_number   integer not null unique,
  points_committed integer not null,
  points_completed integer not null,
  ai_coaching_interactions integer default 0,
  code_review_findings     integer default 0,
  test_coverage_pct        numeric(5,2),
  sprint_start    date,
  sprint_end      date,
  created_at      timestamptz default now()
);

insert into sprint_velocity (sprint_number, points_committed, points_completed, ai_coaching_interactions, code_review_findings, test_coverage_pct, sprint_start, sprint_end) values
  (1, 20, 14, 42,  18, 61.0, current_date - 28, current_date - 15),
  (2, 24, 20, 78,  11, 74.0, current_date - 14, current_date - 1),
  (3, 28, 26, 103,  6, 83.0, current_date,      current_date + 13);

-- ============================================================
-- PIPELINE_EVENTS TABLE
-- GitHub Actions / GitLab CI events — feeds @git_coach + @code_reviewer
-- ============================================================
create table pipeline_events (
  id            uuid primary key default uuid_generate_v4(),
  event_type    text not null check (event_type in ('push','merge_request','pipeline','deployment','failed_check')),
  airman_id     uuid references airmen(id) on delete set null,
  branch        text,
  commit_sha    text,
  jira_story    text,
  status        text check (status in ('success','failure','pending','running')),
  agent_triggered text,                          -- which agent was notified
  details       jsonb,
  occurred_at   timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table agents                    enable row level security;
alter table airmen                    enable row level security;
alter table coaching_log              enable row level security;
alter table dora_metrics              enable row level security;
alter table sprint_velocity           enable row level security;
alter table pipeline_events           enable row level security;
alter table airman_task_certifications enable row level security;

-- Public read for dashboard (demo mode — lock down in production)
create policy "public_read_agents"       on agents       for select using (true);
create policy "public_read_airmen"       on airmen       for select using (true);
create policy "public_read_dora"         on dora_metrics for select using (true);
create policy "public_read_velocity"     on sprint_velocity for select using (true);
create policy "public_read_coaching_log" on coaching_log  for select using (true);
create policy "public_read_pipeline"     on pipeline_events for select using (true);

-- ============================================================
-- REALTIME: enable for live dashboard updates
-- ============================================================
alter publication supabase_realtime add table coaching_log;
alter publication supabase_realtime add table pipeline_events;
alter publication supabase_realtime add table agents;
