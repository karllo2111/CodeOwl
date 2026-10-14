#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');

const BANNED_STRINGS = [
  'awwwards',
  'master build',
  'learning space',
  'lorem',
  'dummy',
  '\\bPRO\\b',
];

const BANNED_CLASSES = [
  'tracking-widest',
  'tracking-\\[',
  'backdrop-blur',
  'blur-',
  'bg-gradient-',
  'bg-clip-text',
  'text-transparent',
  'drop-shadow',
  'uppercase',
];

let totalViolations = 0;

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

walk(SRC_DIR, (filePath) => {
  if (filePath.includes('.test.') || filePath.includes('.spec.')) return;
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.css')) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Check banned strings (case-insensitive)
    for (const pattern of BANNED_STRINGS) {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(line)) {
        console.error(`[check:ui] Banned string "${pattern}" at ${filePath}:${lineNum}`);
        console.error(`  ${line.trim()}`);
        totalViolations++;
      }
    }

    // 2. Check banned classes
    for (const cls of BANNED_CLASSES) {
      const regex = new RegExp(cls, 'g');
      if (regex.test(line)) {
        console.error(`[check:ui] Banned class "${cls}" at ${filePath}:${lineNum}`);
        console.error(`  ${line.trim()}`);
        totalViolations++;
      }
    }

    // 3. Check raw HTML controls outside components/ui
    const isUiComponent = filePath.includes('/components/ui/');
    if (!isUiComponent && (filePath.endsWith('.tsx') || filePath.endsWith('.jsx'))) {
      if (/<button[\s>]/.test(line)) {
        console.error(`[check:ui] Raw <button> found outside components/ui at ${filePath}:${lineNum}`);
        console.error(`  ${line.trim()}`);
        totalViolations++;
      }
      if (/<input[\s>]/.test(line)) {
        console.error(`[check:ui] Raw <input> found outside components/ui at ${filePath}:${lineNum}`);
        console.error(`  ${line.trim()}`);
        totalViolations++;
      }
      if (/<select[\s>]/.test(line)) {
        console.error(`[check:ui] Raw <select> found outside components/ui at ${filePath}:${lineNum}`);
        console.error(`  ${line.trim()}`);
        totalViolations++;
      }
      if (/<textarea[\s>]/.test(line)) {
        console.error(`[check:ui] Raw <textarea> found outside components/ui at ${filePath}:${lineNum}`);
        console.error(`  ${line.trim()}`);
        totalViolations++;
      }
    }
  });
});

if (totalViolations > 0) {
  console.error(`\n[check:ui] FAILED with ${totalViolations} violations.\n`);
  process.exit(1);
} else {
  console.log('\n[check:ui] PASSED. Zero banned strings, classes, or raw controls found.\n');
  process.exit(0);
}
