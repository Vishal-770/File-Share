# File Drop - Code Documentation

## Overview

File Drop is a modern, secure file sharing platform built with Next.js 15, featuring team collaboration, password protection, and public sharing capabilities. This document provides a comprehensive guide to the codebase structure and architecture.

## Architecture

### Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with Shadcn/ui components
- **Authentication**: Clerk with custom pages
- **Database**: MongoDB (primary), Supabase (public files)
- **File Storage**: Vercel Blob
- **Email**: Resend
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form
- **Deployment**: Vercel

### Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Authentication group
│   │   ├── layout.tsx      # Auth-specific layout
│   │   ├── sign-in/        # Custom sign-in page
│   │   └── sign-up/        # Custom sign-up page
│   ├── (main)/             # Protected routes group
│   │   └── dashboard/      # Main dashboard
│   │       ├── layout.tsx  # Dashboard layout with sidebar
│   │       ├── page.tsx    # Dashboard home
│   │       ├── files/      # File management
│   │       ├── teams/      # Team collaboration
│   │       ├── mail/       # Email features
│   │       └── settings/   # User settings
│   ├── (public)/           # Public routes group
│   │   └── public/         # Public file upload
│   ├── (share)/            # File sharing group
│   │   └── share/          # File sharing interface
│   ├── (website)/          # Landing page group
│   │   ├── page.tsx        # Homepage
│   │   └── contact/        # Contact page
│   ├── api/                # API routes
│   │   ├── createteam/     # Team management
│   │   ├── uploadfile/     # File upload
│   │   ├── getfiles/       # File retrieval
│   │   └── ...             # Other API endpoints
│   ├── favicon.ico         # App icon
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                # Shadcn/ui components
│   │   ├── button.tsx     # Button component
│   │   ├── card.tsx       # Card component
│   │   ├── dialog.tsx     # Dialog/modal component
│   │   └── ...            # Other UI components
│   ├── App-SideBar.tsx    # Main sidebar
│   ├── NavBar.tsx         # Navigation bar
│   ├── FileUpload.tsx     # File upload component
│   ├── FilePreview.tsx    # File preview component
│   └── emailtemplates/    # Email templates
├── database/              # Database configurations
│   ├── mongodb/           # MongoDB setup
│   │   ├── dbConnect.ts   # Database connection
│   │   └── models/        # Mongoose models
│   └── supabase/          # Supabase client
├── hooks/                 # Custom React hooks
│   └── use-mobile.ts      # Mobile detection hook
├── lib/                   # Utility libraries
│   ├── utils.ts           # General utilities
│   ├── constants.ts       # App constants
│   └── errors.ts          # Error handling
├── services/              # External services
│   └── service.ts         # API service functions
├── types/                 # TypeScript type definitions
│   └── FileType.ts        # Type definitions
└── utils/                 # Helper functions
    └── functions.ts       # Utility functions
