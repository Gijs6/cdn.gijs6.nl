import { execFileSync } from "node:child_process";
import {
  mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, statSync, existsSync,
} from "node:fs";
import { dirname, join, relative, extname, basename } from "node:path";

const ROOT = dirname(new URL(import.meta.url).pathname);
const SRC = join(ROOT, "src/theme");
const OUT = join(ROOT, "site/theme/v2");
const FONTS_SRC = join(ROOT, "site/fonts");
const LCSS = join(ROOT, "node_modules/.bin/lightningcss");
const ESBUILD = join(ROOT, "node_modules/.bin/esbuild");
const TARGETS = "> 0.25%, last 10 versions, Firefox ESR, not dead";

const walk = (dir, pred = () => true, acc = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, pred, acc);
    else if (pred(p)) acc.push(p);
  }
  return acc;
};
const ensure = (p) => mkdirSync(dirname(p), { recursive: true });

function buildCss() {
  const entries = walk(SRC, (p) => extname(p) === ".css").filter((p) => {
    const rel = relative(SRC, p);
    return rel === "all.css" || rel.startsWith(`accent${"/"}`);
  });
  for (const entry of entries) {
    const rel = relative(SRC, entry);
    const dest = join(OUT, rel);
    ensure(dest);
    execFileSync(LCSS, ["--bundle", "--minify", "--targets", TARGETS, "-o", dest, entry], {
      stdio: ["ignore", "ignore", "inherit"],
    });
    console.log("css   ", rel);
  }
}

function buildJs() {
  if (!existsSync(join(SRC, "js"))) return;
  for (const entry of walk(join(SRC, "js"), (p) => extname(p) === ".js")) {
    const rel = relative(SRC, entry);
    const dest = join(OUT, rel);
    ensure(dest);
    execFileSync(ESBUILD, [entry, "--minify", "--target=es2019", `--outfile=${dest}`], {
      stdio: ["ignore", "ignore", "inherit"],
    });
    console.log("js    ", rel);
  }
}

function buildFonts() {
  const dest = join(OUT, "fonts");
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(FONTS_SRC)) {
    if (/^(fira-sans|ibm-plex-mono)/.test(name)) copyFileSync(join(FONTS_SRC, name), join(dest, name));
  }
  console.log("fonts ", "fira-sans + ibm-plex-mono");
}

function buildDocs() {
  const dir = join(SRC, "docs");
  if (!existsSync(dir)) return;
  for (const p of walk(dir, (p) => /\.(html|svg|png|ico|css)$/.test(p))) {
    const rel = relative(dir, p);
    const dest = join(OUT, rel);
    ensure(dest);
    copyFileSync(p, dest);
    console.log("doc   ", rel);
  }
}

function build() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  buildFonts();
  buildCss();
  buildJs();
  buildDocs();
  console.log("\n  ->", relative(ROOT, OUT));
}

build();

if (process.argv.includes("--watch")) {
  const { watch } = await import("node:fs");
  let t;
  watch(SRC, { recursive: true }, () => {
    clearTimeout(t);
    t = setTimeout(() => {
      try { build(); } catch (e) { console.error(e.message); }
    }, 120);
  });
  console.log("watching src/theme …");
}
