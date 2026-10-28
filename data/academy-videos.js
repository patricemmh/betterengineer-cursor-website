'use strict';

/* BetterEngineer Academy, 2026 edition.
 * Every video below was checked against YouTube's public publication metadata
 * on 2026-08-11/12 and was published during calendar year 2026.
 */

module.exports = [
  {
    slug: 'ai-foundations',
    number: '01',
    title: 'AI engineering foundations',
    description: 'Build a useful map of the field before choosing models, frameworks, or infrastructure.',
    outcome: 'Choose an AI learning path and explain where each part of an AI application fits.',
    videos: [
      { level: 'Beginner', id: 'oHu_xWe0agI', title: 'A Practical Guide To Becoming An AI Engineer (2026)', author: 'CodeHead', duration: '5:06', note: 'A compact orientation to the skills and responsibilities behind AI engineering.' },
      { level: 'Intermediate', id: 'aAItDrJ8-rE', title: 'How to Become an AI Engineer FAST (2026)', author: 'Sajjaad Khader', duration: '15:41', note: 'Turns the field into a practical sequence of concepts, projects, and tools.' },
      { level: 'Advanced', id: '-Qt279gpemQ', title: 'How to Go From Software Engineer to AI Engineer in 2026?', author: 'Aishwarya Srinivasan', duration: '11:45', note: 'Connects existing software engineering experience to production AI work.' },
    ],
  },
  {
    slug: 'context-engineering',
    number: '02',
    title: 'Prompting and context engineering',
    description: 'Move from clever prompts to repeatable context systems that give models the right information.',
    outcome: 'Design prompts and context pipelines that are clear, testable, and grounded.',
    videos: [
      { level: 'Beginner', id: '2BpCk4d2Cc0', title: 'Prompt Engineering Full Course', author: 'Tech With Tim', duration: '37:44', note: 'Covers the prompt structures and iteration habits that produce more reliable results.' },
      { level: 'Intermediate', id: 'BBPQYtR7oUk', title: 'Context engineering explained: What every AI developer should know', author: 'Google Cloud Tech', duration: '10:05', note: 'Explains why application context matters more than a single well-written prompt.' },
      { level: 'Advanced', id: '-h9VVJIqtvA', title: 'Context Engineering in 29 Minutes: Complete Course', author: 'Marina Wyss', duration: '29:39', note: 'Builds a fuller context strategy across memory, retrieval, tools, and instructions.' },
    ],
  },
  {
    slug: 'ai-coding',
    number: '03',
    title: 'AI-assisted software development',
    description: 'Use coding agents as engineering collaborators while keeping scope, review, and correctness under human control.',
    outcome: 'Delegate a bounded coding task, review the result, and improve the agent workflow.',
    videos: [
      { level: 'Beginner', id: 'qYqIhX9hTQk', title: 'FULL Claude Code Tutorial for Beginners in 2026!', author: 'Tech With Tim', duration: '15:10', note: 'A step-by-step introduction to working with a terminal-based coding agent.' },
      { level: 'Intermediate', id: 'C2GpeepcmYs', title: 'Claude Code Crash Course For Developers', author: 'Traversy Media', duration: '1:03:23', note: 'Applies agent workflows to real developer tasks with more project context.' },
      { level: 'Advanced', id: 'IuyVVtr1uhY', title: 'Claude Code Tutorial: Build Apps 10x Faster with AI', author: 'Programming with Mosh', duration: '58:11', note: 'Explores a more complete application workflow, from planning through implementation.' },
    ],
  },
  {
    slug: 'agents',
    number: '04',
    title: 'Agentic AI systems',
    description: 'Understand how agents plan, call tools, maintain state, and recover from failure.',
    outcome: 'Build an agent workflow with explicit tools, state, boundaries, and a completion condition.',
    videos: [
      { level: 'Beginner', id: '4TvH-OZhwxI', title: 'AI Agents Explained: How to Create and Use AI Agents in 2026', author: 'AI Master', duration: '24:28', note: 'Introduces agent components and shows how they differ from ordinary chat workflows.' },
      { level: 'Intermediate', id: 'LNkAW4SSgdY', title: 'The Complete Guide to AI Agents in 2026', author: 'Tech With Tim', duration: '20:39', note: 'Connects agent concepts to practical use cases and implementation choices.' },
      { level: 'Advanced', id: '5p-sq8v3OXw', title: 'AI Agents: The Most Valuable Skill You Can Learn in 2026', author: 'Open Residency and AI with Remy', duration: '2:24:11', note: 'A long-form build that covers the decisions and tradeoffs behind capable agent systems.' },
    ],
  },
  {
    slug: 'mcp-tools',
    number: '05',
    title: 'MCP and tool integration',
    description: 'Connect models to tools and data through clear, inspectable interfaces.',
    outcome: 'Explain MCP transport and capabilities, then build and test a useful server integration.',
    videos: [
      { level: 'Beginner', id: 'cGuyrANVi4A', title: 'How Model Context Protocol (MCP) actually works', author: 'Google Cloud Tech', duration: '7:58', note: 'A concise explanation of MCP clients, servers, tools, resources, and prompts.' },
      { level: 'Intermediate', id: 'm9RvALi4bVo', title: 'MCP Servers Every Developer Must Have in 2026', author: 'MaksDevInsights', duration: '7:44', note: 'Shows how existing MCP integrations extend an everyday development workflow.' },
      { level: 'Advanced', id: 'rwOYK8hk7yo', title: 'Learn MCP in ONE Video: Model Context Protocol Crash Course', author: 'DSwithBappy', duration: '2:19:23', note: 'Moves from protocol concepts to building and using a complete MCP implementation.' },
    ],
  },
  {
    slug: 'rag',
    number: '06',
    title: 'Retrieval and knowledge systems',
    description: 'Ground model answers in trusted information using embeddings, retrieval, and document-aware pipelines.',
    outcome: 'Design a retrieval pipeline and identify why it succeeds or fails on a document set.',
    videos: [
      { level: 'Beginner', id: '4pUYfY-b5CQ', title: 'Vector Databases Explained: The Complete Guide for 2026', author: 'Aishwarya Srinivasan', duration: '9:53', note: 'Explains embeddings, similarity search, and where vector databases fit.' },
      { level: 'Intermediate', id: 'vT-DpLvf29Q', title: 'Complete RAG Tutorial 2026', author: 'KodeKloud', duration: '48:25', note: 'Builds a retrieval-augmented generation workflow through a practical lab.' },
      { level: 'Advanced', id: 'xc63tFIIfeA', title: 'Why RAG Solutions Fail with Complex Documents and Vector Databases', author: 'IBM Technology', duration: '7:46', note: 'Examines failure modes that appear when real documents break naive retrieval assumptions.' },
    ],
  },
  {
    slug: 'evaluation',
    number: '07',
    title: 'Evaluation and observability',
    description: 'Replace subjective demos with traces, datasets, metrics, and repeatable tests.',
    outcome: 'Create a small evaluation set, select useful metrics, and trace an AI workflow end to end.',
    videos: [
      { level: 'Beginner', id: '3CfXVH3uBrg', title: 'LLM Evaluation and AI Observability', author: 'AtoZAboutdata', duration: '6:08', note: 'Introduces the purpose of evaluation and observability in AI applications.' },
      { level: 'Intermediate', id: 'FDVdLrloFOw', title: 'Observability and Evals for AI Agents: A Simple Breakdown', author: 'LangChain', duration: '14:45', note: 'Shows how traces and evaluation fit together for multi-step agent behavior.' },
      { level: 'Advanced', id: 'JsCCrBF7F1g', title: 'LLM Observability, Evaluation, Experimentation Platform', author: 'AI Engineer', duration: '16:32', note: 'Explores a production platform for experiments, evaluations, and operational insight.' },
    ],
  },
  {
    slug: 'security',
    number: '08',
    title: 'AI security and safety',
    description: 'Treat model inputs, tool calls, retrieved content, and outputs as attack surfaces.',
    outcome: 'Threat-model an AI feature and add controls for prompt injection, leakage, and unsafe actions.',
    videos: [
      { level: 'Beginner', id: 'i8mkaO3ur0U', title: 'AI Prompt Injection Explained', author: 'LearnITGuide Tutorials', duration: '5:43', note: 'Introduces how untrusted instructions can manipulate model behavior.' },
      { level: 'Intermediate', id: 'satkgjltgo0', title: 'I Tried 5 Prompt Injection Attacks', author: 'Snyk', duration: '13:04', note: 'Demonstrates common attacks and makes their practical consequences visible.' },
      { level: 'Advanced', id: 'j51uMah-3js', title: 'Attacking AI', author: 'NDC Conferences', duration: '55:49', note: 'A security-conference treatment of offensive techniques and defensive implications.' },
    ],
  },
  {
    slug: 'multimodal',
    number: '09',
    title: 'Multimodal AI',
    description: 'Work across text, images, audio, and video without treating every modality like plain text.',
    outcome: 'Select a multimodal model and build a workflow that combines two or more input types.',
    videos: [
      { level: 'Beginner', id: 'raqPDPWrrOA', title: 'What is Multimodal AI? Text, Image, Voice, Video Explained', author: 'Terminode AI', duration: '5:08', note: 'Defines multimodal systems and the input types they can combine.' },
      { level: 'Intermediate', id: 'J51oZYcNvP8', title: 'What is Multimodal AI? How LLMs Process Text, Images, and More', author: 'IBM Technology', duration: '9:15', note: 'Explains the model concepts behind processing several modalities.' },
      { level: 'Advanced', id: 'Lj1CQrB_dFw', title: 'How to Build a Multimodal AI Agent in Python', author: 'Sharanam and Vaishali Shah', duration: '5:15', note: 'Implements an agent that combines vision, audio, and memory in one workflow.' },
    ],
  },
  {
    slug: 'production-ai',
    number: '10',
    title: 'Production AI and MLOps',
    description: 'Ship AI systems with deployment discipline, monitoring, versioning, and operational ownership.',
    outcome: 'Describe a production AI delivery path from experiment to monitored service.',
    videos: [
      { level: 'Beginner', id: 'e68v8ezxJDc', title: 'MLOps Explained in One Video', author: 'Ops with Roushan', duration: '23:07', note: 'Introduces the lifecycle from experimentation to deployment and monitoring.' },
      { level: 'Intermediate', id: 'biqYkVf-a7Y', title: 'MLOps Explained: What It Is, Why You Need It and How It Works', author: 'TechWorld with Nana', duration: '26:23', note: 'Connects pipelines, registries, deployment, and monitoring into one operating model.' },
      { level: 'Advanced', id: 'tVskbekONlw', title: 'Learn MLOps with MLflow and Databricks', author: 'freeCodeCamp.org', duration: '5:27:47', note: 'A full production-oriented course covering experiments, data, models, deployment, and operations.' },
    ],
  },
];
