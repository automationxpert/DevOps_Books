const fs = require("fs");
const path = require("path");

const BOOKS_DIR = path.join(__dirname, "/");
const TEMPLATE = fs.readFileSync("template.html", "utf8");

const files = fs
  .readdirSync(BOOKS_DIR)
  .filter(f => f.toLowerCase().endsWith(".pdf"))
  .sort();

const listItems = files.map(file => {
  const encoded = encodeURIComponent(file);
  const displayName = file.replace(/\.pdf$/i, "").replace(/_/g, " "); ; // remove .pdf (case-insensitive) and replace underscores with spaces
  return `<div class="card">
  <a href="${encoded}" target="_blank">${displayName}</a></div>`;
}).join("\n");

const output = TEMPLATE.replace("{{BOOK_LIST}}", listItems);

fs.writeFileSync("index.html", output);

console.log(`Generated index.html with ${files.length} books`);
