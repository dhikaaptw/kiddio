# Kiddio — AI-Powered Parenting Companion

Kiddio is an AI-powered parenting companion web application that helps parents navigate parenting with personalized information, practical tips, and compassionate support.

---

## Table of Contents

- [Project Description](#project-description)
- [Main Features](#main-features)
- [Tech Stack](#tech-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Deployment](#deployment)

---

## Project Description

Kiddio is designed as an AI-based parenting assistant that can be accessed anytime. Parents can ask about child development, nutrition, health, and behavioral guidance — all answered by AI with a communication style personalized to the user's preferences.

---

## Main Features

| Feature | Description |
|---|---|
| **AI Chat** | Real-time conversations powered by Google Gemini 2.5 Flash |
| **Child Profile Personalization** | Input child name and age for more relevant responses |
| **AI Communication Style** | 3 selectable styles: Casual, Empathetic, Precise |
| **Chat History** | All conversation sessions are saved and accessible anytime |
| **Quick Topics** | Shortcut topics such as Sleep Tips, Nutrition, Health, etc. |
| **Settings** | Manage child profile, AI preferences, and account settings |
| **JWT Authentication** | Register, login, and protected routes using token-based authentication |

---

## Tech Stack

### Frontend & Backend
- [Next.js 16](https://nextjs.org/) — App Router, Server & Client Components
- [React 19](https://react.dev/) — UI library
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first CSS framework
- [Lucide React](https://lucide.dev/) — Icon library

### Database & ORM
- [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- [Prisma v7](https://www.prisma.io/) — ORM with `@prisma/adapter-pg`

### AI
- [Google Gemini API](https://ai.google.dev/) — Using the `gemini-2.5-flash` model

### Authentication
- [JWT (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Password hashing

### Deployment
- [Vercel](https://vercel.com/)

---

## Application Architecture

```txt
Browser (Client)
      │
      ▼
Next.js App Router
  ├── /app                  ← Pages (Client Components)
  │     ├── page.tsx        ← Landing page
  │     ├── login/          ← Login page
  │     ├── register/       ← Register page
  │     ├── onboarding/     ← Initial child profile setup
  │     ├── home/           ← Main dashboard
  │     ├── chat/           ← AI chat page
  │     └── settings/       ← Profile & preference settings
  │
  ├── /app/api              ← API Routes (Server-side)
  │     ├── auth/           ← Login & Register
  │     ├── chats/          ← Chat sessions & messages CRUD
  │     ├── children/       ← Child profile
  │     └── users/          ← User profile
  │
  └── /lib
        ├── prisma.ts       ← Prisma client singleton
        └── auth.ts         ← JWT helper (getUserIdFromRequest)
          │
          ▼
    PostgreSQL (Supabase)
          │
          ▼
    Google Gemini API
```

---

## Project Structure

```txt
kiddio/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── chats/
│   │   │   ├── [id]/
│   │   │   │   ├── messages/route.ts
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── children/
│   │   │   ├── [id]/route.ts
│   │   │   └── route.ts
│   │   └── users/route.ts
│   ├── chat/page.tsx
│   ├── home/page.tsx
│   ├── login/page.tsx
│   ├── onboarding/page.tsx
│   ├── register/page.tsx
│   ├── settings/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── Navbar.tsx
├── lib/
│   ├── auth.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── images/
├── next.config.ts
├── postcss.config.mjs
├── prisma.config.ts
├── tailwind.config (via globals.css)
└── tsconfig.json
```

---

## User Flow

```txt
1. Register / Login
        ↓
2. Onboarding
   (input child name, age, and AI style)
        ↓
3. Home — choose a Quick Topic or start a free chat
        ↓
4. Chat — ask questions and receive AI responses
        ↓
5. Settings — update child profile or AI style anytime
```

---

## AI & Personalization

AI responses are generated using **Google Gemini 2.5 Flash** with system prompts customized based on:

- **Child's name & age** — for age-appropriate and relevant responses
- **Selected AI communication style**:
  - `Casual` — like talking to a knowledgeable friend
  - `Empathetic` — warm, supportive, and emotionally validating before giving advice
  - `Precise` — direct, structured, and efficient

Conversation history is sent to the Gemini API on every request to maintain chat context.

> ⚠️ Kiddio is not a substitute for professional medical advice or healthcare providers.

---

## Deployment

The application is deployed on **Vercel** with the following configuration:

- Framework Preset: Next.js
- Environment Variables: configured through the Vercel Dashboard
- Database: Supabase PostgreSQL (connected using `@prisma/adapter-pg`)

## Demo Link

https://kiddio-jwpv-1hnk4c7qw-dhikaaptws-projects.vercel.app