```

## Key Features Implementation

### 1. Authentication (Clerk)

The app uses Clerk for authentication with custom pages:

#### Configuration
- Custom sign-in page: `/sign-in`
- Custom sign-up page: `/sign-up`
- Redirect after auth: `/dashboard`

#### Files
- `src/app/(auth)/sign-in/page.tsx` - Custom sign-in UI
- `src/app/(auth)/sign-up/page.tsx` - Custom sign-up UI
- `src/middleware.ts` - Route protection
- `.env.local` - Clerk configuration

### 2. File Management

#### Upload Process
1. Files uploaded via `FileUpload.tsx` component
2. Processed through `/api/uploadfile` endpoint
3. Stored in Vercel Blob storage
4. Metadata saved to MongoDB

#### File Types Supported
- Images: JPG, PNG, GIF, WebP, SVG
- Documents: PDF, DOC, DOCX, TXT, RTF
- Spreadsheets: XLS, XLSX, CSV
- Archives: ZIP, RAR, 7Z
- Audio/Video: MP3, MP4, AVI, etc.

### 3. Team Collaboration

#### Team Structure
- **Owner**: Full permissions, can delete team
- **Admin**: Manage members, upload/delete files
- **Member**: Upload files, view team files

#### Implementation
- Teams stored in MongoDB
- Member permissions managed per team
- Team files isolated from personal files

### 4. Public Sharing

#### Features
- Password protection
- QR code generation
- Download tracking
- Expiration dates

#### Implementation
- Public files stored in Supabase
- Share links: `/share/[fileId]`
- Password verification before download

### 5. Email Integration

#### Capabilities
- Send files via email
- Custom email templates
- File sharing notifications

#### Implementation
- Resend API for email delivery
- React Email for templates
- Email templates in `components/emailtemplates/`

## Database Schema

### MongoDB Collections

#### Files
```typescript
{
  _id: ObjectId,
  fileName: string,
  fileType: string,
  size: number,
  fileUrl: string,
  userId: string,
  teamId?: string,
  password?: string,
  isPublic: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Teams
```typescript
{
  _id: ObjectId,
  name: string,
  description: string,
  ownerId: string,
  members: [{
    userId: string,
    email: string,
    role: 'owner' | 'admin' | 'member',
    joinedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Supabase Tables

#### Public Files
```sql
CREATE TABLE public_files (
  id UUID PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  password TEXT,
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### File Management
- `GET /api/getfiles` - Retrieve user files
- `POST /api/uploadfile` - Upload new file
- `DELETE /api/deletefile` - Delete file
- `POST /api/rename` - Rename file

### Team Management
- `GET /api/fetchteams` - Get user teams
- `POST /api/createteam` - Create new team
- `DELETE /api/deleteteam` - Delete team
- `POST /api/jointeam` - Join team
- `POST /api/leaveteam` - Leave team

### Public Sharing
- `GET /api/fetchPublicFiles` - Get public files
- `POST /api/publicFileUpload` - Upload public file
- `POST /api/sendemail` - Send file via email

## Component Architecture

### Layout Components
- `RootLayout` - Global layout with Clerk provider
- `AuthLayout` - Authentication pages layout
- `DashboardLayout` - Protected pages layout with sidebar

### UI Components (Shadcn/ui)
- Consistent design system
- Accessible components
- Dark/light theme support
- Responsive design

### Custom Components
- `FileUpload` - Drag & drop file upload
- `FilePreview` - File preview with actions
- `App-SideBar` - Dashboard navigation
- `NavBar` - Main navigation

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom design tokens in `globals.css`
- Dark/light theme variables

### Theme Configuration
```css
/* Light theme */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... other variables */
}

/* Dark theme */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  /* ... other variables */
}
```

## Security

### Authentication
- Clerk handles user authentication
- JWT tokens for API requests
- Protected routes via middleware

### File Security
- Password protection for sensitive files
- Access control via team permissions
- Secure file URLs with expiration

### Data Validation
- Input sanitization on all forms
- File type and size validation
- SQL injection prevention

## Performance Optimization

### Next.js Features
- App Router for better performance
- Turbopack for faster development
- Image optimization
- Automatic code splitting

### Caching Strategy
- Static generation for landing pages
- Dynamic imports for components
- React Query for API caching

## Deployment

### Vercel Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopack: true
  },
  images: {
    domains: ['images.clerk.dev', 'your-blob-domain']
  }
}
```

### Environment Variables
- Development: `.env.local`
- Production: Vercel dashboard
- Required variables documented in `.env.local.example`

## Development Workflow

### Getting Started
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (optional)

### Testing Strategy
- Unit tests with Jest (to be implemented)
- Integration tests with Playwright (to be implemented)
- Manual testing for user flows

## Future Enhancements

### Planned Features
- Real-time collaboration
- File versioning
- Advanced search and filtering
- Mobile app
- API rate limiting
- Analytics dashboard

### Technical Improvements
- Server-side caching with Redis
- CDN integration for files
- Comprehensive test suite
- Performance monitoring
- Error tracking (Sentry)

## Troubleshooting

### Common Issues
1. **Authentication errors**: Check Clerk configuration
2. **File upload failures**: Verify Vercel Blob token
3. **Database connection**: Check MongoDB URL
4. **Email not sending**: Verify Resend API key

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check specific modules
DEBUG=clerk:* npm run dev
```

## Contributing

### Code Standards
- Use TypeScript for all new files
- Follow existing component patterns
- Add proper error handling
- Document complex functions
- Write meaningful commit messages

### Pull Request Process
1. Create feature branch
2. Implement changes
3. Add/update tests
4. Update documentation
5. Submit pull request

---

This documentation is a living document and should be updated as the codebase evolves.
