/**
 * Local admin studio for the alonsoburon.cl content.
 *
 * Runs only on your machine: binds to 127.0.0.1, reads and writes the real
 * Markdown files under src/content/blog, and keeps a small JSON queue for the
 * LinkedIn / X / newsletter pieces derived from each article. Nothing here is
 * shipped to the deployed site.
 *
 *   pnpm admin            # studio + astro dev
 *   ADMIN_DEV=0 pnpm admin  # studio only
 *
 * Reach it from another machine on your LAN:
 *
 *   ADMIN_HOST=0.0.0.0 pnpm admin
 *
 * That exposes the studio (and the astro preview) on your network with no
 * authentication, on the assumption the network is yours. If you ever need it
 * on an untrusted one, set ADMIN_TOKEN=… and every request will require it.
 *
 * The Astro dev server watches src/content/blog, so a save shows up in the
 * preview within a second.
 */
import { createServer } from 'node:http';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { pieces } from './publish/store.mjs';

const pexec = promisify(execFile);

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const DATA_DIR = path.join(HERE, 'data');
const TRASH_DIR = path.join(DATA_DIR, 'trash');
const QUEUE_FILE = path.join(DATA_DIR, 'queue.json');
const BACKLOG_FILE = path.join(DATA_DIR, 'backlog.json');
const IDEAS_FILE = path.join(DATA_DIR, 'ideas.json');
const PUBLIC_DIR = path.join(HERE, 'public');

const PORT = Number(process.env.ADMIN_PORT || 4399);
const ASTRO_PORT = Number(process.env.ASTRO_PORT || 4321);

/** Where the studio binds. 0.0.0.0 exposes it to your LAN. */
const HOST = process.env.ADMIN_HOST || '127.0.0.1';
const LOOPBACK = HOST === '127.0.0.1' || HOST === 'localhost' || HOST === '::1';

/** Auth is off by default. Set ADMIN_TOKEN to require one. */
const TOKEN = process.env.ADMIN_TOKEN || null;

function firstLanIp() {
  for (const list of Object.values(os.networkInterfaces())) {
    for (const net of list ?? []) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return null;
}
const LAN_IP = firstLanIp();
const HOST_LABEL = LOOPBACK ? 'localhost' : LAN_IP || HOST;
const PREVIEW = `http://${HOST_LABEL}:${ASTRO_PORT}`;
const STUDIO_URL = `http://${HOST_LABEL}:${PORT}${TOKEN ? `/?token=${TOKEN}` : '/'}`;

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(TRASH_DIR, { recursive: true });
if (!existsSync(QUEUE_FILE)) writeFileSync(QUEUE_FILE, '[]\n');

// ── content helpers ────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(4, '0');

function slugify(s) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 60)
    .replace(/^_+|_+$/g, '') || 'untitled';
}

function yamlString(s) {
  const str = String(s ?? '');
  if (str.includes("'")) return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  return `'${str}'`;
}

function parseValue(raw) {
  const v = raw.trim();
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((p) => parseValue(p));
  }
  if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  if (v.startsWith('"') && v.endsWith('"')) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  return v;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([A-Za-z0-9_-]+):\s?(.*)$/);
    if (mm) data[mm[1]] = parseValue(mm[2]);
  }
  return { data, body: m[2] };
}

function serializeFrontmatter(data, body) {
  const order = ['title', 'date', 'description', 'tags'];
  const keys = [...order.filter((k) => data[k] !== undefined), ...Object.keys(data).filter((k) => !order.includes(k))];
  const lines = keys.map((k) => {
    const v = data[k];
    if (Array.isArray(v)) return `${k}: [${v.map((x) => yamlString(x)).join(', ')}]`;
    if (typeof v === 'string') return `${k}: ${yamlString(v)}`;
    return `${k}: ${v}`;
  });
  return `---\n${lines.join('\n')}\n---\n\n${String(body ?? '').replace(/^\n+/, '').trimEnd()}\n`;
}

