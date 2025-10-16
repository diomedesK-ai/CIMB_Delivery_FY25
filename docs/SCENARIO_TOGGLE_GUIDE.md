# Scenario Toggle Feature - User Guide

## Overview

The Scenario Toggle feature allows you to switch between **Conservative** and **Best Case** ROI projections across the entire application. This provides flexibility for different audiences and presentation contexts.

---

## Two Scenarios Explained

### 1. Conservative Scenario (Default)
**When to Use**: Initial business cases, CFO presentations, board approvals, budget planning

**Characteristics**:
- Uses baseline ROI estimates (as stored in CSV)
- Built-in safety margins
- Under-promises to allow over-delivery
- 15-54% below industry high-end benchmarks
- Provides upside potential

**Example**:
- M365 Copilot: 130% ROI (vs. Forrester 282%)
- Customer Bot: 300% ROI (vs. Industry 400%)
- Fraud Detection: 420% ROI (defensible baseline)

**Best For**:
- Initial approvals
- Risk-averse stakeholders
- Conservative financial planning
- First-time AI implementations

---

### 2. Best Case Scenario
**When to Use**: Proven performance, success stories, scaling discussions, optimistic projections

**Characteristics**:
- Based on Forrester TEI benchmarks
- Reflects optimal, proven outcomes
- 20-90% higher than conservative
- Matches industry high-end performance
- Assumes smooth implementation

**Adjustment Formula**:
```
If baseROI ≤ 150: bestCase = baseROI × 1.9  (90% increase)
If baseROI ≤ 250: bestCase = baseROI × 1.5  (50% increase)
If baseROI ≤ 350: bestCase = baseROI × 1.3  (30% increase)
If baseROI > 350: bestCase = baseROI × 1.2  (20% increase)
```

**Example**:
- M365 Copilot: 130% → **247%** (closer to Forrester 282%)
- Customer Bot: 300% → **390%** (closer to industry 400%)
- Fraud Detection: 420% → **504%** (high-end performance)

**Best For**:
- Success story presentations
- Scaling existing implementations
- Proven use case expansion
- Optimistic planning scenarios

---

## Where the Toggle Appears

### Global Access
The scenario toggle appears on:
- ✅ **Strategic Functions** page (top of page)
- ✅ **AI Clusters** (Microsoft) page (below header)
- ✅ All category cards
- ✅ All individual use case detail views
- ✅ Commercial Cluster views
- ✅ All aggregated metrics

### Real-Time Updates
Switching scenarios **instantly recalculates**:
- Individual use case ROI
- Aggregated weighted ROI per category
- Aggregated weighted ROI per function
- Total investment returns
- Net economic value
- All benefit breakdowns

---

## How to Use

### Step 1: Select Your Scenario

**Conservative** (Blue Button):
```
[🔽 Conservative] [ Best Case ]
```
- Default scenario
- Safer projections
- Conservative description shown

**Best Case** (Green Button):
```
[ Conservative ] [🔼 Best Case]
```
- Optimistic projections
- Green banner explains adjustment
- "Best Case: Based on Forrester TEI benchmarks..."

### Step 2: Review Updated Metrics

All numbers update immediately:
- ROI percentages change
- Economic benefits recalculate
- Net values adjust
- Weighted aggregations update

### Step 3: Present with Confidence

**Conservative Talking Points**:
> "These are conservative estimates with built-in safety margins. Actual results may exceed these projections, as seen in Forrester studies."

**Best Case Talking Points**:
> "These projections reflect optimal performance based on Forrester TEI benchmarks and industry high-end results. They represent achievable outcomes with successful implementation."

---

## Example Comparisons

### Example 1: M365 Copilot for 2000 Users

**Investment**: $2.76M (same in both scenarios)

| Metric | Conservative | Best Case | Difference |
|--------|-------------|-----------|------------|
| **ROI** | 130% | 247% | +90% |
| **Economic Benefits** | $3.59M | $6.82M | +$3.23M |
| **Net Value** | $830k | $4.06M | +$3.23M |

---

### Example 2: Fraud Detection System

**Investment**: $2.54M (same in both scenarios)

| Metric | Conservative | Best Case | Difference |
|--------|-------------|-----------|------------|
| **ROI** | 420% | 504% | +20% |
| **Economic Benefits** | $10.67M | $12.80M | +$2.13M |
| **Net Value** | $8.13M | $10.26M | +$2.13M |

---

### Example 3: Category-Level Aggregation

**Everyday AI Productivity** (27 use cases)

| Metric | Conservative | Best Case | Difference |
|--------|-------------|-----------|------------|
| **Weighted ROI** | 270% | 370% | +37% |
| **Total Investment** | $20M | $20M | — |
| **Economic Benefits** | $54M | $74M | +$20M |
| **Total Value** | $34M | $54M | +$20M |

---

## Use Case Scenarios

### Scenario A: Initial Board Approval

**Situation**: Presenting AI strategy to board for first-time approval

**Recommendation**: **Conservative Scenario**

**Why**:
- Board is risk-averse with new technology
- Need to secure approval without over-promising
- Want safety margin for implementation challenges
- Can show upside potential later

**Talking Points**:
> "We're using conservative estimates 15-54% below industry benchmarks. Forrester found 282% ROI for M365 Copilot; we're projecting 130%. This provides significant upside if we match industry performance."

---

### Scenario B: Success Story Presentation

**Situation**: Showing results after 6 months of successful M365 Copilot deployment

**Recommendation**: **Best Case Scenario**

