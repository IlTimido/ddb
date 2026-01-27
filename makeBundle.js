#!/usr/bin/env node
"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* __dirname replacement per ES modules */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function isTextLikeFile(filePath) {
  const textExts = new Set([".html", ".htm", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".css", ".scss", ".sass", ".less", ".json", ".jsonc", ".md", ".txt", ".yaml", ".yml", ".xml", ".svg", ".env", ".gitignore", ".toml", ".map"]);

  const ext = path.extname(filePath).toLowerCase();
  if (!ext) return true;
  return textExts.has(ext);
}

function shouldSkipPath(entryName) {
  const skip = new Set(["node_modules", ".git", "dist", "build", ".next", ".cache", "coverage", ".vite"]);
  return skip.has(entryName);
}

function shouldSkipFile(fileName) {
  const skipFiles = new Set(["Pqp.js"]);
  return skipFiles.has(fileName);
}

function readFileSafeUtf8(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] === 0) {
        return { ok: false, reason: "binary_or_non_utf8" };
      }
    }
    return { ok: true, content: buf.toString("utf8") };
  } catch (e) {
    return { ok: false, reason: `read_error: ${e.message}` };
  }
}

function walkDirRecursive(rootDir, currentDir) {
  const results = [];
  const absDir = path.join(rootDir, currentDir);

  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const entry of entries) {
    if (shouldSkipPath(entry.name)) continue;

    const relPath = path.join(currentDir, entry.name);
    const absPath = path.join(rootDir, relPath);

    if (entry.isDirectory()) {
      results.push(...walkDirRecursive(rootDir, relPath));
    } else if (entry.isFile()) {
      if (shouldSkipFile(entry.name)) continue;
      results.push(relPath);
    }
  }
  return results;
}

function normalizePosix(p) {
  return p.split(path.sep).join("/");
}

function buildBundle(projectRoot, outFile) {
  const parts = [];
  const startTime = new Date().toISOString();

  function addSection(relPath) {
    const absPath = path.join(projectRoot, relPath);

    if (!fs.existsSync(absPath)) {
      parts.push(`\n\n===== FILE: ${normalizePosix(relPath)} =====\n` + `[MISSING FILE]\n` + `===== END FILE: ${normalizePosix(relPath)} =====\n`);
      return;
    }

    if (!isTextLikeFile(absPath)) {
      parts.push(`\n\n===== FILE: ${normalizePosix(relPath)} =====\n` + `[SKIPPED: extension not allowed]\n` + `===== END FILE: ${normalizePosix(relPath)} =====\n`);
      return;
    }

    const r = readFileSafeUtf8(absPath);
    if (!r.ok) {
      parts.push(`\n\n===== FILE: ${normalizePosix(relPath)} =====\n` + `[SKIPPED: ${r.reason}]\n` + `===== END FILE: ${normalizePosix(relPath)} =====\n`);
      return;
    }

    parts.push(`\n\n===== FILE: ${normalizePosix(relPath)} =====\n` + r.content + (r.content.endsWith("\n") ? "" : "\n") + `===== END FILE: ${normalizePosix(relPath)} =====\n`);
  }

  parts.push(`BUNDLE GENERATED AT: ${startTime}\n` + `ROOT: ${projectRoot}\n` + `INCLUDES: index.html + src/** (recursive)\n`);

  addSection("index.html");

  const srcDir = path.join(projectRoot, "src");
  if (fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory()) {
    const relFiles = walkDirRecursive(projectRoot, "src")
      .filter((p) => p !== outFile)
      .sort((a, b) => normalizePosix(a).localeCompare(normalizePosix(b)));

    for (const relPath of relFiles) {
      addSection(relPath);
    }
  }

  fs.writeFileSync(path.join(projectRoot, outFile), parts.join(""), "utf8");
  console.log(`OK: scritto ${outFile}`);
}

function main() {
  const projectRoot = process.cwd();
  const outFile = process.argv[2] || "bundle_all.txt";

  if (outFile.toLowerCase() === "index.html") {
    console.error("Errore: output non puo' essere index.html");
    process.exit(1);
  }

  buildBundle(projectRoot, outFile);
}

main();
