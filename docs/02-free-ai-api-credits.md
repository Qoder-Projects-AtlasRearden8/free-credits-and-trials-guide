---
title: Free AI API credits
nav: Free AI API credits
description: Where real free API allowances exist in 2026, what they cost in data and limits, and how to build a portable first prototype.
order: 2
kicker: Chapter 02 · API allowances
updated: 2026-10-24
---

An API key is not a subscription. It is a credential that lets a program spend money—or use a limited allowance—on your behalf. Before you put one in a script, know which of those you are dealing with.

This chapter covers the API offers that were real at check time, the ones that are commonly misdescribed as free, and a way to prototype that does not tie your project to one vendor.

> **In plain English:** You can absolutely build useful things on free API tiers. You just need to treat the free tier as a small, temporary lab bench, not as the foundation of the house.

## The honest map, as of October 22, 2026

| Provider | What is free at check | Card | Main catch |
|---|---|---|---|
| **Google Gemini Developer API / AI Studio** | A rate-limited free tier for selected models, with an API key available from AI Studio. Free-tier limits are shown in AI Studio rather than a single static public table. | No card needed for the free tier. | Free-tier content may be used to improve Google products. Some models are paid-only. Do not send private or client data. [Pricing](https://ai.google.dev/gemini-api/docs/pricing) · [Rate limits](https://ai.google.dev/gemini-api/docs/rate-limits) |
| **Groq** | A free tier for fast hosted open models, with limits that vary by model and apply per organization. | No card at check. | It is rate-limited, not unlimited. Check the current model list and data terms. [Rate limits](https://console.groq.com/docs/rate-limits) |
| **OpenRouter** | Free model variants from multiple providers, useful for comparing models through one API. | No card for free models. | Daily request caps depend on your credit history: below $10 in lifetime purchases, 50 free-model requests per day; at $10 or more, 1,000 per day at check. Free variants rotate and may have provider data policies. [Limits](https://openrouter.ai/docs/api-reference/limits) |
| **Cloudflare Workers AI** | A free allocation of 10,000 Neurons per day on the Workers Free plan, plus an OpenAI-compatible API. | No card for the free plan. | Good for small, edge-hosted features, not bulk generation. Model availability and per-model neuron costs vary. [Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) |
| **Mistral La Plateforme** | A Free mode with monthly usage and rate limits, no card at check. | No card at check. | Free-mode data may be used for training unless you opt out. Limits are shown in the admin console. [Usage limits](https://docs.mistral.ai/admin/billing-usage/usage-limits) |
| **Cohere** | A trial API key for evaluation, rate-limited and limited to a monthly call quota. | No card for trial key. | Trial keys are for evaluation, not production. The exact quota and model access can change; confirm in the dashboard before relying on it. [Docs](https://docs.cohere.com/docs/rate-limits) |
| **NVIDIA NIM** | Free access to hosted NIM endpoints through the NVIDIA Developer Program, including OpenAI-compatible APIs and a starting credit allotment. | No card at check. | Intended for development and evaluation; you may need to request more credits, and hosted model access changes. [NVIDIA Build](https://build.nvidia.com/) |

Every row deserves a second sentence: **the free version is a different product from the paid version.** It can have different data handling, different models, different reliability, and different support. That is not a trick. It is the trade.

## Things that are not free API credits

Some offers get repeated so often that they feel true. Check them before you plan around them.

| Offer | The reality at check |
|---|---|
| **OpenAI API** | There are no routine, automatic free API credits for new accounts. API usage is prepaid. The free ChatGPT app is a separate product from the API. Startups may get credits through investor partners or programs, but that is not a general sign-up bonus. |
| **Anthropic Claude API** | We found no general free API credit offer at check. The free Claude consumer app is not an API credit. Startup credits are limited and partner-dependent. |
| **GitHub Models** | Fully retired on July 30, 2026, including its playground, model catalog, and inference API. A good reminder that developer freebies are not permanent infrastructure. [Retirement notice](https://docs.github.com/en/github-models) |
| **Hugging Face Inference Providers** | Free Hugging Face accounts do not include monthly inference credits. PRO is $9 per month and included $2 per month in compute credits at check; you can also buy credits. Free Spaces on CPU are a separate, limited hosting product. [Pricing](https://huggingface.co/docs/inference-providers/pricing) |
| **Together AI** | No free trial credits at check; the platform is prepaid and requires a minimum credit purchase. A startup accelerator may offer separate credits. |
| **Free ChatGPT or Claude subscription** | Useful for learning, but it does not give your code an API key or predictable programmatic access. Do not build a product on browser automation of a chat app. |

If an offer is missing from this chapter, it may still exist. It may also be regional, invite-only, or too unstable to recommend. The absence is a prompt to check the official page, not a verdict that the provider is bad.

## Free coding assistants are a different product

A coding assistant can be free without giving you a general-purpose API allowance. It is usually a seat with its own completion, chat, or agent limits—and those limits can change with the plan.

At check, the useful options fell into three groups:

- **GitHub Copilot Free.** A limited free plan that does not require student verification. Copilot moved to usage-based billing in 2026, so read the current completion and premium-request limits rather than relying on older descriptions. [Copilot plans](https://github.com/features/copilot/plans)
- **Gemini Code Assist for individuals.** A free individual tier with usage limits, separate from the Gemini API's free tier and from a Google AI consumer subscription. [Docs](https://developers.google.com/gemini-code-assist/docs/overview)
- **A free editor plan or an open-source client.** Cursor and similar editors advertise limited free plans. Open-source clients such as Continue, Cline, and Aider do not charge a seat fee, but you still need a model—local or hosted—and that model's allowance and data terms apply. [Cursor pricing](https://cursor.com/pricing) · [Local tools](./07-open-source-alternatives.md)

The safety rules are the same as for any AI tool, with one extra: **your code context is data.** It can include API keys, customer names, internal URLs, and unfinished business logic.

- Read the provider's data-use setting before opening a private repository. A free coding plan may collect code for product improvement unless you change the setting or use a different plan.
- Keep secrets out of the editor context. Use environment variables, a local `.env` file that Git ignores, and a secret scanner before you commit.
- Review every diff before accepting it. An agent that can edit files can also delete the wrong file or introduce a dependency you did not choose.
- Use a disposable branch or a scratch repository for the first agent experiment. Do not give an unsupervised agent production credentials.
- Know what happens at the cap: does the assistant stop, downgrade to a smaller model, or ask you to pay? "Free" that silently becomes a paid upgrade is still a surprise bill.

For student-specific coding benefits, see [Chapter 5](./05-student-education-discounts.md). For a local coding setup with no per-token bill, see [Chapter 7](./07-open-source-alternatives.md).

## The four numbers that determine your bill

API pricing looks complicated, but most of the surprise comes from four things:

1. **Input tokens.** Everything you send: instructions, examples, retrieved documents, conversation history.
2. **Output tokens.** Everything the model generates. Output is often priced higher than input.
3. **Retries and loops.** A failed request that is retried can cost money. An agent that keeps calling tools can spend far more than a single chat.
4. **The model you chose.** A frontier model can cost many times more than a small model for a task where the small model is good enough.

Free tiers change these constraints, but they do not change the underlying behavior. A free tier with a token-per-minute limit will fail in the middle of a long document. A free model with a daily request cap will fail during a demo. Plan for graceful failure: shorter prompts, chunking, caching, and a clear "try later" message.

> **Reality check:** "I used the cheap model" is not the same as "I used the free model." Check the model ID in your code and in the provider dashboard. It is easy to leave a strong default in place and wonder why the allowance vanished.

## A provider-portable first call

Most of the providers above offer an OpenAI-compatible endpoint (NVIDIA NIM, Groq, OpenRouter, Cloudflare, Mistral, and local Ollama can all fit this pattern, though the exact URL and model IDs differ). That lets you start with one SDK and move later.

This example uses environment variables. It does **not** contain a real key, and it will not run until you set one locally. Never commit a key to a repository, paste it into a chat, or put it in a browser-side script.

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.environ["LLM_BASE_URL"],
    api_key=os.environ["LLM_API_KEY"],
)

response = client.chat.completions.create(
    model=os.environ["LLM_MODEL"],
    messages=[
        {"role": "system", "content": "You are a concise writing assistant."},
        {"role": "user", "content": "Give me three plain-English titles for a beginner AI guide."},
    ],
    max_tokens=200,
    timeout=30,
)

print(response.choices[0].message.content)
```

Set the three values in your shell or a local `.env` file that is ignored by Git. For a local Ollama server, the base URL is usually `http://localhost:11434/v1`; the model is one you have pulled locally; the API key value is a placeholder that Ollama does not validate. For a hosted provider, copy the base URL and model ID from that provider's current documentation—not from an old blog post.

The point is not that every provider is identical. The point is that your application should not hard-code one vendor's SDK calls in fifty places. Two functions—one to ask a model, one to estimate usage—are enough to start.

## Free tiers are not private by default

This is the part that matters most for a healthcare-adjacent audience.

- Google's Gemini API free tier says content may be used to improve Google products.
- Mistral's free-mode documentation says data may be used for training unless you opt out.
- Some OpenRouter free variants have provider data policies that differ from paid variants.
- A free consumer chat may train on your conversations; a paid API may offer zero retention or enterprise controls. Those are not the same product.

If you are writing about health, education, or client work, use synthetic examples: "a 68-year-old patient with [invented details]" rather than a real chart. Do not send protected health information, student records, unpublished client data, or your own confidential business documents to a free tier. A paid plan alone is not automatically HIPAA-compliant; you need the right agreement and workflow for the data. That is a compliance question, not a coupon question.

The safest pattern for early experiments is to create a **clean data set**: public-domain text, invented personas, and sample documents you wrote yourself. Keep the real material out until you have a contract and a provider that supports your use case.

## How to be a good citizen of free tiers

Free allowances are shared infrastructure. A few habits keep you from getting blocked and make your results more reproducible:

- **Do not create multiple accounts to evade limits.** Rate limits apply per organization or per person for a reason. It also makes your billing and data harder to manage.
- **Do not resell free credits or paywall your free-tier access.** That is usually against the terms and can get an account terminated.
- **Cache and batch.** If you ask the same prompt repeatedly, store the result. If you need to process a hundred documents, use a batch endpoint if the provider offers one.
- **Avoid retry storms.** Use exponential backoff, a maximum number of attempts, and an alert when failures spike.
- **Keep prompts short and specific.** A long context is not automatically a better answer. It is always more tokens.
- **Use a small model for small tasks.** Classification, cleanup, and title generation rarely need the largest model.
- **Read the free-tier terms again after a provider changes its pricing.** A model that was free last month can move behind a paid tier.

## A practical starter stack

If you are building a small tool for an audience rather than a high-volume product, this stack is a reasonable starting point:

- **Prototype:** Gemini free tier or Groq for text; Cloudflare Workers AI for a small edge feature; OpenRouter when you want to compare models.
- **Learning with private notes:** a local model through Ollama or LM Studio (see [Chapter 7](./07-open-source-alternatives.md)).
- **Production:** one paid provider with a hard spend limit and a documented fallback, not four overlapping free trials.
- **Data:** synthetic examples in development; no patient, student, or client records in free tiers.

Avoid stacking free tiers just to look "multi-provider." A second provider is useful when it gives you a real fallback, a different modality, or better privacy terms. Otherwise it is one more key to rotate and one more dashboard to check.

## Try this now

1. Pick one provider from the table and create an account with a dedicated business email.
2. Find the exact free-tier limits in the provider's dashboard and write them in your tracker, including the date.
3. Make one small request with the provider's own quickstart. Use public or invented text only.
4. Write down what would happen if the free allowance ended today: stop, pay, or switch? If the answer is unclear, do not build a customer workflow on it yet.
5. Bookmark the data-use and billing pages. You will need them more than the marketing page.

For the compute side of the equation—free VMs, notebooks, and static hosting—continue to [Chapter 3](./03-cloud-free-tiers.md).
