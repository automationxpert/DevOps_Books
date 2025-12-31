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
  return `<li><a href="books/${encoded}" target="_blank">${file}</a></li>`;
}).join("\n");

const output = TEMPLATE.replace("{{BOOK_LIST}}", listItems);

fs.writeFileSync("index.html", output);

console.log(`Generated index.html with ${files.length} books`);
