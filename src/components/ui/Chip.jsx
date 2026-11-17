import { Circle } from "lucide-react";

const tones = {
  neutral: "bg-n-100 text-n-800",
  info: "bg-brand-50 text-brand-800",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  gold: "bg-warning-bg text-warning",
};

export function Chip({ icon: Icon = Circle, children, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {Icon ? <Icon size={14} strokeWidth={1.75} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
