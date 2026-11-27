---
title: "Week 11 Worklog"
weight: 11
chapter: false
pre: "<b>1.11. </b> "
---

## Week 11: Data storage and analytics on AWS

**Period:** 30/11/2026–05/12/2026.

**Planned week:** The scheduled week has not occurred. Preparation screenshots are separate from the expected lab results.

### Objectives

Study S3 storage, Glue Data Catalog metadata and Athena queries; prepare sample data, SQL and expected results.

### Planned work

| Topic | Work and learning notes | Expected output |
|---|---|---|
| Amazon S3 | Review objects, prefixes, CSV/JSON and encryption; prepare synthetic data. | Dataset and column descriptions. |
| Glue Data Catalog | Study databases, tables, schema and crawlers. | Metadata mapping notes. |
| Athena | Study workgroups, result locations, permissions and query costs. | SQL examples and expected results. |
| Query optimization | Compare CSV/Parquet and date partitions. | Data layout comparison. |
| Learning summary | Map S3, Data Catalog and Athena; list schema and permission checks. | Diagram and open questions. |

### Study notes

Prepare synthetic order data with known row counts and aggregates, then compare SQL results. Check schema, source-read and result-write permissions, and scanned bytes; compare CSV with Parquet and partitioning.

### Detailed work and screenshots

#### 1. Preparing with the Athena Query Editor

The editor was inspected in preparation. A results location is not configured and SQL has not been executed; this is not query-result evidence.

![Preparing with the Athena Query Editor](/images/1-Worklog/aws-practice/athena-preparation.png)

*Preparation screenshot; the scheduled learning week remains planned.*

#### 2. Preparing with Glue Data Catalog

Inspect the database interface in preparation for schema and metadata learning. No database or crawler creation is claimed.

![Preparing with Glue Data Catalog](/images/1-Worklog/aws-practice/glue-preparation.png)

*Preparation screenshot; the scheduled learning week remains planned.*

### Concept diagram

![Concept diagram](/images/1-Worklog/diagrams/week11-en.svg)

### Expected results

Planned outputs include data, schema, SQL and result comparisons. Only interface preparation has occurred; queries have not run.

### Lessons and remaining work

Athena needs schema, data permissions and a results location. The current editor screenshot has no SQL results; the planned lab will evaluate correctness and scanned data.

### Next steps

Continue with [Generative AI and RAG foundations on AWS](../1.12-week12/).

### Related material

- [Athena documentation](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)
- [Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html)
