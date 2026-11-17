export function Progress({ value = 0, label = "Progress" }) {
  const percent = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm text-n-800">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-n-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="h-full rounded-full bg-accent-ink" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
