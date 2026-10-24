---
title: Cloud free tiers
nav: Cloud free tiers
description: How AWS, Google Cloud, Azure, Oracle, hosting, and developer infrastructure structure free usage, plus the idle resources that create surprise bills.
order: 3
kicker: Chapter 03 · Cloud
updated: 2026-10-24
---

Cloud free tiers are a different animal from AI API free tiers. An API call happens, returns, and stops. A cloud resource can keep running—and keep costing money—while you eat dinner, sleep, or take a month off.

This chapter explains the current shape of the major offers, the traps that catch small businesses, and a safe way to try a cloud platform without making your card part of the experiment.

> **In plain English:** A free cloud server is like a free hotel room. It is only free while the terms say so, and checkout is your job.

## The big four, at check

| Provider | Current free structure at check | Payment method | What to watch |
|---|---|---|---|
| **AWS Free Tier** | New accounts receive **$100 in credits** and can earn **up to another $100** by completing activities. The **Free account plan** lasts up to **six months** or until credits run out. It includes always-free service allowances and excludes some services. The Free account plan does not charge you until you upgrade; at the end, the account closes if unused. | A payment method is part of signup; confirm the current requirements. | Old guides describe a twelve-month everything-free tier. That is no longer the right mental model for a new account. On the **Paid account plan**, usage beyond credits or not covered by credits is billed at standard rates. [AWS docs](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier.html) |
| **Google Cloud Free** | **$300 welcome credit for 90 days**, plus an Always Free tier. At check, Always Free included one e2-micro VM in specific US regions, 5 GB of Cloud Storage, and limited BigQuery usage, among other services. | Billing account and card are required. | The trial is time-boxed. Always Free is region- and service-specific. Google Cloud budgets are **alerts-only** unless you configure additional actions or quotas. [Free features](https://docs.cloud.google.com/free/docs/free-cloud-features) |
| **Microsoft Azure Free** | **$200 credit for 30 days**, plus free quantities of selected services for 12 months. The account is disabled if you do not move to pay-as-you-go after the credit expires or the 30 days end. | Credit card required for verification. | Azure free is a trial, not a permanent free tier for your application. Budgets notify; they do not stop resources. Data can lag 8–24 hours, so an alert can arrive after spending. [Azure free account](https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account) |
| **Oracle Cloud Free Tier** | A $300 trial plus Always Free resources, including two AMD micro VMs, an Ampere A1 allowance that current docs describe as the first **1,500 OCPU-hours and 9,000 GB-hours per month** (equivalent to 2 OCPUs and 12 GB running continuously), and two small Autonomous Databases. | Card is generally required for verification; confirm at signup. | Capacity is region-dependent and popular shapes can be unavailable. Always Free instances may be reclaimed if CPU, network, and memory stay idle. At trial end, Object Storage above 20 GB can be deleted. The A1 allowance is lower than older blog posts claim. [Oracle Always Free docs](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) |

Two useful phrases:

- **Free trial credits** are money that expires. When they are gone, you either upgrade or lose access.
- **Always-free allowances** are monthly usage limits that continue as long as the account and offer exist. They can still change, and they often exclude the capacity you actually need.

A third phrase matters too: **free for personal use only**. Several hosting platforms market a generous free plan that is not licensed for commercial use. Read that line before you deploy a client project or a revenue-generating storefront.

## Hosting and compute offers

| Platform | Free offer at check | Best use | Main catch |
|---|---|---|---|
| **Vercel Hobby** | Free personal plan with monthly CDN, data, and function allowances; overages are hard-capped at check rather than billed. | Personal demos and hobby sites. | The Hobby plan is **not for commercial use**. A business site for an LLC should use a plan that allows commercial use. [Pricing](https://vercel.com/pricing) |
| **Netlify Free** | A free plan with a monthly credit allowance, deploys, custom domains, and functions. | Static sites and small demos. | The credit system and limits change; check the current plan and overage behavior in the dashboard. [Pricing](https://www.netlify.com/pricing/) |
| **Render Free** | Free web services with limited RAM/CPU and bandwidth; services sleep after inactivity. No card required for the free plan at check. | Demos, learning, low-traffic experiments. | Slow cold starts and sleeping services are not a production experience. Limits can change. [Pricing](https://render.com/pricing) |
| **GitHub Pages** | Free static hosting from a public repository, with custom domains and HTTPS. | Manuals, documentation, portfolios, static tools. | Static files only; no server-side code or private repositories on the free plan. Usage limits and acceptable-use rules apply. [Docs](https://docs.github.com/en/pages) |
| **Hugging Face Spaces** | Free CPU-hosted Spaces with usage limits; GPU upgrades are paid. | Small open-model demos and community projects. | Free compute is limited and can sleep. Hugging Face free accounts do not include Inference Providers credits at check. Check visibility and data policies. [Spaces docs](https://huggingface.co/docs/hub/spaces-overview) |
| **Google Colab** | Free hosted notebooks; GPU and TPU access is not guaranteed and sessions time out. | Learning, notebooks, one-off experiments. | Not production hosting. Do not process sensitive data, and do not expect a free GPU to be available at a specific time. [Colab](https://colab.research.google.com/) |
| **Kaggle** | Free notebooks and datasets, with limited weekly GPU/TPU quotas. | Public experiments and learning. | Quotas, session limits, and verification requirements vary. Notebooks and data are public by default in many contexts; check before uploading anything private. [Kaggle docs](https://www.kaggle.com/docs/notebooks) |

> **For an LLC:** GitHub Pages and a commercial hosting plan are usually a cleaner combination than a no-cost hobby plan that forbids commercial use. "Free" that violates the terms is not free.

## The rest of the developer stack

Hosting is only one layer. CI, databases, object storage, authentication, email, and monitoring also have free plans—and their meters are easy to miss because they count minutes, rows, events, seats, or monthly active users instead of dollars.

| Layer | Examples at check | What to verify before you depend on it |
|---|---|---|
| **CI and build minutes** | [GitHub Actions](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions) | Included minutes and storage for private repositories; public repositories may be free; runner-size multipliers; whether a billing method is required once the allowance is gone. |
| **Edge and serverless** | [Cloudflare Workers](https://developers.cloudflare.com/workers/platform/limits/) | Daily requests and CPU time, per-account versus per-project limits, paid overage behavior, and whether the free plan permits commercial use. |
| **Database** | [Supabase](https://supabase.com/pricing), [Neon](https://neon.com/pricing), [MongoDB Atlas](https://www.mongodb.com/atlas) | Storage and compute allowances, inactivity pause or scale-to-zero rules, connection limits, backup and restore terms, and what happens to your data if the project is suspended. |
| **Object storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/pricing/) | Storage, operations, and egress allowances; minimum retention; whether deleting the database also deletes the backups. |
| **Monitoring** | [Sentry](https://sentry.io/pricing/) | Monthly event quota, retention, seat limits, sampling controls, and whether a free plan has a card requirement. |

These offers are useful for shipping a small tool, but they are not a production architecture. A free database is not a backup. Free CI is not an uptime guarantee. A free monitoring quota can hide the incident that exhausts it.

Use the same five-question test you would use for a cloud trial:

1. **What is the unit, and when does it reset?** Minutes, requests, rows, events, seats, or monthly active users can reset on different schedules.
2. **What happens at the cap?** Does the service stop, throttle, pause the project, or bill the card?
3. **What happens when you are inactive?** Free databases and apps often pause, and a paused project can lose scheduled jobs or inbound email.
4. **Can you get your data out?** Test an export before you store anything you care about.
5. **Is this the right license for the work?** Some free plans are personal-use only, and some limit commercial or team use.

> **Reality check:** "Developer free tier" often means "free for one person, one project, and one small workload." That is a fine place to learn. It is not a promise that the same architecture will stay cheap for a team or a customer-facing product.

## The small-resource tax

Cloud bills are rarely one giant charge. They are a flock of small, boring charges that stayed alive:

- A virtual machine you stopped using but never terminated.
- A GPU notebook left running overnight.
- A managed database that keeps storage and backups even when idle.
- A static IP address attached to nothing.
- A NAT gateway, load balancer, or logging pipeline.
- Egress: data leaving the cloud, especially across regions or to the internet.
- Snapshots and old disk volumes from deleted machines.
- Storage buckets accumulating test files.
- Serverless invocations from a loop with no cap.
- A trial that converted to paid because the end date was in a different time zone.

The fix is not to fear the cloud. It is to make a habit of looking at the resource list, not just the invoice. An invoice tells you what happened. A resource list tells you what is still happening.

## A safe first cloud experiment

Use this sequence for AWS, Google Cloud, Azure, or Oracle:

1. **Create a dedicated project or account** for the experiment. Do not mix a learning project with production data.
2. **Give it a name you will recognize** in a billing dashboard, such as `asdale-ai-lab-2026`.
3. **Set a budget alert at 25%, 50%, 75%, and 90%** of a low monthly number, even if you expect to spend nothing. Forward alerts to a folder you check.
4. **Set a hard quota or budget action where available.** AWS Budgets can run actions; Google Cloud needs additional configuration; Azure budgets can call action groups. These are not all instant.
5. **Choose the smallest instance and the closest region** that actually meets the need. Write down the region; pricing and free eligibility vary.
6. **Use a card you can monitor.** A business card with a low credit limit or a virtual card with a cap can reduce exposure, but check that the provider accepts it and that your issuer's protection still applies.
7. **Put a teardown event on your calendar** before you deploy. Include the steps: stop instances, delete disks, release IPs, delete buckets, close the project.
8. **Export anything you need** before deleting the project. Deletion is not a backup.
9. **Review the resource list the next day** and at the end of the week. This is when orphaned resources are easiest to spot.
10. **Close the account or downgrade to a free state** when the experiment is over. Removing the card is not the same as closing the account.

If you cannot name the resource you will delete and the date you will delete it, you are not ready to deploy.

## Which one should you use?

| Job | Sensible starting point |
|---|---|
| Publish this manual or another static site | GitHub Pages or a commercial static-hosting plan. |
| Run a tiny API or web demo | Render free for a short demo; move to a paid plan before real users. |
| Test inference at the edge | Cloudflare Workers AI free allocation, with a usage cap in your app. |
| Learn cloud infrastructure | One provider's free trial, one small project, aggressive teardown. |
| Run an open model for privacy | Your own hardware, or a paid private endpoint—not a free notebook with public data. |
| Host a database for a real business | A paid managed database with backups and a support path. Free trials are not a backup plan. |

Do not spread a first experiment across four clouds at once. You will spend your time learning four billing dashboards and miss the actual work.

## Free is not the same as reliable

Free and low-cost tiers are often shared capacity. They can be rate-limited, paused, reclaimed, or sunset. That is acceptable for a demo, a tutorial, or a learning exercise. It is not acceptable for a customer's order form, your book's download system, or a paid course portal without a fallback.

If a free resource is on the critical path of your business, write down the failure mode and the paid fallback. "It worked yesterday" is not an uptime guarantee.

## Try this now

1. Pick one cloud provider and open its free-tier page in a new tab. Find the **end date** of the trial and what happens when it ends.
2. Create a budget or a low-usage alert **before** creating a resource.
3. Deploy one small thing—a static page or a tiny VM—and then tear it down on purpose. Practice the cleanup before you need it.
4. Add the account, end date, budget, and cleanup URL to the tracker.

For programs that can extend your cloud runway legitimately, read [Chapter 4](./04-startup-credit-programs.md). For the provider-specific controls that actually stop spending, keep [Chapter 8](./08-avoid-surprise-bills.md) nearby.
