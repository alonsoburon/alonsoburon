/* Studio UI — vanilla, no build step. Talks to server.mjs over /api. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const api = {
  get: (p) => fetch(p).then((r) => r.json()),
  send: (p, method, body) =>
    fetch(p, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body ?? {}) }).then((r) => r.json()),
};

const state = { pieces: [], pieceId: null, posts: [], slug: null, ideas: [], ideaFilter: 'all', backlog: [], config: {} };

const status = (msg, ok = true) => {
  const el = $('#status');
  el.textContent = msg;
  el.style.color = ok ? 'var(--str)' : 'var(--kw)';
  clearTimeout(status._t);
  status._t = setTimeout(() => (el.textContent = ''), 3000);
};

/* ── markdown editor (EasyMDE via CDN) ────────────────────── */
function uploadImage(file, onSuccess, onError) {
  fetch('/api/upload?name=' + encodeURIComponent(file.name || 'image.png'), {
    method: 'POST',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  })
    .then((r) => r.json())
    .then((j) => (j.url ? onSuccess(j.url) : onError(j.error || 'upload failed')))
    .catch((e) => onError(String(e)));
}

function makeEditor(el) {
  return new EasyMDE({
    element: el,
    spellChecker: false,
    status: false,
    autoDownloadFontAwesome: true,
    minHeight: '240px',
    toolbar: [
      'bold', 'italic', 'heading', '|',
      'quote', 'unordered-list', 'ordered-list', '|',
      'link', 'image', 'table', 'code', 'horizontal-rule', '|',
      'preview', 'side-by-side', 'fullscreen', '|', 'guide',
    ],
    uploadImage: true,
    imageAccept: 'image/*',
    imagePathAbsolute: true,
    imageUploadFunction: uploadImage,
    renderingConfig: { singleLineBreaks: false },
  });
}

let blogEditor = null;
let postEditor = null;

