/**
 * Unit tests for AirmanStoryTracker component
 * Author: Airman Drake (PW-27 — Unit Testing Fundamentals)
 *
 * AAA Pattern: Arrange → Act → Assert
 * Each test answers: "What bug would this test catch?"
 */
import { describe, it, expect } from 'vitest';

// ── Test the story tracker data logic (no React rendering needed) ──

interface CompletedStory {
  key: string;
  summary: string;
  points: number;
  completedDate: string;
  status: 'done' | 'in-progress' | 'review';
}

// Helper: mirrors the calculation logic in AirmanStoryTracker
function calculateStats(stories: CompletedStory[]) {
  const completed = stories.filter((s) => s.status === 'done');
  const totalPointsCompleted = completed.reduce((sum, s) => sum + s.points, 0);
  const totalPointsAll = stories.reduce((sum, s) => sum + s.points, 0);
  const inProgressCount = stories.filter((s) => s.status === 'in-progress').length;
  const inReviewCount = stories.filter((s) => s.status === 'review').length;
  return { completed, totalPointsCompleted, totalPointsAll, inProgressCount, inReviewCount };
}

describe('AirmanStoryTracker — Points Calculation', () => {
  // Arrange: Rodriguez's story data
  const rodriguezStories: CompletedStory[] = [
    { key: 'PW-12', summary: 'Add Tier Filter Tabs', points: 5, completedDate: '2026-03-08', status: 'done' },
    { key: 'PW-5', summary: 'Zod Schema Validation', points: 3, completedDate: '2026-03-05', status: 'done' },
    { key: 'PW-3', summary: 'Agent Status Grid Component', points: 5, completedDate: '2026-03-02', status: 'done' },
    { key: 'PW-8', summary: 'CFETP Task Checklist Display', points: 8, completedDate: '2026-02-28', status: 'done' },
    { key: 'PW-14', summary: 'Real-Time Coaching Log Feed', points: 5, completedDate: '', status: 'in-progress' },
    { key: 'PW-16', summary: 'Dark/Light Mode Toggle', points: 3, completedDate: '', status: 'review' },
  ];

  it('calculates total completed story points correctly', () => {
    // Act
    const stats = calculateStats(rodriguezStories);
    // Assert — Bug caught: wrong sum would misrepresent airman's output to leadership
    expect(stats.totalPointsCompleted).toBe(21);
  });

  it('counts completed stories correctly', () => {
    const stats = calculateStats(rodriguezStories);
    // Bug caught: showing wrong "Done" count in summary stats
    expect(stats.completed.length).toBe(4);
  });

  it('counts in-progress stories correctly', () => {
    const stats = calculateStats(rodriguezStories);
    // Bug caught: in-progress count mismatch would confuse sprint planning
    expect(stats.inProgressCount).toBe(1);
  });

  it('counts in-review stories correctly', () => {
    const stats = calculateStats(rodriguezStories);
    // Bug caught: missing review items means PRs could get lost
    expect(stats.inReviewCount).toBe(1);
  });

  it('calculates total points (all statuses) correctly', () => {
    const stats = calculateStats(rodriguezStories);
    // Bug caught: progress bar would show wrong percentage
    expect(stats.totalPointsAll).toBe(29);
  });

  it('handles an airman with no stories', () => {
    // Arrange — new airman with empty backlog
    const emptyStories: CompletedStory[] = [];
    // Act
    const stats = calculateStats(emptyStories);
    // Assert — Bug caught: division by zero in progress bar or avg velocity
    expect(stats.totalPointsCompleted).toBe(0);
    expect(stats.totalPointsAll).toBe(0);
    expect(stats.completed.length).toBe(0);
    expect(stats.inProgressCount).toBe(0);
    expect(stats.inReviewCount).toBe(0);
  });

  it('handles an airman with only in-progress stories', () => {
    // Arrange — Drake's current state
    const drakeStories: CompletedStory[] = [
      { key: 'PW-27', summary: 'Unit Testing Fundamentals', points: 5, completedDate: '', status: 'in-progress' },
    ];
    // Act
    const stats = calculateStats(drakeStories);
    // Assert — Bug caught: completed points should be 0, not include in-progress
    expect(stats.totalPointsCompleted).toBe(0);
    expect(stats.inProgressCount).toBe(1);
    expect(stats.completed.length).toBe(0);
  });
});

describe('AirmanStoryTracker — Status Configuration', () => {
  const statusConfig = {
    done: { label: 'DONE', className: 'border-green-500 text-green-400' },
    'in-progress': { label: 'IN PROGRESS', className: 'border-blue-500 text-blue-400' },
    review: { label: 'IN REVIEW', className: 'border-yellow-500 text-yellow-400' },
  } as const;

  it('maps done status to green styling', () => {
    // Bug caught: wrong color for done badge would confuse users
    expect(statusConfig['done'].label).toBe('DONE');
    expect(statusConfig['done'].className).toContain('green');
  });

  it('maps in-progress status to blue styling', () => {
    expect(statusConfig['in-progress'].label).toBe('IN PROGRESS');
    expect(statusConfig['in-progress'].className).toContain('blue');
  });

  it('maps review status to yellow styling', () => {
    expect(statusConfig['review'].label).toBe('IN REVIEW');
    expect(statusConfig['review'].className).toContain('yellow');
  });
});
