export function selectQuestions(banks, { courseId, kind, limit = 5 }) {
  const pool = banks.filter((question) => question.usage === kind && (question.courseId === courseId || question.courseId === "*"));
  const specific = pool.filter((question) => question.courseId === courseId);
  return (specific.length ? specific : pool).slice(0, limit);
}

export function publicQuestion(question) {
  return { id: question.id, prompt: question.prompt, options: question.options };
}

export function gradeAttempt(questions, answers = {}) {
  let correct = 0;
  const perQuestion = questions.map((question) => {
    const ok = String(answers[question.id] ?? "") === String(question.correct);
    if (ok) correct += 1;
    return { id: question.id, correct: ok, explanation: question.explanation || "" };
  });
  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  return { score, correct, total, passed: score >= 70, perQuestion };
}
