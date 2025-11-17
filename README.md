<div align="center">

# 📦 File Drop

Secure, collaborative & shareable file management built with Next.js 15 + React 19.

_Personal storage • Teams • Public & password‑protected sharing • Bulk actions • Modern UI_

🔗 **Live Deployment:** https://file-share-topaz-kappa.vercel.app/

</div>

---

## ✨ Feature Overview

### 🔐 Authentication & Security
- Clerk-powered auth (social + email providers)
- Custom branded sign-in/sign-up pages (light/dark aware)
- Protected dashboard (App Router segment isolation)
- Session + route guards, access control (team leader vs member vs public)
- Password protection for shared files
- Webhook ready (user provisioning / future automation)

### 📁 Personal File Management
- Drag & drop & multi-file uploads
- File metadata persistence (MongoDB)
- Rename, delete (single + bulk)
- Bulk download (individual or single .zip via JSZip)
- Type filtering, search, grid/list toggle
- Storage usage bar with quota awareness

### 👥 Team Collaboration
- Create / join / leave teams
- Team workspace with full-width adaptive layout
- Add existing personal files to a team (no duplicate upload)
- Per-file ownership: only uploader can delete (enforced in bulk + single)
- Team bulk actions: multi-select download (.zip) & delete (permission-aware)
- Member roster + leader spotlight

### 🌍 Public & External Sharing
- Generate public collection links (multi-file public sets)
- Password protect shared assets
- Public download page with preview modes
- Share via email (Gmail SMTP via Nodemailer) & (optional) QR generation support

### 📨 Email & Notifications
- Transactional email template rendered server-side and delivered through Nodemailer (Gmail SMTP)
- Toast feedback (success / error / partial outcomes)

### 🧰 Advanced UX Enhancements
- Hydration-safe animations (randomized visual elements gated to client)
- Single global scrollbar (no nested scroll jank) with custom theming
- Accessible dialogs & focus management (Radix primitives)
- Selection toolbars, select-all toggles, skip indicators inside dialogs
- Permission feedback (lock icon + tooltip for non-deletable team files)

### 🗃️ Storage & Data
- File blobs stored via Vercel Blob
- Metadata in MongoDB (Mongoose models)
- Optional Supabase client (extensible for analytics/logging)

### 🛡️ Resilience & Validation
- Progressive bulk operations (loop with per-item try/catch)
- Partial success toasts (e.g. zip bundling skips failed items)
- Input sanitation & defensive checks for missing IDs

### 🛠️ Developer Experience

### 📊 Analytics & Insights (New)
- Profile dashboard with storage usage progress
- Recharts-based visualizations (pie + bar) for file type distribution
- File type breakdown cards with color legend
- Per-user storage & upload limit surfaced

### 🌐 Public Teams Directory (New)
- Dedicated Public Teams page with search & membership state
- Team leader toggle (card-level) to switch Public / Private instantly (optimistic update)
- Badge + switch UI for visibility state
- Join flow with disabled state + feedback toasts
- TypeScript throughout
- Modular service layer (`src/services/service.ts`)
- React Query caching + invalidation
- Central utility helpers (`src/utils/functions.ts`)
- Shadcn/UI component system + Tailwind v4

