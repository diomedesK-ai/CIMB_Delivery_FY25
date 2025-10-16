# ROI Calculator Services Cost Integration

## Date: October 15, 2025

## Overview

Integrated the actual tiered services costs (Tier 1/2/3) from use cases into the ROI calculator and added ROI alignment validation between the calculator and actual per-project ROIs.

## Changes Implemented

### 1. **Actual Services Cost Calculation**

Added calculation of services costs from all 136 use cases using the tiered bucketing system:

**File**: `app/roi-calculator/page.tsx` (Lines 167-185)

```typescript
// === CALCULATE ACTUAL SERVICES COST FROM USE CASES ===
let actualServicesCost = 0;
let actualTotalInvestment = 0;
let actualTotalBenefits = 0;

useCases.forEach(uc => {
  const implBucket = getImplementationCostBucket(uc);
  const investment = calculateUseCaseInvestment(uc);
  const roi = uc.roi || 300;
  const benefits = investment * (roi / 100);
  
  actualServicesCost += implBucket.cost;
  actualTotalInvestment += investment;
  actualTotalBenefits += benefits;
});

// Apply services cost multiplier
const adjustedServicesCost = actualServicesCost * (assumptions.servicesCostMultiplier / 100);
const actualWeightedROI = actualTotalInvestment > 0 ? ((actualTotalBenefits / actualTotalInvestment) - 1) * 100 : 0;
```

**What It Does**:
- Loops through all 136 use cases
- Gets actual Tier 1/2/3 services cost for each use case
- Calculates total investment and benefits from actual use cases
- Calculates weighted ROI from bottom-up (use case level)
- Applies adjustment multiplier for scenario planning

### 2. **Services Cost Adjustment Lever**

Added new configurable parameter to adjust services costs:

**Assumptions State** (Line 51):
```typescript
servicesCostMultiplier: 100, // % adjustment for actual use case services costs (100% = use actual costs)
```

**UI Input** (Lines 691-708):
```typescript
<div className="pt-4 border-t">
  <Label className="font-semibold">Services Cost Adjustment: {assumptions.servicesCostMultiplier}%</Label>
  <Slider
    value={[assumptions.servicesCostMultiplier]}
    onValueChange={(v) => updateAssumption('servicesCostMultiplier', v[0])}
    min={50}
    max={150}
    step={5}
    className="mt-2"
  />
  <p className="text-xs text-gray-500 mt-1">
    Actual from use cases: {formatCurrency(calculatedROI.actualServicesCost)} → 
    Adjusted: {formatCurrency(calculatedROI.adjustedServicesCost)}
  </p>
  <p className="text-xs text-blue-600 mt-1 font-medium">
    100% = use actual tiered services costs (Tier 1/2/3)
  </p>
</div>
```

**Features**:
- Range: 50% to 150% (adjust up or down from actual costs)
- Default: 100% (use actual tiered costs)
- Real-time display of actual vs. adjusted costs
- Located in "Assumptions" tab under "Costs & Pricing" card

### 3. **ROI Alignment Validation**

Added comprehensive ROI alignment check in the Validation tab:

**File**: `app/roi-calculator/page.tsx` (Lines 1008-1048)

**Components**:

1. **Side-by-Side ROI Comparison**:
   - Calculator (Top-Down): Based on portfolio assumptions
   - Use Cases (Bottom-Up): Weighted average from all use cases
   - Shows both percentages prominently

2. **Financial Metrics**:
   - Actual Services Cost: From tiered bucketing system
   - Actual Investment: Total from all use cases

3. **Alignment Status**:
   - ✅ If difference < 50%: "ROIs are aligned"
   - ⚠️ If difference >= 50%: "ROIs differ significantly - consider adjusting"

**Example Output**:
```
🎯 ROI Alignment Check
Comparing calculator ROI vs. actual use case weighted ROI

Calculator (Top-Down)        Use Cases (Bottom-Up)
     305.2%                        287.4%
Based on portfolio assumptions   From 136 actual use cases

Actual Services Cost: $17.2M    Actual Investment: $112.4M

Alignment Status:
✅ Calculator and use case ROIs are aligned (±18% difference). Numbers are consistent.
```

### 4. **State Management**

Updated calculator state to include new metrics:

**Before**:
```typescript
const [calculatedROI, setCalculatedROI] = useState({
  totalInvestment: 0,
  totalBenefits: 0,
  netValue: 0,
  roiPercentage: 0,
  breakdownByCategory: {} as any,
  yearByYear: [] as any[]
});
```

**After** (Lines 84-95):
```typescript
const [calculatedROI, setCalculatedROI] = useState({
  totalInvestment: 0,
  totalBenefits: 0,
  netValue: 0,
  roiPercentage: 0,
  breakdownByCategory: {} as any,
  yearByYear: [] as any[],
  actualServicesCost: 0,          // NEW
  actualTotalInvestment: 0,       // NEW
  actualWeightedROI: 0,           // NEW
  adjustedServicesCost: 0         // NEW
});
```

