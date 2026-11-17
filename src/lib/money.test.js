import { formatMoney } from "./money";

test("formats rupees with an Indian grouping and a period", () => {
  expect(formatMoney(125000)).toBe("₹1,25,000/mo");
});

test("uses lakhs when compact", () => {
  expect(formatMoney(120000, { compact: true })).toBe("₹1.2L/mo");
  expect(formatMoney(1200000, { compact: true, period: "yr" })).toBe("₹12L/yr");
});

test("returns a dash for a missing amount", () => {
  expect(formatMoney(undefined)).toBe("—");
});
