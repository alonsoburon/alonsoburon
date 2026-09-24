# Content strategy — Alonso Burón

> **Guiding principle:** *provide value over a long period of time.*
> Focus on the audience, give value in every piece, show up consistently.
> A high-trust brand compounds.

> **Pivot (2026):** stop positioning **ECL** as the center of the brand. The
> framework was useful to start publishing, but it is not a topic with demand:
> nobody searches for it, none of the reference voices compete on it, and it
> boxes the brand into "pipeline architect" when the market pays for something
> else. ECL stays as a published essay series, not as an identity.

This is the operating plan for the site, LinkedIn, X and GitHub. The site is
the **owned media** (the hub); everything else points back to it. This is not an
"influencer" strategy: it is a **visible track record of expertise**.

---

## 0. Who we draw from (and what we take)

Looking at the data-engineering profiles that grew on X and LinkedIn in 2026,
the patterns are consistent:

| Reference | What they do | What we take |
|---|---|---|
| **Zach Wilson** (DataExpert.io) | Roadmaps and contrarian takes on the AI era of DE | Strong theses + "roadmap" format |
| **Joe Reis** | "ETL is dead", surveys, data modeling and semantics | A position on the reset of the craft |
| **Ben Rogojan** (SeattleDataGuy) | Migration and architecture stories, very practical | Cases with decisions and trade-offs |
| **Simon Späti** (sspaeti.com) | OSS, Obsidian, Neovim, writing in public | Build-in-public and craft |
| **Ananth Packkildurai** (Data Engineering Weekly) | Curation + real company engineering (Meta, Spotify, Stripe) | Steal the "how X did it" format |
| **Aurimas Griciūnas** (SwirlAI) | Context engineering, agents, RAG in production | Agents as a core theme |
| **Oh That Data Girl** (@ohthatdatagirl) | "Show the messy middle", systems over noise | Show the process, not just the result |

**Format data that matters (LinkedIn 2025–2026):**

- **Documents / carousels** get the best reach **and** engagement.
- **Images** (screenshots, diagrams, charts) are the biggest engagement
  multiplier after documents.
- **Polls** get the most reach but low engagement: they are distribution, not
  authority.
- **Plain text** is declining; **short video** no longer performs.
- Best frequency: **2–3 posts/week**, mixing formats; never two of the same
  format back to back.

**Hot topics in DE 2026** (where to fish): AI/agents inside data engineering,
semantic layers, context engineering, multi-tenancy, tribal knowledge, data
contracts, idempotency, backfill safety, observability, Iceberg. And the
counterpoint: *what AI does not disrupt is strategy, semantics, governance and
trust.*

---

## 1. Objective

Make Alonso Burón the engineer known for **knowing what stays scarce when AI
writes the code**: reliability, semantics, and agents that run on real data.
And, commercially, the reference Chilean companies and mining firms go to.

Outcomes, in order:

1. **Technical inbound** — recruiters, leaders and clients come on their own.
2. **Authority in the AI era of data engineering** — not in a home-grown framework.
3. **Business** — independent consulting and senior offers.

### KPIs (review every 30 days)

| Horizon | Long-form pieces | LinkedIn | Carousels | Newsletter | Talks | Inbound |
|---|---|---|---|---|---|---|
| 90 days | 6 | 36 | 4 | 3 | 1 | 5 conversations |
| 6 months | 12 | 72 | 8 | 6 | 3 | 2 engagements |
| 12 months | 24 | 140 | 16 | 12 | 6 | cited by third parties |

Plus: brand mentions in ChatGPT/Perplexity answers, and ranking for "AI data
engineering", "idempotent pipeline", "SAP Business One BigQuery", "mining BI
Chile".

---

## 2. Audiences

**A. Global data engineers (EN).** They read technical blogs, HN, Reddit, X.
They want frameworks, opinions and scars. → Authority and recruiting.

**B. Chilean/LatAm companies with data and ERPs (ES).** IT, operations and
finance managers in mining, retail, services. They decide purchases.
→ independent consulting.

**C. AI agent builders (EN).** Devs on Claude Code, MCP, tooling. A booming
segment. → The "AI agents" facet of the profile.

