const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");

const filesToCopy = [
  "index.html",
  "trading-page.html",
  "trading-page.css",
  "trading-page.js"
];

function cleanDist() {
  if (fs.existsSync(dist)) {
    fs.rmSync(dist, { recursive: true, force: true });
  }

  fs.mkdirSync(dist, { recursive: true });
}

function copyFile(fileName) {
  const source = path.join(root, fileName);
  const target = path.join(dist, fileName);

  if (!fs.existsSync(source)) {
    throw new Error(`${fileName} was not found in the project root.`);
  }

  fs.copyFileSync(source, target);
  console.log(`Copied ${fileName}`);
}

function build() {
  cleanDist();

  for (const fileName of filesToCopy) {
    copyFile(fileName);
  }

  console.log("MetaBinary static build completed.");
}

build();
