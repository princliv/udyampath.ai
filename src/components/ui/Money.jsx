import { formatMoney } from "@/lib/money";

export function Money({ amount, period = "mo", compact = false }) {
  return <span className="tabular-nums">{formatMoney(amount, { period, compact })}</span>;
}
