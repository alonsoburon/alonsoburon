/**
 * paths.mjs — the few directories the publish layer needs.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)); // tools/admin/publish
export const ADMIN_DIR = path.resolve(HERE, '..');          // tools/admin
export const ROOT = path.resolve(HERE, '..', '..', '..');   // repo root
export const DATA_DIR = path.join(ADMIN_DIR, 'data');
export const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
