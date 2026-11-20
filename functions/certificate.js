import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

export function courseReady(enrollment) {
  return Boolean(enrollment && Number(enrollment.progressPct) >= 100 && enrollment.passedFinal === true);
}

export function specializationGaps(courseNames, completed) {
  const titles = new Set((completed.titles || []).map((title) => String(title).toLowerCase()));
  const ids = new Set(completed.ids || []);
  return (courseNames || []).filter((name) => !titles.has(String(name).toLowerCase()) && !ids.has(slugify(name)));
}

function winAnsi(value) {
  return String(value || "").replace(/[^\x20-\x7E]/g, " ");
}

export async function buildCertificatePdf({ recipientName, title, certificateId, issuedAt }) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const body = await pdf.embedFont(StandardFonts.Helvetica);
  page.drawRectangle({
    x: 28,
    y: 28,
    width: 786,
    height: 539,
    borderColor: rgb(0.14, 0.34, 0.96),
    borderWidth: 3,
  });
  page.drawText("UdyamPath", { x: 72, y: 470, size: 18, font, color: rgb(0.14, 0.34, 0.96) });
  page.drawText("Certificate of completion", { x: 72, y: 410, size: 32, font, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(winAnsi(recipientName), { x: 72, y: 330, size: 26, font, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(winAnsi(title), { x: 72, y: 280, size: 16, font: body, color: rgb(0.2, 0.25, 0.33) });
  page.drawText(`Issued ${new Date(issuedAt).toISOString().slice(0, 10)}`, { x: 72, y: 90, size: 12, font: body });
  page.drawText(winAnsi(certificateId), { x: 72, y: 68, size: 12, font: body });
  return pdf.save();
}
