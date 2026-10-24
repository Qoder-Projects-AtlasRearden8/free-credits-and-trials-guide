---
title: Avoid surprise bills
nav: Avoid surprise bills
description: A practical system for budgets, hard caps, API-key hygiene, cancellation reminders, and monthly billing reviews.
order: 8
kicker: Chapter 08 · Bill safety
updated: 2026-10-22
---

The most expensive sentence in AI is not "the model hallucinated." It is "I thought it was free."

A surprise bill usually comes from one of four things: a trial that converted, a budget that only sent emails, an API key that kept working, or a resource that kept running. Each has a control. None of the controls is automatic unless you set it up.

This chapter is a playbook. Do it once for every tool that can charge you, then put a short monthly review on your calendar.

> **In plain English:** An alert tells you the house is on fire. A hard cap is the sprinkler. You want both, and you want to know which one you actually installed.

## Alert versus brake

| Control | What it usually does | Does it stop spend? |
|---|---|---|
| Email usage alert | Notifies you at a threshold | No |
| Monthly budget | Tracks spend against a number | No, unless configured as a spending cap |
| Cloud budget alert | Sends a notification | No |
| Hard spend limit | Blocks requests after a threshold | Yes, sometimes with a delay |
| Quota | Blocks requests at a usage limit | Yes, for the limited unit |
| Rate limit | Slows or rejects excess requests | It limits speed, not monthly spend |
| Card credit limit | Limits what the issuer will authorize | Partially; declines can break service, and fees may still accrue |
| Calendar reminder | Reminds you to cancel or downgrade | No; it relies on you |

The exact names and behavior differ by provider. The principle does not: **find out which control actually blocks usage, and test it.**

## Provider controls, at check

