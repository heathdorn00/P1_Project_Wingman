const SPRINTS = [
  { sprint: 'Sprint 1', planned: 21, completed: 18, carryOver: 3 },
  { sprint: 'Sprint 2', planned: 26, completed: 24, carryOver: 2 },
  { sprint: 'Sprint 3', planned: 29, completed: 15, carryOver: 0, current: true },
];

const MAX_POINTS = 35;

function Bar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-zinc-500 w-20 text-right">{label}</span>
      <div className="flex-1 h-4 bg-zinc-800 rounded-sm overflow-hidden">
        <div
          className={`h-full ${color} transition-all rounded-sm`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-zinc-300 w-6 text-right">{value}</span>
    </div>
  );
}

export function SprintVelocityChart() {
  return (
    <div className="space-y-4">
      {SPRINTS.map((s) => (
        <div key={s.sprint} className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-300">
              {s.sprint}
              {s.current && <span className="text-[10px] text-yellow-400 ml-2">(IN PROGRESS)</span>}
            </span>
            <span className="text-[10px] text-zinc-500">
              {s.completed}/{s.planned} pts ({Math.round((s.completed / s.planned) * 100)}%)
            </span>
          </div>
          <div className="space-y-1.5">
            <Bar value={s.planned} max={MAX_POINTS} color="bg-zinc-600" label="Planned" />
            <Bar value={s.completed} max={MAX_POINTS} color="bg-violet-500" label="Completed" />
            {s.carryOver > 0 && (
              <Bar value={s.carryOver} max={MAX_POINTS} color="bg-orange-500" label="Carry Over" />
            )}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between text-[10px] text-zinc-600 px-1">
        <span>Avg Velocity: 19 pts/sprint</span>
        <span>Predictability: 87%</span>
        <span>Trend: Accelerating</span>
      </div>
    </div>
  );
}
