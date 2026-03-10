import { describe, it, expect } from 'vitest';
import {
  resolveAgentForEvent,
  buildCoachingPrompt,
  type GitHubPushEvent,
  type GitHubPREvent,
} from '@/lib/ax-platform';

describe('resolveAgentForEvent', () => {
  it('routes push events to git_coach', () => {
    expect(resolveAgentForEvent('push', {})).toBe('git_coach');
  });

  it('routes pull_request events to code_reviewer', () => {
    expect(resolveAgentForEvent('pull_request', {})).toBe('code_reviewer');
  });

  it('routes deployment events to devsecops_lead', () => {
    expect(resolveAgentForEvent('deployment', {})).toBe('devsecops_lead');
  });

  it('routes workflow_run events to devsecops_lead', () => {
    expect(resolveAgentForEvent('workflow_run', {})).toBe('devsecops_lead');
  });

  it('routes check_suite events to test_engineer', () => {
    expect(resolveAgentForEvent('check_suite', {})).toBe('test_engineer');
  });

  it('defaults unknown events to scrum_coach', () => {
    expect(resolveAgentForEvent('issue_comment', {})).toBe('scrum_coach');
  });
});

describe('buildCoachingPrompt', () => {
  it('builds a push coaching prompt with commit messages', () => {
    const payload: GitHubPushEvent = {
      ref: 'refs/heads/feature/PW-5-zod-validation',
      commits: [
        { id: 'abc123', message: 'Add user schema', author: { name: 'rodriguez' } },
        { id: 'def456', message: 'Fix typo', author: { name: 'rodriguez' } },
      ],
      repository: { full_name: 'heathdorn00/P1_Project_Wingman' },
      pusher: { name: 'rodriguez' },
    };

    const prompt = buildCoachingPrompt('push', payload, 'rodriguez');
    expect(prompt).toContain('Airman rodriguez');
    expect(prompt).toContain('refs/heads/feature/PW-5-zod-validation');
    expect(prompt).toContain('- Add user schema');
    expect(prompt).toContain('- Fix typo');
    expect(prompt).toContain('Socratic question');
    expect(prompt).toContain('commit hygiene');
  });

  it('builds a pull_request coaching prompt with PR details', () => {
    const payload: GitHubPREvent = {
      action: 'opened',
      number: 42,
      pull_request: {
        title: 'Add Zod validation for airman profiles',
        body: 'Implements PW-5',
        user: { login: 'rodriguez' },
        base: { ref: 'main' },
        head: { ref: 'feature/PW-5-zod-validation', sha: 'abc123' },
        additions: 150,
        deletions: 10,
      },
    };

    const prompt = buildCoachingPrompt('pull_request', payload, 'rodriguez');
    expect(prompt).toContain('PR #42');
    expect(prompt).toContain('Add Zod validation for airman profiles');
    expect(prompt).toContain('+150 / -10');
    expect(prompt).toContain('Base: main');
    expect(prompt).toContain('Socratic method');
  });

  it('returns a generic prompt for unknown event types', () => {
    const prompt = buildCoachingPrompt('deployment', {} as GitHubPushEvent, 'rodriguez');
    expect(prompt).toContain('New deployment event');
    expect(prompt).toContain('Airman rodriguez');
  });
});
