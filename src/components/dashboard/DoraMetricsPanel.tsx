const METRICS = [
  {
    label: 'Deployment Frequency',
    value: '3.2/week',
    target: '5/week',
    level: 'Medium' as const,
    trend: 'up' as const,
  },
  {
    label: 'Lead Time for Changes',
    value: '2.4 days',
    target: '<1 day',
    level: 'Medium' as const,
    trend: 'down' as const,
  },
  {
    label: 'Mean Time to Recovery',
    value: '45 min',
    target: '<1 hr',
    level: 'High' as const,
    trend: 'stable' as const,
  },
  {
    label: 'Change Failure Rate',
    value: '8%',
    target: '<5%',
    level: 'Medium' as const,
    trend: 'down' as const,
  },
];

const levelColor: Record<string, string> = {
  Elite: 'text-green-400 bg-green-900/30',
  High: 'text-emerald-400 bg-emerald-900/30',
  Medium: 'text-yellow-400 bg-yellow-900/30',
  Low: 'text-red-400 bg-red-900/30',
};

const trendIcon: Record<string, string> = {
  up: '\u2191',
  down: '\u2193',
  stable: '\u2192',
};

export function DoraMetricsPanel() {
  return (
    <div className="space-y-3">
      {METRICS.map((m) => (
        <div key={m.label} className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-400">{m.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${levelColor[m.level]}`}>
              {m.level}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">{m.value}</span>
            <div className="text-right">
              <div className="text-[10px] text-zinc-600">Target: {m.target}</div>
              <div className="text-xs text-zinc-400">{trendIcon[m.trend]} trending</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
