const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,25,000/mo. Compact form uses lakhs: ₹1.2L, ₹12L. */
export function formatMoney(amount, { period = "mo", compact = false } = {}) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";

  const sign = value < 0 ? "−" : "";
  const abs = Math.abs(value);

  if (compact && abs >= 100000) {
    const lakhs = abs / 100000;
    const digits = lakhs >= 10 ? 0 : 1;
    const text = lakhs.toFixed(digits).replace(/\.0$/, "");
    return `${sign}₹${text}L/${period}`;
  }

  const formatted = rupees.format(abs).replace(/[\s-]/g, "");
  return `${sign}${formatted}/${period}`;
}
