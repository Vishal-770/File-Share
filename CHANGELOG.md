# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-08-13

### ✨ Added
- **Custom Authentication Pages**: Complete redesign of login/signup with custom UI
- **Theme-Aware Authentication**: Dark/light mode support for Clerk components
- **Catch-All Routes**: Proper routing structure for authentication (`[[...rest]]`)
- **Enhanced TypeScript Support**: Better type definitions and error handling
- **Comprehensive Documentation**: Updated README with detailed setup instructions
- **Environment Template**: Added `.env.example` for easy setup
- **Utility Functions**: Added validation helpers and constants
- **Error Handling**: Improved error handling with custom utilities

### 🔧 Fixed
- **Nested Anchor Tags**: Resolved hydration errors in navigation components
- **Clerk Configuration**: Fixed routing issues with authentication components
- **Theme Integration**: Proper CSS variables for theme consistency
- **Navigation Structure**: Cleaner navbar without nested link issues

### 🎨 Improved
- **UI/UX**: Better visual design for authentication pages
- **Code Organization**: Cleaner file structure and better separation of concerns
- **Performance**: Optimized component rendering and reduced bundle size
- **Accessibility**: Better keyboard navigation and screen reader support

### 🚀 Enhanced
- **Authentication Flow**: Seamless redirect handling after login/signup
- **Mobile Experience**: Responsive design improvements for all devices
- **Development Experience**: Better error messages and debugging tools
- **Security**: Enhanced security configurations and best practices

## [1.0.0] - 2025-01-13

### Added
- 🎉 Initial release of File Drop
- 🔐 Custom authentication pages with Clerk integration
- 📁 Personal file management with upload, rename, delete capabilities
- 👥 Team collaboration with role-based permissions
- 🔒 Password-protected file sharing
- 🌐 Public file sharing with QR codes
- 📧 Email file sharing with custom templates
- 🎨 Modern UI with dark/light theme support
- 📱 Responsive design for all devices
- ⚡ Built with Next.js 15 and Turbopack for fast performance

### Security
- JWT-based authentication
- File password protection
- Team-based access control
- Input validation and sanitization

### Technical
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS with Shadcn/ui components
- MongoDB for data storage
- Supabase for public files
- Vercel Blob for file storage
- Resend for email delivery

## [Unreleased]

### Planned
- Real-time collaboration features
- File versioning system
- Advanced search and filtering
- Mobile application
- API rate limiting
- Analytics dashboard
- Performance monitoring
- Comprehensive test suite

---

## Release Notes Format

### Added
- New features

### Changed
- Changes in existing functionality

### Deprecated
- Soon-to-be removed features

### Removed
- Now removed features

### Fixed
- Bug fixes

### Security
- Security improvements
