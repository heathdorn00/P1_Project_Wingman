import { Badge } from '@/components/ui/badge';

interface CompletedStory {
  key: string;
  summary: string;
  points: number;
  completedDate: string;
  status: 'done' | 'in-progress' | 'review';
}

interface AirmanStoryData {
  name: string;
  callsign: string;
  rank: string;
  stories: CompletedStory[];
}

// TODO: Replace with Supabase query joining airmen + Jira data
const MOCK_AIRMAN_STORIES: Record<string, AirmanStoryData> = {
  rodriguez: {
    name: 'Airman Rodriguez',
    callsign: 'Rodriguez',
    rank: 'A1C',
    stories: [
      { key: 'PW-12', summary: 'Add Tier Filter Tabs to Agent Status Grid', points: 5, completedDate: '2026-03-08', status: 'done' },
      { key: 'PW-5', summary: 'Zod Schema Validation for Airman Profiles', points: 3, completedDate: '2026-03-05', status: 'done' },
      { key: 'PW-3', summary: 'Agent Status Grid Component', points: 5, completedDate: '2026-03-02', status: 'done' },
      { key: 'PW-8', summary: 'CFETP Task Checklist Display', points: 8, completedDate: '2026-02-28', status: 'done' },
      { key: 'PW-14', summary: 'Real-Time Coaching Log Feed', points: 5, completedDate: '', status: 'in-progress' },
      { key: 'PW-16', summary: 'Dark/Light Mode Toggle with P1 Branding', points: 3, completedDate: '', status: 'review' },
    ],
  },
  drake: {
    name: 'Airman Drake',
    callsign: 'Drake',
    rank: 'Amn',
    stories: [
      { key: 'PW-27', summary: 'Unit Testing Fundamentals with Vitest', points: 5, completedDate: '', status: 'in-progress' },
    ],
  },
};

const statusConfig = {
  done: { label: 'DONE', className: 'border-green-500 text-green-400' },
  'in-progress': { label: 'IN PROGRESS', className: 'border-blue-500 text-blue-400' },
  review: { label: 'IN REVIEW', className: 'border-yellow-500 text-yellow-400' },
} as const;

interface AirmanStoryTrackerProps {
  airmanId?: string;
}

export function AirmanStoryTracker({ airmanId = 'rodriguez' }: AirmanStoryTrackerProps) {
  const data = MOCK_AIRMAN_STORIES[airmanId];
  if (!data) return null;

  const completedStories = data.stories.filter((s) => s.status === 'done');
  const totalPointsCompleted = completedStories.reduce((sum, s) => sum + s.points, 0);
  const totalPointsAll = data.stories.reduce((sum, s) => sum + s.points, 0);
  const inProgressCount = data.stories.filter((s) => s.status === 'in-progress').length;
  const inReviewCount = data.stories.filter((s) => s.status === 'review').length;

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">{data.name}</h3>
          <span className="text-xs text-zinc-500">{data.rank} · AFSC 1D7X1Z</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{totalPointsCompleted}</div>
          <div className="text-xs text-zinc-500">pts completed</div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded bg-zinc-800/50 p-2 text-center">
          <div className="text-lg font-bold text-green-400">{completedStories.length}</div>
          <div className="text-xs text-zinc-500">Done</div>
        </div>
        <div className="rounded bg-zinc-800/50 p-2 text-center">
          <div className="text-lg font-bold text-blue-400">{inProgressCount}</div>
          <div className="text-xs text-zinc-500">In Progress</div>
        </div>
        <div className="rounded bg-zinc-800/50 p-2 text-center">
          <div className="text-lg font-bold text-yellow-400">{inReviewCount}</div>
          <div className="text-xs text-zinc-500">In Review</div>
        </div>
      </div>

      {/* Points progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-zinc-400 mb-1">
          <span>Story Points</span>
          <span>{totalPointsCompleted} / {totalPointsAll} pts</span>
        </div>
        <div className="h-2 w-full bg-zinc-800 rounded-full">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all"
            style={{ width: `${(totalPointsCompleted / totalPointsAll) * 100}%` }}
          />
        </div>
      </div>

      {/* Story list */}
      <div className="space-y-2">
        {data.stories.map((story) => {
          const config = statusConfig[story.status];
          return (
            <div
              key={story.key}
              className="flex items-center justify-between rounded bg-zinc-800/30 px-3 py-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-violet-400 shrink-0">{story.key}</span>
                <span className="text-xs text-zinc-300 truncate">{story.summary}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-xs font-bold text-zinc-400">{story.points} pts</span>
                <Badge variant="outline" className={`text-[10px] ${config.className}`}>
                  {config.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      {/* Velocity note */}
      {completedStories.length > 0 && (
        <div className="mt-3 text-xs text-zinc-500 text-center">
          Avg velocity: {(totalPointsCompleted / 3).toFixed(1)} pts/sprint
        </div>
      )}
    </div>
  );
}