function listPosts() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = readFileSync(path.join(BLOG_DIR, f), 'utf8');
      const { data } = parseFrontmatter(raw);
      const slug = f.replace(/\.md$/, '');
      const num = Number((f.match(/^(\d+)/) || [])[1] || 0);
      return {
        slug,
        number: num,
        filename: f,
        title: data.title ?? slug,
        date: data.date ?? '',
        description: data.description ?? '',
        tags: data.tags ?? [],
        updated: statSync(path.join(BLOG_DIR, f)).mtime.toISOString(),
      };
    })
    .sort((a, b) => b.number - a.number);
}

function readPost(slug) {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(file)) return null;
  const { data, body } = parseFrontmatter(readFileSync(file, 'utf8'));
  return { slug, ...data, body };
}

function nextNumber() {
  const nums = listPosts().map((p) => p.number);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

function createPost(input) {
  const number = nextNumber();
  let slug = `${pad(number)}_${slugify(input.title)}`;
  let file = path.join(BLOG_DIR, `${slug}.md`);
  let n = 2;
  while (existsSync(file)) {
    slug = `${pad(number)}_${slugify(input.title)}_${n++}`;
    file = path.join(BLOG_DIR, `${slug}.md`);
  }
  writePost(slug, input);
  return slug;
}

function writePost(slug, input) {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  const existing = existsSync(file) ? parseFrontmatter(readFileSync(file, 'utf8')).data : {};
  const data = { ...existing, ...input };
  delete data.body;
  writeFileSync(file, serializeFrontmatter(data, input.body), 'utf8');
  return slug;
}

function deletePost(slug) {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(file)) return false;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  renameSync(file, path.join(TRASH_DIR, `${stamp}__${slug}.md`));
  return true;
}

// ── queue helpers ──────────────────────────────────────────────────────────

const readQueue = () => JSON.parse(readFileSync(QUEUE_FILE, 'utf8') || '[]');
const writeQueue = (q) => writeFileSync(QUEUE_FILE, JSON.stringify(q, null, 2) + '\n');
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// ── http plumbing ──────────────────────────────────────────────────────────

function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}
const json = (res, status, obj) => send(res, status, 'application/json; charset=utf-8', JSON.stringify(obj));

