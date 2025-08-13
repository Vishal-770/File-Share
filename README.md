# File Drop - Secure File Sharing Platform

A modern, secure file sharing platform built with Next.js 15, featuring team collaboration, password protection, and public sharing capabilities with custom authentication pages.

## ✨ Features

### 🔐 **Secure Authentication**
- Custom branded login/signup pages with theme support
- Social authentication (Google, GitHub, etc.)
- Secure session management with Clerk
- Proper routing with catch-all authentication routes

### 📁 **File Management**
- Personal file storage and organization
- Drag & drop file uploads
- File renaming and deletion
- Multiple file format support

### 👥 **Team Collaboration**
- Create and manage teams
- Share files within teams
- Team member management
- Collaborative workspaces

### 🔗 **Public Sharing**
- Public file upload links
- Password-protected files
- Temporary file sharing
- QR code generation for easy sharing

### 🎨 **Modern UI/UX**
- Dark/Light mode support with theme-aware authentication
- Responsive design
- Beautiful animations with Framer Motion
- Custom UI components with Radix UI

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui, Lucide Icons
- **Authentication**: Clerk
- **Database**: MongoDB, Supabase
- **File Storage**: Vercel Blob
- **Email**: Resend
- **Deployment**: Vercel

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Clerk account
- Supabase account
- Vercel account (for blob storage)
- Resend account (for emails)

### Installation

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
   RESEND_API_KEY=your_resend_api_key
   
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

## 📝 Configuration

### Authentication Setup

1. Create a [Clerk](https://clerk.com) account
2. Set up your application with the following settings:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

## 🎨 Customization

### Theme Configuration

The app supports light/dark themes. Customize colors in:
- `src/app/globals.css` - CSS variables
- `tailwind.config.js` - Tailwind theme

### Authentication Styling

Customize Clerk components in:
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(auth)/sign-up/page.tsx`

## 🔒 Security Features

- **Authentication**: Secure login with Clerk
- **File Protection**: Password-protected sharing
- **Access Control**: Team-based permissions
- **Data Validation**: Input sanitization and validation
- **Secure Storage**: Encrypted file storage

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables**
3. **Deploy**

The app will be automatically deployed with optimizations.

---

Built with ❤️ using Next.js and modern web technologies
