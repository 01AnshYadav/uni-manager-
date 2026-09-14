# Uni Manager — Full Project Context

You are helping me build a web application called **Uni Manager** for my college branch.

Your job is to understand the existing decisions and architecture before suggesting or changing anything. Do not redesign the project from scratch unless I explicitly ask you to.

---

## 1. Project Goal

Uni Manager is an unofficial student utility platform initially intended for approximately **90 students in our branch**.

The main problem:

Important academic information gets buried inside WhatsApp/group chats.

The goal is to create one simple place where students can quickly find:

* Important announcements
* Urgent notices
* Exams
* Assignments
* Events
* Calendar dates
* Notes/resources
* Daily class updates/logs

The WhatsApp group can continue being used for normal conversation. Uni Manager is meant to extract and organize the important academic information.

The first version is **not officially connected to the college**.

We want to launch it to our classmates first, use it for around **2–3 weeks**, collect real usage data/feedback, and potentially use that evidence later if we decide to approach the HOD/Dean/T&P cell.

We do NOT want to pitch only a demo. We want real usage data.

---

# 2. Current Product Decisions

These decisions have already been made and should be treated as the current requirements.

### Students

Students should be able to **read the platform without creating an account or logging in**.

The goal is zero-friction access.

Initially, approximately 90 students will use it.

There is also a student/join concept so students can be associated with the notification system, especially for Telegram.

---

### Admins

Only the following people should be able to create/upload academic content:

* CR
* Me
* My friend

There will therefore initially be **3 admin accounts**.

The CR has the `cr` role.

The other two have the `admin` role.

Students should NOT be able to create posts or upload resources.

This restriction must be enforced using **Supabase Row Level Security**, not merely by hiding buttons in the frontend.

---

# 3. Main Sections of the App

The current UI/product structure is:

## Feed

The Feed contains time-based information.

It includes:

* Announcements/posts
* Daily class logs

Posts can contain:

* Title
* Description/body
* Priority
* Category
* Optional event date

Priority:

* `urgent`
* `normal`

Urgent information is important enough to notify students immediately.

Normal information can be grouped into a daily digest.

Post categories:

* `exam`
* `assignment`
* `event`
* `general`

---

## Notes

**Notes/Resources is a permanent section in the application.**

This is an important clarification.

Notes should NOT behave like a temporary feed post.

It should have its own permanent navigation item/tab.

Students should always be able to open the Notes section and browse/search resources.

Examples:

* Class notes
* PDFs
* Previous papers
* Study material
* Reference material

Resources are organized by subject.

Only admins can upload resources.

Conceptually:

**Feed = time-based information**

**Notes = permanent resource library**

---

## Calendar

Calendar is another permanent section.

Relevant dates can come from posts that contain an `event_date`.

Examples:

* Exams
* Assignment deadlines
* College events
* Important academic dates

The calendar should provide a cleaner date-based view of important events rather than forcing students to search through the feed.

---

## Daily Class Log

A daily class log is also part of the product.

The purpose is to record what happened in class each day.

A log can contain:

* Date
* Subject
* Summary
* Photos

The current intended structure is approximately:

**One entry per subject per day.**

For example:

September 15:

* Mathematics — Integration completed
* Physics — Lab experiment
* Programming — Functions covered

This allows students who missed class to quickly understand what happened.

---

# 4. Notifications

Notifications are split based on priority.

## Urgent

Urgent posts should trigger an immediate notification.

Example:

> Exam tomorrow at 9 AM.

The planned notification platform is **Telegram**, using a Telegram bot.

We do NOT want to build custom notification infrastructure.

---

## Normal

Normal posts should NOT spam students.

They should be collected and sent as a **once-daily digest**.

Example:

> Today's Uni Manager Digest:
>
> * Assignment announced
> * New physics notes uploaded
> * Tomorrow's class event
> * Daily class updates

The exact Telegram implementation can be refined later, but the principle is:

**Urgent = immediate**

**Normal = daily batch**

---

# 5. Join Flow

There is a student join flow.

The basic idea:

Student receives a shared link → joins/registers with the notification system → can be associated with the Telegram bot.