function body(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 5_000_000) reject(new Error('payload too large'));
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 25_000_000) {
        reject(new Error('image too large (max 25MB)'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

function serveStatic(res, urlPath) {
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, '');
  const file = path.join(PUBLIC_DIR, rel);
  if (!file.startsWith(PUBLIC_DIR) || !existsSync(file)) return false;
  send(res, 200, MIME[path.extname(file)] || 'application/octet-stream', readFileSync(file));
  return true;
}

const COOKIE = 'ab_admin';

/** Loopback needs no token; anything reachable off-host does. */
function authorized(req, url) {
  if (!TOKEN) return true;
  const cookie = req.headers.cookie || '';
  if (cookie.split(/;\s*/).includes(`${COOKIE}=${TOKEN}`)) return true;
  if (req.headers['x-admin-token'] === TOKEN) return true;
  return url.searchParams.get('token') === TOKEN;
}

function unauthorized(res, isApi) {
  if (isApi) return json(res, 401, { error: 'unauthorized — open the studio URL printed by the server' });
  send(
    res,
    401,
    'text/html; charset=utf-8',
    '<!doctype html><meta charset="utf-8"><body style="font:14px ui-monospace,monospace;background:#1d2021;color:#ebdbb2;padding:40px">' +
      '<h2 style="color:#fb4934">401 — token required</h2>' +
      '<p>Open the URL printed by the server: it includes <code>?token=…</code>.</p></body>'
  );
}

// ── publishing helpers ─────────────────────────────────────────────────────

/** Writes the blog file for a piece. LinkedIn and X are copy-and-open. */
function publishBlog(piece) {
  const published = { ...(piece.published ?? {}) };
  const input = {
    title: piece.title,
    date: piece.date || new Date().toISOString().slice(0, 10),
    description: piece.description,
    tags: piece.tags ?? [],
    body: piece.blogBody || piece.title,
  };
  const slug =
    piece.slug && existsSync(path.join(BLOG_DIR, `${piece.slug}.md`))
      ? (writePost(piece.slug, input), piece.slug)
      : createPost(input);
  const url = `${PREVIEW}/blog/${slug}`;
  published.blog = { url, at: new Date().toISOString() };
  return { slug, url, published };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  if (TOKEN && url.searchParams.get('token') === TOKEN) {
    res.setHeader('Set-Cookie', `${COOKIE}=${TOKEN}; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`);
  }
  if (!authorized(req, url)) return unauthorized(res, p.startsWith('/api/'));

  try {
    if (p.startsWith('/api/')) {
      // blog
      if (p === '/api/posts' && req.method === 'GET') return json(res, 200, listPosts());
      if (p === '/api/posts' && req.method === 'POST') {
        const input = await body(req);
        if (!input.title) return json(res, 400, { error: 'title is required' });
        return json(res, 201, { slug: createPost(input) });
      }
      const postMatch = p.match(/^\/api\/posts\/([^/]+)$/);
      if (postMatch) {
        const slug = decodeURIComponent(postMatch[1]);
        if (req.method === 'GET') {
          const post = readPost(slug);
          return post ? json(res, 200, post) : json(res, 404, { error: 'not found' });
        }
        if (req.method === 'PUT') return json(res, 200, { slug: writePost(slug, await body(req)) });
        if (req.method === 'DELETE') return json(res, 200, { deleted: deletePost(slug) });
      }

      // queue
      if (p === '/api/queue' && req.method === 'GET') return json(res, 200, readQueue());
      if (p === '/api/queue' && req.method === 'POST') {
        const q = readQueue();
        const item = { id: uid(), createdAt: new Date().toISOString(), status: 'idea', ...(await body(req)) };
        q.push(item);
        writeQueue(q);
        return json(res, 201, item);
      }
      const qMatch = p.match(/^\/api\/queue\/([^/]+)$/);
      if (qMatch) {
        const id = qMatch[1];
        const q = readQueue();
        const i = q.findIndex((x) => x.id === id);
        if (i === -1) return json(res, 404, { error: 'not found' });
        if (req.method === 'PUT') {
          q[i] = { ...q[i], ...(await body(req)), id };
          writeQueue(q);
          return json(res, 200, q[i]);
        }
        if (req.method === 'DELETE') {
          q.splice(i, 1);
          writeQueue(q);
          return json(res, 200, { deleted: true });
        }
      }

      // pieces — the composer
      if (p === '/api/pieces' && req.method === 'GET') return json(res, 200, pieces.all());
      if (p === '/api/pieces' && req.method === 'POST') {
        const input = await body(req);
        const piece = { id: uid(), createdAt: new Date().toISOString(), title: '', ...input };
        pieces.add(piece);
        return json(res, 201, piece);
      }
      const pieceMatch = p.match(/^\/api\/pieces\/([^/]+)$/);
      if (pieceMatch) {
        const id = pieceMatch[1];
        if (req.method === 'PUT') {
          const updated = pieces.update(id, await body(req));
          return updated ? json(res, 200, updated) : json(res, 404, { error: 'not found' });
        }
        if (req.method === 'DELETE') {
          pieces.remove(id);
          return json(res, 200, { deleted: true });
        }
      }

      if (p === '/api/publish' && req.method === 'POST') {
        const { id } = await body(req);
        const piece = pieces.all().find((x) => x.id === id);
        if (!piece) return json(res, 404, { error: 'piece not found' });
        try {
          const out = publishBlog(piece);
          const updated = pieces.update(id, { slug: out.slug, published: out.published });
          return json(res, 200, { blog: { ok: true, slug: out.slug, url: out.url }, piece: updated });
        } catch (e) {
          return json(res, 500, { blog: { ok: false, error: String(e.message || e) } });
        }
      }

      // Image upload for the markdown editor: raw body + ?name=, saved under
      // public/images so the deployed site can serve it.
      if (p === '/api/upload' && req.method === 'POST') {
        const name = (url.searchParams.get('name') || 'image.png').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
        const buf = await rawBody(req);
        if (!buf.length) return json(res, 400, { error: 'empty body' });
        const dir = path.join(ROOT, 'public', 'images');
        mkdirSync(dir, { recursive: true });
        const ext = path.extname(name) || '.png';
        const stem = path.basename(name, ext) || 'image';
        let file = path.join(dir, name);
        let i = 1;
        while (existsSync(file)) file = path.join(dir, `${stem}-${i++}${ext}`);
        writeFileSync(file, buf);
        return json(res, 200, { url: `/images/${path.basename(file)}`, bytes: buf.length });
      }

      if (p === '/api/deploy' && req.method === 'POST') {
        if (process.env.ADMIN_DEPLOY !== '1') return json(res, 400, { error: 'ADMIN_DEPLOY no está en 1 — haz git push a mano.' });
        const { message } = await body(req);
        try {
          await pexec('git', ['add', '-A', 'src/content/blog', 'public'], { cwd: ROOT });
          await pexec('git', ['commit', '-m', message || 'content: publish'], { cwd: ROOT });
          const { stdout } = await pexec('git', ['push'], { cwd: ROOT });
          return json(res, 200, { ok: true, stdout });
        } catch (e) {
          return json(res, 500, { error: String(e.stderr || e.message || e) });
        }
      }

      // backlog, ideas + config
      if (p === '/api/backlog') return json(res, 200, existsSync(BACKLOG_FILE) ? JSON.parse(readFileSync(BACKLOG_FILE, 'utf8')) : []);
      if (p === '/api/ideas') return json(res, 200, existsSync(IDEAS_FILE) ? JSON.parse(readFileSync(IDEAS_FILE, 'utf8')) : []);
      if (p === '/api/config') return json(res, 200, { preview: PREVIEW, root: ROOT, deploy: process.env.ADMIN_DEPLOY === '1' });

      return json(res, 404, { error: 'unknown endpoint' });
    }

    if (req.method === 'GET' && serveStatic(res, p)) return;
    json(res, 404, { error: 'not found' });
  } catch (err) {
    json(res, 500, { error: String(err?.message || err) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Content studio  →  ${STUDIO_URL}`);
  if (!LOOPBACK) {
    console.log(`  Bind            →  ${HOST}${LAN_IP ? `  (your LAN IP: ${LAN_IP})` : ''}`);
    console.log('  Access          →  no auth. Meant for your local network.');
  }
  console.log(`  Blog files      →  ${BLOG_DIR}`);
  console.log(`  Images          →  ${path.join(ROOT, 'public', 'images')}`);
  console.log(`  Preview (astro) →  ${PREVIEW}\n`);
});

// Optionally bring up the Astro dev server alongside the studio.
let dev = null;
if (process.env.ADMIN_DEV !== '0') {
  // Spawn the local astro binary directly: `pnpm dev -- --host` hands the
  // literal `--` to astro, which then drops the flag.
  // The preview has to answer on the same interface as the studio when the
  // studio is exposed, otherwise the link works only from this machine.
  const astroBin = path.join(ROOT, 'node_modules', '.bin', 'astro');
  const args = LOOPBACK ? ['dev'] : ['dev', '--host'];
  dev = spawn(astroBin, args, { cwd: ROOT, stdio: 'inherit', detached: true });
  dev.on('error', () => console.log('  (could not start astro dev — run `pnpm dev` yourself)'));
}

function shutdown() {
  if (dev && !dev.killed) {
    try {
      process.kill(-dev.pid, 'SIGINT');
    } catch {}
  }
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
