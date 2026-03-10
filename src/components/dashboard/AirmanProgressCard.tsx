interface AirmanProgressCardProps {
  callsign: string;
}

const MOCK_DATA: Record<string, { rank: string; afsc: string; progress: number; tasksComplete: number; totalTasks: number; currentFocus: string; mentorAgent: string }> = {
  Alpha: { rank: 'A1C', afsc: '1D7X1Z', progress: 68, tasksComplete: 17, totalTasks: 25, currentFocus: 'Zod Validation (PW-5)', mentorAgent: 'Code Reviewer' },
  Bravo: { rank: 'Amn', afsc: '1D7X1Z', progress: 42, tasksComplete: 8, totalTasks: 19, currentFocus: 'Git Branching Fundamentals', mentorAgent: 'Git Coach' },
  Charlie: { rank: 'A1C', afsc: '1D7X1Z', progress: 85, tasksComplete: 22, totalTasks: 26, currentFocus: 'CI/CD Pipeline Security', mentorAgent: 'DevSecOps Lead' },
  Delta: { rank: 'AB', afsc: '1D7X1Z', progress: 25, tasksComplete: 5, totalTasks: 20, currentFocus: 'React Component Basics', mentorAgent: 'Frontend Dev 1' },
};

export function AirmanProgressCard({ callsign }: AirmanProgressCardProps) {
  const data = MOCK_DATA[callsign];
  if (!data) return null;

  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-sm font-bold text-white">{callsign}</span>
          <span className="text-xs text-zinc-500 ml-2">{data.rank} · {data.afsc}</span>
        </div>
        <span className="text-xs text-zinc-400">{data.progress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-zinc-800 rounded-full mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
          style={{ width: `${data.progress}%` }}
        />
      </div>

      <div className="space-y-1 text-xs text-zinc-400">
        <div className="flex justify-between">
          <span>Tasks</span>
          <span className="text-zinc-300">{data.tasksComplete}/{data.totalTasks}</span>
        </div>
        <div className="flex justify-between">
          <span>Current Focus</span>
          <span className="text-zinc-300 truncate ml-2">{data.currentFocus}</span>
        </div>
        <div className="flex justify-between">
          <span>Mentor</span>
          <span className="text-violet-400">{data.mentorAgent}</span>
        </div>
      </div>
    </div>
  );
}