## Use Cases & Scenarios

### Scenario 1: Conservative Services Cost Estimate
**Use Case**: Want to reduce services cost assumption for budget planning

**Steps**:
1. Navigate to ROI Calculator → Assumptions tab
2. Adjust "Services Cost Adjustment" slider to 80%
3. Actual $17.2M → Adjusted $13.8M
4. View updated ROI in Validation tab

**Result**: More conservative ROI calculation

### Scenario 2: Aggressive Services Cost (Premium Implementation)
**Use Case**: Planning premium implementation with additional services

**Steps**:
1. Adjust "Services Cost Adjustment" slider to 130%
2. Actual $17.2M → Adjusted $22.4M
3. View impact on total investment and ROI

**Result**: Higher investment, more conservative ROI

### Scenario 3: ROI Alignment Check
**Use Case**: Validate that calculator and use case ROIs are consistent

**Steps**:
1. Navigate to Validation tab
2. Review "ROI Alignment Check" section
3. Compare Calculator (Top-Down) vs. Use Cases (Bottom-Up)
4. Check Alignment Status message

**Result**: Confidence that numbers are internally consistent

## Benefits

### For Finance Team
✅ **Transparency**: Can see actual services costs from use cases  
✅ **Flexibility**: Adjust services costs for different scenarios  
✅ **Validation**: Verify calculator aligns with per-project ROIs  

### For Executives
✅ **Confidence**: See that top-down and bottom-up numbers align  
✅ **Traceability**: Understand where services costs come from  
✅ **Scenarios**: Model different implementation cost assumptions  

### For Project Managers
✅ **Bottom-Up View**: See actual Tier 1/2/3 costs from use cases  
✅ **Benchmarking**: Compare calculator assumptions to actual projects  
✅ **Consistency**: Ensure portfolio view matches project-level ROIs  

## Expected Values

### Services Cost (Based on Conservative Scoring)

| Category | Use Cases | Avg Cost | Total |
|----------|-----------|----------|-------|
| **Tier 1** (<100K) | ~75-80 | $50-70K | ~$4-5M |
| **Tier 2** (100K-1M) | ~45-50 | $200-350K | ~$9-12M |
| **Tier 3** (1-3M) | ~10-12 | $1.5-2.5M | ~$4-8M |
| **Total** | ~136 | - | **$17-25M** |

### ROI Alignment

**Typical Range**: ±20-50% difference between calculator and use cases  
**Good Alignment**: <50% difference  
**Poor Alignment**: >100% difference (requires adjustment)

**Factors Affecting Alignment**:
- Calculator uses portfolio-level assumptions (averages)
- Use cases use specific ROIs per use case (Forrester benchmarks)
- Calculator may be more/less conservative depending on levers

## Testing

### Test 1: Services Cost Display
1. Navigate to Assumptions → Costs & Pricing
2. Verify "Services Cost Adjustment" slider shows
3. Verify it displays: "Actual from use cases: $XX.XM → Adjusted: $XX.XM"
4. Adjust slider and verify adjusted cost updates

**Expected**: Real-time cost adjustment with clear before/after display

### Test 2: ROI Alignment
1. Navigate to Validation tab
2. Scroll to "ROI Alignment Check" section
3. Verify Calculator ROI and Use Cases ROI both display
4. Verify Actual Services Cost and Actual Investment display
5. Verify Alignment Status shows appropriate message

**Expected**: Clear comparison with alignment status

### Test 3: Services Cost Impact on ROI
1. Set services cost multiplier to 50%
2. Note calculator ROI
3. Set services cost multiplier to 150%
4. Verify ROI decreased (higher investment)

**Expected**: ROI inversely correlated with services cost

## Future Enhancements

1. **Category-Level Services Cost**: Show services cost breakdown by category
2. **Tier Distribution Chart**: Visual breakdown of Tier 1/2/3 use cases
3. **Services Cost Scenario Presets**: Quick buttons for 80%, 100%, 120%
4. **Historical Comparison**: Compare current services costs to previous estimates
5. **Export Services Cost Report**: Detailed breakdown by use case

## Files Modified

1. `app/roi-calculator/page.tsx` - Main calculator logic and UI
2. Imports `getImplementationCostBucket` from `lib/csv-parser.ts`

## Documentation Files

1. `docs/ROI_CALCULATOR_SERVICES_COST_INTEGRATION.md` (this file)
2. `docs/IMPLEMENTATION_COST_BUCKETING.md` - Tier system reference
3. `docs/SERVICES_COST_ADJUSTMENTS.md` - Conservative scoring details

---

**Version**: 1.0  
**Status**: Ready for Testing  
**Impact**: Improves transparency, validation, and scenario planning for services costs

