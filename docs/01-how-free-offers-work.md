---
title: How free offers really work
nav: How free offers work
description: The five kinds of free, what providers get in return, the questions to ask before signing up, and a simple decision rule.
order: 1
kicker: Chapter 01 · The basics
updated: 2026-10-22
---

The word "free" is doing a lot of work in AI marketing. Sometimes it means a real, ongoing allowance you can build on. Sometimes it means a trial that converts into a charge. Sometimes it means software you run on hardware you already paid for. Sometimes it means your data is part of the price.

None of those is automatically bad. The mistake is treating them as the same thing.

> **In plain English:** A free tier is a marketing budget with a rate limit. A free trial is a countdown. Open-source software is free like a puppy, not free like a sample. Read the label before you bring it home.

## The five kinds of free

| Kind of free | What it usually looks like | What ends it | Best use |
|---|---|---|---|
| **Ongoing free tier** | A limited number of requests, tokens, or neurons per day or month. | A rate limit, an account change, or the provider changing the offer. | Learning, small prototypes, low-volume tools. |
| **Trial credits** | A dollar balance valid for 30, 90, or 180 days. | The balance or clock runs out; sometimes the account converts to paid. | Time-boxed experiments with a clear end date. |
| **Program credits** | Startup, student, nonprofit, or partner credits awarded after an application. | Expiry, eligibility rules, or failing to meet the program's conditions. | A specific build with a cost forecast, not a lifestyle. |
| **Open-source software** | Software you download and run yourself. | Your hardware, time, maintenance, and the license. | Privacy-sensitive work, offline use, long-term tools. |
| **Free consumer product** | A chat app or editor with a free plan. | Feature limits, usage caps, ads, or a subscription prompt. | Casual use; not an API and not a guarantee of data handling. |

A free API tier and a free chat subscription are not interchangeable. ChatGPT's free app does not give you API credits. Claude's free app does not give you an API budget. Google AI Studio's free tier is a developer allowance with different terms from a Google AI consumer plan. Keep the products separate in your head and in your tracker.

## Why providers give it away

There is usually at least one of five reasons behind a free offer:

1. **Adoption.** If your prototype is built on their API, you are more likely to pay them when it grows.
2. **Data and feedback.** Free tiers can have broader data-use rights than paid tiers. That is part of the trade. Google's Gemini API pricing page says free-tier content may be used to improve products; check the current language for any provider before sending anything sensitive.
3. **Capacity smoothing.** Some providers can afford to fill spare capacity with free users, especially on smaller or faster models.
4. **Developer education.** Cloud providers want you to learn their services. The free trial is a tutorial with a meter attached.
5. **Funnel and ecosystem.** A student who learns on one stack may bring it to work later. A startup that receives credits may build its infrastructure around them.

Understanding the motive does not make the offer sinister. It helps you see the real exchange: money, data, attention, lock-in, or a future purchase. Decide which one you are comfortable with before you click.

## The two-wallet mistake

People often say "I have $300 in credits" and then act as if that is a spending cap. It usually is not.

- **Credits** are a dollar balance. When they run out, the service may stop, or it may start charging your card, depending on the product and your settings.
- **Rate limits** control how fast you can use a service, not how much money you can spend.
- **Budgets and alerts** are usually notifications. They do not necessarily stop usage.
- **Hard limits and quotas** are the things that can block a request. They also may take time to take effect.

A service can have a generous rate limit, no credits, and a card on file. That combination can produce a bill very quickly. It can also have a large credit balance and a strict hard limit that stops you mid-demo. Know which wallet you are spending from.

## The five questions to ask before signing up

### 1. What exactly is free, and for how long?

Write down the unit: tokens, requests, neurons, CPU-hours, days, or dollars. Write down the reset period and the expiration date. "Free" without a unit is not a fact you can plan around.

### 2. What happens when the free part ends?

Does the service stop, downgrade, delete data, or start charging the card? Is there a spending limit? Is the account closed automatically? Find the answer in the provider's billing documentation, not just the marketing page.

