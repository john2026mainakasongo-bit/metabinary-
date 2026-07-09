const fs = require("fs");
const path = require("path");
const root = __dirname;
const dist = path.join(root, "dist");
const filesToCopy = ["index.html", "trading-page.html", "trading-page.css", "trading-page.js"];

if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of filesToCopy) {
  const source = path.join(root, file);
  if (!fs.existsSync(source)) throw new Error(`${file} not found in root.`);
  fs.copyFileSync(source, path.join(dist, file));
  console.log(`Copied ${file}`);
}

console.log("MetaBinary static build completed.");
