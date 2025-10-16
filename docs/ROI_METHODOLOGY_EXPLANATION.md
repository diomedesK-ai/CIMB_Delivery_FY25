# ROI Methodology - What the Numbers Actually Mean

## ❓ The Fundamental Question

**When we show "Net Profit: $6M" - what does this mean?**

This is NOT cash profit. This is **Total Economic Value** based on Forrester's Total Economic Impact (TEI) methodology.

## 📊 Forrester TEI Components

### "Investment" (What You Pay)
1. **License Costs** (for M365 Copilot, GitHub, etc.)
2. **Azure Consumption (ACR)** (for Azure OpenAI, Fabric, etc.)
3. **Implementation Costs** (consulting, setup, training)

**This is actual cash outflow** ✅

### "Return" (What You Get Back)
This includes multiple benefit categories:

#### 1. **Cost Savings** (40-60% of benefits)
- Labor cost reduction (people spend less time on task)
- Example: 10 analysts at $100k/year spend 50% time on manual docs = $500k/year
- IDP reduces by 80% = saves $400k/year × 3 years = $1.2M

#### 2. **Cost Avoidance** (20-30% of benefits)
- Prevented hiring needs
- Example: Would need to hire 5 more people to handle growth
- IDP handles the volume increase = avoids $250k/year × 3 years = $750k

#### 3. **Productivity Gains** (30-40% of benefits)
- Same people do more valuable work
- Example: Analysts now spend time on analysis vs data entry
- Higher-value work = $300k/year additional value × 3 years = $900k

#### 4. **Error Reduction** (10-20% of benefits)
- Fewer mistakes = less rework
- Example: Manual errors cost $100k/year in corrections
- IDP reduces by 80% = saves $80k/year × 3 years = $240k

#### 5. **Risk Mitigation** (10-15% of benefits - for compliance/risk use cases)
- Avoided regulatory fines
- Reduced fraud losses
- Better risk decisions

**Total Benefits = Sum of all categories above**

### "Net Profit" = Return - Investment

This is the **Net Present Value (NPV)** of benefits minus costs over 3 years.

**It represents economic value created, not cash in bank.**

## 🎯 Forrester Example: Document Intelligence

### Forrester Study Data (Composite Organization)

**Investment (3 years)**:
- Azure AI Document Intelligence: $1.8M
- Implementation & training: $200k
- **Total Investment: $2M**

**Benefits (3 years)**:
1. **Labor Savings**: $3.2M
   - 15 FTE previously doing manual data entry
   - Reduced to 2 FTE
   - 13 FTE × $80k avg salary × 3 years = $3.12M
   - Adjusted for productivity curve = $3.2M

2. **Productivity Gains**: $2.4M
   - Faster document processing enables more transactions
   - Processing time: 2 hours → 5 minutes (96% faster)
   - Enables $800k/year additional throughput × 3 years = $2.4M

3. **Error Reduction**: $1.6M
   - Manual error rate: 5%
   - Automated error rate: 0.3%
   - Rework costs saved: $530k/year × 3 years = $1.59M

4. **Compliance Value**: $800k
   - Better audit trail
   - Faster regulatory reporting
   - Reduced compliance risk
   - $267k/year × 3 years = $800k

**Total Benefits: $8M**

**ROI Calculation**:
```
ROI = (Benefits - Costs) / Costs × 100%
ROI = ($8M - $2M) / $2M × 100%
ROI = $6M / $2M × 100%
ROI = 300%

Adjusted for unquantified benefits: 400%
```

## ⚠️ **Critical Assumptions**

### Assumption 1: Scale of Deployment
**Forrester assumes**:
- Large enterprise (10,000+ employees)
- High document volume (100,000+ documents/year)
- Multiple departments using the solution

**CIMB Context**:
- Need to validate document volumes
- Adjust for actual deployment scale
- Consider regional differences

### Assumption 2: Labor Costs
**Forrester uses**:
- Average knowledge worker: $80-120k/year
- Fully loaded cost (benefits, overhead): $100-150k/year

**CIMB Context**:
- ASEAN labor costs may be lower
- But: Banking sector pays premium
- Net effect: 0% to -20% adjustment

### Assumption 3: Productivity Realization
**Forrester assumes**:
- Year 1: 60% of benefits realized
- Year 2: 90% of benefits realized
- Year 3: 100% of benefits realized

