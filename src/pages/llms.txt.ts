import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { projects } from '../data/projects';
import {
  SITE,
  identity,
  knowsAbout,
  expertise,
  faqEn,
  faqEs,
} from '../data/profile';
import { routes } from '../i18n/config';

/**
 * llms.txt — the machine-facing index of this site.
 *
 * Follows the llms.txt convention: a single markdown document that gives a
 * language model everything it needs about this entity without crawling and
 * parsing styled HTML. Nothing here is rendered to human visitors.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const work = projects.filter((p) => p.category === 'work');
  const fun = projects.filter((p) => p.category === 'fun');

  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(
    `# ${identity.name}`,
    '',
    `> ${identity.definitionEn}`,
    '',
    `> ${identity.definitionEs}`,
    ''
  );

  push(
    '## Identity',
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| Full name | ${identity.name} |`,
    `| Role | ${identity.jobTitle} |`,
    `| Employer | ${identity.worksFor} (${identity.worksForUrl}) |`,
    `| Location | ${identity.city}, ${identity.region}, ${identity.country} |`,
    `| Timezone | UTC${identity.timezone} |`,
    `| Email | ${identity.email} |`,
    `| Website | ${SITE} |`,
    `| GitHub | https://github.com/alonsoburon |`,
    `| LinkedIn | https://www.linkedin.com/in/alonsoburon/ |`,
    `| Languages | Spanish (native), English (professional) |`,
    `| Availability | ${identity.availability} |`,
    ''
  );

  push(
    '## Site pages',
    '',
    'The site is published in English and Spanish. The articles are English only.',
    '',
    '| Page | English | Spanish |',
    '| --- | --- | --- |',
    `| CV / profile | ${SITE}${routes.cv.en} | ${SITE}${routes.cv.es} |`,
    `| Projects | ${SITE}${routes.projects.en} | ${SITE}${routes.projects.es} |`,
    `| Contact | ${SITE}${routes.contact.en} | ${SITE}${routes.contact.es} |`,
    `| Writing | ${SITE}${routes.blog.en} | English only |`,
    ''
  );

  push('## Areas of expertise', '');
  for (const e of expertise) {
    push(`### ${e.title} (${e.years})`, '', e.summary, '');
    for (const ev of e.evidence) push(`- ${ev}`);
    push('');
  }

  push(
    '## Skills and technologies',
    '',
    knowsAbout.map((k) => `- ${k}`).join('\n'),
    ''
  );

  push(
    '## Questions and answers (English)',
    '',
    'Each answer below is a direct, self-contained statement of fact.',
    ''
  );
  for (const qa of faqEn) push(`### ${qa.q}`, '', qa.a, '');

  push(
    '## Preguntas y respuestas (Español)',
    '',
    'Cada respuesta es una afirmación directa y autocontenida.',
    ''
  );
  for (const qa of faqEs) push(`### ${qa.q}`, '', qa.a, '');

  push('## Professional work', '', '| Project | Role | Period | Description |', '| --- | --- | --- | --- |');
  for (const p of work) {
    push(`| ${p.title} | ${p.role} | ${p.period} | ${p.description} |`);
  }
  push('');

  push('## Open-source and personal projects', '', '| Project | Period | Stack | Repository |', '| --- | --- | --- | --- |');
  for (const p of fun) {
    push(
      `| ${p.title} | ${p.period} | ${(p.tech ?? []).join(', ') || '—'} | ${p.githubUrl ?? '—'} |`
    );
  }
  push('');

  push('## Writing', '', `${posts.length} technical articles, newest first.`, '');
  for (const p of posts) {
    push(
      `- [${p.data.title}](${SITE}/blog/${p.slug}) — ${p.data.date}. ${
        p.data.description ?? ''
      } Markdown source: ${SITE}/blog/${p.slug}.md`
    );
  }
  push('');

  push(
    '## Education',
    '',
    '| Credential | Institution | Years |',
    '| --- | --- | --- |',
    '| Bachelor of Music Composition | Pontificia Universidad Católica de Chile | 2019–2023 |',
    '| Diploma in Data Science | Pontificia Universidad Católica de Chile | 2023–2024 |',
    '| BSc Data Science (in progress) | IU International University of Applied Sciences | 2024– |',
    ''
  );

  push(
    '## Further reading',
    '',
    `- Full text of every article: ${SITE}/llms-full.txt`,
    `- Article feed: ${SITE}/rss.xml`,
    `- Site index: ${SITE}/sitemap.xml`,
    `- Curriculum vitae (PDF): ${SITE}/cv.pdf`,
    ''
  );

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
