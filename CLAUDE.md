# CLAUDE.md
你是一个有大型 React + Next.js 经验的前端架构师。

我会给你一段代码。

请你：

1. 指出隐藏问题
2. 分析抽象是否合理
3. 提出更优设计
4. 给出重构版本
5. 说明 trade-off

不要泛泛而谈。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a LeetCode-style coding practice platform tailored for frontend developers. The platform focuses on JavaScript, CSS, HTML, React, TypeScript, and DOM manipulation problems. Currently in active development, it includes problem browsing, admin panel structure, and authentication systems.

**Tech Stack:**
- Next.js 16.1.4 with App Router architecture
- React 18.3.1 with React Server Components (RSC)
- TypeScript 5
- Radix UI (unstyled, accessible components)
- Tailwind CSS v4
- Zustand 5 (client state management)
- TanStack React Query 5 (server state)
- Monaco Editor (code editor)

**Planned Backend:**
- NestJS BFF layer
- MySQL database

## Development Commands

```bash
# Start development server (cleans .next first)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code with oxfmt
pnpm fmt

# Check code formatting
pnpm fmt:check
```

**Package Manager:** This project uses pnpm (evidenced by pnpm-lock.yaml).

## Architecture

### Directory Structure

```
app/
├── (site)/              # Site route group with shared layout
├── (admin)/             # Admin route group with separate layout
├── api/                 # API routes (Next.js route handlers)
├── layout.tsx           # Root layout
└── page.tsx            # Home page

components/
├── ui/                 # Radix UI primitives with custom styling
└── [feature]/          # Feature-specific components

data/                   # Static data (problems, test cases)
stores/                 # Zustand state management
types/                  # TypeScript type definitions
const/                  # Application constants
hooks/                  # Custom React hooks
mockApi/               # Mock API implementations for development
lib/                   # Utility functions
public/                # Static assets
```

### Route Groups Architecture

The application uses Next.js route groups to organize layouts:
- `(site)` - Main application routes for end users
- `(admin)` - Admin panel routes with separate authentication and layout

Each route group has its own `layout.tsx` for shared UI and behavior.

### State Management Strategy

**Zustand** (stores/): Client-side state for user authentication and UI state
- `useAuthStore` - User authentication state (login/logout, user data)

**React Query** (@tanstack/react-query): Server state management
- Use for API calls, caching, and synchronization

**Server Components vs Client Components:**
- Default to Server Components for better performance
- Add `"use client"` directive when using:
  - Browser APIs (localStorage, etc.)
  - React hooks (useState, useEffect, etc.)
  - Event handlers
  - Zustand stores

### Problem Data Model

Problems are defined in `data/problem.ts` with this structure:
- `id`: Unique identifier
- `title`/`titleCn`: English and Chinese titles
- `difficulty`: "easy" | "medium" | "hard"
- `category`: "JavaScript" | "CSS" | "HTML" | "React" | "TypeScript" | "DOM"
- `tags`: Array of topic tags
- `acceptance`: Completion rate (percentage)
- `description`: Problem statement
- `examples`: Array of input/output examples
- `starterCode`: Initial code template
- `solution`: Optional reference solution
- `solved`: User completion status

### Authentication Pattern

Current implementation uses mock APIs (`mockApi/login.ts`) with:
- JWT token storage in HttpOnly cookies
- User roles: "admin" | "user"
- Zustand store for client-side auth state

### TypeScript Configuration

- Path alias: `@/*` maps to project root
- Strict mode enabled
- Target: ES2017
- Module resolution: "bundler"

## Development Approach

### Component Organization

- Radix UI primitives in `components/ui/` follow atomic design patterns
- Feature components organized by domain
- Use `class-variance-authority` (cva) for component variants
- Combine `clsx` and `tailwind-merge` for conditional styling

### Form Handling

- React Hook Form + Zod for form validation
- `@hookform/resolvers` for schema integration

### Code Formatting

- Uses **oxfmt** (OCaml formatter) - not Prettier
- Run `pnpm fmt` to format code
- Run `pnpm fmt:check` to verify formatting

### Styling Conventions

- Tailwind CSS v4 with new @import syntax
- Framer Motion for animations
- `tailwindcss-animate` for Tailwind animation utilities
- Custom theme configuration in Tailwind

## Key Patterns

### Adding New Problems

1. Define problem data in `data/problem.ts`
2. Add test cases in `data/testCases.ts`
3. Create dynamic route at `app/(site)/problem/[id]/page.tsx`

### API Routes

Create API routes in `app/api/` following Next.js App Router conventions:
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: 'response' });
}
```

### Client vs Server Component Decision Tree

Use **Server Components** by default unless you need:
- Interactivity (onClick, onChange, etc.)
- Browser APIs
- React hooks (useState, useEffect, etc.)
- Context providers
- Client-side libraries (Zustand, React Query, etc.)

## Code Quality Standards

Following the project's AI system guidelines (.ai/system.md):

1. **Architecture First**: Consider layering and separation of concerns
2. **Server/Client Boundaries**: Be explicit about component boundaries
3. **Type Design**: Leverage TypeScript for type safety
4. **Performance & Maintainability**: Optimize for both
5. **Trade-offs**: Consider and document architectural decisions
6. **Production-Grade Code**: Avoid shortcuts; write production-ready implementations

Follow these best practices:
- react-best-practices (via /skill)
- web-design-guidelines (via /skill)

## Current Development Status

**Implemented:**
- Problem browsing interface
- Basic admin panel structure
- Mock authentication system
- Modern React/Next.js architecture

**In Progress:**
- Problem solving interface with Monaco Editor
- Real authentication integration
- Admin panel functionality
- Test case execution system
