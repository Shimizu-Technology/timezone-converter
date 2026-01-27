export default function TimeOfDayLegend() {
  const items = [
    { icon: '🌅', label: 'Morning', color: '#f59e0b', time: '6am-12pm' },
    { icon: '☀️', label: 'Afternoon', color: '#22c55e', time: '12pm-6pm' },
    { icon: '🌆', label: 'Evening', color: '#f97316', time: '6pm-9pm' },
    { icon: '🌙', label: 'Night', color: '#6366f1', time: '9pm-6am' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs" style={{ color: 'var(--card-text-muted)' }}>
      <span className="font-semibold">Border colors:</span>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span 
            className="w-3 h-3 rounded-sm border"
            style={{ backgroundColor: item.color, borderColor: item.color }}
          />
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
