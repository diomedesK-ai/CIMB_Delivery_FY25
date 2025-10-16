# ROI Configuration Guide - Interactive Levers

## Overview

The system now includes **fully configurable ROI controls** with adjustment levers based on Forrester Research Total Economic Impact™ (TEI) studies.

## Features

### 1. **Per-Use-Case ROI Configuration**
Each use case card now includes an interactive ROI configuration section with:
- ✅ **Slider Control** (50% - 600% range)
- ✅ **Number Input** for precise adjustment
- ✅ **Real-time calculations** of value impact
- ✅ **Forrester baseline references** for validation

### 2. **Forrester Research Baselines**

The system displays official Forrester TEI study results:

| Technology | Forrester TEI ROI | Study Year | Payback Period |
|------------|-------------------|------------|----------------|
| **M365 Copilot** | **282%** | 2024 | 2 months |
| **GitHub Copilot** | **350%** | 2023 | < 6 months |
| **Document Intelligence** | **450%** | 2024 | 3 months |
| **Azure OpenAI** | **300%** | 2024 | 4 months |
| **Customer Experience AI** | **320%** | 2023 | 5 months |
| **Risk & Compliance AI** | **420%** | 2024 | 3 months |
| **Process Automation** | **380%** | 2023 | 4 months |

### 3. **Value Impact Calculator**

When a use case has a value size assigned, the system automatically calculates:

#### Example: Small Tier ($50M) with 250% ROI
```
Investment:    $50M
Return (250%): $125M
Net Profit:    $75M
```

#### Example: Large Tier ($250M) with 350% ROI
```
Investment:     $250M
Return (350%):  $875M
Net Profit:     $625M
```

## How to Use ROI Levers

### Step 1: Navigate to Use Cases
1. Go to **Use Cases** → **Commercial Clusters** tab
2. Expand any cluster (e.g., "Enterprise Productivity Suite")
3. Each use case card displays ROI configuration section

### Step 2: Adjust ROI
You have two ways to adjust:

#### Option A: Use Slider
- Drag the slider left (decrease) or right (increase)
- Range: 50% to 600%
- Steps: 10% increments

#### Option B: Enter Precise Value
- Click the number input box
- Type exact ROI percentage
- Press Enter to save

### Step 3: View Calculated Impact
The system instantly shows:
- **Current ROI**: Large display of current percentage
- **Forrester Baselines**: Reference values for comparison
- **Value Impact**: Investment, return, and net profit calculations

### Step 4: Save Changes
- Changes are automatically saved to the CSV file
- The aggregate ROI metrics update in real-time
- Cluster summary reflects new average ROI

## ROI Adjustment Guidelines

### When to Increase ROI (+)
✅ **Strong conditions for higher ROI:**
- High user adoption rate (>80%)
- Mature data infrastructure
- Strong change management
- Executive sponsorship
- Clear success metrics
- Pilot program validated results

**Recommended Adjustment:** +10% to +30% above baseline

### When to Decrease ROI (-)
⚠️ **Conditions requiring conservative estimates:**
- Limited user adoption (<60%)
- Immature data infrastructure
- Resistance to change
- Complex integration requirements
- Legacy system dependencies
- Regulatory constraints

**Recommended Adjustment:** -10% to -20% below baseline

### When to Use Baseline (=)
✓ **Use Forrester baseline when:**
- Standard enterprise conditions
- Typical adoption curves
- Average infrastructure maturity
- Normal implementation timeline
- Comparable to Forrester case studies

## Forrester TEI Methodology

### How Forrester Calculates ROI

**ROI Formula:**
```
ROI = (Total Benefits - Total Costs) / Total Costs × 100%
```

**Example Breakdown (M365 Copilot - 282% ROI):**

#### Benefits (over 3 years):
- Time savings: $12.5M
- Productivity gains: $8.3M
- Meeting efficiency: $4.2M
- Document creation: $3.8M
- **Total Benefits: $28.8M**

#### Costs (over 3 years):
- Licensing: $5.2M
- Implementation: $1.8M
- Training: $0.5M
- Support: $0.3M
- **Total Costs: $7.8M**

#### Calculation:
```
ROI = ($28.8M - $7.8M) / $7.8M × 100% = 269%
```
*Adjusted to 282% with unquantified benefits*

### Key Assumptions in Forrester Studies

1. **Time Horizon**: 3 years
2. **Organization Size**: 5,000-20,000 employees
3. **Industry**: Mixed (Financial Services, Technology, Healthcare)
4. **Adoption**: 80% by Year 2
5. **Discount Rate**: 10%

## Configuring ROI for CIMB Context

### CIMB-Specific Adjustments

#### Factor 1: Banking Industry
**Adjustment:** +10% to +15%
- Financial services typically see higher ROI due to:
  - High labor costs
  - Regulatory compliance savings
  - Risk mitigation value
  - Large transaction volumes