Students should not need a complicated account system just to read Uni Manager.

The student database exists mainly to support this type of functionality and future usage tracking.

---

# 6. Technology Stack

The current stack is:

* **Next.js**
* **Supabase**
* **Vercel**
* **GitHub**
* **Telegram Bot**

The project is already using Next.js and Supabase.

Do not introduce another backend framework unless there is a strong reason.

The goal is to keep the architecture simple.

---

# 7. Collaboration Strategy

There are two developers:

* Me
* My friend

We have roughly equal skill levels.

We deliberately decided NOT to split the project into:

> "You do frontend, I do backend."

That would cause unnecessary dependencies and merge conflicts.

Instead, we are splitting the project by **feature/vertical slice**.

Each person should own a complete feature including:

* UI
* frontend logic
* Supabase queries
* backend/data logic
* feature-specific integration

This means each person can build and test their feature independently.

---

# 8. Planned Feature Split

## My side

I will primarily work on:

### Announcement Feed

Build:

* Feed page
* Post display
* Priority display
* Category display
* Event date
* Supabase post queries
* Admin post creation
* Urgent/normal handling
* Telegram notification integration

### Telegram Bot

The bot should eventually:

* Register/join students
* Associate Telegram users with students
* Send urgent announcements immediately
* Send normal announcements as a daily digest

---

## Friend's side

My friend will primarily work on:

### Shared Calendar

Build:

* Calendar UI
* Event/date display
* Reading event dates from posts
* Exam/deadline/event organization

### Resource / Notes Section

Build:

* Permanent Notes page
* Subject filtering
* Resource browsing
* File upload
* Resource metadata
* Supabase Storage integration if required

### UI Shell

My friend is also working on the general UI/UX shell.

This includes things such as:

* Navigation
* Layout
* Styling
* Shared components
* Overall visual structure

The feature pages should eventually fit into this shell.

---

# 9. Integration Strategy

Both developers should work against the **same Supabase project and same schema**.

We do NOT want:

Developer A → separate database

Developer B → separate database

and then try to merge databases later.

Instead:

GitHub repo
↓
Same codebase
↓
Same Supabase project
↓
Same database schema
↓
Separate feature branches
↓
Merge working vertical slices

The main integration point happens after both feature slices work independently.

---

# 10. Shared Setup That Must Be Done Together

Before serious feature development, both developers should agree on the database schema.

This is the most important shared dependency.

If the schema differs between developers, everything becomes harder to merge.

The shared setup is:

1. Supabase project
2. GitHub repository
3. Vercel project
4. Database schema
5. RLS policies
6. Admin authentication
7. Environment variable structure

After this, feature development can happen independently.

---

# 11. Supabase Architecture

The planned database has these tables:

1. `students`
2. `admins`
3. `posts`
4. `resources`
5. `daily_logs`

Supabase Auth handles admin authentication.

Students do not need Supabase Auth just to read public content.

---

# 12. Current Database Schema

The current proposed SQL is:

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_or_telegram text unique not null,
  joined_at timestamp default now()
);

create table admins (
  id uuid primary key references auth.users(id),
  name text not null,
  role text check (role in ('cr', 'admin'))
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  priority text not null check (priority in ('urgent', 'normal')),
  category text check (category in ('exam', 'assignment', 'event', 'general')),
  event_date date,
  created_by uuid references admins(id),
  created_at timestamp default now()
);

create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_url text not null,
  subject text not null,
  uploaded_by uuid references admins(id),
  created_at timestamp default now()
);

create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null,
  subject text,
  summary text,
  photo_urls text[],
  posted_by uuid references admins(id),
  created_at timestamp default now()
);
```

---

# 13. Row Level Security

RLS is important.

Students should be able to read:

* Posts
* Resources
* Daily logs

But only authenticated users who exist in the `admins` table should be able to insert content.

Current proposed RLS:

```sql
alter table posts enable row level security;
alter table resources enable row level security;
alter table daily_logs enable row level security;

create policy "public read posts"
on posts
for select
using (true);

create policy "public read resources"
on resources
for select
using (true);

create policy "public read logs"
on daily_logs
for select
using (true);

