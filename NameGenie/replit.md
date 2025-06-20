# Replit.md

## Overview

This is a full-stack web application built for "Existence Downloads" - a premium download platform for game cheats, external tools, and utilities. The application features a Discord-inspired dark UI theme and provides a catalog of downloadable products with filtering and search capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS with custom Discord-inspired dark theme
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful endpoints
- **Development**: Hot reload with Vite middleware integration
- **Error Handling**: Centralized error middleware

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM with Zod schema validation
- **Database Driver**: Neon Database serverless connector
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Development**: In-memory storage implementation for rapid prototyping

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Products Table**: Product catalog with name, description, category, color indicators, download URLs, and feature flags

### API Endpoints
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch specific product
- `GET /api/products/category/:category` - Filter by category
- `GET /api/products/filter/featured` - Get featured products
- `GET /api/products/filter/popular` - Get popular products (endpoint defined but not implemented)

### UI Components
- **Header**: Discord-style navigation with search and notification icons
- **Sidebar**: Category filtering and product type navigation
- **ProductCard**: Individual product display with download actions
- **ProductModal**: Product selection dialog

## Data Flow

1. **Client Request**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests
3. **Storage Layer**: Currently uses in-memory storage with seed data
4. **Response**: JSON data returned to client with error handling

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router via Wouter)
- UI libraries (Radix UI primitives, Lucide React icons)
- Utility libraries (clsx, class-variance-authority, date-fns)
- TanStack Query for data fetching

### Backend Dependencies
- Express.js web framework
- Drizzle ORM with PostgreSQL support
- Neon Database serverless connector
- Development tools (tsx for TypeScript execution)

### Development Tools
- Vite for bundling and development server
- TypeScript for type safety
- Tailwind CSS for styling
- ESBuild for production builds

## Deployment Strategy

### Development
- Uses Vite dev server with Express middleware integration
- Hot module replacement for React components
- TypeScript compilation on-the-fly
- Environment: `NODE_ENV=development`

### Production
- **Build Process**: Vite builds client assets, ESBuild bundles server
- **Output**: Static assets in `/dist/public`, server bundle in `/dist`
- **Runtime**: Node.js running production server
- **Environment**: `NODE_ENV=production`

### Replit Configuration
- **Modules**: Node.js 20, web development, PostgreSQL 16
- **Run Command**: `npm run dev` for development
- **Build Command**: `npm run build` for production
- **Deployment**: Autoscale deployment target

## Discord Bot Integration

### Bot Information
- **Bot Name**: Existence#2276
- **Status**: Active and running
- **Token**: Configured and authenticated

### Bot Commands
- `!products` - Interactive product browser with dropdown selection
- `!featured` - Display featured products
- `!popular` - Show popular downloads
- `!help` - List all available commands

### Invitation URL
```
https://discord.com/api/oauth2/authorize?client_id=1385296321287684236&permissions=314432&scope=bot%20applications.commands
```

## Changelog

Changelog:
- June 19, 2025. Initial setup
- June 19, 2025. Added Discord bot integration with interactive product browsing
- June 19, 2025. Added automatic status embed system with dual-channel setup (dropdown menu + status display)
- June 19, 2025. Implemented permanent dropdown menu and comprehensive tool status tracking
- June 19, 2025. Added animated status indicators with 5-hour refresh intervals
- June 19, 2025. Implemented comprehensive news system with automated welcome messages and partnership recruitment

## User Preferences

Preferred communication style: Simple, everyday language.