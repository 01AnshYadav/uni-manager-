# 🎓 Uni Manager

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=700&lines=Your+College%2C+One+Place.;Announcements.+Resources.+Events.;Built+for+Students%2C+by+Students.">
</p>

<p align="center">
  <b>A modern digital hub for managing college life.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js">
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/01AnshYadav/uni-manager-?style=flat-square">
  <img src="https://img.shields.io/github/forks/01AnshYadav/uni-manager-?style=flat-square">
  <img src="https://img.shields.io/github/last-commit/01AnshYadav/uni-manager-?style=flat-square">
</p>

---

## ✨ What is Uni Manager?

College information is usually scattered across **WhatsApp groups, Telegram chats, PDFs, Google Drive links and random messages**.

**Uni Manager brings it together.**

> 📢 Announcements
> 📚 Study Resources
> 📅 Events & Calendar
> 📝 Daily Updates
> 👥 Student Community

The goal is simple:

### **Less searching. More doing.**

---

## 🚀 Features

| Feature                     | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| 📢 **Announcements**        | Important college updates in one central feed         |
| 🚨 **Priority System**      | Separate urgent announcements from normal updates     |
| 📚 **Resources**            | Upload and access notes, PDFs and study material      |
| 📅 **Events**               | Keep track of important academic and college events   |
| 📝 **Daily Logs**           | Share daily academic updates with the batch           |
| 👥 **Students**             | Maintain the student community                        |
| 🔐 **Authentication**       | Protected access for authorized users                 |
| 🛡️ **Role-Based Access**   | Different permissions for Admins, CRs and students    |
| 🤖 **Telegram Integration** | Designed for instant urgent alerts and normal digests |

---

## 🧠 Why Uni Manager?

Most college communication looks something like this:

```text
WhatsApp
   ↓
500 messages
   ↓
"Guys did anyone see the assignment?"
   ↓
Someone sends a PDF
   ↓
PDF gets buried
   ↓
"Can someone send it again?"
```

### Uni Manager:

```text
                 🎓 UNI MANAGER
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
     📢 Posts       📚 Resources    📅 Events
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                Everything in
                  one place.
```

---

## 🏗️ Architecture

```text
                         ┌─────────────────┐
                         │    Students     │
                         └────────┬────────┘
                                  │
                                  ▼
                       ┌────────────────────┐
                       │     Next.js App    │
                       │   Frontend + API   │
                       └─────────┬──────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
           🔐 Auth          📊 Database       📦 Storage
                 │               │               │
                 └───────────────┼───────────────┘
                                 ▼
                         ┌───────────────┐
                         │   Supabase    │
                         └───────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* ⚡ **Next.js**
* 🔷 **TypeScript**
* 🎨 **Tailwind CSS**
* 🧩 **React**

### Backend

* 🔥 **Next.js API Routes**
* 🟢 **Supabase**
* 🔐 **Supabase Authentication**
* 🗄️ **PostgreSQL**
* 📦 **Supabase Storage**

### Development

* 🐙 **Git & GitHub**
* 💻 **VS Code**
* 🧪 **ESLint**
* 📦 **npm**

---

## 🔐 Role-Based Access

Uni Manager isn't just a frontend.

Permissions are enforced on the backend.

```text
                    👤 USER
                      │
                      ▼
                 🔐 AUTHENTICATE
                      │
              ┌───────┴───────┐
              ▼               ▼
           Student          Staff
              │               │
              │          ┌────┴────┐
              │          ▼         ▼
              │         CR       Admin
              │          │         │
              ▼          ▼         ▼
           READ       WRITE      FULL ACCESS
```

### Current roles

**👨‍🎓 Student**

* View announcements
* Access resources
* View updates

**📣 CR**

* Create announcements
* Manage students
* Manage relevant academic content

**🛡️ Admin**

* Full administrative access
* Manage announcements
* Manage students
* Manage resources
* Administrative operations

---

## 📂 Project Structure

```text
uni-manager/
│
├── app/
│   ├── api/
│   │   ├── posts/
│   │   ├── resources/
│   │   ├── daily-logs/
│   │   └── students/
│   │
│   ├── auth/
│   └── ...
│
├── components/
│
├── lib/
│   └── supabase/
│       ├── auth.ts
│       ├── queries.ts
│       └── types.ts
│
├── public/
│
├── plan.md
├── package.json
└── README.md
```

---

## 🗄️ Database

The backend currently revolves around these core entities:

```text
┌──────────────┐
│    admins    │
└──────┬───────┘
       │
       │ creates
       ▼
┌──────────────┐
│    posts     │
└──────────────┘

┌──────────────┐
│  resources   │
└──────────────┘

┌──────────────┐
│ daily_logs   │
└──────────────┘

┌──────────────┐
│   students   │
└──────────────┘
```

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/01AnshYadav/uni-manager-.git
cd uni-manager-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Add your Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit `.env.local` or expose secret keys.

### 4. Start development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 5. Build for production

```bash
npm run build
```

---

## 🧪 Development

Check the project before pushing:

```bash
npm run lint
npm run build
```

Then:

```bash
git status
git add .
git commit -m "your message"
git push
```

---

## 🛣️ Roadmap

### ✅ Completed

* [x] Next.js foundation
* [x] Supabase integration
* [x] Authentication structure
* [x] Database schema
* [x] Role-based authorization
* [x] Posts API
* [x] Resources API
* [x] Daily logs API
* [x] Students API
* [x] Supabase Storage setup

### 🔨 In Progress

* [ ] Complete frontend
* [ ] Connect UI to API
* [ ] Announcement dashboard
* [ ] Resource management UI
* [ ] Student management UI
* [ ] Calendar interface

### 🔮 Planned

* [ ] Telegram bot
* [ ] Urgent notification system
* [ ] Normal announcement digest
* [ ] Better mobile experience
* [ ] Search
* [ ] Notifications
* [ ] Analytics
* [ ] More automation

---

## 🤝 Contributing

Uni Manager is being built with a simple philosophy:

> **Build useful things, learn while building them.**

If you're working on the project:

1. Create a branch

```bash
git checkout -b feature/your-feature
```

2. Make your changes

3. Test them

```bash
npm run lint
npm run build
```

4. Commit

```bash
git commit -m "feat: add your feature"
```

5. Push

```bash
git push origin feature/your-feature
```

6. Open a Pull Request 🚀

---

## 👨‍💻 Built By

<table>
<tr>
<td align="center">
<a href="https://github.com/01AnshYadav">
<img src="https://github.com/01AnshYadav.png" width="100px;" alt="Ansh"/>
<br />
<b>Ansh Yadav</b>
</a>
<br />
<sub>Developer</sub>
</td>
</tr>
</table>

---

## 💡 Vision

Uni Manager isn't trying to replace every tool students use.

It's trying to solve one annoying problem:

### **"Where was that information again?"**

One announcement.

One resource.

One event.

One place.

---

<p align="center">

### 🎓 Built for students. Built to scale. Built to be useful.

**Made with ❤️ and way too much debugging.**

</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=6366F1&height=100&section=footer">
</p>
