# Services Cost Adjustments & Display Improvements

## Date: October 15, 2025

## Issues Identified

1. **Services cost was $36.1M** instead of the expected $17-18M USD
2. **Services cost was not prominent enough** in the function cards
3. **Investment breakdown was unclear** - users didn't understand that investment includes services cost

## Root Cause

The implementation cost bucketing system was **too generous** with scoring:
- **Tier 2 threshold** was set at 15 points (too low)
- **Azure OpenAI scoring** was 8 points (too high for a common product)
- **Multi-department bonus** was 5 points per department (too generous)
- **Tier 2 cost ranges** were too high ($150K-$750K)

This caused too many use cases to be classified as Tier 2, inflating the total services cost from the expected $17-18M to $36.1M.

## Fixes Applied

### 1. Implementation Cost Scoring Adjustments

**File**: `lib/csv-parser.ts`

#### Reduced Product Complexity Scores (Lines 446-452)
**Before**:
- Azure OpenAI: **8 points**
- Document Intelligence: **7 points**

**After**:
- Azure OpenAI: **5 points** (reduced by 3)
- Document Intelligence: **6 points** (reduced by 1)

**Rationale**: Azure OpenAI is a common product used in many use cases. It should not automatically push use cases into Tier 2.

#### Reduced Multi-Department Bonus (Line 481)
**Before**:
- **+5 points** per department over 2

**After**:
- **+3 points** per department over 2 (reduced by 2)

**Rationale**: Multi-department deployments are common and don't always indicate high complexity.

#### Increased Tier 2 Threshold (Line 519)
**Before**:
- Tier 2: Score **>= 15**
- Tier 1: Score **< 15**

**After**:
- Tier 2: Score **>= 20** (increased by 5)
- Tier 1: Score **< 20**

**Rationale**: Increase the bar for Tier 2 classification to push more use cases into Tier 1.

#### Reduced Tier 2 Cost Ranges (Lines 522-529)
**Before**:
- Score >= 30: $750,000
- Score >= 25: $450,000
- Score >= 20: $280,000
- Score >= 15: $150,000

**After**:
- Score >= 30: **$550,000** (reduced by $200K)
- Score >= 25: **$350,000** (reduced by $100K)
- Score >= 22: **$220,000** (reduced by $60K)
- Score >= 20: **$140,000** (reduced by $10K)

**Rationale**: More conservative costs for Tier 2 use cases.

#### Adjusted Tier 1 Cost Ranges (Lines 542-549)
**Before**:
- Score >= 10: $85,000
- Score >= 5: $60,000
- Score < 5: $40,000

**After**:
- Score >= 15: **$90,000** (new bracket, just below Tier 2 threshold)
- Score >= 10: **$70,000** (reduced from $85K)
- Score >= 5: **$50,000** (reduced from $60K)
- Score < 5: **$35,000** (reduced from $40K)

**Rationale**: Slightly reduced costs across Tier 1 to be more conservative.

### Expected Services Cost Impact

**Before Adjustments**:
- Total services cost: **$36.1M**
- Too many Tier 2 use cases

**After Adjustments** (Estimated):
- Total services cost: **$17-20M** (target range)
- Distribution:
  - **~75-80 use cases** in Tier 1 (avg $50-70K) = ~$4-5M
  - **~45-50 use cases** in Tier 2 (avg $200-350K) = ~$9-12M
  - **~10-12 use cases** in Tier 3 (avg $1.5-2.5M) = ~$4-8M
  - **Total**: $17-25M (depending on actual distribution)

### 2. Services Cost Display Improvements

**File**: `app/functions/page.tsx`

#### Function Cards - More Prominent Display (Lines 258-267)

**Before**:
```tsx
<div className="flex justify-between items-center">
  <span className="text-xs text-orange-600">Services Cost:</span>
  <span className="text-sm font-semibold text-orange-700">{formatCurrency(func.totalImplementationCost)}</span>
</div>
```

**After**:
```tsx
<div className="bg-orange-50 rounded px-2 py-1.5 border border-orange-200">
  <div className="flex justify-between items-center">
    <span className="text-xs font-semibold text-orange-700">Services Cost:</span>
    <span className="text-sm font-bold text-orange-700">{formatCurrency(func.totalImplementationCost)}</span>
  </div>
  <p className="text-[10px] text-orange-600 mt-0.5">
    (included in investment)
  </p>
</div>
```

**Changes**:
- Added **orange background** with border for prominence
- Made text **bold** instead of semibold
- Added clarifying note: **(included in investment)**

