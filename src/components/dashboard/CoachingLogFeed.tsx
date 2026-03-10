import { useState } from 'react';
import type { CoachingMessage } from '@/lib/ax-platform';

const MOCK_LOG: CoachingMessage[] = [
  {
    id: '1',
    airman_callsign: 'Alpha',
    agent_slug: 'code_reviewer',
    agent_display_name: 'Code Reviewer',
    tier: 'CATCH',
    airman_message: 'Opened PR #3: Add Zod validation for airman profiles',
    agent_response: 'I see you\'re validating the AFSC field with a regex. What would happen if the Air Force introduces a new AFSC format with 7 characters? How might you make this validation more resilient to future changes?',
    is_question: true,
    jira_story: 'PW-5',
    triggered_by: 'webhook',
    created_at: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: '2',
    airman_callsign: 'Bravo',
    agent_slug: 'git_coach',
    agent_display_name: 'Git Coach',
    tier: 'COACH',
    airman_message: 'Pushed 3 commits to feature/branching-practice',
    agent_response: 'Your commit messages are getting more descriptive! I noticed two of them start with "fix" — what\'s the difference between a fix and a refactor, and which one better describes what you did in commit abc123?',
    is_question: true,
    jira_story: null,
    triggered_by: 'webhook',
    created_at: new Date(Date.now() - 12 * 60_000).toISOString(),
  },
  {
    id: '3',
    airman_callsign: 'Charlie',
    agent_slug: 'devsecops_lead',
    agent_display_name: 'DevSecOps Lead',
    tier: 'CATCH',
    airman_message: 'CI pipeline failed on security audit step',
    agent_response: 'The npm audit found a high-severity vulnerability in a transitive dependency. Before you fix it, can you trace which direct dependency pulls it in? Understanding the dependency tree is a key DevSecOps skill.',
    is_question: true,
    jira_story: null,
    triggered_by: 'mention',
    created_at: new Date(Date.now() - 25 * 60_000).toISOString(),
  },
  {
    id: '4',
    airman_callsign: 'Alpha',
    agent_slug: 'career_progression',
    agent_display_name: 'Career Progression',
    tier: 'TRAIN',
    airman_message: 'How many more tasks until I hit 5-level?',
    agent_response: 'You\'re at 68% completion with 17 of 25 core tasks done. The remaining 8 tasks focus on Security Implementation and System Administration — areas where you\'ll need sign-off from your supervisor. What\'s your plan to schedule those hands-on evaluations?',
    is_question: true,
    jira_story: null,
    triggered_by: 'mention',
    created_at: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
];

const tierColor: Record<string, string> = {
  TRAIN: 'text-blue-400',
  COACH: 'text-violet-400',
  CATCH: 'text-orange-400',
};

export function CoachingLogFeed() {
  const [entries] = useState<CoachingMessage[]>(MOCK_LOG);

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${tierColor[entry.tier]}`}>
                {entry.agent_display_name}
              </span>
              <span className="text-[10px] text-zinc-600">→</span>
              <span className="text-xs text-zinc-300">{entry.airman_callsign}</span>
            </div>
            <div className="flex items-center gap-2">
              {entry.jira_story && (
                <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                  {entry.jira_story}
                </span>
              )}
              <span className="text-[10px] text-zinc-600">
                {new Date(entry.created_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 mb-1 italic">"{entry.airman_message}"</div>
          <div className="text-xs text-zinc-300 leading-relaxed">{entry.agent_response}</div>
        </div>
      ))}
    </div>
  );
}
