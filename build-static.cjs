const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");

function copyFile(name) {
  const from = path.join(root, name);
  const to = path.join(dist, name);
  if (fs.existsSync(from)) fs.copyFileSync(from, to);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

copyFile("index.html");
copyFile("trading-page.html");
copyFile("trading-page.css");
copyFile("trading-page.js");

console.log("MetaBinary static files built into dist/");
