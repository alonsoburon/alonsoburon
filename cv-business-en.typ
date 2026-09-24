#set page(
  paper: "a4",
  margin: (x: 1.6cm, y: 1.4cm),
)
#set text(font: "Inter", size: 9.6pt, fill: rgb("#1a1a1a"))
#set par(leading: 0.55em, justify: false)
#show link: it => underline(text(fill: rgb("#0a66c2"), it))

#let accent = rgb("#0a66c2")
#let muted  = rgb("#5a5a5a")

#let section(title) = {
  v(0.45em)
  block(
    stroke: (bottom: 0.6pt + accent),
    inset: (bottom: 2pt),
    width: 100%,
    text(weight: "bold", size: 10.5pt, fill: accent, upper(title))
  )
  v(0.25em)
}

#let role(title, org, dates) = {
  grid(
    columns: (1fr, auto),
    align: (left, right),
    [*#title* · #text(fill: accent, org)],
    text(fill: muted, dates)
  )
}

// ─── Header ──────────────────────────────────────────
#align(center)[
  #text(size: 20pt, weight: "bold")[Alonso Burón Ardiles]
  #v(-0.4em)
  #text(size: 9pt)[
    Santiago, Chile · #link("tel:+56959058121")[+56 9 5905 8121] · #link("mailto:alonso.buron@proton.me")[alonso.buron\@proton.me] \
    #link("https://alonsoburon.cl")[alonsoburon.cl] ·
    #link("https://linkedin.com/in/alonsoburon")[linkedin/alonsoburon] ·
    #link("https://github.com/alonsoburon")[github/alonsoburon]
  ]
]

#v(0.3em)

// ─── Summary ─────────────────────────────────────────
Business solutions consultant with experience supporting approximately 20 companies across different industries. I work with business users to understand their processes and translate operational needs into information models, performance indicators and monitoring tools connected to their business systems. My experience spans mining, manufacturing, retail, pharmaceuticals, textiles and the wine industry, among others.

// ─── Experience ──────────────────────────────────────
#section("Experience")

#role("Data Engineering Lead", "Datawalt", "Oct 2024 — Present")
- Lead a team of 5 and translate client and business priorities into scalable data solutions.
- Designed *Warp*, a platform connecting more than 150 enterprise systems and enabling Datawalt to serve over 500 companies.
- Supported approximately 20 clients across mining, manufacturing, retail, pharmaceuticals, textiles and the wine industry, turning operational problems into improvement plans and monitoring.
- For Janssen, a construction-equipment company, designed end-to-end contract and field-service monitoring across value, term, milestones, support compliance, customer receivables, hour-meter readings and maintenance plans. Connected daily service work to customer outcomes and renewal decisions.
- At Labococh, linked sales, production plans and purchasing to anticipate stockouts and reduce duplicate orders for interchangeable materials; delivered indicators to support corrective actions and incentives for purchasing and sales teams.
- At Curacaribs, modeled inventory and costs across production stages: from raw ingredient weight and cost, through cooking yield loss and revaluation, to use in recipes and finished menu items.

#role("BI Developer", "Datawalt", "2023 — Oct 2024")
- Gathered requirements from finance, sales, HR and operations teams and translated them into information models and decision-support indicators.
- Developed financial reporting for SAP Business One and shared HR models for clients with different platforms and processes.
- Worked with teams at Bagó, Enaex, Janssen and Canontex, adapting analytics solutions to each operation.

#section("Selected Projects")

- *#link("https://www.datawalt.cl/soluciones/warp")[Warp]* — Integration platform that centralizes business information and enables consistent analysis and monitoring across systems.
- *#link("https://www.datawalt.cl/sap-business-one")[SAP Business One Solutions]* — SAP B1 / HANA data integration with financial reporting and analysis tailored to client needs.

#section("Business Skills")

#grid(
  columns: (auto, 1fr),
  column-gutter: 0.6em,
  row-gutter: 0.35em,
  text(weight: "bold")[Consulting], [Requirements gathering · Process analysis · Translating needs into solutions],
  text(weight: "bold")[Processes], [Contracts · Maintenance · Procurement and sales · Production · Inventory and costing],
  text(weight: "bold")[Systems], [SAP Business One · SAP HANA · Softland · Odoo · Power BI],
  text(weight: "bold")[Languages], [Spanish: native · English: expert proficiency],
)

// ─── Education ───────────────────────────────────────
#section("Education")

*Data Science Diploma* & *Music Composition B.A.*, PUC Chile
