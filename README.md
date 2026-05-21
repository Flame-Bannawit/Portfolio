# 🚀 Bannawit Chaichomphu — Portfolio

> Personal portfolio website of Bannawit Chaichomphu, Computer Engineering graduate from Rangsit University.

🌐 **Live:** [portfolio-sigma-sage-8nfhj05bav.vercel.app](https://portfolio-sigma-sage-8nfhj05bav.vercel.app)

---

## ✨ Features

- 🌗 Dark / Light mode (Racing orange & Corporate blue theme)
- 🌏 Bilingual support (TH / EN) with fallback logic
- 🎠 3D perspective carousel on homepage
- 📱 Fully responsive (Desktop, Tablet, Mobile)
- 🔐 Admin panel with Supabase Auth
- 📊 Page view analytics dashboard
- 🖼️ Project & Certificate management via Admin CMS
- ⚡ Smooth animations & scroll reveal

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 + CSS Variables |
| **UI** | shadcn/ui + Radix UI + Lucide React |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + RLS) |
| **Animation** | Framer Motion + CSS animations |
| **Charts** | Recharts |
| **Deployment** | Vercel |

---

## 📁 Project Structure
src/
├── app/
│   ├── (client)/          # Public pages
│   │   ├── page.tsx       # Home
│   │   ├── projects/      # Projects + [slug]
│   │   ├── certificates/  # Certificates
│   │   └── about/         # About Me
│   ├── admin/             # Admin panel
│   │   ├── page.tsx       # Dashboard
│   │   └── login/         # Auth
│   └── globals.css        # Design tokens
├── components/
│   ├── home/              # Hero, Carousel, HScroll
│   ├── nav/               # Navbar
│   ├── admin/             # ProjectForm, CertForm
│   └── shared/            # Providers
├── lib/
│   ├── supabase/          # Client, Server, Queries
│   └── i18n/              # TH/EN strings
└── types/                 # TypeScript types

---

## 🗄️ Database Schema (Supabase)

```sql
projects        — Project data + metadata
project_tech    — Tech stack per project (TH/EN notes)
certificates    — Certificate data
tech_stacks     — Master tech list (filterable by category)
page_views      — Analytics tracking
profiles        — Admin user profiles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/Flame-Bannawit/Portfolio.git
cd Portfolio

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Run Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ครับ

---

## 👤 Admin Setup

1. สร้าง user ใน Supabase Authentication
2. รัน SQL เพื่อตั้งเป็น admin:

```sql
insert into profiles (id, email, is_admin)
values ('YOUR_USER_ID', 'your@email.com', true);
```

3. Login ที่ `/admin/login`

---

## 📄 Pages

| Path | Description |
|---|---|
| `/` | Home — Hero + 3D Carousel + Featured work |
| `/projects` | All projects with filter |
| `/projects/[slug]` | Project detail |
| `/certificates` | Certificates list |
| `/about` | About me — Education, Experience, Skills |
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login |

---

## 🎨 Design System

### Dark Mode (Racing)
- Primary: `#ff5b1f` (Racing orange)
- Background: `#0a0a0c`
- Accent: `#e11d48`

### Light Mode (Corporate)
- Primary: `#1d4ed8` (Blue-700)
- Background: `#f6f8fc`
- Accent: `#0ea5e9`

---

## 📝 License

MIT License — feel free to use as inspiration for your own portfolio!

---

<div align="center">
  <p>Designed & Built with ❤️ by <strong>Bannawit Chaichomphu</strong></p>
  <p>
    <a href="https://portfolio-sigma-sage-8nfhj05bav.vercel.app">🌐 Website</a> ·
    <a href="https://github.com/Flame-Bannawit">💻 GitHub</a>
  </p>
</div>
