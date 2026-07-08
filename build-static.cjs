const fs = require("fs");
const path = require("path");

const root = __dirname;
const target = path.join(root, "dist");
const files = ["index.html", "trading-page.html", "trading-page.css", "trading-page.js"];

fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(target, file));
}

console.log("Static trading page copied to dist.");