| Provider | Controls to look for | The caveat |
|---|---|---|
| **OpenAI API** | Organization and project limits; email alerts; project spend limits with an option to enforce a hard limit. | Enforcement is not always instantaneous, so a small overage may happen. Check the current project Limits page. [OpenAI help](https://help.openai.com/en/articles/9186755-managing-your-work-in-the-api-platform-with-projects) |
| **Anthropic Claude API** | Organization and workspace spend limits; usage reporting; alerts. | Make sure the limit applies to the workspace or project that is actually making the calls. A limit on a different workspace is not protection. Check the Console billing pages for current behavior. [Pricing docs](https://platform.claude.com/docs/en/about-claude/pricing) |
| **Google Cloud** | Budgets with alert thresholds; programmatic budget notifications; spend caps for some services; quotas. | Google explicitly says alerts-only budgets do not cap usage or spending. Budget actions require additional setup and can take time. [Budget docs](https://docs.cloud.google.com/billing/docs/how-to/budgets) |
| **AWS** | AWS Budgets with alerts; budget actions that can apply an IAM/SCP policy or target EC2/RDS resources; service quotas. | Actions must be configured with an IAM role and can be scoped narrowly. They are not a blanket "stop my whole bill" button. [Budget actions](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html) |
| **Microsoft Azure** | Budgets for subscriptions/resource groups; actual and forecasted alerts; action groups that can trigger automation. | Resources are not stopped by a budget alert. Cost data can lag 8–24 hours and budgets are evaluated roughly daily. [Azure budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets) |
| **GitHub Copilot** | Plan-level usage controls and spending limits for organizations; individual plans auto-renew. | Copilot moved to usage-based billing in 2026. A "free" plan has completion and premium-request limits; a paid plan can incur additional usage charges if configured that way. Check the current plan and spending settings. [GitHub blog](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/) |
| **SaaS trials and subscriptions** | Auto-renewal, seat counts, annual vs monthly billing, cancellation windows. | The most common surprise is a free trial that becomes a full-price annual plan. Put the renewal date in your calendar and the tracker. |

> **Reality check:** A budget in a dashboard is not a legal promise that you will never be charged. It is a monitoring feature. If the provider's documentation does not say "hard limit" or "stop usage," assume it does not.

## Set the trap before the tool

Use this sequence every time you add a card or enable billing.

**Step 1: Use the right identity.** Create a dedicated business email for AI accounts. Use it consistently. If an account is tied to an old personal email, you may miss a renewal notice or lose recovery access.

**Step 2: Give every experiment its own project or workspace.** Do not mix the book's production API key with a weekend test. A separate project gives you separate limits, usage, and a clean way to cancel.

**Step 3: Set the lowest useful hard limit.** If the provider has a hard spend limit, turn it on. Start low. Some systems have minimums or delays; test with a tiny request. If there is no hard limit, use the smallest quota you can and add a manual review date.

**Step 4: Set alert thresholds.** Use 25%, 50%, 75%, and 90% of your monthly target. Send them to an inbox you actually read. A dedicated billing filter or label helps.

**Step 5: Set a limit inside your application.** Even a good provider cap can be expensive if a bug runs all night. Apply:
- A maximum output token count per request.
- A timeout and a maximum retry count.
- A per-run or per-day request cap.
- A maximum number of agent steps or tool calls.
- Rejection of oversized inputs.
- Cost logging per request or per user.
- A kill switch that can disable the key without a deploy.

**Step 6: Set two calendar reminders.** One **7 days before** the trial ends, and one **1 day before**. The first is for the decision; the second is for the action. For annual subscriptions, set a reminder **30 days before renewal**, because cancellation windows can be narrow.

**Step 7: Record the cancel URL.** Put it in the tracker. Do not trust that you will find it later.

**Step 8: Test the cap.** Once the service is working, temporarily set a very low limit and make a request. Confirm that the system blocks or warns as expected. If it does not, you have learned something important before the real bill.

## The $1 test

If a provider allows a custom hard limit, set it to the lowest practical amount—$1, for example—and make a small request. Watch what happens in the dashboard. Then raise it to your working limit.

You are testing three things:

1. Does the limit apply to the correct project or workspace?
2. How quickly do usage and alerts update?
3. What does a blocked request look like to your app?

A guardrail you have never tested is a decoration. This test takes minutes and can prevent an unpleasant lesson.

## Build guardrails into the code

A provider limit is your last line of defense. Your app should have its own limits too. This skeleton shows the pattern; it is not a complete production implementation:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.environ["LLM_BASE_URL"],
    api_key=os.environ["LLM_API_KEY"],
)

MAX_OUTPUT_TOKENS = 300
MAX_RETRIES = 2
MAX_AGENT_STEPS = 5

def answer(prompt, steps_used=0):
    if steps_used >= MAX_AGENT_STEPS:
        raise RuntimeError("Agent step limit reached")
    response = client.chat.completions.create(
        model=os.environ["LLM_MODEL"],
        messages=[{"role": "user", "content": prompt}],
        max_tokens=MAX_OUTPUT_TOKENS,
        timeout=30,
    )
    return response.choices[0].message.content
```

The important parts are not the exact SDK syntax. They are the habits: set a ceiling, set a timeout, log what happened, and do not let an agent loop forever. If you add retries, use exponential backoff and a hard retry cap. If you process a batch, cap the batch size and estimate the worst-case cost before starting.

## Never do this with API keys

- Never commit a key to Git, even in a "private" repository. Rotate it if you do.
- Never put a key in front-end JavaScript, a mobile app, or a URL query string.
- Never paste a key into a chat, screenshot, support forum, or public notebook.
- Never share one key across unrelated projects. Use separate keys and revoke the ones you stop using.
- Never give a key more permissions than the task needs.
- Never assume a free tier's key is harmless because the plan is free. A misconfigured paid fallback or a project upgrade can change the cost.

Use a secret manager or environment variables for real work. For local experiments, a `.env` file that is excluded from Git is acceptable. Create a habit of checking `git status` before committing.

## The monthly close

Once a month, spend 30 minutes on the money side. This is less fun than building. It is also cheaper than a surprise invoice.

1. **Download the invoice and usage export** for every active provider. Put them in one folder with the month in the name.
2. **Compare the total to last month.** Look for new line items, not just the grand total.
3. **Open the resource list.** Stop, delete, or schedule the deletion of anything you are not using. Check disks, snapshots, IPs, databases, buckets, and functions.
4. **Check that budgets and alerts are still attached** to the right project and the right email. A billing email change can silently disable your early warning.
5. **Revoke unused API keys** and remove stale team members or integrations.
6. **Update the tracker**: status, spend, next decision date, cancellation URL.
7. **Adjust one thing.** Raise a budget if usage is legitimately growing, cancel a tool you have not opened, or downgrade a plan. One deliberate change per month is enough.
8. **File the receipts** with your bookkeeping. Keep business and personal spending separate.

Do this weekly for the first month after you add a new card. Monthly is too slow when a bug can consume a credit balance in a weekend.

## The cancellation playbook

Cancellation is a small project. Do it in this order:

1. **Decide:** cancel, downgrade, pause, or keep and budget.
2. **Export:** prompts, files, conversation history, invoices, and configuration you need.
3. **Revoke access:** API keys, OAuth connections, team invites, and integrations.
4. **Stop usage:** disable scheduled jobs, workers, and webhooks.
5. **Delete resources:** compute first, then storage/databases, then networking, then the project. Confirm that backups and snapshots are deleted too.
6. **Downgrade or cancel the plan:** use the provider's account settings or support path. Save the confirmation number or screenshot.
7. **Remove the card** if the account allows it, or close the account. Removing a card from a subscription does not always cancel the subscription.
8. **Verify the next invoice is zero** and that the account shows the expected state. Check one month later.

Deleting data does not cancel a subscription. Canceling a subscription does not always delete data. Treat them as separate tasks.

## When a charge is wrong

Contact the provider's billing support quickly, with dates, amounts, account IDs, and a clear request. Screenshot the dashboard and keep the cancellation confirmation. Ask for a refund or credit, but do not assume it will be granted. A chargeback should be a last resort after good-faith support contact; it can result in account closure and loss of data.

The best time to prevent a dispute is before the card is entered: a separate project, a hard cap, a renewal reminder, and a cancellation path you have already tested.

## A simple personal policy

> I do not enter a card unless I have a cancel date, a spend cap, and a job for the tool.

That is the whole system in one sentence. The tracker and the reminders exist to make the policy easy to keep.

## Try this now: the 15-minute audit

1. List every AI or cloud service that has your card. Check your email for "trial ending" and "payment received" messages.
2. Open the tracker and add one row per service. Mark the trial end date, renewal date, and cancel URL.
3. Set a spend limit or quota on the one service that could generate the largest bill.
4. Put a 10-minute billing review on your calendar for next Monday. Add a recurring monthly event.
5. Revoke one key or install one guardrail in your code before you close this guide.

If you want a ready-made reminder, the site's Tracker page can generate a calendar file (`.ics`) for a decide-by date. It runs entirely in your browser.

Next: how to keep this system alive as offers change, and when paying is the better decision.
