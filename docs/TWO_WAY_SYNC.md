# Two-Way Sync: Master CSV Data Integration

## Overview

The CIMB Delivery Dashboard now features a **two-way sync system** with the master CSV file (`public/data/master-use-cases.csv`). This means:

1. **CSV → Dashboard**: All use case data is read from the master CSV file
2. **Dashboard → CSV**: Any changes made in the UI are automatically saved back to the CSV

The CSV file is the **single source of truth** for all use case data.

## Architecture

### Components

1. **Master CSV File**: `/public/data/master-use-cases.csv`
   - Original file: `AI_Banking_Use_Cases___Departments__KPIs__Products.csv`
   - Contains 137+ use cases with full details

2. **CSV Parser** (`lib/csv-parser.ts`)
   - Parses CSV data into structured TypeScript objects
   - Handles CSV formatting (quotes, commas, multi-line fields)
   - Provides utility functions for searching, filtering, and grouping

3. **Data Hook** (`hooks/use-master-data.ts`)
   - Custom React hook for managing use case data
   - Provides CRUD operations (Create, Read, Update, Delete)
   - Automatically syncs changes to CSV via API

4. **API Endpoint** (`app/api/save-use-cases/route.ts`)
   - Handles reading and writing the master CSV file
   - POST: Saves updated CSV content
   - GET: Fetches current CSV content

5. **Management Interface** (`app/use-cases/manage/page.tsx`)
   - User-friendly interface for managing use cases
   - Add, edit, delete use cases
   - Changes immediately update the CSV file

### Data Flow

```
CSV File ──┐
           │
           ├─→ CSV Parser ─→ useMasterData Hook ─→ UI Components
           │                                             │
           │                                             │
           └─────────────── API Endpoint ←──────────────┘
                           (saves changes)
```

## CSV Schema

The master CSV file has the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| **Group** | Main category/group | "0. Everyday AI Productivity" |
| **Sub-Category** | Sub-grouping | "0.A Knowledge & Document Co-Pilots" |
| **Use Case / Scenario** | Name of the use case | "Copilot Studio for most office workers" |
| **Bank Departments Involved** | Semicolon-separated list | "IT/CTO & Engineering; Data & Analytics (CDO)" |
| **Primary KPIs (1–2)** | Key performance indicators | "Time saved per user/day; Success rate" |
| **Microsoft / Partner Products** | Products used | "Microsoft 365 Copilot; Azure AI Search" |

## Usage

### Loading Master Data

```typescript
import { useMasterData } from '@/hooks/use-master-data';

function MyComponent() {
  const { useCases, isLoading, error } = useMasterData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {useCases.map(uc => (
        <div key={uc.id}>{uc.useCase}</div>
      ))}
    </div>
  );
}
```

### Adding a Use Case

```typescript
const { addUseCase } = useMasterData();

await addUseCase({
  group: "0. Everyday AI Productivity",
  subCategory: "0.A Knowledge & Document Co-Pilots",
  useCase: "New AI Assistant",
  departments: ["IT/CTO & Engineering", "HR / L&D"],
  kpis: ["User satisfaction", "Time saved"],
  microsoftProducts: ["Microsoft 365 Copilot"]
});
```

### Updating a Use Case

```typescript
const { updateUseCase } = useMasterData();

await updateUseCase('use-case-id', {
  kpis: ["Updated KPI 1", "Updated KPI 2"]
});
```

### Deleting a Use Case

```typescript
const { deleteUseCase } = useMasterData();

await deleteUseCase('use-case-id');
```

## Enhanced Components

The following components now display data from the master CSV:

### 1. Use Case Cards (`components/use-case-cards.tsx`)
- Shows **Department Dependencies** from CSV
- Displays **Primary KPIs** from CSV
- Lists **Microsoft Products** from CSV
- Enriches existing use case data with CSV information

### 2. Timeline View (`components/timeline-view.tsx`)
- Integrates CSV data into timeline display
- Shows department and KPI counts
- Detailed view includes all CSV fields

### 3. AI Value Gantt (`components/ai-value-gantt.tsx`)
- Can be enhanced with CSV data for comprehensive project planning
- Use cases mapped to workstreams

## Management Interface

Navigate to **"Manage Master Data"** in the sidebar to:

1. **View All Use Cases**: Browse the complete list from the CSV
2. **Search & Filter**: Find specific use cases by name, group, or category
3. **Add New Use Cases**: Create new entries that save to CSV
4. **Edit Existing**: Modify any field and save changes
5. **Delete**: Remove use cases (with confirmation)
6. **Refresh**: Reload data from CSV file
7. **View Stats**: See total counts of use cases, departments, and products

## Data Enrichment

Legacy use cases in the dashboard are automatically enriched with CSV data using fuzzy matching:

```typescript
const enrichedUseCases = useCases.map((useCase) => {
  const csvMatch = masterUseCases.find((csvUC) => 
    // Fuzzy matching logic
    csvUC.useCase.toLowerCase().includes(useCase.name.toLowerCase()) ||
    useCase.name.toLowerCase().includes(csvUC.useCase.toLowerCase())
  );

  return {
    ...useCase,
    csvDepartments: csvMatch?.departments || [],
    csvKpis: csvMatch?.kpis || [],
    csvMicrosoftProducts: csvMatch?.microsoftProducts || [],
  };
});
```

## API Endpoints

### POST `/api/save-use-cases`

Saves updated CSV content to the master file.

**Request:**
```json
{
  "csvContent": "Group,Sub-Category,Use Case / Scenario,...\n..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Use cases saved successfully"
}
```

### GET `/api/save-use-cases`

Fetches the current CSV content.

**Response:**
```json
{
  "success": true,
  "csvContent": "Group,Sub-Category,Use Case / Scenario,...\n..."
}
```

## Benefits

1. **Single Source of Truth**: CSV file contains all authoritative data
2. **Easy Editing**: Manage use cases through intuitive UI
3. **Data Consistency**: Changes in UI immediately reflect in CSV
4. **Auditability**: CSV file can be version-controlled with git
5. **Portability**: Export/import CSV for external analysis
6. **Flexibility**: Add new fields or use cases without code changes

## Best Practices

1. **Backup**: Always backup the CSV file before major changes
2. **Validation**: The system validates required fields (use case name)
3. **Formatting**: Use semicolons (;) to separate multiple values in departments, KPIs, and products
4. **Consistency**: Follow naming conventions from existing entries
5. **Review**: Check changes in the CSV file after updates

## Troubleshooting

### CSV File Not Loading
- Check that `/public/data/master-use-cases.csv` exists
- Verify CSV format (no syntax errors)
- Check browser console for errors

### Changes Not Saving
- Ensure API endpoint has write permissions
- Check network tab for failed requests
- Verify CSV file is not read-only

### Data Not Matching
- Click "Refresh from CSV" to reload data
- Clear browser cache
- Check for duplicate entries with same name

## Future Enhancements

Potential improvements to the two-way sync system:

1. **Conflict Resolution**: Handle concurrent edits
2. **Version History**: Track changes over time
3. **Batch Operations**: Import/export multiple use cases
4. **Real-time Sync**: WebSocket updates for multi-user scenarios
5. **Field Validation**: Enhanced validation rules
6. **CSV Templates**: Download template for bulk imports

## Summary

The two-way sync system ensures that the CIMB Delivery Dashboard always reflects the latest use case data while allowing easy management through the UI. The master CSV file remains the authoritative source, enabling both programmatic access and human-readable documentation.




