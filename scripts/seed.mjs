import { readFile } from "node:fs/promises";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const dev = process.argv.includes("--dev");
if (!dev) {
  process.env.FIRESTORE_EMULATOR_HOST ||= "127.0.0.1:8080";
}
if (dev && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("Dev seed needs GOOGLE_APPLICATION_CREDENTIALS. The emulator is the default.");
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "demo-udyam";
initializeApp({
  projectId,
  ...(dev
    ? {}
    : { credential: { getAccessToken: async () => ({ access_token: "owner", expires_in: 3600 }) } }),
});
const db = getFirestore();

function slug(value) {
  return String(value || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function scale(record, factor) {
  const next = {};
  for (const [key, value] of Object.entries(record)) {
    next[key] = Math.round(Number(value) * factor);
  }
  return next;
}

function salaryOf(raw) {
  const amount = Number(String(raw ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(amount)) return { raw: String(raw ?? ""), period: "month", monthly: 0 };
  if (amount >= 100000) return { raw: String(raw), period: "year", monthly: Math.round(amount / 12) };
  return { raw: String(raw), period: "month", monthly: Math.round(amount) };
}

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
}

async function writeAll(collection, docs) {
  let batch = db.batch();
  let count = 0;
  for (const [id, data] of docs) {
    batch.set(db.collection(collection).doc(id), data, { merge: true });
    count += 1;
    if (count % 400 === 0) {
      await batch.commit();
      batch = db.batch();
    }
  }
  if (count % 400 !== 0) await batch.commit();
  return count;
}

const citiesRaw = await readJson("../public/citydata.json");
const cityDocs = citiesRaw.map((city) => {
  const costs = {
    monthly_rent: city.monthly_rent,
    food_expense: city.food_expense,
    transport: city.transport,
    utilities: city.utilities,
    miscellaneous: city.miscellaneous,
    other: city.other,
    total_expense: city.total_expense,
  };
  const id = slug(city.city);
  return [
    id,
    {
      name: city.city,
      slug: id,
      image: city.image,
      medium: costs,
      low: scale(costs, 0.7),
      high: scale(costs, 1.4),
      source: "seed",
    },
  ];
});
const cityIds = cityDocs.map(([id]) => id);

const coursesRaw = await readJson("../public/coursedata.json");
const courseDocs = coursesRaw.map((course, index) => {
  const id = slug(`${course.company}-${course.title}`) || `course-${index}`;
  return [id, { ...course, slug: id, source: "seed" }];
});

const specializationsRaw = await readJson("../public/specializations.json");
const specializationDocs = (specializationsRaw.specializations || []).map((item, index) => {
  const id = slug(item.id || item.name) || `specialization-${index}`;
  return [id, { ...item, slug: id, source: "seed" }];
});

const jobsRaw = await readJson("../public/jobdata.json");
const internRaw = await readJson("../public/interndata.json");
const jobDocs = [
  ...jobsRaw.map((job, index) => {
    const id = slug(`${job.company}-${job.title}`) || `job-${index}`;
    return [
      id,
      {
        ...job,
        kind: "job",
        cityId: cityIds[index % cityIds.length],
        salary: salaryOf(job.salary),
        source: "seed",
      },
    ];
  }),
  ...internRaw.map((job, index) => {
    const id = slug(`intern-${job.company}-${job.title}`) || `intern-${index}`;
    return [
      id,
      {
        ...job,
        kind: "internship",
        cityId: cityIds[index % cityIds.length],
        salary: salaryOf(job.salary),
        source: "seed",
      },
    ];
  }),
];

const counts = {
  cities: await writeAll("cities", cityDocs),
  courses: await writeAll("courses", courseDocs),
  specializations: await writeAll("specializations", specializationDocs),
  jobs: await writeAll("jobs", jobDocs),
};
console.log(`Seeded ${dev ? "dev" : "emulator"}: ${JSON.stringify(counts)}`);
