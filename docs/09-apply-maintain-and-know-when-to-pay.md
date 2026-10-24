---
title: Apply, maintain, and know when to pay
nav: Maintain & decide
description: Keep the tracker alive, update stale offers, build portable systems, and recognize the moment a paid tool becomes the cheaper choice.
order: 9
kicker: Chapter 09 · Maintenance
updated: 2026-10-22
---

The list of free programs is not the valuable part. The habit of checking dates, eligibility, data terms, and renewal paths is. Offers change; a good operating rhythm does not.

This final chapter is about keeping the system alive: reviewing the tracker, applying without overextending yourself, and knowing when paying is the mature choice.

> **In plain English:** The goal is not to collect the most free credits. It is to build something that can afford to keep existing after the credits run out.

## Keep the tracker alive

Your tracker should be boring, current, and small enough to review in ten minutes.

**Update it when:**

- You sign up, upgrade, downgrade, or cancel.
- A provider changes a limit, price, or eligibility rule.
- A credit or trial gets a new expiration date.
- You add a card or change the billing email.
- A program application is submitted, approved, rejected, or expires.
- A tool becomes part of a customer-facing workflow.

**Do not let the tracker become a museum.** If a row is no longer relevant, mark it `expired` or `cancelled` and write one line about what happened. Delete rows only after the data and invoices are archived. The history is useful when a program reappears or when you need to explain a purchase.

### The quarterly 20-minute review

Put this on your calendar every three months. Use a timer.

1. Sort by `decide_by_date`. Anything within 30 days gets a calendar event today.
2. Review every `active` row: is the tool still used, still worth its cost, and still on the right plan?
3. Check the official pages for your three most important programs. Update the `date_checked` field even if nothing changed.
4. Look for reminders you may have missed: trials ending, annual renewals, auto-upgrades.
5. Update budgets and alert thresholds for anything that has grown.
6. Archive the previous quarter's invoices and usage exports.
7. Add one sentence to your notes about what you would do differently next quarter.

### The annual review

Once a year, look at the whole stack:

- Which free tiers became paid plans? Were the upgrades intentional?
- Which paid tools could be replaced by a local/open-source tool?
- Which free tools are now critical to revenue without a paid fallback?
- Are your data-processing terms still appropriate for the work you do?
- Are your API keys, OAuth grants, and team members still needed?

An annual review is also a good time to delete dormant accounts. An account you do not use is still a place where a payment method, a data set, or a credential can sit unattended.

## When a paid plan is the right answer

Free tiers optimize for exploration. Paid plans optimize for reliability, support, higher limits, and often better data terms. Pay when one of these is true:

- **The tool is on a revenue path.** The time it saves or the work it enables is worth more than the subscription.
- **Free limits break the customer experience.** A rate-limited demo or a sleeping server is not a product.
- **You need support or uptime commitments.** A business cannot rely on a community forum during a launch.
- **You need data protections.** Paid does not automatically mean compliant, but it is where business-associate agreements, enterprise retention controls, and support paths usually exist.
- **Your time is the bottleneck.** Maintaining a self-hosted stack to save $20 a month is a bad trade if it costs four hours.
- **The free offer has changed.** A retired product or a closed program is a signal to re-evaluate, not a reason to wait indefinitely.

Do not pay just because the free trial is ending and you have not decided. The deadline is not the strategy. Decide what job the tool does and what you would pay for that job.

### The cost of a useful output

Compare **cost per useful output**, not list price per token:

```text
cost per useful output =
  (API + subscription + hosting + storage + fees)
  ÷ (outputs that actually pass your quality bar)

plus:
  - your editing time
  - failure and retry costs
  - support and maintenance time
  - the cost of a data or compliance mistake
```

A cheaper model that requires three attempts and heavy editing can be more expensive than a better model that gets it right. A free tool with no support can be more expensive than a paid one when it fails during a launch. Measure outcomes, not promises.

## Build for portability

You do not need a giant abstraction layer. You need enough separation that a provider change does not become a rewrite.

- **Keep prompts in versioned files**, not buried in a proprietary dashboard.
- **Use OpenAI-compatible endpoints** when they are a good fit. They make it easier to test a second provider or a local model.
- **Store your data in formats you can export**: Markdown, CSV, JSON, plain text, standard image/audio formats.
- **Keep a fallback**: a second provider, a local model for small tasks, or a manual process for the day an API is down.
- **Document the model ID and version** used for any important workflow. A silent model update can change tone, safety behavior, or cost.
- **Test the fallback quarterly.** An untested backup is a hope.