create policy "admins insert posts"
on posts
for insert
with check (
  auth.uid() in (select id from admins)
);

create policy "admins insert resources"
on resources
for insert
with check (
  auth.uid() in (select id from admins)
);

create policy "admins insert logs"
on daily_logs
for insert
with check (
  auth.uid() in (select id from admins)
);
```

Important:

Do not assume this is production-complete.

Before launch, review whether we also need:

* UPDATE policies
* DELETE policies
* admin role checks
* storage policies
* student insert policies
* better timestamp types
* constraints
* indexes
* unique constraints for daily logs
* security around Telegram/student registration

The above is the current starting point, not something that must never change.

---

# 14. Supabase Admin Authentication

There will be three real accounts:

1. CR
2. Me
3. Friend

Supabase Authentication will manage their login.

Current simple choice:

**Email + password**

Magic links can be considered later.

The admin users are created through:

Supabase Dashboard → Authentication → Users

Then each authentication user's UUID is inserted into:

`admins.id`

Example:

```text
auth.users
    |
    | UUID
    ↓
admins.id
```

This allows the database to determine whether the currently authenticated user is an admin.

---

# 15. Important Security Principle

Do NOT create a shared password/PIN such as:

> "All admins use password 1234"

That was rejected.

Each admin should have their own real Supabase Auth account.

Supabase Auth handles authentication.

RLS handles authorization.

Frontend UI should only provide convenience; it should NOT be the security boundary.

---

# 16. Supabase Setup Process

The intended initial setup is:

### Step 1 — Create Supabase project

Create one Supabase project for Uni Manager.

Use the free tier initially.

Choose a region appropriate for the users, preferably geographically reasonable for India.

---

### Step 2 — Add collaborator

Invite my friend to the Supabase project so both developers can work against the same backend.

---

### Step 3 — Create database tables

Open:

Supabase Dashboard → SQL Editor

Run the table schema.

Verify that these tables exist:

```text
students
admins
posts
resources
daily_logs
```

---

### Step 4 — Enable RLS

Enable RLS and create the policies.

Verify public users can read content.

Verify unauthenticated users cannot insert content.

Verify authenticated admins can insert content.

---

### Step 5 — Create admin users

Create:

* CR
* Me
* Friend

under Supabase Authentication.

---

### Step 6 — Link auth users to admins

Take each user's Supabase Auth UUID.

Insert it into the `admins` table with:

* name
* role

Example:

```text
id = Supabase Auth UUID
name = Ansh
role = admin
```

---

### Step 7 — Connect Next.js

Get:

* Supabase Project URL
* Supabase publishable/anon client key as appropriate for the project's current Supabase setup

Put them into local environment variables.

For example:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Do NOT commit real secret keys to GitHub.

If the current Supabase tooling/project recommends newer key naming, use the current official Supabase approach rather than blindly copying an old variable name.

---

### Step 8 — Vercel

Add the same required environment variables to the Vercel project.

Development:

```text
.env.local
```

Production:

```text
Vercel Environment Variables
```

---

# 17. Supabase Storage

Resources contain files such as:

* PDFs
* Notes
* Papers
* Images

Therefore, the final resource system will probably use:

**Supabase Storage**

rather than storing actual files directly inside PostgreSQL.

The database should store metadata and the appropriate file reference/path.

Example conceptual structure:

```text
Supabase Storage
    ↓
notes/
    ↓
physics/
    ↓
