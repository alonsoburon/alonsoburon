export interface Project {
  title: string;
  period: string;
  role: string;
  description: string;
  achievements: string[];
  tech?: string[];
  githubUrl?: string;
  publishedAt?: Date;
}

export const closedSourceProjects: Project[] = [
  {
    title: "Warp Data Platform",
    period: "2024-10 - Now",
    role: "Data Engineering Lead",
    description: "Enterprise EtLT solution for multiple On-Site and Cloud-based clients.",
    achievements: [
      "Unification of +20 data systems into a single platform",
      "Focus on simplifying incremental data loading"
    ],
    publishedAt: new Date("2024-10-01")
  },
  {
    title: "HR Multi-Platform Integration",
    period: "2025-03 - 2025-09",
    role: "Data Engineer",
    description: "Integrating and homogenizing data from multiple HR platforms into a single star-schema for reporting. (Talana, GeoVictoria, Buk, more)",
    achievements: [
      "Integration of multiple REST-APIs",
      "Custom gold-level views for different stakeholders"
    ],
    publishedAt: new Date("2025-03-01")
  },
  {
    title: "Financial Reporting Template",
    period: "2024-12 - 2025-03",
    role: "BI Developer",
    description: "Financial reporting template for internal use.",
    achievements: [
      "PowerBI parametrized and automated template",
      "Multisource star-schema for SAP B1 systems"
    ],
    publishedAt: new Date("2024-12-01")
  },
  {
    title: "Mining Analytics Platform",
    period: "2024-06 - 2025-06",
    role: "BI Developer",
    description: "Analytics platform for mining companies.",
    achievements: [
      "Deep visualization platform for a mining company",
      "Custom visuals and dashboards with RLS"
    ],
    publishedAt: new Date("2024-06-01")
  }
];

export const openSourceProjects: Project[] = [
  {
    title: "Real-time E-commerce Analytics Pipeline",
    period: "Portfolio Project",
    role: "",
    description: "Complete real-time streaming analytics pipeline featuring Kafka streaming, real-time processing, anomaly detection, and interactive dashboards.",
    achievements: [
      "Real-time Processing",
      "Anomaly Detection",
      "Streaming Analytics"
    ],
    tech: [
      "Kafka",
      "Streamlit",
      "SQLite",
      "Parquet"
    ],
    githubUrl: "https://github.com/alonsoburon/portfolio-streaming",
    publishedAt: new Date("2025-10-26")
  },
  {
    title: "NYC Taxi Analytics Pipeline",
    period: "Portfolio Project",
    role: "",
    description: "Complete ELT pipeline implementing medallion architecture with Dagster, dlt, dbt, DuckDB and Plotly for orchestration, ingestion, transformation, storage and visualization.",
    achievements: [
      "Medallion Architecture",
      "Dynamic Viz",
      "Data Quality"
    ],
    tech: [
      "Dagster",
      "dlt",
      "dbt",
      "DuckDB",
      "Plotly"
    ],
    githubUrl: "https://github.com/alonsoburon/portfolio-batchElt",
    publishedAt: new Date("2025-10-10")
  }
];
