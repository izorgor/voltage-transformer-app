# Voltage Transformer Monitoring Application

> **Frontend Software Engineer Technical Assessment**
> A production-ready web application for monitoring and visualizing transformer asset data.

## 🚀 Quick Start

**Option 1: Docker**

```bash
npm run docker:prod
# → Application available at http://localhost:3000
```

**Option 2: Development Mode**

```bash
npm install
npm run dev
# → Application available at http://localhost:5173
```

---

## ✅ Requirements Implementation

This application meets all specified requirements:

### 1. Programming Language & Framework

- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **React 19** - React with latest features
- ✅ **Vite** - Build tool

### 2. Data Ingestion

- ✅ **TanStack Query (React Query)** - Data fetching with caching
- ✅ **Zod Validation** - Runtime type validation for data integrity
- ✅ **Error Handling** - Error boundaries and validation
- 📁 Data source: `/public/sampledata.json`

### 3. UI Components

**Table Component** ✅

- Displays: name, region, health status
- **Bonus Features**:
  - Search by name
  - Filter by region
  - Filter by health status
  - Sortable columns
  - Responsive design

**Line Chart Component** ✅

- Unique colored line for each transformer
- X-axis: Time (formatted timestamps)
- Y-axis: Voltage readings
- Checkboxes for selecting/deselecting transformers
- **Bonus Features**:
  - "Select All" checkbox
  - Interactive tooltips
  - Color-coded by health status
  - Responsive container

### 4. State Management

- ✅ **Zustand** with persist middleware
- ✅ **localStorage** for persistence
- ✅ **Cross-tab synchronization** - State syncs across multiple browser tabs
- ✅ Separate stores for chart and table (separation of concerns)

### 5. Build, Package & Deployment

- ✅ **Docker** multi-stage build (Node + Nginx)
- ✅ **docker-compose** for orchestration
- ✅ **Production-optimized** Nginx configuration with gzip, caching, security headers
- ✅ **Automated packaging** script: `npm run package`
- ✅ **CI/CD ready** with comprehensive npm scripts

---

## Features

- 📊 **Interactive Data Table** - View all transformers with filtering and search capabilities
- 📈 **Real-time Line Chart** - Visualize voltage readings over time for multiple transformers
- 🔄 **Persistent State** - State management across browser tabs using Zustand with localStorage
- 🎨 **Modern UI** - Built with Tailwind CSS for a clean, responsive design
- 🚀 **Optimized Performance** - Efficient data fetching with TanStack Query
- 🐳 **Docker Ready** - Containerized deployment with Docker and docker-compose

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand with persist middleware
- **Data Fetching**: TanStack Query (React Query)
- **Table**: TanStack Table (React Table v8)
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Code Quality**: ESLint + Prettier
- **Deployment**: Docker + Nginx

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- Docker and Docker Compose (for containerized deployment)

## Installation

### 1. Clone the repository and install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

## Available Scripts

### Development

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build (http://localhost:4173)
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
```

### Docker Deployment

```bash
npm run docker:prod  # Build and run in production mode (detached)
npm run docker:logs  # View Docker container logs
npm run docker:build # Build Docker image only
npm run docker:up    # Start container (attached mode)
npm run docker:down  # Stop container
```

### Packaging

```bash
npm run package      # Create deployment package (.tar.gz)
```

## Docker Deployment

### Option 1: Using docker-compose (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# Stop the application
docker-compose down
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Option 2: Using Docker directly

```bash
# Build the image
docker build -t voltage-transformer-app .

# Run the container
docker run -p 3000:80 voltage-transformer-app
```

## Project Structure

```
voltage/
├── public/
│   └── sampledata.json          # Transformer sample data
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── TransformerTable.tsx # Main table component
│   │   ├── TransformerChart.tsx # Line chart component
│   │   └── Layout.tsx           # App layout wrapper
│   ├── hooks/
│   │   └── useTransformers.ts   # TanStack Query hook
│   ├── lib/
│   │   ├── api.ts               # Data fetching with Zod validation
│   │   ├── broadcastSync.ts     # Cross-tab sync with BroadcastChannel
│   │   ├── constants.ts         # Shared constants
│   │   └── utils.ts             # Utility functions
│   ├── store/
│   │   ├── chartStore.ts        # Chart state with cross-tab sync
│   │   └── tableStore.ts        # Table filters with cross-tab sync
│   ├── types/
│   │   └── transformer.ts       # TypeScript type definitions
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles with Tailwind
├── scripts/
│   └── package-deployment.sh    # Automated packaging script
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yml           # Docker Compose orchestration
├── nginx.conf                   # Nginx production configuration
├── .dockerignore                # Docker build optimization
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.ts               # Vite configuration
└── README.md                    # This file
```

## Features Overview

### 1. Transformer Table

- Display all transformers with name, region, and health status
- Search functionality to filter transformers by name
- Filter by region and health status
- Responsive design that works on all screen sizes

### 2. Voltage Line Chart

- Interactive chart showing voltage readings over time
- Each transformer has a unique colored line
- Checkboxes to toggle transformer visibility
- Synchronized with table state across browser tabs

### 3. State Persistence

- All selections and filters are saved in localStorage
- State is synchronized across multiple browser tabs
- Persistent even after browser restart

## Data Structure

The application ingests data from `/public/sampledata.json`:
