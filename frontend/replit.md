# Solar Loan Fit Checker

## Overview

This is a full-stack web application built for checking solar loan eligibility and calculating potential savings. The application provides an interactive, multi-step form that collects user information (location, electric bill, credit score, roof details) and provides personalized solar installation estimates and financing options.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions and 3D effects
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks and TanStack React Query for server state
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Development**: Hot reloading with Vite integration in development mode
- **Static Serving**: Express serves the built React application in production

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Neon Database serverless)
- **In-Memory Storage**: Temporary MemStorage implementation for development
- **Session Management**: connect-pg-simple for PostgreSQL session storage

## Key Components

### Frontend Components
1. **Solar Checker Wizard**: Multi-step form with progress tracking
   - Step 1: Location (ZIP code input)
   - Step 2: Electric bill range selection
   - Step 3: Credit score range selection
   - Step 4: Roof type and age selection
2. **Glass Card UI**: Glassmorphism design with backdrop blur effects
3. **3D Progress Indicator**: Animated step tracker with icons
4. **Background Animation**: Floating 3D sun elements
5. **Results Display**: Personalized savings calculations and financing options
6. **Loading Animation**: Animated loading screen during calculation

### Backend Components
1. **Express Server**: Main application server with middleware
2. **Storage Interface**: Abstracted storage layer supporting multiple implementations
3. **Route Registration**: Modular route handling system
4. **Development Integration**: Vite middleware for hot reloading

### Shared Components
1. **Database Schema**: User model with Drizzle ORM schemas
2. **Type Definitions**: Shared TypeScript interfaces and types

## Data Flow

1. **User Interaction**: User navigates through multi-step form
2. **Form Validation**: Client-side validation for each step
3. **Data Collection**: Form data stored in component state
4. **Calculation Trigger**: Final step triggers loading animation
5. **Results Generation**: Client-side calculation of solar savings
6. **Results Display**: Personalized recommendations shown to user

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **Animation**: Framer Motion for smooth animations
- **Database**: Drizzle ORM, Neon Database serverless PostgreSQL
- **Development**: Vite, TypeScript, ESBuild for production builds

### Replit Integration
- **Development Banner**: Replit development environment integration
- **Error Handling**: Runtime error modal for development
- **Cartographer**: Code mapping for Replit environment

## Deployment Strategy

### Development
- **Environment**: Replit with Node.js 20, PostgreSQL 16
- **Port Configuration**: Local port 5000, external port 80
- **Hot Reloading**: Vite development server with Express middleware
- **Database**: Automatic PostgreSQL provisioning via environment variables

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles backend
- **Deployment Target**: Replit autoscale deployment
- **Static Assets**: Frontend built to `dist/public`, served by Express
- **Database Migration**: Drizzle Kit for schema management

### Environment Configuration
- **Development**: `NODE_ENV=development` with TypeScript execution via tsx
- **Production**: `NODE_ENV=production` with compiled JavaScript
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```