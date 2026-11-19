import { describe, expect, test } from "vitest";
import { courseRows, durationBucket, filterCourses, slugify, toCourse, withUniqueSlugs } from "./catalog";

describe("catalog", () => {
  test("builds a unique slug and syllabus lessons", () => {
    const course = toCourse({
      company: "Amazon",
      title: "Java",
      duration: "2 months",
      level: "Junior",
      skillsGained: ["OOP"],
      pathway: [{ title: "Intro", details: "Start", data: { type: "video", content: "https://example.com" } }],
    });
    expect(course.slug).toBe("amazon-java");
    expect(course.durationHours).toBe(80);
    expect(durationBucket(course.durationHours)).toBe("medium");
    expect(course.modules[0].lessons[0].type).toBe("video");
  });

  test("keeps duplicate titles addressable", () => {
    const courses = withUniqueSlugs([
      toCourse({ company: "Amazon", title: "Java" }, 0),
      toCourse({ company: "Amazon", title: "Java" }, 1),
    ]);
    expect(courses.map((course) => course.slug)).toEqual(["amazon-java", "amazon-java-2"]);
  });

  test("filters and groups rows", () => {
    const courses = [
      toCourse({ company: "Google", title: "Python for Data", level: "Junior", duration: "1 week" }),
      toCourse({ company: "Amazon", title: "Leadership", level: "Senior", duration: "6 months" }),
    ];
    expect(filterCourses(courses, { topic: "Data", level: "Junior" })).toHaveLength(1);
    expect(slugify("Artificial Intelligence")).toBe("artificial-intelligence");
    const rows = courseRows(courses, ["google-python-for-data"]);
    expect(rows.recent).toHaveLength(1);
    expect(rows.recommended[0].title).toMatch(/Python/);
  });
});
