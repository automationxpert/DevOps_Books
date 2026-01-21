const fs = require("fs");
const path = require("path");

const BOOKS_DIR = path.join(__dirname, "books/");
const TEMPLATE_FILE = "template.html";

// 1. Repo URL Logic - Accurate and filtered
let repoUrl = "#"; 
if (process.env.GITHUB_REPOSITORY) {
    repoUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}`;
} else if (process.env.REPOSITORY_URL) {
    repoUrl = process.env.REPOSITORY_URL;
}

try {
    if (!fs.existsSync(TEMPLATE_FILE)) throw new Error("template.html missing");

    const TEMPLATE = fs.readFileSync(TEMPLATE_FILE, "utf8");

    // 2. Original Book Scanning Logic
    const files = fs
        .readdirSync(BOOKS_DIR)
        .filter(f => f.toLowerCase().endsWith(".pdf"))
        .sort();

    // 3. Generate <a> tags (The template handles the Card UI)
    const listItems = files.map(file => {
        const encoded = encodeURIComponent(file);
        // Preserving your exact naming logic
        const displayName = file
            .replace(/\.pdf$/i, "")
            .replace(/_/g, " ")
            .replace(/[_-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        
        return `<a href="books/${encoded}">${displayName}</a>`;
    }).join("\n");

    // 4. Injection
    let output = TEMPLATE
        .replace("{{BOOK_LIST}}", listItems)
        .replace("{{REPO_URL}}", repoUrl);

    fs.writeFileSync("index.html", output);

    console.log(`Successfully built library for: ${repoUrl}`);
} catch (err) {
    console.error("Build failed:", err.message);
    process.exit(1);
}
