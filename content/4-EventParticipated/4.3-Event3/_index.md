---
title: "Event 3"
date: 2026-10-08
weight: 3
chapter: false
pre: " <b> 4.3. </b> "
---

## Reflection on AWS for Software & Financial Services Companies Day

### 1. Event information

- **Date and time:** October 8, 2026, 09:00–18:00, Vietnam time.
- **Venue:** Sheraton Saigon Grand Opera Hotel, Ho Chi Minh City.
- **Organizer:** Amazon Web Services (AWS).
- **Format:** Technical sessions and hands-on workshop tracks, delivered in Vietnamese.

The registration page uses **AWS for Software & Financial Services Companies Day**, while the supplied slides use **AWS for Software and Technology Companies Day**. This reflection follows the registration title and retains the original session titles.

### 2. Learning objectives

During my AWS internship, I want to understand how infrastructure, data and security form a working application. The program addresses this through production agents, high-quality data products and AI-assisted migration. My learning goal is to recognize requirements that a demonstration may not reveal: authorization, data correctness, observability, cost and verification of results.

### 3. What I learned from the program

#### 3.1. From a working demo to a production agent

In **From Demo to Deployment: Solving Agentic AI's Toughest Challenges**, **Dzung Ha, Solutions Architect, AWS**, presents four pillars: operational excellence, data and context, reliability, and trust.

Operational readiness requires visibility into the entire workflow. A slow answer might originate in model inference, retrieval or a tool call. Model selection therefore involves tradeoffs among cost, latency and accuracy. For RAG, chunking, embedding quality, ranking and index freshness all affect the context available to the model. Short-term and long-term memory serve different purposes and require user separation.

The most useful principle for me is to use deterministic code for calculations, validation and fixed rules. Agents can interpret and orchestrate tasks without replacing testable functions. A successful demonstration is an initial milestone; deployment also needs evaluation cases, monitoring and recovery procedures. Identity, isolated sessions and pre-execution policy checks belong in the design.

#### 3.2. Data needs explicit meaning and ownership

**Building High-Quality Data Products for AI Agents**, presented by **Binh Tran, Senior Solutions Architect, AWS**, describes five attributes: trusted, contextual, traceable, governed and operational.

A spending example illustrates how a plausible total can be wrong if refunds and reversals are omitted. An agent may then turn that data error into an incorrect credit-limit action. This makes source and pipeline validation essential.

A data contract specifies ownership, schema, metric definitions, quality rules, freshness, versions and access. Define `net_spend` as settled spending minus refunds and reversals so consumers interpret the field consistently. The comparison between vector and graph retrieval also shows that relevant answers can depend on business relationships beyond textual similarity.

For write-back, the slides list narrow tools, external hard limits, human approval for high-impact changes, safe retries and traced writes. Its 15% limit is an illustrative business rule, not a universal threshold. My takeaway is to treat data as a maintained product whose correctness and permitted use can be explained.

#### 3.3. Migration requires planning and verification

In **Migration at scale with agentic AI: AWS Transform and beyond**, **Taiki Dang, Solutions Architect, Migration & Modernize | Security, AWS**, explains how AWS Transform, Kiro and Amazon Bedrock AgentCore can work together.

Rehosting on EC2, moving to containers and refactoring onto managed services involve different changes and testing requirements. Migration includes dependency discovery, cost assessment, target preparation, network changes, testing and cutover planning.

The presented approach uses AWS Transform for assessment and transformation workflows, Kiro as a conversational interface connected through MCP, and AgentCore agents for coordination tasks such as change requests and status updates. People retain responsibility for goals and approvals.

The FPT Retail and MoMo examples in the slides link generated code or infrastructure to build, test and security checks. Their reported outcomes apply to those cases; they are not guarantees for another project. At my internship level, I can first apply dependency mapping, incremental changes, validation and recovery planning.

#### 3.4. Developing from a specification with Kiro

The workshop briefing offers **Build with Kiro: From Spec to Working Application** and **Build & Deploy AI Agents on Amazon Bedrock AgentCore using Vibe Coding with Kiro**. Track A reviews requirements, design and tasks before implementation. Track B focuses on building and deploying an agent in the cloud.

My methodological takeaway is to review the requirement before accepting generated code. A running feature can still solve the wrong problem. Specifications and task plans support review, acceptance criteria and team communication. This section summarizes the workshop materials; it does not claim a completed personal lab or deployment.

### 4. Personal lessons

AWS fundamentals remain necessary when working with AI tools. Reviewing generated configurations requires an understanding of IAM, networking, storage and application dependencies. Otherwise, excessive permissions, incorrect data flows and unnecessary resource costs can be difficult to identify.

I also need to assess results through evidence: answers against sources, code against tests, and API actions against execution status. Missing information should lead to an explicit limitation rather than an unsupported conclusion. A small feature with prepared data and measurable acceptance criteria is an appropriate internship goal.

### 5. Planned application during the internship

| Area | Proposed work | Verification |
|---|---|---|
| AWS foundations | Review access flows, IAM and lab configuration | Explain required permissions and diagnose access failures |
| DropIt | Define document ownership, sharing scope and versions; investigate read-only document assistance | Retrieve the right source without unauthorized disclosure |
| FitJoy | Use specifications, task plans and tests with coding assistance | Verify agreed behavior; this is a development-method proposal, not an AWS deployment claim |
| Data quality | Write a small data contract for prototype inputs | Detect missing fields, invalid types and stale data |
| Documentation | Record assumptions, changes, test results and limitations | Let another reader reproduce the main steps |

These are planned applications, not completed outcomes. I would first validate one bounded workflow before extending an agent to write operations.

### 6. Conclusion

The program connects Cloud and AI development to a complete engineering process: requirements, data preparation, access design, implementation, testing and operations. My clearest takeaway is the importance of reliable data and verifiable results, which will guide my continued AWS learning and internship projects.

### Participation evidence

![Group photo with fellow attendees at AWS for Software & Financial Services Companies Day.](/images/4-EventParticipated/aws-financial-services-day-evidence.png)

*Group photo with fellow attendees at AWS for Software & Financial Services Companies Day.*

![Attendee badge and conference venue at AWS for Software & Financial Services Companies Day.](/images/4-EventParticipated/aws-financial-services-day-badge.jpg)

*Attendee badge and conference venue at AWS for Software & Financial Services Companies Day.*

![Session takeaways on data foundations, RAG retrieval quality and agent memory.](/images/4-EventParticipated/aws-financial-services-day-data-session.jpg)

*Session takeaways on data foundations, RAG retrieval quality and agent memory.*