### 🚀 Performance & Future Hooks
- Turbopack dev server
- Potential for batch APIs (bulk delete optimization placeholder)
- Lazy client-only random visuals to avoid hydration mismatch

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript / React 19 |
| Styling | Tailwind CSS v4, Shadcn/UI, custom tokens, Lucide Icons |
| State/Data | React Query (TanStack) |
| Auth | Clerk |
| Storage | Vercel Blob (files), MongoDB (metadata) |
| Email | Nodemailer + Gmail SMTP |
| Zip | JSZip |
| Animations | motion / Framer Motion compatible API |
| Misc | nanoid, date-fns, qrcode-generator (optional), radix primitives |

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/         # Custom sign-in page
│   │   └── sign-up/         # Custom sign-up page
│   ├── (main)/              # Protected dashboard routes
│   │   └── dashboard/       # Main dashboard
│   ├── (public)/            # Public file sharing
│   ├── (share)/             # File sharing interface
│   ├── (website)/           # Landing page
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # Reusable UI components
│   └── emailtemplates/      # Email templates
├── database/
│   ├── mongodb/             # MongoDB schemas
│   └── supabase/            # Supabase client
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
├── services/                # External services
├── types/                   # TypeScript types
└── utils/                   # Helper functions
```

---

## ⚙️ Environment Variables

| Variable | Purpose |
|----------|---------|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk public key |
| CLERK_SECRET_KEY | Clerk server secret |
| NEXT_PUBLIC_CLERK_SIGN_IN_URL | Sign in route |
| NEXT_PUBLIC_CLERK_SIGN_UP_URL | Sign up route |
| NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL | Post-auth redirect |
| NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL | Post-auth redirect |
| MONGODB_URL | MongoDB connection string |
| NEXT_PUBLIC_SUPABASE_URL | Optional Supabase base URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase client key |
| BLOB_READ_WRITE_TOKEN | Vercel Blob RW token |
| GMAIL_USER | Gmail address used for SMTP |
| GMAIL_APP_PASSWORD | Gmail App Password (16-character code) |
| NEXT_PUBLIC_BASE_URL | Client base URL |
| BASE_URL | Server base URL |
| WEBHOOK_SECRET | Webhook signature secret |

> See `.env.local.example` for canonical list.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Clerk account
- Supabase account
- Vercel account (for blob storage)
- Gmail account with App Password (for emails)

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd file-sharing-app/File-Share
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy `.env.local.example` to `.env.local` and fill in your values:
   
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
   
   # Database
   MONGODB_URL=your_mongodb_connection_string
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # File Storage
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   
   # Email
   GMAIL_USER=your_gmail_address
   GMAIL_APP_PASSWORD=your_gmail_app_password
   
   # App Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   BASE_URL=http://localhost:3000
   WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Authentication Setup

1. Create a [Clerk](https://clerk.com) application
2. Configure allowed redirect URLs (local + production)
3. Set the auth route mappings in env vars
4. (Optional) Configure webhooks with `WEBHOOK_SECRET`

## 🎨 Theming & Customization

Modify CSS variables in `src/app/globals.css` (OKLCH palette) and extend utilities with Tailwind config. Component-level variations (buttons, dialogs, nav) derive from tokenized variables for consistency.

Auth pages are fully customizable under `(auth)` segment.

## 🔒 Security Highlights

- Clerk-managed sessions & JWT rotation
- Per-file password gating (optional)
- Team member vs leader authorization (delete restrictions)
- Server-side validation in API routes (narrowed inputs)
- Progressive error handling for bulk ops

## 🔌 API & Service Layer (Selected)

| Action | Function | Endpoint |
|--------|----------|----------|
| Upload single file metadata | `UploadFileDetails` | POST `/api/uploadfile` |
| Upload multiple metadata | `UploadMultipleFileDetails` | POST `/api/uploadfile` (loop client) |
| List user files | `getFileDetails` | GET `/api/getfiles?id=` |
| Delete file | `DeleteFileDetails` | DELETE `/api/deletefile?id=` |
| Bulk delete | `DeleteMultipleFileDetails` | DELETE `/api/deletefiles` |
| Rename file | `UpdateFileName` | PATCH `/api/rename` |
| Password update | `UpdatePassword` | PATCH `/api/password` |
| Send share email | `SendEmail` | POST `/api/sendemail` |
| Fetch user meta | `FetchUser` | GET `/api/fetchuser?id=` |
| Create team | `CreateTeam` | POST `/api/createteam` |
| Fetch teams | `FetchTeams` | POST `/api/fetchteams` |
| Fetch single team | `FetchTeam` | GET `/api/fetchteam?teamId=` |
| Join team | `JoinTeam` | PATCH `/api/jointeam` |
| Leave team | `LeaveTeam` | PATCH `/api/leaveteam` |
| Add file(s) to team | `UploadFilesToTeam` | POST `/api/uploadfileteam` |
| Delete team file | `DelteTeamFile` | DELETE `/api/deleteteamfile` |
| Upload public files | `UploadPublicFiles` | POST `/api/publicFileUpload` |
| Get public set | `GetPublicFiles` | GET `/api/fetchPublicFiles?uniqueId=` |

> Batch team deletion endpoint can be added later to optimize loops.

## 🧪 Testing & Quality

- Type checks: `npm run type-check`
- Lint: `npm run lint` (Tailwind + ESLint)
- Build verification: `npm run build`

## 🗺️ Roadmap (Planned / Suggested)

- [ ] Parallelized & throttled downloads with progress UI
- [ ] Public team discovery filters (members count, recently active)
- [ ] Profile export (CSV of file inventory)
- [ ] Server-side batch delete (team + personal) to reduce N API calls
- [ ] Zip streaming (avoid memory spikes on very large sets)
- [ ] File previews (image/pdf/video inline modal)
- [ ] Role tiers (admin/moderator within teams)
- [ ] Rate limiting & audit logs
- [ ] Virtualized large file lists
- [ ] Activity feed / notifications panel

## 🤝 Contributing

1. Fork + branch (`feat/your-feature`)
2. Install deps & run dev
3. Ensure lint & type check pass
4. Submit PR with concise description / screenshots

## 📄 License

MIT © Your Name

## ❤️ Acknowledgements

- Next.js / Vercel team
- Clerk authentication platform
- Shadcn/UI & Radix primitives
- Nodemailer community for SMTP tooling

---

Built with passion using modern web technologies.

> Have an idea or found an issue? Open a discussion / PR — contributions welcome!
