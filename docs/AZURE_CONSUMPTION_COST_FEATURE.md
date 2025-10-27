# Azure Consumption Cost Feature

## Overview
Added comprehensive Azure consumption cost tracking and editing functionality to the ROI Calculator's process-specific view. This allows detailed cost modeling for each use case with editable Azure service costs and CIMB markup.

## Implementation Details

### Data Model
Added three new interfaces to `/app/roi-calculator/page.tsx`:

1. **AzureCostBreakdown**: Tracks individual Azure service costs (MYR/month)
   - Azure OpenAI (GPT-4 token costs)
   - Copilot Studio (session costs)
   - Power Apps (user licenses)
   - Storage (Blob storage)
   - Database (Azure SQL/Cosmos DB)
   - AKS (Kubernetes hosting)
   - Other (monitoring, networking, etc.)

2. **CostStructure**: Complete cost structure with markup
   - Azure cost breakdown
   - CIMB markup percentage (default 30%)
   - Total Azure cost
   - Total CIMB cost (markup amount)
   - Total monthly cost
   - Volume tier (Small/Medium/Large)

3. **ClusterParameters**: Extended with `azureCostStructure` optional field

### Default Costs - Application Intake (Medium Tier - 1,000 applications/month)

Based on realistic Azure pricing (USD primary, MYR equivalent):

| Service | Monthly Cost (USD) | Notes |
|---------|-------------------|-------|
| Azure OpenAI | $1,650 | 50K input + 10K output tokens per app. GPT-4o: $0.025/1K input, $0.04/1K output |
| Copilot Studio | $2,200 | Base $200 + 1K sessions × $2/session |
| Power Apps | $1,000 | 50 loan officers × $20/user/month (optional) |
| Storage | $180 | 10GB/app × 1K apps = 10TB. Mix of hot ($0.018/GB) + archive ($0.002/GB) |
| Database | $149 | Azure SQL Standard S2 (50 DTUs) - verified 2025 pricing |
| AKS | $140 | 2 × Standard D2s v3 nodes (2 vCPU, 8GB RAM each) |
| Other | $150 | Monitoring, networking, App Insights, API Management |
| **Total Azure** | **$5,469** | **~RM 24,611** |
| **CIMB Markup (30%)** | **$1,641** | **~RM 7,383** |
| **Total Monthly** | **$7,110** | **~RM 31,994** |

### UI Features

#### 1. T-shirt Size Selector (Pill-Shaped Design)
- **Small**: 50% of Medium costs (500 applications/month)
- **Medium**: Base costs (1,000 applications/month)
- **Large**: 200% of Medium costs (2,000 applications/month)

Clicking a size button automatically adjusts all Azure service costs proportionally.

**Design**: Pill-shaped buttons (`rounded-full`) with blue highlight for selected state, providing a modern, clean interface.

#### 2. Editable Service Costs with Info Tooltips
Each Azure service has:
- Input field for direct cost editing (USD)
- Real-time display with USD + MYR dual currency formatting
- Automatic recalculation of totals
- **Info tooltip (ⓘ)** on hover showing detailed assumptions:
  - **Azure OpenAI**: Token counts, pricing per 1K tokens
  - **Copilot Studio**: Session counts, base + per-session pricing
  - **Power Apps**: User counts, per-user pricing, marked as optional
  - **Storage**: GB per application, total storage, tier pricing
  - **Database**: SQL tier, DTU capacity, use case
  - **AKS**: Node count, VM size, vCPU/RAM specs

#### 3. Cost Summary Panel
Three summary cards showing:
- **Total Azure Cost**: Sum of all Azure services (MYR + USD)
- **CIMB Markup**: Editable percentage (default 30%) with calculated markup amount
- **Total Monthly Cost**: Azure + CIMB markup combined

All costs display in dual currency format: `RM X,XXX (${USD})`

