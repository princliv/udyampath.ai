/** Format a rupee amount for Indian readers. */
export function inr(amount) {
  const value = Math.abs(Math.round(Number(amount) || 0));
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Signed rupee delta, using a minus glyph so it stays readable in chips. */
export function signedInr(amount) {
  const n = Math.round(Number(amount) || 0);
  return `${n >= 0 ? "+" : "−"}${inr(n)}`;
}

/**
 * Compare a posted salary with a city's monthly cost of living.
 * The job catalogue does not store a pay period. Figures of ₹1,00,000
 * or more are treated as annual and divided by 12. Smaller figures are
 * treated as monthly. Callers must label the result as estimated.
 */
export function affordability({ salary, monthlyCost }) {
  const raw = Number(salary);
  const cost = Number(monthlyCost);
  if (!Number.isFinite(raw) || raw <= 0 || !Number.isFinite(cost) || cost <= 0) {
    return null;
  }

  const annual = raw >= 100000;
  const monthlyPay = annual ? raw / 12 : raw;
  const delta = monthlyPay - cost;

  return {
    monthlyPay,
    monthlyCost: cost,
    delta,
    recommended: delta >= 0,
    salaryPeriod: annual ? "annual" : "monthly",
    estimated: true,
  };
}
