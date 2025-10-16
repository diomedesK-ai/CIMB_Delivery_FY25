# Flash Cards & Commercial Clusters Implementation

## Overview
This document describes the implementation of the flash card system and commercial cluster management features for the CIMB AI Use Cases Dashboard.

## Features Implemented

### 1. Data Structure Updates
- **File**: `lib/csv-parser.ts`
- Added `commercialCluster` field to `UseCaseRecord` interface
- Updated CSV parsing to handle the new column
- Updated CSV export functions to include commercial cluster data
- **File**: `public/data/master-use-cases.csv`
- Added "Commercial Cluster" column header

### 2. Flash Card Component
- **File**: `components/use-case-flash-card.tsx`
- Clean, minimal card design showing:
  - Use case name (prominent)
  - Sub-category badge
  - Top 3 KPIs (summarized)
  - First 3 departments (with count of remaining)
  - Top 2 Microsoft products (summarized, with count of remaining)
- Hover effects for interactivity
- Click handler to open detailed view
- Responsive design

### 3. Detailed View Dialog
- **File**: `components/use-case-detail-dialog.tsx`
- Dialog/modal component with hierarchical tree structure
- Sections include:
  - Commercial Cluster assignment (editable dropdown)
  - Departments (bulleted list)
  - KPIs (bulleted list)
  - Microsoft Products (bulleted list)
  - Prerequisites (numbered list)
  - Contribution Types (badges)
  - Tags (badges)
- Clean, executive-grade styling with proper spacing
- Scrollable content area for long details

### 4. Category Flash Cards Modal
- **File**: `components/category-flash-cards-modal.tsx`
- Modal that opens when clicking a category
- Header shows category name and use case count
- Grid layout of flash cards (1-3 columns responsive)
- Each card clickable to open detailed view
- Integrates with detail dialog
- Close button and overlay click to dismiss

### 5. Microsoft Dashboard Updates
- **File**: `app/microsoft/page.tsx`
- Made category items clickable in "Use Case Distribution" section
- Added state management for selected category
- Integrated CategoryFlashCardsModal component
- Added cluster update functionality
- Passes available clusters to modal

### 6. Commercial Cluster Manager
- **File**: `components/commercial-cluster-manager.tsx`
- View and manage commercial clusters
- Cluster cards showing:
  - Cluster name and use case count
  - Aggregated metrics (departments, KPIs, products)
  - Key departments display
  - Primary KPIs preview
- Click cluster to see its flash cards
- Summary statistics section showing:
  - Active clusters count
  - Assigned use cases count
  - Unassigned use cases count
  - Assignment rate percentage
- "Unassigned" cluster automatically created for unmapped use cases

### 7. Use Cases Page Updates
- **File**: `app/use-cases/page.tsx`
- Added tabs for Timeline View and Commercial Clusters
- Integrated CommercialClusterManager component
- Added cluster update functionality
- Loading states for data fetching

## User Flows

### Flow 1: View Use Cases by Category
1. User navigates to Microsoft Dashboard
2. User clicks on a category (e.g., "Everyday AI Productivity")
3. Modal opens showing all flash cards for that category
4. User clicks on a flash card
5. Detail dialog opens showing full information

### Flow 2: Assign Use Case to Commercial Cluster
1. User opens a use case detail dialog (via flash card)
2. User selects a commercial cluster from dropdown
3. Assignment is saved automatically to CSV
4. Use case now appears in that cluster

### Flow 3: View Commercial Clusters
1. User navigates to Use Cases page
2. User switches to "Commercial Clusters" tab
3. View all clusters with aggregated metrics
4. Click on a cluster to see its use cases as flash cards
5. Can reassign use cases to different clusters

## Technical Details

### State Management
- Uses React hooks (useState) for local component state
- `useMasterData` hook for global use case data management
- Automatic CSV persistence via API endpoint

### Styling
- Clean, minimal design with subtle borders
- Executive-grade appearance
- No icons in cards (text and shapes only)
- Proper spacing and typography
- Responsive grid layouts
- Hover effects for interactivity

### Data Persistence
- Commercial cluster assignments saved to CSV file
- Two-way sync between UI and CSV
- Uses existing save-use-cases API endpoint

## Navigation
- **Microsoft Dashboard** (`/microsoft`): View and explore use cases by category
- **Use Cases** (`/use-cases`): Access commercial cluster management via tabs

## Future Enhancements
- LLM integration for auto-generating cluster descriptions
- LLM-suggested use case groupings
- Dynamic value calculation per cluster
- Export cluster reports
- Create new clusters inline (currently requires manual entry)

