---
title: Open-source and local alternatives
nav: Open-source & local
description: Run useful AI without per-token bills, choose the right local tools, understand hardware and licenses, and avoid the hidden costs of self-hosting.
order: 7
kicker: Chapter 07 · Local-first
updated: 2026-10-22
---

There is a third option between free tiers and paid APIs: run the software yourself. For some jobs, it is genuinely cheaper and more private. For others, it is a hobby disguised as a business decision.

This chapter gives you a practical local-first stack, hardware expectations, and the questions that keep self-hosting from becoming a second job.

> **In plain English:** Local AI has no per-token bill. You still pay for the computer, the electricity, the updates, the backups, and your time. The bill just arrives from somewhere else.

## What local is good at—and what it is not

**Good fit for a small, careful setup:**

- Drafting, rewriting, outlining, and summarizing text you do not want to send to a hosted free tier.
- Transcribing your own voice notes or meeting notes with consent and a retention plan.
- Tagging, searching, and organizing your own documents or research.
- Learning how models work, testing prompts, and teaching examples.
- An offline backup workflow when the internet or API is unavailable.
- Small coding assistance and repetitive file transforms under supervision.

**Still difficult on a normal laptop:**

- Matching the best hosted models on complex reasoning, long contexts, or multimodal tasks.
- Running a large model with low latency while also running your IDE and browser.
- Production-grade availability, support, and security with no operator.
- High-volume batch processing on battery power.
- Reliable tool-using agents that can browse, write files, and execute code without supervision. Those need guardrails no matter where they run.

The local gap is shrinking, but "can run on my machine" is not the same as "solves the same problem as well."

## A practical local stack

