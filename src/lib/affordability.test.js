import { affordability, signedInr } from "./affordability";

test("treats a five-figure salary as monthly", () => {
  const fit = affordability({ salary: "45000", monthlyCost: 47000 });
  expect(fit.recommended).toBe(false);
  expect(fit.salaryPeriod).toBe("monthly");
  expect(Math.round(fit.delta)).toBe(-2000);
});

test("converts a six-figure salary from annual to monthly", () => {
  const fit = affordability({ salary: 600000, monthlyCost: 40000 });
  expect(fit.salaryPeriod).toBe("annual");
  expect(fit.monthlyPay).toBe(50000);
  expect(fit.recommended).toBe(true);
});

test("returns null when the city cost is missing", () => {
  expect(affordability({ salary: 45000, monthlyCost: 0 })).toBeNull();
});

test("formats a shortfall with a minus", () => {
  expect(signedInr(-2000)).toBe("−₹2,000");
  expect(signedInr(8000)).toBe("+₹8,000");
});
