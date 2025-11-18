# Premium Developer Portfolio

## Overview

This is a world-class, modern developer portfolio built with a premium, minimalist design approach. The application showcases projects with AI-generated visuals, features a three-page structure (About, Work, Contact), and emphasizes typography-first layouts with generous whitespace. The project follows Swiss minimalism principles combined with modern developer portfolio references (Linear, Vercel, Stripe).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React 19 with Vite as the build tool
- Wouter for client-side routing (lightweight alternative to React Router)
- Three main pages: About (`/`), Work (`/work`), and Contact (`/contact`)
- Full TypeScript support with strict mode enabled

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS 4 with custom design tokens and CSS variables
- Components configured in `components.json` with New York style preset
- Custom theme system supporting light/dark modes via CSS variables

**Design System**
- Typography-first approach using Inter font from Google Fonts
- Swiss minimalism aesthetic with generous whitespace
- Defined spacing primitives: 4, 8, 12, 16, 20, 24, 32px units
- Custom color palette using HSL format with alpha value support
- Consistent border radius system (sm: 3px, md: 6px, lg: 9px)

**State Management & Data Fetching**
- TanStack Query (React Query) v5 for server state management
- Custom query client with infinite stale time and disabled refetching
- Form state managed via React Hook Form with Zod validation
- Theme state persisted to localStorage

**Animation & Interactions**
- Framer Motion 11 for page transitions and micro-interactions
- Premium hover effects and elevation system (`hover-elevate`, `active-elevate-2`)
- Smooth scroll behavior and backdrop blur effects
- Staggered animations for project cards

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- Vite development server integration with HMR support
- Custom middleware for request logging and JSON parsing

**Storage Layer**
- In-memory storage implementation (`MemStorage`) for development
- Database schema defined using Drizzle ORM with PostgreSQL dialect
- Prepared for Neon serverless PostgreSQL integration
- Schema includes projects table with support for case studies, tags, and image URLs

**API Design**
- RESTful endpoints under `/api` prefix
- Project management: GET `/api/projects`, GET `/api/projects/:id`
- Image generation: POST `/api/projects/:id/generate-image`
- Contact form: POST `/api/contact`
- Resume data: GET `/api/resume`, GET `/api/resume/download`
- Hero background: GET `/api/images/hero-background`

**Data Models**
- **Projects**: id, title, description, tags[], palette[], deviceFrames[], caseStudy (problem, approach, result), imageUrl, featured
- **ContactForm**: name, email, message (validated with Zod)
- **ResumeData**: name, role, bio, experience[], skills[], social links

### External Dependencies

**AI Integration - OpenAI**
- DALL-E 3 for AI-generated project hero images
- Image generation with configurable size and quality parameters
- Prompt engineering system for project visuals, backgrounds, and PDF covers
- Graceful degradation when API key is not configured
- In-memory caching to prevent redundant API calls

**Database - PostgreSQL (Neon)**
- Configured via `DATABASE_URL` environment variable
- Drizzle ORM for type-safe database queries
- Migration system via `drizzle-kit` (migrations stored in `/migrations`)
- Schema definition in `shared/schema.ts` using pg-core

**UI Libraries**
- Radix UI primitives (20+ component primitives)
- Tailwind CSS with autoprefixer via PostCSS
- class-variance-authority for component variant management
- clsx and tailwind-merge for className utilities

**Development Tools**
- Replit-specific plugins: vite-plugin-runtime-error-modal, cartographer, dev-banner
- TypeScript with strict mode and ES modules
- Path aliases: `@/` (client/src), `@shared/` (shared), `@assets/` (attached_assets)

**Email & Contact**
- Prepared for React Email + Resend integration (implementation pending)
- Contact form validation using Zod schemas
- Toast notifications for user feedback

**Build & Deployment**
- Vite for frontend bundling (output to `dist/public`)
- esbuild for server bundling (ESM format)
- Production build combines both client and server
- Optimized for Vercel deployment with Analytics and Speed Insights support

**Package Management**
- PNPM as the package manager for speed and efficiency
- Lockfile version 3 with comprehensive dependency tree