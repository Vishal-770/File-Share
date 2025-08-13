# Contributing to File Drop

Thank you for your interest in contributing to File Drop! This guide will help you get started.

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Local Setup
1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/file-drop.git
   cd file-drop/File-Share
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Fill in your environment variables
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Code Standards

### TypeScript
- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` type - use `unknown` instead
- Use strict type checking

### React/Next.js
- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router patterns
- Implement proper error boundaries

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design
- Support dark/light themes

### File Organization
```
components/
├── ui/           # Reusable UI components
├── forms/        # Form components
├── layout/       # Layout components
└── feature/      # Feature-specific components
```

## Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/tool changes

### Examples
```bash
feat(auth): add custom login page with Clerk integration

- Create custom sign-in and sign-up pages
- Update middleware for proper redirects
- Add authentication styling

Closes #123
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow code standards
   - Add proper error handling
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide clear description
   - Reference related issues
   - Add screenshots if UI changes

## Code Review

### What We Look For
- Code quality and readability
- Proper error handling
- Security considerations
- Performance implications
- Accessibility compliance

### Review Process
1. Automated checks (linting, type checking)
2. Manual code review
3. Testing on different devices/browsers
4. Security review for sensitive changes

## Testing

### Manual Testing
- Test on different screen sizes
- Verify dark/light theme
- Test authentication flows
- Check file upload/download
- Verify team collaboration features

### Future Testing
We plan to implement:
- Unit tests with Jest
- Integration tests with Playwright
- End-to-end testing

## Documentation

### When to Update Docs
- New features or API changes
- Configuration changes
- Breaking changes
- Bug fixes that affect usage

### Documentation Files
- `README.md` - Project overview and setup
- `ARCHITECTURE.md` - Technical documentation
- `CONTRIBUTING.md` - This file
- Code comments for complex logic

## Issue Reporting

### Bug Reports
Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos
- Browser/OS information
- Error messages/logs

### Feature Requests
Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Implementation complexity estimate

## Getting Help

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)

### Contact
- Open an issue for bugs/features
- Join our Discord for questions
- Email for security concerns

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to maintainer team (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to File Drop! 🚀