**Why**:
- Proven success de-risks projections
- Can confidently cite actual performance
- Justifies scaling investment
- Demonstrates value realization

**Talking Points**:
> "Our M365 Copilot implementation has exceeded conservative estimates. We're now projecting 247% ROI based on actual usage data and Forrester benchmarks, supporting expansion from 2,000 to 5,000 users."

---

### Scenario C: CFO Budget Planning

**Situation**: Annual budget cycle, need reliable financial projections

**Recommendation**: **Conservative Scenario**

**Why**:
- Finance requires defensible numbers
- Budget accountability is critical
- Under-promise allows budget cushion
- Upside creates positive variance

**Talking Points**:
> "Budget request is based on conservative ROI assumptions. Any outperformance creates positive budget variance and justifies additional AI investment next cycle."

---

### Scenario D: Scaling Proven Use Cases

**Situation**: Expanding fraud detection from pilot to enterprise-wide

**Recommendation**: **Best Case Scenario**

**Why**:
- Pilot proved the technology works
- Scaling reduces unit costs
- Can cite pilot results
- Optimization improves performance

**Talking Points**:
> "Pilot fraud detection achieved 450% ROI. Enterprise-scale deployment will benefit from optimizations and economies of scale, projecting 504% ROI using industry best-case benchmarks."

---

## Methodology & Rationale

### Conservative Multiplier: 1.0× (No Change)
**Rationale**: Base CSV values already incorporate safety margins

**Sources**:
- Industry analyst reports (Gartner, Forrester, McKinsey)
- Actual client deployments
- Vendor case studies
- Academic research

**Approach**: Mid-to-low range of published benchmarks

---

### Best Case Multipliers

#### Very Conservative (≤150%): 1.9× Multiplier
**Rationale**: Base ROI is very conservative; best case brings to industry standard

**Example**: 
- M365 Copilot base 130% → 247% best case
- Still below Forrester's 282% benchmark
- Represents realistic high-end performance

---

#### Conservative (151-250%): 1.5× Multiplier
**Rationale**: Base ROI is conservative; best case matches industry average

**Example**:
- Knowledge Search base 210% → 315% best case
- Aligns with document automation standards (300-350%)

---

#### Mid-Range (251-350%): 1.3× Multiplier
**Rationale**: Base ROI is realistic; best case matches high-end

**Example**:
- Customer Bot base 300% → 390% best case
- Approaches industry high-end of 400%

---

#### Already High (>350%): 1.2× Multiplier
**Rationale**: Base ROI already aggressive; modest increase for optimal performance

**Example**:
- Fraud Detection base 420% → 504% best case
- Stays within industry range of 350-520%

---

## Technical Implementation

### Global Context
```typescript
// contexts/scenario-context.tsx
export type Scenario = 'conservative' | 'bestcase';

const getAdjustedROI = (baseROI: number): number => {
  if (scenario === 'conservative') return baseROI;
  
  // Best case adjustments
  if (baseROI <= 150) return Math.round(baseROI * 1.9);
  if (baseROI <= 250) return Math.round(baseROI * 1.5);
  if (baseROI <= 350) return Math.round(baseROI * 1.3);
  return Math.round(baseROI * 1.2);
};
```

### Component Usage
```typescript
// Any component can use scenario
import { useScenario } from '@/contexts/scenario-context';

const { getAdjustedROI, scenario, scenarioLabel } = useScenario();

// Apply to ROI calculations
const baseROI = useCase.roi || 300;
const adjustedROI = getAdjustedROI(baseROI);
const returnValue = investment * (adjustedROI / 100);
```

### Real-Time Updates
- Switching scenarios triggers React re-renders
- All components using `useScenario` recalculate
- No page refresh required
- All aggregations update automatically

---

## Best Practices

### DO:
✅ Use Conservative for initial approvals
✅ Use Best Case for proven implementations
✅ Explain the scenario choice to audience
✅ Document which scenario was used
✅ Switch scenarios for sensitivity analysis

### DON'T:
❌ Use Best Case for first-time pitches
❌ Mix scenarios in same presentation
❌ Present without explaining methodology
❌ Assume Best Case is guaranteed
❌ Use Best Case for budget commitments

---

## Frequently Asked Questions

**Q: Which scenario should I use by default?**
A: Conservative. It's the default for good reason - safer projections.

**Q: Can I create custom scenarios?**
A: Not currently. Two scenarios cover most needs without confusion.

**Q: Do scenarios change investment costs?**
A: No. Investment (licenses, ACR, implementation) stays the same. Only ROI changes.

**Q: Why don't all use cases change by the same amount?**
A: Different multipliers reflect how conservative the base estimate was. Very conservative estimates get larger adjustments.

**Q: Is Best Case unrealistic?**
A: No. Best Case reflects Forrester TEI benchmarks and industry high-end performance. It's achievable with successful implementation.

**Q: Should I show both scenarios in presentations?**
A: Only if doing sensitivity analysis. Otherwise, pick one appropriate for the audience.

**Q: Can I export data with scenario selection?**
A: Future enhancement. Currently, scenario is UI-only.

---

## Summary

The Scenario Toggle provides:
- ✅ Flexibility for different audiences
- ✅ Conservative safety margins (default)
- ✅ Optimistic projections based on proven benchmarks
- ✅ Real-time recalculation across entire app
- ✅ Defensible methodology for both scenarios
- ✅ Easy switching without data loss

**Use wisely and present confidently!**

---

*Last Updated: October 14, 2025*
*Feature Status: ✅ Production Ready*