Portability is not just about price. It is about leaving a provider when the data terms, limits, or quality change. The best time to discover that your prompts are trapped in a dashboard is before you need to move.

## Keep business records separate

For an LLC, the clean pattern is:

- A dedicated business email for accounts.
- A business payment method with statements you reconcile.
- One project or workspace per product.
- A bookkeeping folder for invoices and usage exports.
- A simple monthly note on the cost and purpose of each AI tool.

This is not tax advice. It is the minimum record-keeping that makes a deduction conversation, a budget review, or a pricing decision possible. Ask your accountant about the treatment of credits, subscriptions, and equipment. Keep the receipts regardless.

## Apply honestly, even when nobody checks

The fastest way to lose access to useful programs is to misrepresent eligibility. Some examples that are not worth the risk:

- Signing up as a student with someone else's credentials.
- Using a 501(c)(3)'s EIN or validation for a for-profit LLC.
- Claiming a VC relationship or accelerator that you do not have.
- Buying a "verified student" or "startup credit" package.
- Creating multiple accounts to evade free-tier limits.
- Reselling credits or API access against the provider's terms.

These are not clever growth hacks. They are account-termination risks, clawback risks, and reputational risks. A small, honest company can afford the base-tier price. It cannot always afford a pattern of misrepresentation.

## Maintaining this repository

If you are updating this guide, keep the source of truth clear:

- **Chapters:** `docs/NN-name.md`. The front matter includes the title, description, order, kicker, and updated date.
- **Program finder:** `src/site/data/programs.json`. Every entry has an official URL, a check date, card status, audience, and caveats.
- **Sources:** `src/site/data/sources.json`. Use official provider pages first.
- **Change log:** `src/site/data/changes.json`. Record retirements, closures, and material changes, not every price tweak.
- **Generated output:** `site/`. Do not edit generated HTML by hand.

After changing content:

```bash
npm run build
npm test
npm run serve
```

The verification script checks internal links, dates, required disclaimers, CSV structure, secret-like patterns, and a local HTTP smoke test. It cannot verify that a provider's website still says what it said yesterday. That is the human review.

### What to update when an offer changes

1. Find the current official page and note the date.
2. Update the program entry: limits, card requirement, status, caveats, URL.
3. Update the relevant chapter if the explanation changes.
4. Add a change-log entry if the change is material.
5. Update the `updated` date in the chapter front matter.
6. Rerun the build and tests.
7. If a program is retired, keep a note explaining what it was; the disappearance is part of the history.

## A realistic 90-day plan for a solo LLC

You do not need to apply for ten programs in a week.

**Days 1–14:** Choose one free API tier and one local tool. Build a small, non-sensitive prototype. Set up the tracker, budgets, and two calendar reminders. No card unless required.

**Days 15–30:** Publish a small piece of evidence: a working demo, a guide, a talk, or a documented experiment. Collect usage numbers from the free tier. If the prototype is still useful, consider a small paid budget for one provider.

**Days 31–60:** Prepare the startup application kit. Apply to one base-tier program you actually qualify for. Keep building; do not wait for the credits. Review the first invoice and the tracker.

**Days 61–90:** Decide what to keep. Cancel or downgrade the experiments that did not earn their place. If a tool is now on the revenue path, move it to a paid plan with a hard cap and a support path. If not, thank it and let it go.

This plan is deliberately unglamorous. It produces a small business that knows its numbers, not a screenshot of a credit approval.

## The closing rule

You will get more value from three careful experiments than from thirty free accounts. A free trial is a tool for learning. A budget is a tool for deciding. A cancel reminder is a tool for respecting your future self.

Free is a starting point. A budget is a business.

## Try this now

1. Put the quarterly review on your calendar. Add a link to the tracker in the event notes.
2. Choose one active tool and find its cancel URL. If you cannot find it, that is your next task.
3. Write a one-line rule for when you will pay: "I will pay for [specific tool] when [specific condition]."
4. Check the sources page and note the date. If an offer has changed, update your own tracker first.

You now have the full loop: find an offer, verify the terms, use it within limits, track it, and leave cleanly. That is enough to be a careful builder in a market that changes every week.
