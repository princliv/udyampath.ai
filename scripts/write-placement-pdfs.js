const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "public", "placement-papers");
fs.mkdirSync(dir, { recursive: true });

function escapePdf(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function makePdf(title, lines) {
  const commands = ["BT", "/F1 16 Tf", "54 740 Td", `(${escapePdf(title)}) Tj`, "/F1 11 Tf"];
  lines.forEach((line) => {
    commands.push("0 -18 Td", `(${escapePdf(line)}) Tj`);
  });
  commands.push("ET");
  const stream = commands.join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj",
    `4 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(Buffer.byteLength(body));
    body += `${obj}\n`;
  });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return body;
}

const papers = {
  "amazon.pdf": [
    "UdyamPath sample sheet - Amazon",
    "1. Reverse a linked list in place.",
    "2. Find the first non-repeating character in a string.",
    "3. Design a rate limiter for an API.",
    "4. Explain CAP theorem with a shopping-cart example.",
    "5. Write a query to find the second highest salary.",
  ],
  "google.pdf": [
    "UdyamPath sample sheet - Google",
    "1. Given a grid, count islands of connected land.",
    "2. Implement an LRU cache with O(1) get and put.",
    "3. Estimate daily searches for a new feature.",
    "4. Explain how a browser renders a page.",
    "5. Find the shortest path in an unweighted graph.",
  ],
  "microsoft.pdf": [
    "UdyamPath sample sheet - Microsoft",
    "1. Detect a cycle in a linked list.",
    "2. Merge two sorted arrays in place.",
    "3. Design a notification service for Teams.",
    "4. Explain deadlock and how to avoid it.",
    "5. Write a function to validate balanced brackets.",
  ],
};

Object.entries(papers).forEach(([name, lines]) => {
  fs.writeFileSync(path.join(dir, name), makePdf(lines[0], lines.slice(1)));
});

console.log("wrote", Object.keys(papers).join(", "));