#### Function Dialog - Investment Breakdown (Lines 311-348)

**Added to "Aggregated Function Metrics" section**:

1. **Under Total Investment**:
```tsx
<p className="text-xs text-orange-600 mt-1">
  (incl. {formatCurrency(selectedFunction.totalImplementationCost)} services)
</p>
```

2. **New "Investment Breakdown" Section**:
```tsx
<div className="mt-4 pt-4 border-t border-purple-300">
  <p className="text-sm font-semibold text-gray-700 mb-2">Investment Breakdown:</p>
  <div className="grid grid-cols-3 gap-3 text-center">
    <div className="bg-white rounded p-2">
      <p className="text-xs text-gray-600">Licenses + ACR</p>
      <p className="text-sm font-bold text-gray-900">
        {formatCurrency(selectedFunction.totalInvestment - selectedFunction.totalImplementationCost)}
      </p>
    </div>
    <div className="bg-white rounded p-2">
      <p className="text-xs text-orange-600">Services Cost</p>
      <p className="text-sm font-bold text-orange-700">
        {formatCurrency(selectedFunction.totalImplementationCost)}
      </p>
    </div>
    <div className="bg-white rounded p-2">
      <p className="text-xs text-gray-600">Total</p>
      <p className="text-sm font-bold text-gray-900">
        {formatCurrency(selectedFunction.totalInvestment)}
      </p>
    </div>
  </div>
</div>
```

**Benefits**:
- **Crystal clear** that Investment = Licenses + ACR + Services
- **Visual breakdown** shows the three components
- **Eliminates confusion** about whether investment includes services

## Validation

### Complexity Scoring Examples

#### Example 1: Basic M365 Copilot (HR Team)
- Products: M365 Copilot
- Departments: 1 (HR L&D)
- Use case: Simple productivity tool

**Score**: 0 points
- M365 Copilot: 0 (not in scoring)
- Departments: 0 (only 1 dept)
- **Tier**: 1
- **Cost**: $35,000

#### Example 2: Azure OpenAI Chatbot (Customer Service)
- Products: Azure OpenAI, Copilot Studio
- Departments: 2 (Contact Center, IT/CTO)
- Use case: Customer service bot

**Score**: 5 + 10 = 15 points
- Azure OpenAI: 5
- Customer-facing: 10
- **Tier**: 1 (just below threshold)
- **Cost**: $90,000

#### Example 3: Multi-Department Azure OpenAI (3 departments)
- Products: Azure OpenAI, Document Intelligence
- Departments: 3 (Finance, Legal, Compliance)
- Use case: Report automation

**Score**: 5 + 6 + 3 = 14 points
- Azure OpenAI: 5
- Document Intelligence: 6
- Multi-dept (3): +3
- **Tier**: 1
- **Cost**: $70,000

#### Example 4: Complex AI Platform (5 departments)
- Products: Azure OpenAI, Fabric, Document Intelligence
- Departments: 5
- Use case: Data analytics platform

**Score**: 5 + 10 + 6 + 9 = 30 points
- Azure OpenAI: 5
- Fabric: 10
- Document Intelligence: 6
- Multi-dept (5): +9 (3 × 3)
- **Tier**: 2
- **Cost**: $550,000

#### Example 5: Enterprise M365 Copilot
- Products: M365 Copilot
- Departments: 8
- Use case: "Copilot Studio for most office workers"

**Score**: 40 + 18 = 58 points
- Enterprise-wide: 40
- Multi-dept (8): +18 (6 × 3)
- **Tier**: 3
- **Cost**: $2,200,000

## Testing Recommendations

1. **Navigate to Strategic Functions** (`/functions`)
2. **Verify Services Cost in header** - should now be closer to $17-20M (down from $36.1M)
3. **Check function cards** - Services Cost should have orange background
4. **Click on any function** to open dialog
5. **Verify "Investment Breakdown" section** shows three components clearly
6. **Verify "Total Investment" note** shows included services amount

## Files Modified

1. `lib/csv-parser.ts` - Implementation cost scoring adjustments
2. `app/functions/page.tsx` - Services cost display improvements

## Documentation Files

1. `docs/SERVICES_COST_ADJUSTMENTS.md` (this file)
2. `docs/IMPLEMENTATION_COST_BUCKETING.md` - Updated tier targets

---

**Version**: 1.0  
**Target Services Cost**: $17-20M USD  
**Status**: Ready for Testing  
**Expected Impact**: 40-45% reduction in total services cost through more conservative tier classification


