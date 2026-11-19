import { describe, expect, test } from "vitest";
import { gradeAttempt, publicQuestion, selectQuestions } from "./grade";

const banks = [
  { id: "q1", courseId: "*", usage: "quiz", prompt: "One", options: ["a", "b"], correct: 0, explanation: "a" },
  { id: "q2", courseId: "java", usage: "quiz", prompt: "Two", options: ["a", "b"], correct: 1, explanation: "b" },
  { id: "f1", courseId: "*", usage: "final", prompt: "Final", options: ["a"], correct: 0, explanation: "a" },
];

describe("assessment grading", () => {
  test("prefers course questions and hides the answer key", () => {
    const chosen = selectQuestions(banks, { courseId: "java", kind: "quiz" });
    expect(chosen.map((question) => question.id)).toEqual(["q2"]);
    expect(publicQuestion(chosen[0])).toEqual({ id: "q2", prompt: "Two", options: ["a", "b"] });
  });

  test("scores on the server and passes at 70", () => {
    const result = gradeAttempt(banks.slice(0, 2), { q1: 0, q2: 0 });
    expect(result).toMatchObject({ score: 50, correct: 1, total: 2, passed: false });
    expect(gradeAttempt(banks.slice(0, 1), { q1: 0 }).passed).toBe(true);
  });
});
