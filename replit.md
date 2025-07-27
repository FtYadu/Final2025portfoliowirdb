# Portfolio Website for Yadu Krishna

## Overview

This is a full-stack portfolio website built for Yadu Krishna, a creative visual storyteller and graphic designer. The application features a modern, responsive design showcasing photography work, with interactive galleries, contact forms, and social media integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture using a Node.js/Express backend with a React frontend, designed for optimal performance and user experience.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Component Library**: Radix UI primitives with shadcn/ui components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Animations**: GSAP for smooth animations and scroll effects
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Built-in session handling with PostgreSQL storage

## Key Components

### Portfolio Gallery System
- Masonry-style image layout with responsive design
- Lightbox functionality for image viewing
- Auto-scroll feature for continuous browsing
- Lazy loading and performance optimization
- Shuffle functionality to randomize image display

### Contact Form Integration
- Dual submission system (local storage + Formspree)
- Form validation using Zod schemas
- Toast notifications for user feedback
- Spam protection and error handling

### Theme System
- Dark/light mode toggle with system preference detection
- Persistent theme storage in localStorage
- Smooth transitions between themes
- Custom CSS variables for consistent theming

### Social Media Integration
- Floating social dock with multiple platform links
- Direct WhatsApp messaging integration
- Calendar booking system integration
- External portfolio site linking

## Data Flow

1. **Image Data**: Portfolio images are stored in the database and served via REST API endpoints
2. **Contact Submissions**: Forms are validated client-side, then submitted to both local API and external Formspree service
3. **Theme Preferences**: Stored locally and applied via CSS custom properties
4. **Animation State**: Managed by GSAP with scroll-triggered animations and loading sequences

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL)
- **UI Components**: Radix UI primitives
- **Animations**: GSAP with ScrollTrigger
- **Form Handling**: Formspree for contact form submissions
- **Fonts**: Google Fonts (Inter, Playfair Display)

### Development Tools
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework
- **ESLint/Prettier**: Code formatting and linting (implicit)

### External Services
- **Google Drive**: Image hosting for portfolio images
- **Formspree**: Contact form backend service
- **Google Calendar**: Appointment scheduling integration
- **Social Platforms**: Direct integration with Instagram, Twitter, LinkedIn, etc.

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory
- Backend builds to `dist` directory using esbuild
- Single deployment artifact with Express serving static files

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development environment detection
- Separate build commands for development and production

### Performance Optimizations
- Image lazy loading and optimization
- Code splitting and tree shaking via Vite
- CSS custom properties for efficient theming
- Smooth animations without blocking main thread
- Efficient query caching with TanStack Query

### SEO and Meta Tags
- Comprehensive Open Graph and Twitter Card meta tags
- Structured data for better search engine understanding
- Proper canonical URLs and meta descriptions
- Social media optimization for sharing

The application is designed to provide an immersive, professional showcase of creative work while maintaining excellent performance and user experience across all devices.