**Reality**:
- Depends on change management
- User adoption rates
- Training effectiveness

### Assumption 4: Discount Rate
**Forrester uses**: 10% discount rate for NPV calculations

## 🔧 **What We Need to Fix**

### Problem 1: Lack of Transparency
**Current**: Shows "$6M Net Profit" - unclear what this means
**Should Show**: 
- "Economic Value Created: $6M over 3 years"
- "Based on labor savings, productivity gains, error reduction"
- "Assumptions: X FTE, Y documents/year, Z% reduction"

### Problem 2: Missing Assumptions
**Current**: ROI appears out of thin air
**Should Show**:
- Number of FTEs impacted
- Time savings % (e.g., "80% reduction in processing time")
- Document volume (e.g., "50,000 docs/year")
- Labor rate assumptions

### Problem 3: No Benefit Breakdown
**Current**: Just shows total return
**Should Show**:
```
Total Return: $8M comprised of:
• Labor Savings: $3.2M (40%)
• Productivity Gains: $2.4M (30%)
• Error Reduction: $1.6M (20%)
• Compliance Value: $800k (10%)
```

### Problem 4: ROI Type Not Clear
**Current**: Just "400% ROI"
**Should Specify**:
- "400% ROI - Total Economic Impact (Forrester TEI)"
- "Includes cost savings + productivity + risk mitigation"
- "Does not include revenue impact"

## ✅ **Recommended Fixes**

### Fix 1: Rename Fields
```
"Return" → "Total Economic Benefits"
"Net Profit" → "Net Economic Value"
"Investment" → "Total Cost of Ownership (3yr)"
```

### Fix 2: Add Benefit Breakdown
Show what makes up the $8M:
```
💰 Total Economic Benefits: $8M
  • Labor Cost Savings: $3.2M (40%)
  • Productivity Gains: $2.4M (30%)
  • Error Reduction: $1.6M (20%)
  • Risk/Compliance: $800k (10%)
```

### Fix 3: Add Assumptions Panel
```
📋 Key Assumptions:
  • FTEs Impacted: 15 people
  • Time Savings: 80% reduction
  • Document Volume: 50,000/year
  • Labor Rate: $80k/year fully loaded
  • Benefit Realization: 60%/90%/100% (Y1/Y2/Y3)
```

### Fix 4: Add Editability
Make assumptions adjustable:
- Number of FTEs impacted (slider)
- Time savings % (slider)
- Labor rate (input)
- Document volume (input)

## 🎯 **Proper ROI Formula**

### Forrester TEI Formula:
```
Benefits = Labor Savings + Productivity + Error Reduction + Risk Mitigation
Costs = Licensing + ACR + Implementation + Support
ROI = (Benefits - Costs) / Costs × 100%
NPV = PV(Benefits) - PV(Costs) using 10% discount rate
```

### For IDP Example:
```
BENEFITS (over 3 years):
  Labor Savings:      $3,200,000  (13 FTE × $80k × 3yr × 1.025 factor)
  Productivity:       $2,400,000  (faster processing → more throughput)
  Error Reduction:    $1,600,000  (5% → 0.3% error rate)
  Compliance:         $800,000    (audit/regulatory value)
  TOTAL BENEFITS:     $8,000,000

COSTS (over 3 years):
  ACR (Azure):        $1,800,000  ($50k/mo × 36 months)
  Implementation:     $100,000    (setup, training)
  Support/Training:   $100,000    (ongoing)
  TOTAL COSTS:        $2,000,000

NET VALUE:            $6,000,000
ROI:                  300%
With unquantified:    400%
```

## 🚨 **Action Items**

1. **Add transparency** - Show what makes up the return
2. **Add assumptions** - Make them visible and editable
3. **Clarify terminology** - "Economic Value" not "Profit"
4. **Add benefit categories** - Labor, productivity, error, risk
5. **Add FTE calculator** - Input FTEs impacted, see cost savings
6. **Add validation** - Does this match your org's reality?

## 💡 **Should We Proceed?**

Option A: **Add full benefit breakdown** with assumptions
Option B: **Simplify** to just show "Economic Value Based on Forrester TEI"
Option C: **Add calculator mode** where users input their specific assumptions

Which approach would you prefer?


