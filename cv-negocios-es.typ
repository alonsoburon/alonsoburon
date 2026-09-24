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

// ─── Encabezado ──────────────────────────────────────
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

// ─── Perfil ──────────────────────────────────────────
Consultor de soluciones de negocio con experiencia acompañando a cerca de 20 empresas de distintos rubros. Levanto necesidades con usuarios, entiendo sus procesos y las traduzco en modelos de información, indicadores y herramientas de seguimiento conectadas a sus sistemas de gestión. He trabajado con minería, manufactura, retail, industria farmacéutica, textil y vitivinícola, entre otros sectores.

// ─── Experiencia ─────────────────────────────────────
#section("Experiencia")

#role("Líder de Ingeniería de Datos", "Datawalt", "Oct 2024 — Actualidad")
- Lidero un equipo de 5 personas y traduzco prioridades de clientes y del negocio en soluciones de datos escalables.
- Diseñé *Warp*, plataforma que conecta más de 150 sistemas empresariales y permite a Datawalt atender a más de 500 empresas.
- Acompañé a cerca de 20 clientes de minería, manufactura, retail, farmacéutica, industria textil y vitivinícola, convirtiendo problemas operativos en planes de mejora y monitoreo.
- Para Janssen, empresa de equipos de construcción, diseñé seguimiento integral de contratos y servicio técnico: montos, vigencias, hitos, cumplimiento de soporte, pagos de clientes, horómetros y planes de mantenimiento. El análisis conectaba el trabajo cotidiano del equipo con la experiencia del cliente y las decisiones de renovación.
- En Labococh, relacioné ventas, planes de producción y compras para anticipar quiebres de stock y reducir compras duplicadas de materiales sustituibles; entregué indicadores para apoyar acciones correctivas e incentivos a los equipos de compra y venta.
- En Curacaribs, modelé inventario y costos a través de etapas de producción: desde el peso y costo de insumos crudos, pasando por mermas y valorización tras la cocción, hasta su uso en recetas y platos terminados.

#role("BI Developer", "Datawalt", "2023 — Oct 2024")
- Levanté necesidades de áreas de finanzas, ventas, recursos humanos y operaciones y las convertí en modelos de información e indicadores para la toma de decisiones.
- Desarrollé reportes financieros para SAP Business One y modelos comunes de RR. HH. para clientes con distintas plataformas y procesos.
- Trabajé con equipos de Bagó, Enaex, Janssen y Canontex, adaptando soluciones de analítica a cada operación.

#section("Proyectos destacados")

- *#link("https://www.datawalt.cl/soluciones/warp")[Warp]* — Plataforma de integración que centraliza información empresarial y habilita análisis y seguimiento consistentes entre sistemas.
- *#link("https://www.datawalt.cl/sap-business-one")[Soluciones para SAP Business One]* — Integración de información de SAP B1 / HANA con reportes financieros y análisis ajustados a las necesidades del cliente.

#section("Competencias")

#grid(
  columns: (auto, 1fr),
  column-gutter: 0.6em,
  row-gutter: 0.35em,
  text(weight: "bold")[Consultoría], [Levantamiento de requerimientos · Análisis de procesos · Traducción de necesidades a soluciones],
  text(weight: "bold")[Procesos], [Contratos · Mantenimiento · Compras y ventas · Producción · Inventario y costos],
  text(weight: "bold")[Sistemas], [SAP Business One · SAP HANA · Softland · Odoo · Power BI],
  text(weight: "bold")[Idiomas], [Español: nativo · Inglés: experto],
)

// ─── Educación ───────────────────────────────────────
#section("Educación")

*Diplomado en Data Science* y *Licenciatura en Composición Musical*, PUC Chile