| Job | Tools worth knowing | What to know |
|---|---|---|
| Run models | **[Ollama](https://ollama.com/)**, **[LM Studio](https://lmstudio.ai/)**, **[llama.cpp](https://github.com/ggml-org/llama.cpp)** | Ollama is a friendly command-line/server option; LM Studio is a desktop GUI; llama.cpp is the lower-level engine for tinkerers. All can run on CPU, with GPU acceleration where supported. |
| Chat interface | **[Open WebUI](https://github.com/open-webui/open-webui)** | A self-hosted chat UI for local or remote model servers. Check the current license and secure the login before exposing it beyond your machine. |
| Documents and RAG | **[AnythingLLM](https://anythingllm.com/)** | A desktop app for chatting with document collections. Local embeddings and models are possible, but a "local" RAG stack still needs a data-retention decision. |
| Coding | **[Continue](https://www.continue.dev/)**, **[Aider](https://aider.chat/)**, **[Cline](https://cline.bot/)** | These can use hosted or local models. Aider edits files in your repository; commit or back up before letting any agent write. |
| Images | **[ComfyUI](https://github.com/comfyanonymous/ComfyUI)**, Stable Diffusion WebUI, Fooocus | Node-based workflows are powerful and fiddly. GPU memory, model licenses, and safety filters matter. |
| Audio | **[Whisper](https://github.com/openai/whisper)**, faster-whisper, Piper TTS | Transcribe local audio on CPU or GPU. Do not use it on patient or client recordings without the right consent and compliance plan. |
| Automation | **[n8n](https://n8n.io/)** community edition, Home Assistant | n8n is fair-code, not OSI open source; the community edition is free to self-host for many internal uses, with license restrictions. Read the Sustainable Use License. |
| Writing and publishing | LibreOffice, Pandoc, Calibre, LanguageTool, Scribus | Not AI, but free, local, and useful for an author-publisher workflow. Calibre can manage an ebook library; Pandoc converts formats; LanguageTool checks grammar. |

A reasonable first stack is **Ollama + Open WebUI + one small document assistant**, not a rack of servers. Add tools when a real workflow is blocked, not because a video made them look impressive.

## Hardware, without the hype

Local model size is usually described in billions of parameters. A common rough guide:

| Model size | Approximate memory at 4-bit quantization | Realistic hardware |
|---|---|---|
| 3–4B | 2–3 GB | Most laptops with 8 GB RAM; a modest GPU helps. |
| 7–8B | 5–6 GB | 16 GB RAM (CPU, slower) or a GPU with 6–8 GB VRAM. |
| 13–14B | 9–11 GB | 12–16 GB VRAM, or a Mac with unified memory and patience. |
| 30–34B | 20–24 GB | 24 GB VRAM or a high-memory unified-memory machine. |
| 70B | 40–48 GB+ | Multiple GPUs, a workstation, or a server-class machine. |

These are rough numbers. Context length, quantizer, runtime, and the rest of your desktop all affect whether a model actually fits. Leave headroom. A model that barely fits may run slowly or fail when you increase the context.

**Do not buy a $1,500 GPU to avoid a $15 monthly API bill.** That is more than eight years of the API bill, before electricity and your time. Buy or use local hardware when you value privacy, offline operation, learning, predictable costs at high volume, or the ability to keep working when a provider changes its terms. Those are legitimate reasons. "Avoiding a subscription" alone is usually not.

Apple Silicon machines can be excellent local-AI machines because the unified memory is available to the GPU; performance varies by model and runtime. A gaming GPU can be excellent on a desktop. A thin laptop with 8 GB of RAM is a fine place to learn with a 3B model, but not a good place to run a 70B model. Start with what you own.

## A safe first install

Install Ollama from its official download page rather than piping a random script from a search result. Then use a small model:

```bash
# after installing Ollama from https://ollama.com/download
ollama pull llama3.2:3b
ollama run llama3.2:3b
```

Model names change. If that tag is no longer current, browse the official model library and choose a small instruct model. You can see what you have installed with `ollama list`.

Ollama exposes an OpenAI-compatible endpoint at `http://localhost:11434/v1` for many tools. The API key value is a placeholder; local Ollama does not validate it. That means any tool on your machine that can reach localhost may also reach the model. Keep the server bound to localhost, do not expose port 11434 to the public internet, and do not install untrusted extensions that can read your files.

For a first test, ask the model to summarize a page of public-domain text. Then ask it to do the same with a document you wrote. Compare the output with the hosted model you already use. You are looking for "good enough for this job," not a benchmark victory.

## Free hosted experiments

You do not need a new computer to try open models:

- **Google Colab** and **Kaggle** offer free notebooks with limited, non-guaranteed GPU access. They are for experiments, not production, and public notebooks are not a private data store.
- **Hugging Face Spaces** can host a small demo on free CPU, with sleep and usage limits. Do not assume free hosting equals private hosting.
- **OpenRouter** and other providers offer free variants of some open models. The model may be open-weight, but the provider's data policy still applies.
- **LM Studio** and **Ollama** are free to install; the model files have their own licenses.

Free hosted compute changes frequently. Treat it as a place to learn, not an SLA.

## Model licenses are not all the same

"Open source" is often used loosely for models whose weights are downloadable. The license may still restrict commercial use, require attribution, impose acceptable-use terms, or have a user-count threshold.

Before you embed a model in a product:

1. Open the model card and the license on Hugging Face or the creator's site.
2. Check whether commercial use is permitted.
3. Check whether you must display attribution or pass through terms.
4. Check whether your use case is restricted.
5. Save a copy of the license version you relied on.

Examples of license families include Apache 2.0 (permissive), MIT (permissive), the Llama community license (source-available weights with conditions), and Gemma's terms (permitted commercial use with use restrictions). The details matter; do not assume that "you can download it" means "you can ship it however you like."

## Security: local is not automatically safe

A local model is only one part of the system. The risk often comes from the tools around it:

- A coding agent can read your files, run shell commands, and make network requests. Use a disposable repository or a VM for experiments, and review diffs before accepting changes.
- A RAG assistant can be prompt-injected by a malicious document. Treat retrieved text as untrusted content; do not let it trigger tools or reveal secrets.
- A local web UI exposed to the internet needs authentication, HTTPS, updates, and backups. "It is on my own server" is not a security plan.
- Model downloads and plugins are software supply-chain risks. Prefer official sources and pin versions.
- Logs can contain sensitive prompts. Decide where they are stored and how long they live.

The safest local workflow for a beginner is modest: one machine, localhost only, one model, a folder of non-sensitive documents, and a backup. Expand after you have a reason.

## When self-hosting is cheaper

Run the math on **cost per useful output**, not tokens alone:

```text
monthly local cost = hardware cost / useful months
                   + electricity
                   + your maintenance time (at a rate you respect)
                   + backup/storage
                   + the cost of mistakes
```

Then compare that with the paid API bill for the same useful output, including retries and your editing time. For a few dollars of API use per month, a new GPU is almost never cheaper. For a high-volume, privacy-sensitive, offline-first workflow, local can be compelling.

A hybrid is often best: use a local model for drafts, classification, and private material; use a paid frontier model for the hard 10 percent; use a free hosted tier for learning. The goal is not purity. It is the lowest total cost for the outcome you need.

## An open-source back office for an author-LLC

ASDALE DYNAMICS, LLC can run a surprising amount of its operations with free, local tools:

- **Writing and conversions:** Obsidian or a plain Markdown folder, Pandoc, LibreOffice.
- **Ebook checks:** Calibre, LanguageTool, a human proofreader.
- **Bookkeeping:** GnuCash or a self-hosted accounting package, with an accountant's review; do not self-host your only copy of financial records without backups.
- **Invoicing:** Invoice Ninja or a simple document workflow, with a payment processor that handles tax and fraud.
- **Automation:** n8n for scheduled backups and reminders; keep it inside your network.
- **Publishing:** a static site on GitHub Pages, a newsletter tool with exportable subscribers, and your own domain.

Open-source software shifts cost from licenses to maintenance. That is a good trade only if you will actually maintain it. Keep automatic backups, update on a schedule, and write down how to restore.

## Try this now

1. Install Ollama and run one small model on a public-domain document. Note the speed and quality on your hardware.
2. Choose one private workflow that would benefit from local processing—and verify you can do it without uploading sensitive data.
3. Pick one open-source tool for your business back office. Check its license, backup path, and update process before importing real data.
4. Write down your hybrid rule: "Local for X, free tier for Y, paid API for Z." If you cannot name X, Y, and Z, you are not ready to buy hardware.

Next: the bill-safety system. This is the chapter to reread before you add a payment method to anything.