/* ── tabs ─────────────────────────────────────────────────── */
$$('.tabs button').forEach((b) =>
  b.addEventListener('click', () => {
    $$('.tabs button').forEach((x) => x.classList.toggle('active', x === b));
    $$('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${b.dataset.tab}`));
  })
);

/* ── composer ─────────────────────────────────────────────── */
function dots(p) {
  const pub = p.published ?? {};
  return ['blog', 'linkedin', 'x']
    .map((k) => `<span class="dot ${pub[k] ? 'on' : ''}" title="${k}">${k[0].toUpperCase()}</span>`)
    .join('');
}

function renderPieces() {
  $('#piece-count').textContent = `${state.pieces.length} pieces`;
  $('#piece-list').innerHTML = state.pieces
    .map(
      (p) => `<button class="post-row ${p.id === state.pieceId ? 'active' : ''}" data-id="${esc(p.id)}">
        <span class="ttl">${esc(p.title || '(untitled)')}</span>
        <span class="row-meta">${dots(p)}<span class="dt">${esc(p.date || '')}</span></span>
      </button>`
    )
    .join('');
  $$('#piece-list .post-row').forEach((r) => r.addEventListener('click', () => openPiece(r.dataset.id)));
}

function setPieceForm(p) {
  const f = $('#piece-form');
  f.title.value = p?.title ?? '';
  f.date.value = p?.date ?? new Date().toISOString().slice(0, 10);
  f.tags.value = (p?.tags ?? []).join(', ');
  f.description.value = p?.description ?? '';
  f.linkedinText.value = p?.linkedinText ?? '';
  f.xText.value = p?.xText ?? '';
  if (blogEditor) blogEditor.value(p?.blogBody ?? '');
  $('#piece-file').textContent = p ? `piece ${p.id}${p.slug ? ` · /blog/${p.slug}` : ''}` : 'new piece';
  $('#delete-piece').classList.toggle('hidden', !p);
  $('#publish-result').classList.add('hidden');
  updateCounters();
}

function piecePayload() {
  const f = $('#piece-form');
  return {
    title: f.title.value.trim(),
    date: f.date.value,
    tags: f.tags.value.split(',').map((t) => t.trim()).filter(Boolean),
    description: f.description.value.trim(),
    blogBody: blogEditor ? blogEditor.value() : f.blogBody.value,
    linkedinText: f.linkedinText.value,
    xText: f.xText.value,
  };
}

async function openPiece(id) {
  const p = state.pieces.find((x) => x.id === id);
  state.pieceId = id;
  setPieceForm(p);
  renderPieces();
}

$('#new-piece').addEventListener('click', () => {
  state.pieceId = null;
  setPieceForm(null);
  renderPieces();
  $('#piece-form').title.focus();
});

async function savePiece(silent) {
  if (!state.pieceId) {
    const created = await api.send('/api/pieces', 'POST', piecePayload());
    state.pieceId = created.id;
    state.pieces.unshift(created);
  } else {
    const updated = await api.send(`/api/pieces/${state.pieceId}`, 'PUT', piecePayload());
    const i = state.pieces.findIndex((x) => x.id === state.pieceId);
    if (i > -1) state.pieces[i] = updated;
  }
  if (!silent) status('Saved');
  renderPieces();
  return state.pieceId;
}

$('#save-piece').addEventListener('click', () => savePiece(false));

$('#delete-piece').addEventListener('click', async () => {
  if (!state.pieceId || !confirm('Delete this piece?')) return;
  await api.send(`/api/pieces/${state.pieceId}`, 'DELETE');
  state.pieces = state.pieces.filter((x) => x.id !== state.pieceId);
  state.pieceId = null;
  setPieceForm(null);
  renderPieces();
  status('Piece deleted');
});

/* ── publishing (no API: blog writes, LinkedIn/X copy + open) ─ */
async function markPublished(platform) {
  const p = state.pieces.find((x) => x.id === state.pieceId);
  if (!p) return;
  p.published = { ...(p.published ?? {}), [platform]: { at: new Date().toISOString() } };
  await api.send(`/api/pieces/${p.id}`, 'PUT', { published: p.published });
  renderPieces();
}

$('#pub-blog').addEventListener('click', async () => {
  await savePiece(true);
  const res = await api.send('/api/publish', 'POST', { id: state.pieceId });
  const i = state.pieces.findIndex((x) => x.id === state.pieceId);
  if (i > -1 && res.piece) state.pieces[i] = res.piece;
  setPieceForm(res.piece ?? state.pieces[i]);
  renderPieces();
  const box = $('#publish-result');
  if (res.blog?.ok) {
    const hint = state.config.deploy
      ? ''
      : `<div class="res-hint">To publish it: <code>git add src/content/blog public && git commit -m "post" && git push</code></div>`;
    box.innerHTML = `<div class="res-line ok">✓ blog — <a href="${esc(res.blog.url)}" target="_blank" rel="noopener">${esc(res.blog.url)}</a></div>${hint}`;
  } else {
    box.innerHTML = `<div class="res-line err">✗ blog — ${esc(res.blog?.error || 'error')}</div>`;
  }
  box.classList.remove('hidden');
  status(res.blog?.ok ? 'Blog written' : 'Failed to write the blog', Boolean(res.blog?.ok));
});

$('#pub-linkedin').addEventListener('click', async () => {
  const f = $('#piece-form');
  const text = f.linkedinText.value.trim() || f.title.value.trim();
  if (!text) return status('Write the LinkedIn text first', false);
  await navigator.clipboard.writeText(text).catch(() => {});
  window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank', 'noopener');
  await markPublished('linkedin');
  status('LinkedIn copied — paste in the open window');
});

$('#pub-x').addEventListener('click', async () => {
  const f = $('#piece-form');
  const text = f.xText.value.trim() || f.title.value.trim();
  if (!text) return status('Write the X text first', false);
  const parts = chunk(text);
  await navigator.clipboard.writeText(parts[0]).catch(() => {});
  window.open('https://x.com/compose/post', '_blank', 'noopener');
  await markPublished('x');
  status(parts.length > 1 ? `Thread of ${parts.length} — first tweet copied` : 'X copied — paste in the open window');
});

/* counters + generators + X thread preview */
function updateCounters() {
  const f = $('#piece-form');
  const li = f.linkedinText.value.length;
  $('#li-count').textContent = `${li} / 3000`;
  $('#li-count').className = 'counter' + (li > 3000 ? ' over' : '');
  const xt = f.xText.value.length;
  const parts = chunk(f.xText.value.trim());
  $('#x-count').textContent = parts.length > 1 ? `${xt} · ${parts.length} tweets` : `${xt} / 280`;
  $('#x-count').className = 'counter' + (xt > 280 ? ' warn' : '');
  renderThread(parts, xt > 280);
}

function renderThread(parts, show) {
  const box = $('#x-thread');
  if (!show || parts.length < 2) {
    box.classList.add('hidden');
    return;
  }
  box.innerHTML = parts
    .map(
      (t, i) => `<div class="thread-item"><span class="thread-n">${i + 1}/${parts.length}</span>
        <span class="thread-t">${esc(t)}</span>
        <button type="button" class="ghost mini" data-copy="${i}">copy</button></div>`
    )
    .join('');
  box.classList.remove('hidden');
  $$('#x-thread [data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      await navigator.clipboard.writeText(parts[Number(b.dataset.copy)]).catch(() => {});
      status(`Tweet ${Number(b.dataset.copy) + 1} copied`);
    })
  );
}

