# Portfolio CMS & Showcase

A modern, full-stack developer portfolio and Content Management System (CMS) built with **Next.js**, **Supabase**, and **Tailwind CSS**.

This portfolio allows you to elegantly showcase your professional experience, educational background, projects, and technical blog—all fully manageable through a secure, built-in Admin Dashboard.

## 🚀 Features

- **Dynamic Homepage**: Features an animated hero section, a timeline for your Professional Experience and Academic Background, and a skills showcase.
- **Projects Gallery**: Display your work with support for multiple images/videos (auto-playing hover slideshows), multiple repositories, and detailed rich-text write-ups.
- **Technical Blog**: Publish technical articles with a built-in rich-text editor, custom cover images, and publish dates.
- **Dedicated Contact Page**: A clean, accessible page for visitors to reach out.
- **Admin Dashboard**: A hidden, secure admin portal (`/admin/login`) to manage everything without touching code.
  - *Secret Access*: Click your logo/name in the Navbar 5 times rapidly to jump to the admin login.
- **Rich Text Editing**: Built-in TipTap editor for writing blog posts, project descriptions, and milestone details (supports bullet points, bold/italic, and code blocks).

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, ISR for high performance)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism, custom micro-animations, dark mode)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Scroll-reveal and layout transitions)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Storage Buckets, Authentication)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Rich Text**: [TipTap](https://tiptap.dev/)

## 📂 Database Schema

The backend uses PostgreSQL (via Supabase) with the following core tables:
1. `profiles`: Links to Supabase Auth to manage admin privileges.
2. `site_settings`: Stores global settings like your Hero headline and Profile Photo.
3. `projects`: Stores portfolio projects, media gallery JSON arrays, tech stacks, and dates.
4. `posts`: Stores blog articles with rich-text content and publish toggles.
5. `experiences`: Tracks professional career history for the homepage timeline.
6. `education`: Tracks academic milestones for the homepage timeline.
7. `contact_messages`: Stores messages submitted through the contact form, with read/unread status.

*(See `supabase/schema.sql` for the complete final schema).*

## 🏁 Getting Started

First, install dependencies:
```bash
npm install
```

Set up your environment variables by creating a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Admin Access
To access the CMS dashboard locally:
1. Go to `http://localhost:3000/admin/login`
2. Log in with your Supabase auth credentials.
3. Manage your content under the Projects, Blog Posts, Experiences, Education, and Site Settings tabs.

---
*Designed & Built by Bhanura Waduge*
