# RealNews - News Aggregation Platform

## Overview

RealNews is a modern news aggregation platform built as a full-stack web application that collects, filters, and organizes news from diverse sources using RSS technology. The platform presents news categorized by topics (technology, sports, politics, economics, culture, etc.) with a focus on delivering the latest, reliable information quickly and concisely. The application is designed with a clean, minimal interface optimized for fast load times and intuitive navigation across both mobile and desktop devices.

The platform is built with a React frontend using TypeScript, Express.js backend, and uses Drizzle ORM with PostgreSQL for data management. Future features include AI-powered article translation, rewriting, and summarization using the Gemini 1.5 Flash API.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred language: O'zbek tili (Uzbek language).

## Recent Changes

### Migration from Replit Agent to Replit Environment (August 26, 2025)
- Successfully completed full migration from Replit Agent to standard Replit environment
- Fixed database schema type mismatches and added missing fields (email, role, isActive to users table)
- Added title, description, content fields to articles table for proper content management
- Created extended types for storage interface (ArticleWithCategory, CategoryWithCount, StoryWithCategory, StoryWithItems)
- Ran database migration (`drizzle-kit push`) to create all necessary PostgreSQL tables
- Application running successfully with proper database integration on port 5000
- Admin user creation working correctly (username: Akramjon)
- All API endpoints functioning properly with proper CORS configuration
- Frontend and backend communication established and tested
- Migration checklist completed: packages installed, workflow restarted, project verified

### Render Deployment Configuration (August 26, 2025)
- Created comprehensive render.yaml configuration for production deployment
- Configured separate services: realnews-backend (Web Service) and realnews-frontend (Static Site)
- Fixed routing issues with proper rewrite rules using `:path*` syntax
- Set up API and admin panel routing from frontend to backend service
- Created _redirects files as backup routing configuration
- Admin credentials: username = Akramjon, password = Gisobot201415*
- Database populated with 85+ real articles from RSS feeds (Daryo.uz, Sky News)
- All production build commands optimized for Render deployment

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, category, and individual articles
- **State Management**: TanStack React Query for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Internationalization**: Content primarily in Uzbek language (uz-UZ locale)

The frontend follows a component-based architecture with:
- Page components for different routes (Home, Category, Article, NotFound)
- Reusable UI components (NewsCard, Header, Footer, Sidebar, BreakingNews)
- Custom hooks for data fetching and mobile detection
- SEO optimization utilities for dynamic meta tag updates

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with endpoints for articles, categories, RSS feeds, and newsletter subscriptions
- **Development**: Hot-reloading with Vite integration for seamless development experience
- **Build Process**: ESBuild for production bundling with platform-specific optimizations

The backend implements:
- Route registration system with automatic error handling
- Request/response logging middleware
- Storage abstraction layer supporting both in-memory and database storage
- RSS feed parsing service for automated content ingestion
- Input validation using Zod schemas

### Data Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless connection
- **Schema Design**: Relational schema with tables for users, categories, articles, RSS feeds, and newsletters
- **Migrations**: Database migrations managed through Drizzle Kit
- **Validation**: Zod schemas for runtime type validation and API request/response validation

Key database entities:
- Articles with categorization, metadata, and engagement metrics
- Categories with customizable icons and colors
- RSS feeds for automated content sourcing
- User management and newsletter subscriptions

### Deployment Architecture
- **Build Strategy**: Separate client and server builds with optimized production assets
- **Static Assets**: Client assets served from dist/public directory
- **Environment**: Environment variable based configuration for database connections
- **Development**: Development server with HMR and error overlay integration

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **PostgreSQL**: Primary database engine with full SQL support

### UI and Styling
- **Radix UI**: Headless UI components for accessibility and consistency
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **FontAwesome**: Additional icons for news categories and social media

### Development Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Type-safe development with strict configuration
- **ESLint/Prettier**: Code quality and formatting (implied by project structure)
- **React Query**: Server state synchronization and caching

### Content Management
- **RSS Parsing**: XML2JS for RSS feed content extraction
- **Date Handling**: date-fns for internationalized date formatting
- **Slug Generation**: Custom utility for URL-friendly article identifiers

### Planned Integrations
- **Gemini 1.5 Flash API**: Future integration for AI-powered content processing including article translation, rewriting, and summarization
- **Social Media APIs**: Planned integrations for content sharing and social authentication

The architecture supports horizontal scaling through its serverless database approach and stateless backend design, making it suitable for high-traffic news aggregation workloads.