**D. Composers / non-linear careers (EN/ES).** A human, top-of-funnel audience;
the composer-to-data-lead story is pure differentiation.

---

## 3. Positioning

**One line (EN):** *I build data platforms that survive production — and the AI
agents that run on them.*

**Differentiators nobody else combines:**

- Real production at scale: **150 sources / ~160,000 tables a day**, replaced
  **Fivetran**.
- Chilean **mining** with RLS between contractors and sites.
- **Agentic systems** (MCP, Agent Skills, cost-tiered multi-agent) on top of
  enterprise data, not in a playground.
- A **composer** background → structural and narrative thinking.

---

## 4. Content pillars

Every piece belongs to **one** pillar. The pillar defines format, channel and CTA.

### Pillar 1 — The AI era of data engineering (core, EN)
What stays scarce when AI writes the pipelines: semantics, reliability,
idempotency, backfill safety, data contracts, governance. Strong theses and
contrarian takes, in a roadmap or "what survives" format.
- **CTA:** subscribe, follow the series.
- **Formats:** essay + carousel + poll for distribution.

### Pillar 2 — Production stories with numbers (EN)
The "messy middle": migrations, architecture, decisions and trade-offs. Stealing
the format of engineering write-ups (Meta/Spotify/Stripe) but with his own work:
Warp, multi-tenancy, ERPs, cost.
- **CTA:** consulting ("shall we review your ingestion?").
- **Formats:** essay with metrics + diagram + carousel.

### Pillar 3 — Agents and context engineering (EN)
MCP, Agent Skills, cost-tiered orchestration, guardrails, least privilege,
context design for agents with warehouse access.
- **CTA:** try `vintage` / `ecl-skill`; talk about AI projects.
- **Formats:** technical post + repo + X thread + short demo.

### Pillar 4 — Mining and enterprise data in Chile (EN/ES)
The commercial wedge. RLS, SAP B1/HANA, plant reporting, history you cannot
re-extract.
- **CTA:** direct contact.
- **Formats:** article + case study + LinkedIn.

### Pillar 5 — Build in public and craft (EN/ES)
OSS, Obsidian, Arch/Hyprland, learning Go/Rust, the process and not just the
result, the composer-to-data-lead story.
- **CTA:** follow / connect.
- **Formats:** short post + screenshot + short.

---

## 5. Cadence and production system

**Rule:** one long piece every two weeks is the base unit. Everything else is
derived from it. Never original content that differs by channel.

| Rhythm | Piece | Channel | Effort |
|---|---|---|---|
| Every 2 weeks | Long essay (900–1,800 words) | Site (hub) | High |
| Weekly | 3 short derived posts | LinkedIn | Low |
| Biweekly | 1 carousel (document) from the essay | LinkedIn | Medium |
| Weekly | 1 thread or build-in-public | X | Low |
| Monthly | "The Conform" newsletter | Email | Medium |
| Per release | Notes + demo | GitHub | Low |
| Quarterly | Talk / podcast | Earned | Medium |

**Batching:** one writing day, one derivative day (3 LinkedIn + 1 carousel + 1
thread), half an hour scheduling. Schedule the whole month at once.

**Reuse pipeline for each essay:**

```
Essay (site)
  ├─ 1) Branded OG card               ← automatic on publish
  ├─ 2) LinkedIn carousel (8–10 slides) ← best reach format
  ├─ 3) LinkedIn post with the "lesson learned" angle
  ├─ 4) X thread with the framework step by step
  ├─ 5) Related poll (reach) → results thread
  ├─ 6) Newsletter item with the core idea
  └─ 7) Vertical short (60–90 s) if the topic earns it
```

**Essay template:** hook with a real scene → the problem → why the obvious
answer fails → the pattern/framework → evidence (numbers) → limits (when NOT to
use it) → close with a concrete action.

---

## 6. Channels and their role

