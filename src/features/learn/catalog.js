export function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

export function parseDurationHours(label) {
  const text = String(label || "").toLowerCase();
  const amount = Number(text.match(/(\d+(?:\.\d+)?)/)?.[1] || 0);
  if (text.includes("hour")) return amount;
  if (text.includes("week")) return amount * 10;
  if (text.includes("month")) return amount * 40;
  return amount || 10;
}

export function durationBucket(hours) {
  if (hours <= 40) return "short";
  if (hours <= 120) return "medium";
  return "long";
}

export function topicOf(title) {
  const text = String(title || "").toLowerCase();
  if (/data|machine|ai|analytics|python/.test(text)) return "Data";
  if (/cloud|devops|security|network|system/.test(text)) return "Systems";
  if (/java|web|react|program|javascript|dsa|algorithm/.test(text)) return "Programming";
  return "Career";
}

export function toCourse(raw, index = 0) {
  const title = raw.title || `Course ${index + 1}`;
  const providerName = raw.company || raw.provider?.name || "UdyamPath";
  const lessons = (raw.pathway || []).map((item, lessonIndex) => ({
    id: `l${lessonIndex + 1}`,
    order: lessonIndex + 1,
    type: item.data?.type || "text",
    title: item.title || `Lesson ${lessonIndex + 1}`,
    durationMin: 20,
    summary: item.details || "",
    content: item.data?.content || item.details || "",
  }));
  return {
    id: slugify(`${providerName}-${title}`),
    slug: slugify(`${providerName}-${title}`),
    title,
    provider: { name: providerName, logo: raw.logo || "" },
    level: raw.level || "Beginner",
    durationHours: parseDurationHours(raw.duration),
    durationLabel: raw.duration || "",
    topic: topicOf(title),
    skills: Array.isArray(raw.skillsGained) ? raw.skillsGained : [],
    description: raw.description || "",
    published: true,
    modules: [
      {
        id: "m1",
        order: 1,
        title: "Syllabus",
        summary: raw.description || "",
        lessons,
      },
    ],
  };
}

export function withUniqueSlugs(courses) {
  const seen = new Map();
  return courses.map((course) => {
    const count = seen.get(course.slug) || 0;
    seen.set(course.slug, count + 1);
    if (!count) return course;
    const slug = `${course.slug}-${count + 1}`;
    return { ...course, id: slug, slug };
  });
}

export function filterCourses(courses, filters = {}) {
  const query = String(filters.q || "").trim().toLowerCase();
  return courses.filter((course) => {
    const haystack = `${course.title} ${course.description} ${course.skills.join(" ")} ${course.provider.name}`.toLowerCase();
    if (query && !haystack.includes(query)) return false;
    if (filters.topic && filters.topic !== "all" && course.topic !== filters.topic) return false;
    if (filters.level && filters.level !== "all" && course.level !== filters.level) return false;
    if (filters.duration && filters.duration !== "all" && durationBucket(course.durationHours) !== filters.duration) return false;
    if (filters.provider && filters.provider !== "all" && course.provider.name !== filters.provider) return false;
    return true;
  });
}

export function courseRows(courses, recentSlugs = []) {
  const recent = recentSlugs.map((slug) => courses.find((course) => course.slug === slug)).filter(Boolean);
  const recommended = courses.filter((course) => /junior|beginner/i.test(course.level));
  return {
    popular: courses.slice(0, 8),
    newest: courses.slice(-8).reverse(),
    recommended: (recommended.length ? recommended : courses).slice(0, 8),
    recent,
  };
}

export function flattenLessons(course) {
  if (!course) return [];
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleId: module.id, moduleTitle: module.title })),
  );
}

export function findCourse(courses, key) {
  const value = String(key || "");
  return courses.find((course) => course.slug === value || course.title === value) || null;
}

const RECENT_KEY = "learn.recent";

export function readRecentSlugs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function rememberCourse(slug) {
  const next = [slug, ...readRecentSlugs().filter((item) => item !== slug)].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

let cache;

export async function loadCourses() {
  if (cache) return cache;
  const response = await fetch("/coursedata.json");
  if (!response.ok) throw new Error("Could not load the course catalog.");
  const raw = await response.json();
  cache = withUniqueSlugs((Array.isArray(raw) ? raw : []).map(toCourse));
  return cache;
}
