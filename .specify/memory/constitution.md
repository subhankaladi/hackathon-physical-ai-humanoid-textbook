<!-- SYNC IMPACT REPORT
Version change: N/A -> 1.0.0
Modified principles: N/A (initial constitution)
Added sections: All principles and sections (initial constitution)
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ updated
  - .specify/templates/tasks-template.md ✅ updated
  - .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics — AI/Spec-Driven Book with Integrated RAG Chatbot Constitution

## Core Principles

### Technical Accuracy and Source Verification
All technical claims and factual statements must be backed by credible sources such as research papers, official documentation (ROS 2, NVIDIA Isaac, OpenAI), or primary sources in robotics and AI. No unverified technical assertions are permitted in the content.

### Clarity for Target Audience
Content must be designed for clarity and accessibility for developers, AI engineers, and robotics students. Writing should maintain Flesch-Kincaid grade level 10-12 to ensure broad comprehension while preserving technical precision.

### Reproducibility of Code and Systems
All code examples, simulations, and system designs must be fully reproducible. Code correctness and build reproducibility are required. Every implementation must include clear setup instructions and verification steps.

### Theory-Practice Integration
Practical rigor is essential: theoretical concepts must be backed by implementation demonstrations and practical examples. Theory without corresponding implementation or demonstration is insufficient.

### Standardized Citations
All factual and technical claims must be source-backed using APA citation format. Acceptable source types include peer-reviewed research papers, official documentation from relevant platforms (ROS 2, NVIDIA Isaac, OpenAI), and authoritative technical resources.

## Technology and Platform Standards

The project must adhere to the following technology stack and platform requirements:
- Format: Docusaurus book deployed to GitHub Pages
- Embedded RAG chatbot answering book-only and user-selected text queries
- Technologies: Spec-Kit Plus, Claude Code, OpenAI Agents SDK, FastAPI, Qdrant, Neon
- Modules must align with ROS 2, Gazebo, Isaac, and VLA stack

## Development Workflow

The project follows Spec-Driven Development (SDD) methodology with the following requirements:
- Strict adherence to specification-driven development process
- All implementations must reference the specification
- Changes to specifications require formal approval process
- All code changes must include appropriate tests
- Documentation updates must accompany all functional changes

## Governance

This constitution establishes the foundational principles that govern all aspects of the Physical AI & Humanoid Robotics book project. All development activities, documentation, and architectural decisions must comply with these principles. Deviations require formal constitutional amendments with proper justification and approval.

All pull requests and reviews must verify compliance with these principles. Any complexity introduced must be justified by clear benefits to the core mission of creating a technically accurate, reproducible, and accessible resource for physical AI and humanoid robotics.

**Version**: 1.0.0 | **Ratified**: 2025-12-13 | **Last Amended**: 2025-12-13
