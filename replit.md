# Multi-Tool Web Application

## Overview

This is a comprehensive multi-tool web application providing utility functions including file conversion, unit conversion, Wikipedia search, calculator, data viewing, audio recording/editing, and photo editing. The application is built as a client-heavy Single Page Application (SPA) with minimal backend requirements, designed to run most operations directly in the browser.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- **React 18** with TypeScript for UI components
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** (React Query) for state management and data fetching
- **Tailwind CSS** with shadcn/ui component library for styling

**Design System:**
- Material Design 3 principles implemented through shadcn/ui components
- Custom Tailwind configuration with "new-york" style variant
- CSS variables for theming with support for light/dark modes
- Inter font family for UI text, Roboto Mono for monospace displays
- Responsive grid layouts with mobile-first approach

**Component Architecture:**
- Radix UI primitives (@radix-ui/*) as the foundation for accessible UI components
- shadcn/ui components built on top of Radix primitives
- Page-based routing with dedicated routes for each tool
- Shared UI components in `/client/src/components/ui/`
- Custom hooks for cross-cutting concerns (mobile detection, toast notifications)

**Client-Side Tools:**
The application provides nine distinct tools, each operating primarily in the browser:
1. **File Converter** - Image format conversion (PNG/JPG/WebP) using Canvas API
2. **Unit Converter** - Mathematical conversions across multiple unit categories
3. **Wikipedia Search** - Direct Wikipedia API integration
4. **Calculator** - Scientific calculator with graphing capabilities (recharts)
5. **Data Viewer** - Parse and display CSV, JSON, YAML, XML files (PapaParse, js-yaml, fast-xml-parser)
6. **Audio Recorder** - Browser MediaRecorder API for audio capture
7. **Audio Editor** - WaveSurfer.js for waveform visualization and editing
8. **Photo Editor** - Cropper.js for image manipulation with filters
9. **Preview Tool** - Markdown (marked.js) and HTML rendering

### Backend Architecture

**Server Stack:**
- **Express.js** as the HTTP server framework
- **Node.js** runtime environment
- Minimal API surface - currently just infrastructure routes
- Development mode uses Vite middleware for HMR and asset serving
- Production mode serves pre-built static assets

**Build & Deployment:**
- Client builds to `dist/public` via Vite
- Server bundles to `dist/index.js` via esbuild with ESM format
- Single production entry point combines static file serving with API routes

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) as the current data persistence layer
- Storage interface (`IStorage`) designed for potential database integration
- Basic user model defined but not actively used by current feature set
- Schema definitions in `/shared/schema.ts` focus on file conversion types

### External Dependencies

**Third-Party Services:**
- **Wikipedia API** - Direct CORS-enabled API calls from client for article search
- No authentication or API keys required for current integrations

**Key NPM Packages:**

*UI & Interaction:*
- `@radix-ui/*` - Accessible component primitives (accordion, dialog, dropdown, etc.)
- `class-variance-authority` & `clsx` - Dynamic CSS class composition
- `tailwind-merge` - Tailwind class conflict resolution
- `lucide-react` - Icon system

*Media Processing:*
- `wavesurfer.js` - Audio waveform visualization and playback
- `cropperjs` & `react-cropper` - Image cropping and manipulation
- `recharts` - Graph visualization for calculator

*Data Parsing:*
- `papaparse` - CSV parsing
- `js-yaml` - YAML parsing
- `fast-xml-parser` - XML parsing
- `marked` - Markdown to HTML conversion

*Math & Utilities:*
- `mathjs` - Mathematical expression evaluation
- `date-fns` - Date manipulation
- `nanoid` - Unique ID generation

**Database Preparation:**
- **Drizzle ORM** configured with PostgreSQL dialect
- **@neondatabase/serverless** driver for Neon Database connectivity
- Migration directory and schema ready but not actively used
- Current architecture uses in-memory storage; database integration is prepared but not required for existing features

**Development Tools:**
- `@replit/vite-plugin-*` - Replit-specific development enhancements
- `tsx` - TypeScript execution for development server
- `esbuild` - Production server bundling

### Design Decisions

**Client-Side Processing:**
Most tool operations run entirely in the browser to minimize server load and enable offline-capable functionality. File conversions, calculations, and data transformations happen client-side using modern browser APIs.

**Minimal Backend:**
The backend primarily serves as a static file host and provides infrastructure for potential future API endpoints. This allows the application to scale horizontally with simple static hosting while maintaining the option to add server-side features.

**Component Library Choice:**
shadcn/ui was selected over traditional component libraries because it provides full source code ownership - components are copied into the project rather than imported as dependencies. This enables deep customization while maintaining consistency through Radix UI primitives.

**Type Safety:**
TypeScript is used throughout with strict mode enabled. Shared types in `/shared/schema.ts` use Zod for runtime validation and type inference, ensuring type safety across client-server boundaries even with minimal current usage.

**Routing Strategy:**
Wouter provides a minimal routing solution (1.5KB) compared to React Router, sufficient for the simple page-based navigation structure of this tool suite.