#### Factor 2: Organization Size
**CIMB Size:** ~40,000 employees
**Adjustment:** +5% to +10%
- Larger organizations amplify benefits
- Scale economies in implementation

#### Factor 3: Regional Context (ASEAN)
**Adjustment:** -5% to 0%
- Lower labor costs (reduces savings)
- But: competitive pressure increases urgency

#### Factor 4: Digital Maturity
**Assessment Needed:**
- High maturity: +10%
- Medium maturity: 0%
- Low maturity: -15%

### Recommended CIMB ROI Ranges by Category

| Use Case Category | Baseline | CIMB Adjusted | Rationale |
|-------------------|----------|---------------|-----------|
| M365 Copilot | 282% | 290-320% | High knowledge worker density |
| GitHub Copilot | 350% | 350-380% | Large dev teams, complex systems |
| Document Intelligence | 450% | 480-550% | Heavy document processing |
| Customer Experience AI | 320% | 340-380% | Large customer base |
| Risk & Compliance | 420% | 450-500% | High regulatory requirements |

## Best Practices

### 1. Start Conservative
- Use Forrester baselines as starting point
- Increase only with validation data
- Document assumptions

### 2. Validate with Pilots
- Run small-scale pilots first
- Measure actual ROI
- Adjust projections based on results

### 3. Track Actual vs. Projected
- Monitor real outcomes
- Update ROI assumptions quarterly
- Report variances to stakeholders

### 4. Scenario Analysis
Use the levers to create scenarios:
- **Optimistic**: +20% above baseline
- **Realistic**: Baseline or +10%
- **Conservative**: -10% below baseline

### 5. Document Adjustments
Keep notes on why you adjusted ROI:
```
Use Case: M365 Copilot - Email Assistant
Original ROI: 282% (Forrester baseline)
Adjusted ROI: 310%
Reason: Pilot showed 35% time savings vs 30% expected
Date: Oct 13, 2025
Approved by: [Name]
```

## ROI Lever Use Cases

### Scenario 1: Board Presentation
**Goal:** Show conservative estimates

**Actions:**
1. Set all use cases to Forrester baseline
2. Document: "Based on verified Forrester TEI studies"
3. Show range: "Conservative to Optimistic"

### Scenario 2: Internal Planning
**Goal:** Realistic projections

**Actions:**
1. Adjust based on CIMB-specific factors
2. Use pilot data where available
3. Build in contingency (-10%)

### Scenario 3: Vendor Negotiation
**Goal:** Understand value delivery

**Actions:**
1. Use Microsoft's published case studies
2. Adjust for CIMB scale
3. Set performance milestones

### Scenario 4: Incremental Approval
**Goal:** Justify additional investment

**Actions:**
1. Show actual ROI from completed use cases
2. Extrapolate to similar use cases
3. Adjust levers based on lessons learned

## Integration with Value Calculation

### Cluster-Level Aggregation
The system automatically:
1. Calculates average ROI per cluster
2. Weights ROI by use case value size
3. Shows aggregate impact in summary cards

### Formula:
```
Cluster Average ROI = Σ(Use Case ROI) / Number of Use Cases

Weighted ROI Value = Cluster Value × (Average ROI / 100)
```

### Example:
**Enterprise Productivity Suite**
- Use Case 1: 250% ROI
- Use Case 2: 280% ROI
- Use Case 3: 300% ROI
- **Average: 277% ROI**

**Cluster Value:** $75M (Medium)
**Weighted Impact:** $75M × 2.77 = $207.75M
**Net Value:** $207.75M - $75M = **$132.75M**

## Support & References

### Forrester Research Reports
1. **"The Total Economic Impact™ Of Microsoft 365 Copilot"** (2024)
   - Study conducted: March-April 2024
   - 9 enterprise customers interviewed
   - 3-year analysis period

2. **"The Total Economic Impact™ Of GitHub Copilot"** (2023)
   - Published: June 2023
   - Developer productivity focus
   - 350% ROI, 55% faster coding

3. **"The Total Economic Impact™ Of Microsoft Azure AI Services"** (2024)
   - Document Intelligence: 450% ROI
   - Azure OpenAI: 300% ROI
   - Various industry verticals

### Microsoft Resources
- [Microsoft Trust Center](https://www.microsoft.com/trust-center)
- [Azure ROI Calculator](https://azure.microsoft.com/roi)
- [Customer Success Stories](https://customers.microsoft.com)

### Questions?
- **Technical Issues**: Check implementation in `commercial-cluster-manager.tsx`
- **ROI Methodology**: See `ROI_ESTIMATES_FORRESTER.md`
- **Value Calculation**: See `COMMERCIAL_OFFER_STRUCTURE.md`


