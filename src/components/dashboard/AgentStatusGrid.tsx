import { useEffect, useState } from 'react';
import type { AXAgent } from '@/lib/ax-platform';

const MOCK_AGENTS: AXAgent[] = [
  { id: '1', slug: 'scrum_coach', display_name: 'Scrum Coach Fulcrum', tier: 'COACH', llm_provider: 'claude', llm_model: 'claude-sonnet-4-6', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 1200, total_interactions: 342 },
  { id: '2', slug: 'code_reviewer', display_name: 'Code Reviewer', tier: 'CATCH', llm_provider: 'claude', llm_model: 'claude-sonnet-4-6', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 980, total_interactions: 156 },
  { id: '3', slug: 'devsecops_lead', display_name: 'DevSecOps Lead', tier: 'CATCH', llm_provider: 'gpt', llm_model: 'gpt-4o', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 1400, total_interactions: 89 },
  { id: '4', slug: 'career_progression', display_name: 'Career Progression', tier: 'TRAIN', llm_provider: 'claude', llm_model: 'claude-sonnet-4-6', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 1100, total_interactions: 67 },
  { id: '5', slug: 'security_engineer', display_name: 'Security Engineer', tier: 'CATCH', llm_provider: 'gemini', llm_model: 'gemini-2.5-pro', runtime: 'ax-cloud', status: 'idle', last_triggered_at: null, avg_response_ms: 1600, total_interactions: 45 },
  { id: '6', slug: 'git_coach', display_name: 'Git Coach', tier: 'COACH', llm_provider: 'claude', llm_model: 'claude-haiku-4-5', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 450, total_interactions: 210 },
  { id: '7', slug: 'frontend_dev_1', display_name: 'Frontend Dev 1', tier: 'COACH', llm_provider: 'gpt', llm_model: 'gpt-4o', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 1300, total_interactions: 78 },
  { id: '8', slug: 'backend_dev_1', display_name: 'Backend Dev 1', tier: 'COACH', llm_provider: 'claude', llm_model: 'claude-sonnet-4-6', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 1050, total_interactions: 93 },
  { id: '9', slug: 'test_engineer', display_name: 'Test Engineer', tier: 'CATCH', llm_provider: 'claude', llm_model: 'claude-haiku-4-5', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 380, total_interactions: 124 },
  { id: '10', slug: 'product_coach', display_name: 'Product Coach', tier: 'COACH', llm_provider: 'gpt', llm_model: 'gpt-4o', runtime: 'ax-cloud', status: 'idle', last_triggered_at: null, avg_response_ms: 1500, total_interactions: 34 },
  { id: '11', slug: 'gpt_agent', display_name: 'GPT Agent', tier: 'COACH', llm_provider: 'claude', llm_model: 'claude-opus-4-6', runtime: 'ax-moltworker', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 2100, total_interactions: 15 },
  { id: '12', slug: 'heath_assistant1', display_name: 'Heath Assistant 1', tier: 'TRAIN', llm_provider: 'claude', llm_model: 'claude-sonnet-4-6', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 900, total_interactions: 201 },
  { id: '13', slug: 'onboarding_guide', display_name: 'Onboarding Guide', tier: 'TRAIN', llm_provider: 'gemini', llm_model: 'gemini-2.5-flash', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 320, total_interactions: 55 },
  { id: '14', slug: 'docs_writer', display_name: 'Docs Writer', tier: 'COACH', llm_provider: 'claude', llm_model: 'claude-haiku-4-5', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 400, total_interactions: 88 },
  { id: '15', slug: 'incident_responder', display_name: 'Incident Responder', tier: 'CATCH', llm_provider: 'claude', llm_model: 'claude-sonnet-4-6', runtime: 'ax-cloud', status: 'active', last_triggered_at: new Date().toISOString(), avg_response_ms: 750, total_interactions: 12 },
];

const tierColor: Record<string, string> = {
  TRAIN: 'border-blue-700 bg-blue-900/20',
  COACH: 'border-violet-700 bg-violet-900/20',
  CATCH: 'border-orange-700 bg-orange-900/20',
};

const statusDot: Record<string, string> = {
  active: 'bg-green-400',
  idle: 'bg-yellow-400',
  offline: 'bg-red-400',
};

const providerBadge: Record<string, string> = {
  claude: 'text-orange-400',
  gpt: 'text-emerald-400',
  gemini: 'text-blue-400',
};

const TIERS = ['All', 'TRAIN', 'COACH', 'CATCH'] as const;
type TierFilter = (typeof TIERS)[number];

const tierTabColor: Record<string, string> = {
  All: 'border-zinc-500 text-zinc-300',
  TRAIN: 'border-blue-500 text-blue-400',
  COACH: 'border-violet-500 text-violet-400',
  CATCH: 'border-orange-500 text-orange-400',
};

const tierTabActive: Record<string, string> = {
  All: 'bg-zinc-700/50 border-zinc-400 text-white',
  TRAIN: 'bg-blue-900/50 border-blue-400 text-blue-300',
  COACH: 'bg-violet-900/50 border-violet-400 text-violet-300',
  CATCH: 'bg-orange-900/50 border-orange-400 text-orange-300',
};

export function AgentStatusGrid() {
  const [agents, setAgents] = useState<AXAgent[]>([]);
  const [activeTier, setActiveTier] = useState<TierFilter>('All');

  useEffect(() => {
    // TODO: Replace with listAgents() from ax-platform client
    setAgents(MOCK_AGENTS);
  }, []);

  const filteredAgents = activeTier === 'All'
    ? agents
    : agents.filter((a) => a.tier === activeTier);

  const tierCounts: Record<string, number> = {
    All: agents.length,
    TRAIN: agents.filter((a) => a.tier === 'TRAIN').length,
    COACH: agents.filter((a) => a.tier === 'COACH').length,
    CATCH: agents.filter((a) => a.tier === 'CATCH').length,
  };

  return (
    <div>
      {/* Tier Filter Tabs — PW-12 (airman_rodriguez) */}
      <div className="flex gap-2 mb-3" role="tablist" aria-label="Filter agents by tier">
        {TIERS.map((tier) => (
          <button
            key={tier}
            role="tab"
            aria-selected={activeTier === tier}
            onClick={() => setActiveTier(tier)}
            onKeyDown={(e) => {
              const idx = TIERS.indexOf(activeTier);
              if (e.key === 'ArrowRight') setActiveTier(TIERS[(idx + 1) % TIERS.length]);
              if (e.key === 'ArrowLeft') setActiveTier(TIERS[(idx - 1 + TIERS.length) % TIERS.length]);
            }}
            className={`px-3 py-1.5 rounded border text-xs font-bold tracking-wide transition ${
              activeTier === tier ? tierTabActive[tier] : `${tierTabColor[tier]} border-zinc-700 hover:brightness-125`
            }`}
          >
            {tier} <span className="ml-1 opacity-70">({tierCounts[tier]})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2" role="tabpanel" aria-label={`${activeTier} agents`}>
      {filteredAgents.map((agent) => (
        <div
          key={agent.id}
          className={`rounded border px-3 py-2 ${tierColor[agent.tier]} hover:brightness-125 transition`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-zinc-200 truncate">{agent.display_name}</span>
            <span className={`h-2 w-2 rounded-full ${statusDot[agent.status]}`} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span className={providerBadge[agent.llm_provider]}>{agent.llm_model}</span>
            <span>{agent.avg_response_ms ?? '—'}ms</span>
          </div>
          <div className="text-[10px] text-zinc-600 mt-1">
            {agent.total_interactions} interactions · {agent.tier}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