/** Same split rule as the server: blank lines, then sentences, then hard wrap. */
function chunk(text, limit = 280) {
  const parts = [];
  for (const para of String(text).split(/\n{2,}/)) {
    let current = '';
    for (const unit of para.split(/(?<=[.!?])\s+/)) {
      const candidate = current ? `${current} ${unit}` : unit;
      if (candidate.length <= limit) {
        current = candidate;
        continue;
      }
      if (current) parts.push(current);
      if (unit.length <= limit) current = unit;
      else {
        let rest = unit;
        while (rest.length > limit) {
          parts.push(rest.slice(0, limit));
          rest = rest.slice(limit);
        }
        current = rest;
      }
    }
    if (current) parts.push(current);
  }
  return parts.length ? parts : [''];
}

$('#piece-form').addEventListener('input', updateCounters);

function stripMd(s) {
  return s
    .replace(/^#+\s*/gm, '')
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .replace(/<\/?span[^>]*>/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

$('#gen-linkedin').addEventListener('click', () => {
  const f = $('#piece-form');
  const paras = stripMd(blogEditor ? blogEditor.value() : '').split(/\n{2,}/).filter(Boolean);
  let out = f.title.value ? `${f.title.value}\n\n` : '';
  out += paras.slice(0, 3).join('\n\n');
  f.linkedinText.value = out.slice(0, 3000);
  updateCounters();
});

$('#gen-x').addEventListener('click', () => {
  const f = $('#piece-form');
  const first = (stripMd(blogEditor ? blogEditor.value() : '').split(/\n{2,}/)[0] || '').trim();
  let out = (first.match(/^[^.!?]+[.!?]/) || [first])[0].trim();
  if (out.length > 280) out = out.slice(0, 277) + '…';
  if (!out) out = f.title.value.slice(0, 280);
  f.xText.value = out;
  updateCounters();
});

/* ── blog (edit the .md files) ────────────────────────────── */
function renderPosts() {
  $('#post-count').textContent = `${state.posts.length} posts`;
  $('#post-list').innerHTML = state.posts
    .map(
      (p) => `<button class="post-row ${p.slug === state.slug ? 'active' : ''}" data-slug="${esc(p.slug)}">
        <span class="ttl">${esc(p.title)}</span>
        <span class="row-meta"><span class="dt">${esc(p.date)}</span></span>
      </button>`
    )
    .join('');
  $$('#post-list .post-row').forEach((r) => r.addEventListener('click', () => openPost(r.dataset.slug)));
}

function setPostForm(post) {
  const f = $('#post-form');
  f.title.value = post?.title ?? '';
  f.date.value = post?.date ?? new Date().toISOString().slice(0, 10);
  f.tags.value = (post?.tags ?? []).join(', ');
  f.description.value = post?.description ?? '';
  if (postEditor) postEditor.value(post?.body ?? '');
  $('#post-file').textContent = post ? `${post.slug}.md` : 'new post';
  $('#delete-post').classList.toggle('hidden', !post);
  $('#post-preview').classList.toggle('hidden', !post);
  if (post) $('#post-preview').href = `${state.config.preview}/blog/${post.slug}`;
}

async function openPost(slug) {
  const post = await api.get(`/api/posts/${slug}`);
  state.slug = slug;
  setPostForm(post);
  renderPosts();
}

$('#new-post').addEventListener('click', () => {
  state.slug = null;
  setPostForm(null);
  renderPosts();
});
$('#save-post').addEventListener('click', async () => {
  const f = $('#post-form');
  const payload = {
    title: f.title.value.trim(),
    date: f.date.value,
    description: f.description.value.trim(),
    tags: f.tags.value.split(',').map((t) => t.trim()).filter(Boolean),
    body: postEditor ? postEditor.value() : f.body.value,
  };
  if (!payload.title) return status('Title is required', false);
  if (state.slug) await api.send(`/api/posts/${state.slug}`, 'PUT', payload);
  else {
    const { slug } = await api.send('/api/posts', 'POST', payload);
    state.slug = slug;
  }
  state.posts = await api.get('/api/posts');
  await openPost(state.slug);
  status('Saved');
});
$('#delete-post').addEventListener('click', async () => {
  if (!state.slug || !confirm(`Move ${state.slug}.md to trash?`)) return;
  await api.send(`/api/posts/${state.slug}`, 'DELETE');
  state.slug = null;
  state.posts = await api.get('/api/posts');
  setPostForm(null);
  renderPosts();
});

/* ── ideas ────────────────────────────────────────────────── */
function renderIdeaFilters() {
  const pillars = ['all', ...new Set(state.ideas.map((i) => i.pillar))];
  $('#idea-filters').innerHTML = pillars
    .map((p) => `<button class="chip ${p === state.ideaFilter ? 'active' : ''}" data-pillar="${esc(p)}">${esc(p)}</button>`)
    .join('');
  $$('#idea-filters .chip').forEach((c) =>
    c.addEventListener('click', () => {
      state.ideaFilter = c.dataset.pillar;
      renderIdeaFilters();
      renderIdeas();
    })
  );
}

function renderIdeas() {
  const list = state.ideaFilter === 'all' ? state.ideas : state.ideas.filter((i) => i.pillar === state.ideaFilter);
  $('#ideas').innerHTML = `<thead><tr><th>Pillar</th><th>Format</th><th>Hook</th><th>Outline</th><th></th></tr></thead>
    <tbody>${list
      .map(
        (i) => `<tr>
          <td class="pillar">${esc(i.pillar)}</td>
          <td class="muted">${esc(i.format)}</td>
          <td>${esc(i.hook)}</td>
          <td>
            <div class="muted">${esc(i.angle)}</div>
            <ul class="idea-points">${(i.points ?? []).map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
          </td>
          <td class="actions"><button class="ghost" data-idea="${esc(state.ideas.indexOf(i))}">→ Composer</button></td>
        </tr>`
      )
      .join('')}</tbody>`;
  $$('#ideas button').forEach((b) =>
    b.addEventListener('click', () => {
      const idea = state.ideas[Number(b.dataset.idea)];
      const outline = (idea.points ?? []).map((p) => `- ${p}`).join('\n');
      newPieceFrom({
        title: idea.hook,
        description: idea.angle,
        blogBody: `## ${idea.hook}\n\n${idea.angle}\n\n${outline}\n\n`,
      });
    })
  );
}

/* ── plan ─────────────────────────────────────────────────── */
function renderBacklog() {
  $('#backlog').innerHTML = `<thead><tr><th>Wk</th><th>Pillar</th><th>Piece</th><th>Derivative</th><th></th></tr></thead>
    <tbody>${state.backlog
      .map(
        (b) => `<tr>
          <td class="week">${esc(b.week)}</td>
          <td class="pillar">${esc(b.pillar)}</td>
          <td>${esc(b.title)}</td>
          <td class="muted">${esc(b.derivative)}</td>
          <td class="actions"><button class="ghost" data-week="${esc(b.week)}">→ Composer</button></td>
        </tr>`
      )
      .join('')}</tbody>`;
  $$('#backlog button').forEach((btn) =>
    btn.addEventListener('click', () => {
      const b = state.backlog.find((x) => String(x.week) === btn.dataset.week);
      newPieceFrom({ title: b.title, description: `${b.derivative} · pillar: ${b.pillar}`, blogBody: `## ${b.title}\n\n` });
    })
  );
}

async function newPieceFrom(fields) {
  const created = await api.send('/api/pieces', 'POST', {
    title: fields.title ?? '',
    description: fields.description ?? '',
    blogBody: fields.blogBody ?? '',
    date: new Date().toISOString().slice(0, 10),
  });
  state.pieces.unshift(created);
  $$('.tabs button').forEach((x) => x.classList.toggle('active', x.dataset.tab === 'composer'));
  $$('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-composer'));
  openPiece(created.id);
  status('Piece created');
}

/* ── boot ─────────────────────────────────────────────────── */
(async function init() {
  blogEditor = makeEditor($('#piece-form [name=blogBody]'));
  postEditor = makeEditor($('#post-form [name=body]'));

  const [pieces, posts, ideas, backlog, config] = await Promise.all([
    api.get('/api/pieces'),
    api.get('/api/posts'),
    api.get('/api/ideas'),
    api.get('/api/backlog'),
    api.get('/api/config'),
  ]);
  state.pieces = pieces;
  state.posts = posts;
  state.ideas = ideas;
  state.backlog = backlog;
  state.config = config;
  $('#preview-link').href = config.preview;
  renderPieces();
  renderPosts();
  renderIdeaFilters();
  renderIdeas();
  renderBacklog();
  if (state.pieces.length) openPiece(state.pieces[0].id);
  else setPieceForm(null);
  if (state.posts.length) openPost(state.posts[0].slug);
  else setPostForm(null);
})();
