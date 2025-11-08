# SEO Meta Tag Analyzer

## Overview

This is an SEO Meta Tag Analyzer web application that allows users to analyze and validate SEO meta tags for any website URL. The application fetches a webpage, extracts meta tags, validates them against SEO best practices, and provides visual previews of how the page appears in Google search results, Facebook shares, and Twitter cards. It provides character count analysis, status indicators (optimal/warning/missing), and actionable recommendations for improving SEO.

The app features a comprehensive SEO Performance Dashboard that displays an overall SEO score via a doughnut chart, percentage scoring, performance descriptors (Excellent/Good/Fair/Needs Improvement/Poor), and KPI metrics showing the count of Passed Checks, Warnings, and Failed Checks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: shadcn/ui (Radix UI primitives) with Tailwind CSS for styling
- Material Design aesthetic inspired by developer tools (Chrome DevTools, Linear)
- Comprehensive component library including cards, buttons, forms, dialogs, and data display components
- Custom design system with CSS variables for theming (light/dark mode support)

**Routing**: wouter for lightweight client-side routing

**State Management**: 
- TanStack Query (React Query) for server state management and API data fetching
- Local component state with React hooks

**Key UI Patterns**:
- SEO Performance Dashboard displayed at the top of analysis results
  - Doughnut chart visualization showing distribution of passed/warnings/failed checks
  - Overall SEO score calculation: (passed + warnings * 0.5) / totalChecks * 100
  - Performance level badges: Excellent (90%+), Good (75-89%), Fair (60-74%), Needs Improvement (40-59%), Poor (<40%)
  - KPI metrics cards with color-coded icons for Passed Checks, Warnings, and Failed Checks
- Two-column desktop layout: Meta tags list (60%) and preview cards (40% sticky)
- Single-column mobile layout with stacked components
- Preview cards showing Google Search, Facebook, and Twitter appearances
- Meta tag cards with expandable details, copy functionality, and status badges

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Development Setup**: 
- Vite middleware for development with HMR (Hot Module Reload)
- Custom logging middleware for API request tracking
- Static file serving in production

**API Design**:
- RESTful endpoint: `POST /api/analyze` accepts a URL and returns SEO analysis
- Request validation using Zod schemas
- Response includes categorized meta tags (essential, OpenGraph, Twitter, technical)

**Web Scraping**:
- Cheerio for HTML parsing and meta tag extraction
- Validates meta tags against optimal character ranges (title: 50-60 chars, description: 150-160 chars)
- Status classification: optimal, present, missing, warning

### Data Storage

**Current Implementation**: In-memory storage using Map-based storage class (MemStorage)
- User management support (getUser, getUserByUsername, createUser)
- No persistent storage currently implemented

**Database Schema** (Drizzle ORM configured but not actively used):
- PostgreSQL dialect configured via Neon Database serverless driver
- Users table defined with id, username, password fields
- Schema validation with drizzle-zod integration

### External Dependencies

**Core Libraries**:
- `cheerio` - Server-side HTML parsing and DOM manipulation for meta tag extraction
- `@neondatabase/serverless` - PostgreSQL database driver for Neon (configured but not currently used)
- `drizzle-orm` - TypeScript ORM for database operations (configured but not currently used)

**UI & Styling**:
- `@radix-ui/*` - Headless UI component primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe variant styling
- `lucide-react` - Icon library
- `recharts` - Charting library for React (used for doughnut chart visualization in SEO dashboard)

**Form & Validation**:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Validation resolver integration
- `zod` - Schema validation for both client and server

**Development Tools**:
- `vite` - Build tool and dev server
- `tsx` - TypeScript execution for server
- `esbuild` - Bundler for production builds
- Replit-specific plugins for cartographer and dev banner

**Data Fetching**:
- `@tanstack/react-query` - Server state management
- Native fetch API for HTTP requests

**Fonts**: Google Fonts (Inter, DM Sans, Fira Code, Geist Mono) loaded via CDN