unit-1.pdf
```

And PostgreSQL stores metadata such as:

```text
title
subject
file path / URL
uploaded_by
created_at
```

Storage RLS/policies must also be configured correctly.

Do not assume that making the `resources` table public automatically makes Storage files secure.

---

# 18. Important Schema Considerations

Before finalizing production schema, review the current design.

For example, `daily_logs` currently allows multiple rows for the same:

```text
date + subject
```

But our product decision says:

> One entry per subject per day.

Therefore, the final database may need a unique constraint such as:

```text
unique(log_date, subject)
```

This should be discussed before production.

Similarly, consider whether subjects should eventually be represented by a dedicated table instead of free-form text.

Do not over-engineer v1 unnecessarily, though.

---

# 19. Current Development Status

The project is already an active Next.js project.

The repository currently contains the Next.js application and associated project files.

The current build has successfully passed:

```text
npm run build
```

with:

* Next.js 16.3.5
* Turbopack
* TypeScript compilation
* production build process

So this is NOT a greenfield project where we need to initialize Next.js from scratch.

There is already a working codebase.

---

# 20. Git Collaboration

We are using GitHub.

The goal is to avoid directly making unrelated changes on `main`.

Preferred workflow:

```text
main
│
├── feature/announcements
├── feature/telegram
├── feature/calendar
├── feature/resources
└── feature/ui
```

Each developer should work on their feature branch.

Before merging:

1. Pull latest main
2. Resolve conflicts locally if needed
3. Test
4. Build
5. Open PR
6. Review
7. Merge

Do not randomly overwrite another developer's work.

---

# 21. Vercel

Vercel will host the Next.js application.

There should be one shared Vercel project connected to the GitHub repository.

The production deployment should eventually point to the `main` branch.

Feature branches/PRs can use Vercel preview deployments.

This makes testing easier before merging.

---

# 22. Expected User Flow

A normal student should experience something like:

```text
Open shared Uni Manager link
        ↓
Feed
        ↓
See important announcements
        ↓
Open Notes when looking for study material
        ↓
Open Calendar for exams/deadlines
        ↓
Optionally join Telegram notifications
```

No mandatory account creation should block the student.

---

# 23. Admin Flow

Admin flow:

```text
Admin opens Uni Manager
        ↓
Login
        ↓
Admin dashboard
        ↓
Create announcement / upload notes / add daily log
        ↓
Supabase verifies authentication
        ↓
RLS verifies admin authorization
        ↓
Data stored in Supabase
        ↓
Relevant notification sent through Telegram
```

---

# 24. Example Announcement Flow

Example:

CR creates:

```text
Title:
Physics Mid-Sem Exam

Priority:
Urgent

Category:
Exam

Event Date:
2026-10-10
```

Supabase stores the post.

The Feed displays it.

Calendar can use the event date.

Telegram bot sends an immediate notification because priority is `urgent`.

---

# 25. Example Normal Post

Example:

```text
Title:
Assignment 2 uploaded

Priority:
Normal

Category:
Assignment
```

The post appears in Feed.

It should be included in the next daily Telegram digest rather than immediately spamming everyone.

---

# 26. Example Resource

Admin uploads:

```text
Title:
Physics Unit 1 Notes

Subject:
Physics

File:
physics-unit-1.pdf
```

File goes into Supabase Storage.

Metadata goes into:

`resources`

Students can open:

```text
Notes
  ↓
Physics
  ↓
Physics Unit 1 Notes
```

---

# 27. Example Daily Log

Admin adds:

```text
Date:
2026-09-15

Subject:
Programming

Summary:
Functions and basic modules were covered.

Photos:
[classroom photos]
```

Students can later look at the daily class record.

---

# 28. Product Philosophy

Keep v1 simple.

The target is not to build a huge college ERP.

We are building a focused student information/organization platform.

Priorities:

1. Extremely easy for students
2. Fast mobile experience
3. Reliable announcements
4. Useful permanent Notes section
5. Useful Calendar
6. Simple admin workflow
7. Reliable Telegram notifications
8. Secure admin permissions
9. ₹0-ish operating cost initially
10. Easy to maintain by two students

Avoid unnecessary features such as:

* Complex student profiles
* Chat system
* Social feed
* Complicated permissions
* AI features just for the sake of AI
* Payment systems
* Custom notification infrastructure
* Excessive analytics
* Over-engineered microservices

---

# 29. Target Timeline

Target:

**2–3 weeks to launch to approximately 90 classmates.**

Rough plan:

### Week 1

* Shared Supabase setup
* Authentication
* RLS
* Core UI
* Feed
* Notes
* Calendar
* Telegram foundation

### Following few days

* Integrate both feature slices
* Mobile testing
* Fix database/security issues
* Test Telegram notifications
* Test admin permissions
* Test uploads
* Test real student flow

### Launch

Release to the ~90 students.

Then run it for approximately 2–3 weeks.

Collect:

* Number of users
* Usage frequency
* Notes downloads/views
* Announcement views
* Telegram participation
* Feedback
* Student quotes
* Problems encountered

This becomes evidence for any future college pitch.

---

# 30. Your Role as AI Assistant

When helping me with this project:

### Always

* Understand the existing architecture first.
* Prefer incremental changes.
* Give exact commands when necessary.
* Explain what a command does if it affects the project.
* Preserve existing working features.
* Think about Supabase RLS/security.
* Consider mobile usability.
* Keep the architecture simple.
* Respect the two-developer feature split.
* Avoid creating merge conflicts.
* Test/build after significant changes.

### Before modifying database structure

Explain:

1. What changes
2. Why it is needed
3. What existing code could be affected
4. Whether a migration is required

Do not casually change the schema.

### Before making large code changes

Inspect the existing codebase and determine:

* Current folder structure
* Existing components
* Existing Supabase client setup
* Existing authentication implementation
* Existing routes
* Existing environment variables
* Existing UI components

Do not blindly generate a new architecture over the existing one.

---

# 31. Current Immediate Task

The immediate shared task is to finish the **Supabase foundation** before both developers work independently.

The desired order is:

```text
1. Shared Supabase project
        ↓
