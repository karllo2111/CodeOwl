#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKENS_PATH = path.resolve(__dirname, '../src/styles/tokens.css');

function hexToRgb(hex) {
  hex = hex.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function getLuminance(hex) {
  const rgb = hexToRgb(hex).map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function getContrast(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const content = fs.readFileSync(TOKENS_PATH, 'utf-8');

// Parse light tokens
const lightMatch = content.match(/\[data-theme="light"\]\s*\{([^}]+)\}/s) || content.match(/:root[^{]*\{([^}]+)\}/s);
// Parse dark tokens
const darkMatch = content.match(/\[data-theme="dark"\]\s*\{([^}]+)\}/s);

function parseTokens(block) {
  const tokens = {};
  if (!block) return tokens;
  const lines = block.split('\n');
  for (const line of lines) {
    const match = line.match(/(--[\w-]+):\s*([^;]+);/);
    if (match) {
      tokens[match[1]] = match[2].trim();
    }
  }
  return tokens;
}

const lightTokens = parseTokens(lightMatch ? lightMatch[1] : '');
const darkTokens = parseTokens(darkMatch ? darkMatch[1] : '');

let failures = 0;
const results = [];

function check(label, condition, detail) {
  if (condition) {
    results.push({ check: label, status: 'PASS', detail });
  } else {
    results.push({ check: label, status: 'FAIL', detail });
    failures++;
  }
}

// 1. Dark --bg luminance inside 0.012–0.025
if (darkTokens['--bg']) {
  const lum = getLuminance(darkTokens['--bg']);
  check('Dark --bg luminance (0.012 - 0.025)', lum >= 0.012 && lum <= 0.025, `actual: ${lum.toFixed(4)} (${darkTokens['--bg']})`);
}

// 2. Dark --surface luminance inside 0.017–0.04
if (darkTokens['--surface']) {
  const lum = getLuminance(darkTokens['--surface']);
  check('Dark --surface luminance (0.017 - 0.04)', lum >= 0.017 && lum <= 0.04, `actual: ${lum.toFixed(4)} (${darkTokens['--surface']})`);
}

// 3. Light --bg luminance inside 0.78–0.86
if (lightTokens['--bg']) {
  const lum = getLuminance(lightTokens['--bg']);
  check('Light --bg luminance (0.78 - 0.86)', lum >= 0.78 && lum <= 0.86, `actual: ${lum.toFixed(4)} (${lightTokens['--bg']})`);
}

// 4. Light --surface luminance <= 0.93
if (lightTokens['--surface']) {
  const lum = getLuminance(lightTokens['--surface']);
  check('Light --surface luminance (<= 0.93)', lum <= 0.93, `actual: ${lum.toFixed(4)} (${lightTokens['--surface']})`);
}

// 5. No token is pure #000 or #fff
for (const [key, val] of Object.entries({ ...lightTokens, ...darkTokens })) {
  if (val.startsWith('#')) {
    const isPure = val.toLowerCase() === '#000000' || val.toLowerCase() === '#ffffff' || val.toLowerCase() === '#000' || val.toLowerCase() === '#fff';
    if (isPure) {
      check(`No pure black/white on ${key}`, false, `found ${val}`);
    }
  }
}

// 6. Contrast ratios: --text, --text-muted, --accent, --success, --warning, --danger on --bg and --surface >= 4.5:1
const coloredTokens = ['--text', '--accent', '--success', '--warning', '--danger'];

for (const theme of ['light', 'dark']) {
  const tokens = theme === 'light' ? lightTokens : darkTokens;
  const bg = tokens['--bg'];
  const surface = tokens['--surface'];

  for (const t of coloredTokens) {
    if (tokens[t] && bg) {
      const cr = getContrast(tokens[t], bg);
      check(`${theme} ${t} on --bg (>= 4.5:1)`, cr >= 4.5, `${cr.toFixed(2)}:1`);
    }
    if (tokens[t] && surface) {
      const cr = getContrast(tokens[t], surface);
      check(`${theme} ${t} on --surface (>= 4.5:1)`, cr >= 4.5, `${cr.toFixed(2)}:1`);
    }
  }

  // Check border-strong vs surface >= 3:1
  if (tokens['--border-strong'] && surface) {
    const cr = getContrast(tokens['--border-strong'], surface);
    check(`${theme} --border-strong vs --surface (>= 3:1)`, cr >= 3.0, `${cr.toFixed(2)}:1`);
  }
}

console.log('\n=== CHECK TOKENS CONTRAST & LUMINANCE ===\n');
console.table(results);

if (failures > 0) {
  console.error(`\n[check:tokens] FAILED with ${failures} violations.\n`);
  process.exit(1);
} else {
  console.log(`\n[check:tokens] PASSED. All tokens within spec.\n`);
  process.exit(0);
}
