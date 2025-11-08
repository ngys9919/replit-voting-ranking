# National Parks Ranker

## Overview

This is an interactive voting application for ranking America's National Parks using the chess ELO rating system. Users vote on parks head-to-head, and the app calculates rankings based on voting outcomes. The application features:

- **Head-to-Head Voting**: Users compare two random National Parks and vote for their favorite
- **ELO Rating System**: Rankings are calculated using the chess ELO algorithm with K-factor of 32
- **Live Rankings**: Real-time leaderboard showing all parks sorted by ELO rating
- **Recent Activity**: Display of recent voting activity from the community
- **Persistent Data**: All votes and ratings are stored in a PostgreSQL database

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: shadcn/ui (Radix UI primitives) with Tailwind CSS for styling
- Clean, modern design with card-based layouts
- Responsive grid system for desktop and mobile
- Hover and active states for interactive elements
- Loading states and smooth transitions

**Routing**: wouter for lightweight client-side routing

**State Management**: 
- TanStack Query (React Query) for server state management and API data fetching
- Automatic cache invalidation after voting
- Loading and error states handled gracefully

**Key Components**:
- **VotingMatchup**: Displays two parks side-by-side with images, descriptions, and ELO ratings
  - Click anywhere on park card to vote
  - Disabled state during vote submission
  - Visual feedback with loading indicators
- **Rankings**: Shows top National Parks sorted by ELO rating
  - Trophy icons for top 3 parks
  - Badge display for ELO ratings
  - Hover effects for better UX
- **RecentVotes**: Displays recent voting activity
  - Winner vs loser format
  - Relative timestamps using date-fns
  - Real-time updates after each vote

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Development Setup**: 
- Vite middleware for development with HMR (Hot Module Reload)
- Custom logging middleware for API request tracking
- Express static middleware serves `/attached_assets` directory for park images
- Static file serving in production

**API Endpoints**:
- `GET /api/matchup` - Returns two random parks for voting
- `POST /api/vote` - Records a vote and updates ELO ratings (uses transaction for atomicity)
- `GET /api/rankings` - Returns all parks sorted by ELO rating descending
- `GET /api/recent-votes` - Returns recent voting activity with park details

**ELO Rating System** (`server/elo.ts`):
- Standard ELO formula: `New Rating = Old Rating + K * (Actual Score - Expected Score)`
- Expected score calculated using: `1 / (1 + 10^((Opponent Rating - Player Rating) / 400))`
- K-factor: 32 (standard for moderate sensitivity)
- Ratings rounded to nearest integer

### Data Storage

**Database**: PostgreSQL (Neon serverless)
- Configured with WebSocket support for Node.js environment
- Drizzle ORM for type-safe database queries
- Transaction support for atomic operations

**Schema** (`shared/schema.ts`):

**Parks Table**:
- `id` (varchar, UUID primary key)
- `name` (text) - Park name
- `location` (text) - State(s) where park is located
- `description` (text) - Brief park description
- `imageUrl` (text) - URL to park image
- `eloRating` (integer, default: 1500) - Current ELO rating

**Votes Table**:
- `id` (varchar, UUID primary key)
- `winnerId` (varchar, foreign key to parks) - ID of winning park
- `loserId` (varchar, foreign key to parks) - ID of losing park
- `timestamp` (timestamp, auto-generated) - When vote was cast

**Seed Data** (`server/seed-data.ts`):
- All 63 official U.S. National Parks with descriptions and locally-hosted images
- All parks start at 1500 ELO rating
- Automatically seeded on server startup if database is empty
- Images stored in `attached_assets/stock_images/` and served via Express static middleware

**Storage Layer** (`server/storage.ts`):
- `getAllParks()` - Get all parks ordered by ELO rating
- `getParkById(id)` - Get single park by ID
- `getRandomMatchup()` - Get two random parks for voting
- `recordVoteWithRatings()` - **Transactional method** that updates both park ratings and records vote atomically
- `getRecentVotes(limit)` - Get recent votes with full park details

### Data Flow

1. User loads page → Fetches random matchup, rankings, and recent votes
2. User votes on a park → POST to `/api/vote` with winner and loser IDs
3. Backend:
   - Fetches both parks from database
   - Calculates new ELO ratings using chess algorithm
   - **Atomically** updates both ratings and records vote in transaction
   - Returns updated ratings
4. Frontend:
   - Invalidates all queries (matchup, rankings, recent votes)
   - Refetches fresh data
   - Displays success toast

### Key Features

**Transaction Safety**: Vote recording uses database transactions to ensure:
- Both park ratings update successfully, or neither does
- Vote is only recorded if ratings update successfully
- Prevents inconsistent state if operation fails mid-process

**Real-time Updates**: React Query automatically refetches and updates all sections after voting

**Responsive Design**: Works on desktop, tablet, and mobile with appropriate layouts

**Image Loading**: National Parks images served locally from `attached_assets/stock_images/` directory
- Each park has a unique, contextually accurate image
- Express serves static assets via `/attached_assets` route
- Eliminates external CDN dependencies and rate-limiting issues

**User Feedback**: Toast notifications for successful votes and error handling

## Development

### Running the Project
```bash
npm run dev  # Starts both Express backend and Vite frontend
```

### Database Migrations
```bash
npm run db:push  # Sync Drizzle schema to database
```

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (automatically set by Replit)
- Other Neon database variables set automatically

## Recent Changes

- **2024-11-08**: Fixed deployment issues and updated page title
  - Updated HTML page title from "SEO Meta Tag Analyzer" to "National Parks Ranker"
  - Fixed deployment asset serving: Images and data now show correctly when deployed
  - Modified build script to copy `attached_assets` to `dist/public/` during build
  - Updated server to conditionally serve assets: development from workspace, production from build output
  - Deployment now includes all park images and data in the production bundle

- **2024-11-08**: Fixed vote button UI bug
  - Only the clicked vote button now shows disabled state and loading spinner
  - Other vote button remains stable with no visual changes (no blink)
  - Prevents confusing UX where both buttons appeared to be affected

- **2024-11-08**: Image hosting migration and complete park data expansion
  - Migrated from external Wikipedia Commons URLs to locally-hosted stock images
  - Downloaded 63 unique, contextually accurate images for all official U.S. National Parks
  - Added Express static middleware to serve `/attached_assets` directory
  - Updated seed data to include all 63 National Parks with descriptions
  - Resolved image rate-limiting and 404 errors by using local asset hosting
  - Verified all images display correctly in production

- **2024-11-08**: Initial implementation of National Parks voting app
  - Created database schema for parks and votes
  - Implemented ELO rating calculation system
  - Built voting UI with matchup display
  - Added rankings and recent votes displays
  - Integrated Neon PostgreSQL with transaction support
