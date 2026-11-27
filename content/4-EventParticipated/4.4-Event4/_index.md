---
title: "Event 4"
date: 2026-10-02
weight: 4
chapter: false
pre: " <b> 4.4. </b> "
---

## Reflection on Fireside Chat with Dr. Werner

### 1. Event information

- **Speaker:** Dr. Werner Vogels: Chief Technology Officer, Amazon.
- **Date and time:** October 2, 2026, 08:30–12:00, Vietnam time.
- **Venue:** Bitexco Financial Tower, 2 Hai Trieu, Ho Chi Minh City.
- **Listed host on Luma:** Huỳnh Hoàng Long.
- **Format:** Community conversation, interactive Q&A and networking.

### 2. Learning objectives

During my AWS internship, I want to understand engineering questions beyond individual labs: how to design for more users, select technology and respond to change. This fireside chat introduces these subjects through the perspective of Amazon's CTO.

My objective is to connect Cloud and AI topics with software development practices and identify skills to strengthen. Alongside service knowledge, I focus on asking clear questions, understanding requirements and checking the impact of technical decisions.

### 3. Program topics and learning reflections

#### 3.1. Cloud, AI and practical user needs

The published program covers the future of cloud computing, artificial intelligence and technology trends. My related takeaway is to place these technologies within a concrete user workflow, supported by appropriate data and operational requirements.

Before proposing AI, I need to identify the task, permitted data and evaluation criteria. Before choosing infrastructure, I need to understand application behavior, availability needs and cost constraints. Asking which part of a problem a service solves makes learning IAM, networking, compute and storage more connected.

#### 3.2. Building and operating systems at global scale

Lessons from global-scale systems are an announced theme. My technical reflection is to consider increasing load, component failures and operational changes alongside normal behavior.

For example, a failed document upload should produce a truthful status, and retrying a create request should avoid accidental duplicate records. These small cases help develop a habit of designing for failure. Response time, error rate and resource use can inform improvements before adding infrastructure or splitting services. These examples are personal study applications, not claims about an architecture demonstrated during the conversation.

#### 3.3. Innovation and problem selection

The program also highlights innovation, leadership and emerging trends. At internship level, I connect these themes to identifying a real difficulty, proposing an approach and testing assumptions.

A useful experiment might address slow document discovery, inconsistent environments or hard-to-diagnose failures. I can start with one scenario and an expected result, build a small prototype, then use feedback and tests to guide the next step. Documentation should explain what changed, why it was chosen and what remains unresolved.

#### 3.4. Community learning and Q&A

The event introduces interactive Q&A and connections among students, developers, architects and engineers. The supplied photographs show the community setting and a session screen naming Dr. Werner Vogels.

My takeaway is to prepare questions with a goal, attempted approach, observed behavior and a specific uncertainty. After a discussion, I should turn selected ideas into a lab, project improvement or short technical note. No unverified personal Q&A exchange or speaker quotation is recorded here.

### 4. Personal lessons

**Strengthen fundamentals.** Networking, identity, data, programming and operations remain essential for understanding configurations and application behavior as Cloud and AI evolve.

**Evaluate observable outcomes.** Record behavior before and after a change, the verification method and its impact on users. Assess a solution against agreed requirements.

**Communicate clearly.** Provide useful context when asking mentors or teammates for help and record the resulting decisions. This supports both debugging and continued learning.

### 5. Planned internship applications

| Area | Proposed work | Verification |
|---|---|---|
| AWS labs | Define the problem and map access/data flows before selecting services | Explain resource roles, permissions and configuration |
| DropIt | Review upload failures, status messages and retry behavior | Clear status without unintended duplicate records |
| FitJoy | Define one user scenario and acceptance criteria | Confirm expected behavior; this is a development-method application, not an AWS deployment claim |
| Quality monitoring | Record latency and errors for the experimental workflow | Locate problems using measurements before optimizing |
| Community learning | Prepare contextual questions and reproduce relevant ideas | Produce a result that can be checked |

These are planned applications of the event themes. Completed outcomes should be recorded only after implementation and verification.

### 6. Conclusion

The fireside chat broadens my learning focus from individual AWS services to problem solving and operating useful systems. Strong fundamentals, clear questions and verified changes are practices I intend to maintain throughout the internship.

### Participation evidence

![Community gathering at the event](/images/4-EventParticipated/event4/community.jpg)

*Figure 1. The community gathering and attendees at the event.*

![Fireside chat with Dr. Werner Vogels](/images/4-EventParticipated/event4/fireside-chat.jpg)

*Figure 2. Session overview; the presentation screens identify Fireside chat with Dr. Werner Vogels.*