| Channel | Role | Audience | Frequency |
|---|---|---|---|
| **alonsoburon.cl** | Canonical hub; GEO/AEO already optimized | All | Every piece |
| **LinkedIn** | Main engine: carousels + short posts | A, B, D | 3/week |
| **X / Twitter** | Devs + AI builders; technical threads | A, C | 1 thread/week |
| **GitHub** | Proof the code exists | A, C | Per release |
| **Newsletter** | Direct relationship, not algorithmic | A, B, D | Monthly |
| **Reddit / HN** | Traffic spikes and citations | A | Strong posts only |
| **Podcasts / conferences** | Earned media and credentials | A, B | Quarterly |

**Channel rule:** LinkedIn = story + lesson + carousel. X = framework + code.
Site = the full, citable version. GitHub = the artifact.

---

## 7. 12-week backlog

Each row is one long piece + its derivatives.

| Wk | Pillar | Title | Derivative |
|---|---|---|---|
| 1 | AI-era DE | *What's still scarce when AI writes the pipelines* | Carousel "2026 roadmap" |
| 2 | Production | *We replaced Fivetran across 150 sources: the numbers* | LinkedIn: build vs buy |
| 3 | Agents | *Designing an MCP server agents can trust* | X thread + vintage demo |
| 4 | Mining / LatAm | *Row-level security for contractors, sites and business units* | Full article |
| 5 | AI-era DE | *Idempotency is the only thing that makes a pipeline safe to retry* | LinkedIn: checklist |
| 6 | Agents | *Cost-tiered multi-agent orchestration: a cheap model and a frontier one* | X thread |
| 7 | Production | *Keeping 160,000 tables sane: extraction health at scale* | Carousel + LinkedIn |
| 8 | AI-era DE | *Data contracts for ugly enterprise data* | LinkedIn: template |
| 9 | Mining / LatAm | *Why mining companies can't re-extract history (and how to design for it)* | Full article |
| 10 | Agents | *Context engineering for agents with warehouse access* | X thread |
| 11 | Craft | *From film scoring to data platforms: what composing taught me about systems* | LinkedIn: personal story |
| 12 | Production | *BigQuery + ClickHouse: a hybrid warehouse for analytics and apps* | LinkedIn: architecture |

**Immediate reuse:** the already-published essays (0001–0012) have not been
distributed on LinkedIn/X yet. Turning the best ones into carousels is the
fastest win and requires no new writing. The ECL posts become "pipeline
architecture", without naming the framework.

---

## 8. Measurement

- **Privacy-first analytics** (Umami or Plausible). No cookies; measure page
  views, referrers, countries and outbound clicks.
- **UTMs** on every link to know which channel brings real traffic.
- **Monthly dashboard:** pieces published, reach, net followers, clicks,
  replies/DMs, consulting inquiries, saves (key for carousels).
- **LLM monitor:** once a month ask ChatGPT/Perplexity "Who is Alonso Burón?",
  "What's still scarce in data engineering with AI?" and record whether he shows
  up and how accurately.
- **Quarterly review:** double down on the pillar that converts best, pause the
  one that moves no metric.

---

## 9. Brand rules

- **Tone:** direct, first person, no hype, no decorative emojis. Real numbers or
  nothing. Show the process ("messy middle"), not just the result.
- **The Wall Street Journal test:** if it would not be comfortable on the front
  page of the WSJ, it does not ship. Ask Datawalt for their guidelines if unsure
  about work material.
- **Never reveal** client data, names without permission, or sensitive internal
  figures. Use ranges and abstractions.
- **Give the framework, not the secret:** the value is in the pattern, not the
  proprietary code.
- **Consistency over intensity:** one piece every two weeks for two years beats
  ten in a month and then silence.

---

## 10. Next technical steps (on the site)

Done: GEO/AEO layer, EN/ES i18n, social cards per page and per article, manifest
and icons, `Person` schema with image, local studio with a markdown editor and
image upload.

Pending, by return on effort:

1. **Surface `cv.pdf` in the UI** (today it only exists for LLMs).
2. **Newsletter** (Buttondown or beehiiv) + capture on the site.
3. **A `/now` page** — a freshness and humanity signal.
4. **A Cal.com scheduling link** on contact for consulting.
5. **Enable `ADMIN_DEPLOY=1`** so the studio can commit and push published posts.
