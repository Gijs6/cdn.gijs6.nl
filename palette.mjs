import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = dirname(new URL(import.meta.url).pathname);
const OUT = join(ROOT, "src/theme/base/palette.css");

const HUES = {
  red: [22, 24],
  orange: [58, 52],
  yellow: [94, 80, 1.4],
  lime: [128, 136],
  green: [156, 154],
  teal: [186, 186],
  cyan: [224, 226],
  indigo: [266, 266],
  purple: [302, 302],
  pink: [352, 350],
};

const STEPS = {
  text: [[0.52, 0.18, true], [0.8, 0.13]],
  solid: [[0.545, 0.19, true], [0.52, 0.18, true]],
  "solid-line": [[0.46, 0.17, true], [0.44, 0.16, true]],
  tint: [[0.96, 0.03], [0.28, 0.065, true]],
  "tint-line": [[0.87, 0.09], [0.45, 0.11, true]],
  "tint-text": [[0.42, 0.13, true], [0.87, 0.1]],
};

const LIGHT_SOLIDS = {
  orange: {
    solid: [[0.73, 0.19], [0.7, 0.18]],
    "solid-line": [[0.67, 0.19], [0.65, 0.18]],
    "on-solid": [[0.24, 0.05], [0.24, 0.05]],
  },
  yellow: {
    solid: [[0.87, 0.18], [0.84, 0.17]],
    "solid-line": [[0.8, 0.17], [0.77, 0.16]],
    "on-solid": [[0.27, 0.05], [0.27, 0.05]],
  },
};

const GREY_HUE = 265;
const GREY_CHROMA = 0.006;
const GREYS = {
  bg: [0.955, 0.165],
  page: [1, 0.225],
  fg: [0.24, 0.96],
  muted: [0.5, 0.76],
  line: [0.91, 0.33],
  rule: [0.8, 0.42],
  "page-line": [0.86, 0.3],
  head: [0.935, 0.3],
  "head-soft": [0.97, 0.265],
  "pre-bg": [0.97, 0.265],
  "input-bg": [1, 0.26],
  "input-fg": [0.24, 0.96],
  "input-line": [0.62, 0.6],
  "btn-bg": [1, 0.32],
  "btn-line": [0.62, 0.6],
  "btn-hover": [0.93, 0.37],
};

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function oklchToLinearRgb(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function hex(L, C, h) {
  if (L >= 1) return "#ffffff";
  let c = C;
  let rgb = oklchToLinearRgb(L, c, h);
  while (rgb.some((v) => v < -1e-4 || v > 1 + 1e-4) && c > 0) {
    c -= 0.001;
    rgb = oklchToLinearRgb(L, c, h);
  }
  return "#" + rgb
    .map((v) => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}

function luminance(hx) {
  const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hx.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(x, y) {
  const [a, b] = [luminance(x), luminance(y)].sort((p, q) => q - p);
  return (a + 0.05) / (b + 0.05);
}

const greys = Object.fromEntries(
  Object.entries(GREYS).map(([k, pair]) => [k, pair.map((L) => hex(L, GREY_CHROMA, GREY_HUE))]),
);
const ramps = Object.fromEntries(
  Object.entries(HUES).map(([name, h]) => [
    name,
    Object.fromEntries(
      Object.entries({ ...STEPS, ...LIGHT_SOLIDS[name] }).map(([step, pair]) => [
        step,
        pair.map(([L, C, deep]) => (deep ? hex(L, C, h[1]) : hex(L, C * (h[2] ?? 1), h[0]))),
      ]),
    ),
  ]),
);

const checks = [];
for (const [mode, i] of [["light", 0], ["dark", 1]]) {
  const g = (k) => greys[k][i];
  const r = (hue, step) => ramps[hue][step][i];
  const check = (name, fg, bg, min) => checks.push({ name: `${mode} ${name}`, ratio: contrast(fg, bg), min });

  for (const bg of ["page", "bg", "head", "head-soft", "pre-bg", "btn-bg", "btn-hover"]) check(`fg on ${bg}`, g("fg"), g(bg), 4.5);
  for (const bg of ["page", "bg", "head", "head-soft"]) check(`muted on ${bg}`, g("muted"), g(bg), 4.5);
  check("input-fg on input-bg", g("input-fg"), g("input-bg"), 4.5);
  for (const bg of ["page", "input-bg"]) check(`input-line on ${bg}`, g("input-line"), g(bg), 3);
  for (const bg of ["page", "btn-bg"]) check(`btn-line on ${bg}`, g("btn-line"), g(bg), 3);
  check("page on muted (count)", g("page"), g("muted"), 4.5);

  for (const hue of Object.keys(HUES)) {
    for (const bg of ["page", "bg", "head-soft", "pre-bg"]) check(`${hue}-text on ${bg}`, r(hue, "text"), g(bg), 4.5);
    const onSolid = LIGHT_SOLIDS[hue] ? r(hue, "on-solid") : "#ffffff";
    check(`on-solid on ${hue}-solid`, onSolid, r(hue, "solid"), 4.5);
    check(`on-solid on ${hue}-solid-line`, onSolid, r(hue, "solid-line"), 4.5);
    check(`${hue}-tint-text on ${hue}-tint`, r(hue, "tint-text"), r(hue, "tint"), 4.5);
    check(`fg on ${hue}-tint`, g("fg"), r(hue, "tint"), 4.5);
    check(`muted on ${hue}-tint`, g("muted"), r(hue, "tint"), 4.5);
    check(`fg on ${hue}-tint-line`, g("fg"), r(hue, "tint-line"), 4.5);
  }
}

const pair = ([light, dark]) => (light === dark ? light : `light-dark(${light}, ${dark})`);
let css = ":root {\n    --white: #ffffff;\n    --black: #000000;\n\n";
for (const [k, v] of Object.entries(greys)) css += `    --${k}: ${pair(v)};\n`;
for (const [name, steps] of Object.entries(ramps)) {
  css += "\n";
  for (const [step, v] of Object.entries(steps)) css += `    --${name}-${step}: ${pair(v)};\n`;
}
css += "}\n";

const failed = checks.filter((c) => c.ratio < c.min);
const tightest = [...checks].sort((a, b) => a.ratio / a.min - b.ratio / b.min).slice(0, 5);
console.log(`${checks.length} pairs checked, ${failed.length} below WCAG AA`);
for (const c of tightest) console.log(`  ${c.name}: ${c.ratio.toFixed(2)} (needs ${c.min})`);
for (const c of failed) console.log(`FAIL ${c.name}: ${c.ratio.toFixed(2)} (needs ${c.min})`);

if (failed.length) process.exit(1);
writeFileSync(OUT, css);
console.log("wrote", OUT.slice(ROOT.length + 1));
