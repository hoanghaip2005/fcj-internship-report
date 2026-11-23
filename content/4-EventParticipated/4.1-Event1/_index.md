---
title: "Event 1"
date: 2026-09-26
weight: 1
chapter: false
pre: " <b> 4.1. </b> "
---

# Reflection on Buildrathon Kickoff Code the Future with CMC Global

### Event information

- **Event:** Buildrathon Kickoff: Code the Future with CMC Global.
- **Date:** September 26, 2026.
- **Time:** 09:00–12:00, Vietnam time; the published agenda ends its closing session at 11:20.
- **Venue:** Bitexco Financial Tower, 2 Hai Trieu, Ho Chi Minh City.
- **Listed host on Luma:** Huỳnh Hoàng Long.

### Event objectives

The event introduces the Buildathon challenge, its objectives and judging criteria while connecting participants interested in cloud computing and AI. Its central theme is applying AWS Cloud, Generative AI and AI agents to practical problems.

For the early stage of my internship, these topics provide a useful learning direction: understand the purpose of each service, connect the components into an application, and choose a manageable problem to investigate.

### Program highlights

#### Buildathon kickoff and team connections

The **09:00–09:30** kickoff introduces the challenge and provides an overview of AWS Cloud, Generative AI and AI agents. The **09:30–09:45** ice-breaking session focuses on participants' backgrounds, interests and preparation for collaboration.

My takeaway is that a project needs a clear problem, an understandable solution and criteria for judging its results. Requirements and responsibilities should therefore be agreed before technology choices are made.

#### Building a career in Cloud and AI

The **09:45–10:30** talkshow covers cloud and AI trends, practical projects, career opportunities and organizational adoption of AWS and Agentic AI.

These themes reinforce the importance of networking, security, storage and programming fundamentals. Calling a model is only one part of an application; user access, data permissions, failures and costs also need attention. Projects and technical writing can demonstrate how these concerns are understood and addressed.

#### Questions about learning and certifications

The published **10:30–10:45 Q&A** covers AWS, Generative AI, careers, certifications and the Buildathon challenge. My reflection is to set staged learning goals: use structured study to organize concepts, then use labs and projects to test the ability to apply them.

#### AI Agent Challenge

The **10:45–11:15** hands-on session describes an AWS-based mini challenge with mentor support. The announced concepts include **prompt engineering, retrieval-augmented generation (RAG), knowledge bases and AI agents**.

I organize these concepts as follows:

- **Prompt engineering:** specifying a task, context, constraints and output format clearly.
- **RAG:** retrieving relevant documents and providing them as model context; quality depends on both the data and retrieval.
- **Knowledge bases:** organizing information for retrieval and contextual responses.
- **AI agents:** combining models, tools and workflows to perform tasks, with controlled permissions and actions.

These explanations are my technical synthesis of the announced topics, rather than confirmation of the architecture or exact services used in the challenge.

### Extended technical analysis of the event topics

This section connects the published agenda to AWS documentation and a CMC Global article. The examples and evaluation plan are proposed study work, not a transcript of speakers or a confirmed implementation of the event challenge.

#### Prompt engineering: define a testable task

For a documentation assistant, a useful prompt identifies the task, permitted context, constraints and output format. For example: explain S3 object read permissions using only retrieved documentation; avoid guessing account settings; ask for missing information; return a concise explanation, verification steps and supporting sources. Prompt instructions help structure responses, while application code must still enforce permissions. Compare prompt versions against the same questions instead of judging a single impressive answer.

#### RAG: separate ingestion from answering

AWS Knowledge Bases documentation describes two stages for unstructured data. During preparation, documents become text, are split into chunks, converted to embeddings and stored in a vector index with links to original documents. At runtime, the query becomes an embedding; related chunks are retrieved and added to the model context before generation.

Semantic similarity does not guarantee that a passage is current or sufficient. A proposed DropIt assistant could retrieve study-group rules before explaining document access. Its sources would need document names, versions and access metadata, with index synchronization after updates. This is a proposed extension, not an implemented feature. Evaluate retrieval separately from generation: incorrect retrieved passages require different fixes from unsupported claims generated from correct passages.

#### Agents: distinguish knowledge retrieval from actions

The Amazon Bedrock Agents architecture reference explains an orchestration loop: interpret a request, choose a tool or knowledge base, collect missing parameters, observe the result and determine the next step. Asking about booking rules is retrieval; creating a booking requires an API and validated date, time zone, group and authorization.

Server-side code must validate model-generated parameters. Report success only after a valid API response. A proposed prototype should start with read-only tools, bounded calls and timeouts, and logs of tool names, status and latency. Write operations need suitable confirmation and duplicate-prevention rules. AWS currently labels the referenced service Agents Classic, in maintenance mode; new implementations should consult current Strands Agents SDK and Amazon Bedrock AgentCore guidance.

#### CMC Global perspective: engineering discipline around AI

CMC Global's Agentic AI In BFSI: Code Modernization Use Cases & Strategies discusses architecture, technology stack and development-practice modernization. It emphasizes business context, architectural boundaries, automated testing and CI/CD. This supplementary business perspective supports a practical learning goal: demonstrate a complete, testable workflow covering requirements, data, APIs, permissions and monitoring. The article is not a recap of the kickoff.

#### Proposed prototype evaluation

| Scenario | Expected behavior | Verification |
|---|---|---|
| Answer exists in documentation | Accurate answer with supporting source | Compare answer with original passage |
| Out-of-scope question | State missing information | Check for fabricated details |
| Multiple document versions | Select applicable version | Inspect source metadata |
| Restricted document | Do not expose unauthorized content | Test retrieval/API authorization |
| Missing tool parameters | Ask before execution | Inspect tool arguments and logs |
| API error or timeout | Report the actual status | Inject failure; inspect response |

Record correct answers across a fixed question set, source support, response time and model/tool call counts. No measurements or challenge ranking are claimed here. These checks help locate problems in data, retrieval, prompting or API integration.

### Lessons learned

**Start with a user need.** Define the task, data sources and evaluation criteria before adding AI. A small, testable scope is appropriate for an early prototype.

**Treat data quality as part of the solution.** Document freshness, chunking, retrieval and access permissions matter. RAG does not guarantee correctness; missing information and source attribution still need explicit handling.

**Consider security and cost early.** Agent tools should have limited permissions. Secrets should not appear in source code or prompts. Request volume, latency and cost belong in the evaluation plan.

**Make collaboration explicit.** Shared requirements, component interfaces and a clear demonstration plan help prevent incompatible implementations. Concise documentation and architecture diagrams make a solution easier to review.

### Application to my internship

1. Continue the IAM, VPC, EC2 and S3 learning path, recording each service's role, limitations and cost implications.
2. Investigate a small document question-answering prototype, evaluating accuracy, citations and out-of-scope questions. Amazon Bedrock and S3 are possible research choices, not services confirmed by the event listing.
3. Consider a group-rules lookup assistant for DropIt. For FitJoy, limit an initial idea to product guidance; health content requires reliable sources and should not turn model output into medical advice.
4. Document the problem, data flow, sources, evaluation criteria and prototype limitations before preparing a blog or workshop.

### Conclusion

The central lesson I draw from the program is to connect Cloud and AI knowledge to a problem whose results can be checked. My next steps are to strengthen AWS fundamentals, choose a manageable experiment and evaluate quality, security, cost and operability together.

### Photo gallery

Click an image to view the full version.

{{< event2-gallery >}}