### 3. Is a card required?

A card requirement is not automatically a red flag, but it changes the stakes. If there is a card on file, set a hard cap if one exists, set a calendar reminder before the trial ends, and use a payment method where you can see and limit charges. If there is no card, the risk shifts from money to lost work and data access.

### 4. What am I giving the provider?

Read the data-use terms for the specific tier. Free tiers may use inputs and outputs to improve products. Some programs require a public project or a case study. Some discounts require verification through a third party. "Free" can cost privacy, publicity, or control.

### 5. How do I leave?

Find the cancel, downgrade, delete, or account-closure path **before** you need it. Save the URL in your tracker. Export the data you need. Delete resources in the right order. A cancel link buried in a help center is still findable; discovering it after the renewal charge is the expensive way to learn.

## A simple decision rule

| Your situation | A sane default |
|---|---|
| You want to learn prompting with no sensitive data | Free consumer chat, a free API tier, or a small local model. |
| You are building a prototype that must live for two weeks | Free API tier plus manual logging; no card unless the provider requires it. |
| You are launching something customers depend on | A paid plan with a budget, an uptime expectation, and an export path. Free tiers are for development. |
| You are handling patient, student, or client data | A compliant provider and contract designed for that data. Not a free tier. |
| You want an always-available personal tool and already own capable hardware | Local open-source software, accepting the maintenance cost. |
| You are a one-person LLC applying for startup credits | Start with the honest base tiers and a clear usage forecast; do not pretend to be venture-backed. |

## The 10-minute safety setup

Do this before your first serious experiment. It is deliberately short.

1. **Pick one business email** for AI accounts. Do not mix it with a personal inbox you ignore.
2. **Create a tracker row** with the program name, official URL, date checked, and cancel URL.
3. **Set a decide-by date** before the trial ends. Put it on your calendar with a notification, not only in your head.
4. **Set a spend cap or quota** if the service offers one. If it does not, decide on a manual review date and a maximum card exposure.
5. **Write the first task** you want the tool to do. A free account with no job is just a future newsletter subscription.

> **Reality check:** You will not remember the renewal date. That is not a character flaw; it is how subscriptions are designed. The calendar reminder is part of the tool's real setup cost.

## Free is not a business model

A free tier can help you find out whether an idea is worth paying for. It cannot be the foundation of a product that customers pay you for. If your costs are variable and your revenue is not, an expiring credit is not a margin; it is a delay.

This matters for a small company. ASDALE DYNAMICS, LLC can use free tiers to write, test, and teach. But a customer-facing tool needs a price that covers inference, storage, support, payment fees, and the cost of your time. "It was free during beta" is not a pricing strategy.

A useful test: if the free credit disappeared tomorrow, what would one hundred real requests cost? If you cannot answer that, you are not ready to put the tool in front of customers.

## Offers change; the habit does not

These are not hypothetical warnings. In 2026, [GitHub Models was fully retired on July 30](https://docs.github.com/en/github-models), [Cursor closed new sign-ups for its student discount on June 25](https://cursor.com/help/account-and-billing/student-discount), [GitHub Copilot moved to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/), and AWS replaced its old twelve-month Free Tier structure with a credit-based plan model. A guide written in 2024 would be actively misleading today.

That is why every chapter uses the phrase "at check," why the program directory shows a date, and why the tracker has a `date_checked` column. The date is part of the content.

## Try this now

1. Choose one AI task you actually do each week: summarizing a chapter, drafting a product description, outlining a course, or transcribing a non-sensitive voice note.
2. Decide whether it is a **learning task** (free tier), a **customer task** (paid path), or a **private-data task** (local or compliant provider).
3. Open the tracker CSV, delete the example rows, and add one row for a tool you are considering. Fill in the cancel URL and decide-by date even if you have not signed up yet.

When you are ready to make a first API call, move to [Chapter 2](./02-free-ai-api-credits.md). If you are mostly interested in running models on your own machine, skip ahead to [Chapter 7](./07-open-source-alternatives.md).
