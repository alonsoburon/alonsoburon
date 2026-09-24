/**
 * store.mjs — tiny JSON persistence for composer pieces.
 *
 * Lives under tools/admin/data and is gitignored: pieces are private drafts.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './paths.mjs';

mkdirSync(DATA_DIR, { recursive: true });

const file = (name) => path.join(DATA_DIR, name);

function read(name, fallback) {
  const f = file(name);
  if (!existsSync(f)) return fallback;
  try {
    return JSON.parse(readFileSync(f, 'utf8'));
  } catch {
    return fallback;
  }
}

function write(name, value) {
  writeFileSync(file(name), JSON.stringify(value, null, 2) + '\n');
}

export const pieces = {
  all: () => read('pieces.json', []),
  save: (list) => write('pieces.json', list),
  add: (piece) => {
    const list = read('pieces.json', []);
    list.push(piece);
    write('pieces.json', list);
    return piece;
  },
  update: (id, patch) => {
    const list = read('pieces.json', []);
    const i = list.findIndex((p) => p.id === id);
    if (i === -1) return null;
    list[i] = { ...list[i], ...patch, id };
    write('pieces.json', list);
    return list[i];
  },
  remove: (id) => {
    const list = read('pieces.json', []);
    write('pieces.json', list.filter((p) => p.id !== id));
  },
};

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