2. Shared GitHub repo
        ↓
3. Shared Vercel project
        ↓
4. Finalize database schema
        ↓
5. Create tables
        ↓
6. Enable RLS
        ↓
7. Create policies
        ↓
8. Create 3 admin Auth accounts
        ↓
9. Link Auth users → admins table
        ↓
10. Configure Storage for resources
        ↓
11. Configure local environment variables
        ↓
12. Connect Next.js
        ↓
13. Test public read access
        ↓
14. Test admin insert access
        ↓
15. Test unauthorized insert rejection
        ↓
16. Build feature slices
```

---

# 32. Important Warning for the AI

Do not assume the SQL above is perfect production schema.

Treat it as the **currently agreed starting point**.

Before we deploy to real students, help review:

* RLS
* Storage policies
* Auth
* Admin authorization
* UPDATE/DELETE permissions
* Telegram security
* Student registration
* Unique constraints
* Database indexes
* File access
* Environment variables
* Server/client Supabase usage
* Secrets

But don't derail development with unnecessary enterprise-level complexity.

The goal is a secure, simple v1 for ~90 students.

---

# 33. What I Want From You

Act as a technical teammate for Uni Manager.

When I ask:

> "What should I do next?"

Give me the next practical step, not a giant list of 50 things.

When I give you an error:

1. Understand the error
2. Identify the likely cause
3. Tell me exactly what to check
4. Give the smallest safe fix
5. Tell me how to verify it

When I ask for code:

* Match the existing project structure.
* Don't rewrite unrelated files.
* Don't invent dependencies unless necessary.
* Keep changes focused.

When I ask for Supabase help:

* Explain the database/auth/RLS relationship clearly.
* Give exact SQL when appropriate.
* Warn me before destructive operations.
* Prefer migrations/reversible changes when possible.

When I ask about Git:

* Keep the two-person workflow in mind.
* Avoid changes that will overwrite my friend's work.

---

## Final Mental Model

Think of Uni Manager as:

```text
                    UNI MANAGER
                         │
          ┌──────────────┼──────────────┐
          │              │              │
        Feed           Notes         Calendar
          │              │              │
     ┌────┴────┐      Resources      Events
     │         │
 Announcements Daily Logs
     │
 ┌───┴────┐
Urgent   Normal
  │         │
Instant   Daily
Telegram  Digest
```

Backend:

```text
                    Supabase
                       │
       ┌───────────────┼────────────────┐
       │               │                │
   PostgreSQL       Auth             Storage
       │               │                │
 ┌─────┼─────┐     3 Admins        Notes/Papers
 │     │     │
Posts Resources Daily Logs
 │
Students
```

Hosting:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
Supabase
```

The core principle is:

**Students read easily. Admins publish securely. Urgent information gets attention. Notes remain permanently useful. Calendar organizes dates. Telegram handles notifications. Two developers build independent feature slices against one shared backend.**