### Location in UI
The cost section appears in the **Process-Specific ROI** view, specifically:
- After the "Metrics Grid" (Annual Savings, Per Transaction, etc.)
- Before the "Process Steps" breakdown
- Only visible when a cluster has `azureCostStructure` defined

### Design
- Clean gradient background (blue-50 to indigo-50)
- Bordered with blue-300 for clear visual separation
- Editable inputs styled minimally with gray borders
- Color-coded summary cards (blue, indigo, green)
- Responsive grid layout (2 columns for services, 3 for summary)

## Cost Calculation Logic

```typescript
// When any Azure service cost changes:
totalAzureCost = sum of all Azure service costs
totalCIMBCost = totalAzureCost × (cimbMarkup / 100)
totalMonthlyCost = totalAzureCost + totalCIMBCost

// When T-shirt size changes:
multiplier = Small: 0.5, Medium: 1.0, Large: 2.0
each service cost = base cost × multiplier
```

## Architecture Assumptions

### Application Intake Use Case
- **Azure OpenAI**: GPT-4 for form validation, auto-completion (~500 tokens per application)
- **Copilot Studio**: Conversational interface for applicants (1 session per application)
- **Power Apps**: Custom loan officer interface (assumed 50 concurrent users)
- **Storage**: Document uploads, form data (~50GB/month)
- **Azure SQL**: Basic tier for application metadata
- **AKS**: Basic cluster for hosting custom applications
- **Other**: Application Insights, networking, monitoring

## Future Enhancements

1. Add cost structures for remaining 7 clusters in Loan Applications
2. Add cost structures for Collections (3 clusters) and Contact Center (2 clusters)
3. Add annual cost projections
4. Add cost comparison charts (Azure vs. manual process costs)
5. Export cost breakdown to CSV/Excel
6. Add volume-based pricing tiers (usage-based scaling)
7. Integration with Azure Cost Management API for real-time pricing

## Currency Display
- **Primary Currency: USD** for Azure costs (as Azure prices in USD)
- **Secondary Currency: MYR** for local reference (RM 4.5 = USD 1.0)
- All Azure service costs stored and edited in **USD**
- MYR equivalent shown in parentheses for every cost
- Labor/savings costs remain in **MYR** (primary for local salaries)

## Baseline Dimensioning Reference

A CSV file has been created at `/public/data/azure-dimensioning-baseline.csv` containing:

1. **Use Case Benchmarks**: 12 use cases with realistic token consumption and costs
   - Synthetic Customers, BIAN Mapping, ECOM Onboarding, etc.
   - Token input/output volumes
   - Monthly costs and annual consumption

2. **Frequency of Use Matrix**:
   - Light: 2 sessions/month
   - Medium: 5 sessions/month
   - Frequent: 30 sessions/month
   - Intense: 400 sessions/month

3. **Intensity Levels** (Turns per Session):
   - Low: 2 turns
   - Medium: 5 turns
   - High: 10 turns
   - Intense: 30 turns

4. **Complexity Levels** (Tokens per Turn):
   - Low: 300 input / 5,000 output
   - Medium: 1,000 input / 10,000 output
   - High: 2,000 input / 20,000 output
   - Very High: 5,000 input / 50,000 output

5. **Model Pricing** (Cost per Million Tokens):
   - GPT-4O: $0.0025 input / $0.01 output
   - GPT-4O-Mini: $0.00015 input / $0.0006 output
   - O1-Mini: $0.0121 input / $0.0484 output
   - O3-Mini: $0.0011 input / $0.0044 output

This baseline can be used to calculate custom cost scenarios based on:
- `Total Monthly Cost = (Frequency × Intensity × Complexity × Model Cost)`

## Transparency & Visual Design

All cost breakdown boxes use `bg-white/60 backdrop-blur-sm` for a modern, semi-transparent glass-morphism effect that makes the interface feel lighter and more elegant.

## Status
✅ **Implemented for Application Intake cluster only** (as requested)

Ready to replicate for all other use case clusters with the baseline dimensioning framework.

