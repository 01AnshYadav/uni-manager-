# [Project Name TBD] — Branch Update & Resource Hub

*A one-page explainer to walk your friend through the what, why, how, and cost.*

## The problem

The branch WhatsApp group mixes two things that don't belong together:
- Chit-chat, memes, random messages
- Actually important stuff from the CR (exam dates, notes, deadlines, faculty changes)

Result: turn notifications on → drowned in noise. Turn them off → miss something important. Everyone in the batch feels this, which means everyone is a potential user on day one — no convincing needed, just a working alternative.

## What we're building (v1 — MVP)

A single lightweight web page + notification channel for our branch's 1st year (~80–90 students):

| Feature | What it does |
|---|---|
| **Live announcement feed** | CR posts updates in one place — separate from casual chat |
| **Priority tagging** | Every post is tagged **Urgent** (exam reschedule, today's deadline) or **Normal** (notes uploaded, FYI). Urgent = instant push. Normal = batched into one digest a day |
| **Resource section** | Shared notes, previous year papers, assignment files — searchable instead of buried 500 messages deep in a group |
| **Shared calendar** | Exam dates, submission deadlines, events — auto-reminders, no manual "don't forget" messages |
| **No login friction** | Just a shared link + WhatsApp/Telegram number to join — nothing to install for classmates |

## What we're explicitly *not* doing (v1)

- Not official — no teacher/college login, no admin backing yet
- Not replacing the WhatsApp group — that stays for chit-chat, we just pull the *important* stuff out of it
- Not building our own notification infrastructure — we ride on Telegram/WhatsApp Channels, which people already have open all day

## Tech stack

- **Frontend + backend**: Next.js (same stack as my CyberSync project — no new learning curve)
- **Database**: Supabase (free tier — plenty for 90 users)
- **Notifications**: Telegram bot (free, a few lines of Python/JS) or a WhatsApp Channel for broadcast-only posts
- **Hosting**: Vercel free tier

## Cost — v1, our branch only (~90 students)

| Item | Cost |
|---|---|
| Hosting (Vercel free tier) | ₹0 |
| Database (Supabase free tier) | ₹0 |
| Telegram bot | ₹0 |
| WhatsApp Channel | ₹0 |
| Custom domain (optional, for credibility) | ~₹500–1,000/year |
| **Total to launch** | **₹0–1,000** |

This is the whole point of starting small: proving the idea costs us basically nothing. No college approval, no budget request, no waiting.

## How we prove it before pitching anything official

1. **Launch to our branch only** — no announcement, just start posting real updates through it for 2–3 weeks
2. **Track real numbers**: how many of the 90 joined, how many actually open the urgent pings, how many use the resource section
3. **Collect a few real quotes**: "I found out the exam was postponed because of this" is worth more than any feature list
4. That evidence — not a demo — is what we'd eventually take to the HOD, Dean of Student Affairs, or T&P cell. Teachers won't adopt an unofficial tool; we don't need them to. We need *students* to use it and *data* that shows it.

## Future scope, if it works

- Scale to all first-year branches (~1,000 students) — at that point Google Workspace for Education (free for accredited institutions) becomes worth pursuing officially, since licensing is free once verified
- Add a resume/notes archive tied to placements, given both our interest in IT-sector jobs — this could double as a portfolio piece for internship/placement applications
- Possible official backing later: college domain, admin dashboard for CRs across branches, integration with T&P announcements

## Rough role split (adjust based on what your friend prefers)

- **You**: backend/data model (priority tagging, Supabase schema, bot logic)
- **Friend**: frontend UI + testing with classmates + driving actual adoption in the group

---
*This is a working plan, not a final spec — the goal right now is just getting it in front of our own 90 people and seeing what sticks.*
