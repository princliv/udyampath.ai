import { describe, expect, test } from "vitest";
import { buildCertificatePdf, courseReady, specializationGaps } from "./certificate";

describe("certificates", () => {
  test("a course certificate needs finished lessons and a passed final", () => {
    expect(courseReady({ progressPct: 100, passedFinal: true })).toBe(true);
    expect(courseReady({ progressPct: 100, passedFinal: false })).toBe(false);
    expect(courseReady({ progressPct: 40, passedFinal: true })).toBe(false);
  });

  test("a specialization certificate lists the courses still open", () => {
    const gaps = specializationGaps(
      ["Machine Learning Fundamentals", "Computer Vision"],
      { titles: ["Machine Learning Fundamentals"], ids: [] },
    );
    expect(gaps).toEqual(["Computer Vision"]);
  });

  test("the pdf is a real document", async () => {
    const bytes = await buildCertificatePdf({
      recipientName: "Asha Rao",
      title: "Java",
      certificateId: "cert-demo",
      issuedAt: Date.parse("2026-11-19T00:00:00Z"),
    });
    const header = Buffer.from(bytes.slice(0, 5)).toString("utf8");
    expect(header).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(500);
  });
});
