# Investment Calculation Logic

## Overview
Investment per use case is calculated as a **3-year Total Cost of Ownership (TCO)** to match Forrester's ROI methodology.

## Cost Components

### 1. License Costs (for M365, GitHub, etc.)
```
License Cost = Users × Cost per User/Month × 36 months
```

**Realistic User Counts** (conservative for phased deployment):
| Scope | User Count | Rationale |
|-------|-----------|-----------|
| **Enterprise-wide** (M365 Copilot for most office workers) | 2,000 | Phase 1 rollout, not all 30k+ employees |
| **Contact Center** | 300 | Agent seats |
| **RM/Sales Teams** | 250 | Relationship managers |
| **Developers** (GitHub Copilot) | 200 | Engineering team |
| **Compliance/Legal/Audit** | 80 | Smaller specialized teams |
| **Single Department** | 100 | Pilot deployment |
| **Two Departments** | 200 | Cross-functional |
| **3+ Departments** | 350 | Multi-department |
| **Default** | 150 | Conservative baseline |

**License Costs per User/Month**:
| Product | Cost | Notes |
|---------|------|-------|
| M365 Copilot | $30 | Standard pricing |
| GitHub Copilot Business | $19 | Per developer |
| Security Copilot | $40 | Estimated |
| Dynamics 365 | $50 | Average across SKUs |
| Default | $25 | Conservative estimate |

### 2. Azure Consumption Revenue (ACR) Costs
```
ACR Cost = Monthly ACR Spend × 36 months
```

**Conservative ACR Estimates** (pilot/initial deployment scale):
| Complexity | Monthly ACR | Use Cases |
|------------|-------------|-----------|
| **High** | $55k-80k | Fabric + Databricks, fraud detection, real-time analytics |
| **Medium-High** | $30k-35k | Advanced customer bots, complex analytics |
| **Medium** | $8k-12k | Azure OpenAI (typical), Document Intelligence |
| **Low** | $3k-5k | Power Automate, Copilot Studio (without OpenAI), AI Search |
| **Default** | $8k | Conservative baseline |

**Rationale**: 
- Assumes pilot or departmental scale, not full enterprise
- Actual consumption will scale with usage
- Conservative to avoid over-promising

### 3. Implementation Costs

#### For License-Based Solutions:
```
Implementation = Users × $250-400 per user
```
| Type | Cost per User | Examples |
|------|--------------|----------|
| **Enterprise rollout** | $300 | M365 Copilot for 2000 users |
| **Specialized/Custom** | $400 | Specialized LLM, security tools |
| **Standard** | $250 | Typical productivity tools |

**Includes**: Training, change management, customization, integration, support.

#### For ACR-Based Solutions:
```
Implementation = Monthly ACR × 1.5-3 months
```
| Complexity | Multiplier | Examples |
|------------|-----------|----------|
| **Complex AI** | 3× | Fraud detection, risk models, advanced bots |
| **Data platforms** | 2.5× | Fabric + Databricks setup |
| **Standard AI** | 1.5× | Typical Azure OpenAI implementations |

**Includes**: Infrastructure setup, model training, integration, testing, documentation.

## Example Calculations

### Example 1: M365 Copilot for Most Office Workers
**Use Case**: Enterprise productivity assistant

**Cost Model**: License-based

**Calculation**:
```
Users: 2,000 (enterprise-wide Phase 1)
License Cost: 2,000 × $30/month × 36 = $2,160,000
Implementation: 2,000 × $300 = $600,000
Total Investment: $2,760,000 ($2.76M)
```

### Example 2: GitHub Copilot (Developers)
**Use Case**: Coding assistant

**Cost Model**: License-based

**Calculation**:
```
Users: 200 (engineering team)
License Cost: 200 × $19/month × 36 = $136,800
Implementation: 200 × $250 = $50,000
Total Investment: $186,800 ($187k)
```

### Example 3: Credit Review Analysis (Azure OpenAI + Fabric)
**Use Case**: AI-powered credit analysis

**Cost Model**: Hybrid (License + ACR)

**Calculation**:
```
Users: 100 (Credit Risk department)
License Cost: 100 × $25/month × 36 = $90,000

Monthly ACR: $30,000 (Fabric + Azure OpenAI)
ACR Cost: $30,000 × 36 = $1,080,000

Implementation: $30,000 × 2.5 = $75,000

Total Investment: $1,245,000 ($1.25M)
```

### Example 4: Simple Customer Bot
**Use Case**: Basic FAQ chatbot

**Cost Model**: ACR-based

**Calculation**:
```
Monthly ACR: $12,000 (Copilot Studio + Azure OpenAI)
ACR Cost: $12,000 × 36 = $432,000
Implementation: $12,000 × 1.5 = $18,000
Total Investment: $450,000 ($450k)
```

### Example 5: Fraud Detection System
**Use Case**: Real-time fraud detection

**Cost Model**: ACR-based (complex)

**Calculation**:
```
Monthly ACR: $65,000 (high complexity ML models)
ACR Cost: $65,000 × 36 = $2,340,000
Implementation: $65,000 × 3 = $195,000
Total Investment: $2,535,000 ($2.54M)
```

## Category-Level Investment

### Everyday AI Productivity (27 use cases)
**Estimated Total**: ~$18-25M

**Breakdown**:
- 1× Enterprise M365 Copilot (2000 users): $2.76M
- 1× GitHub Copilot (200 devs): $187k
- 25× Various productivity tools (avg 150 users or $12k ACR): ~$15-22M

**Why $70M was too high**:
- Old logic used 500-5000 users per use case
- Old ACR was $25k-150k/month
- New logic is conservative for realistic rollout

### AI Risk Intelligence (20 use cases)
**Estimated Total**: ~$35-45M

**Higher per use case because**:
- Complex models (fraud, risk, compliance)
- Enterprise data platforms (Fabric + Databricks)
- Higher ACR spend ($30k-80k/month)

## Validation Against Forrester

**Forrester TEI Baseline**: 200-520% ROI over 3 years

**Our Approach**:
- Conservative investment estimates (pilot/Phase 1 scale)
- Forrester ROI percentages applied
- Results in credible economic value

**Example**:
```
Use Case Investment: $500k
Forrester ROI: 400%
Economic Benefits: $500k × 4 = $2M
Net Value: $2M - $500k = $1.5M
```

## Adjustability

**All parameters are editable** in the UI:
- License count
- Cost per user
- Monthly ACR spend
- ROI percentage

This allows:
- Customization per client
- Scenario planning (pilot vs. full scale)
- Sensitivity analysis

## Key Principles

1. **Conservative by Default**: Better to under-promise and over-deliver
2. **Phased Rollout**: Assume Phase 1, not full enterprise immediately
3. **Realistic Scale**: Actual bank team sizes, not aspirational
4. **Transparent**: All calculations visible and editable
5. **Forrester-Aligned**: 3-year TCO matches Forrester methodology

## Summary Table

| Category | Use Cases | Avg Investment | Total Investment |
|----------|-----------|----------------|------------------|
| **Everyday AI Productivity** | 27 | ~$740k | ~$20M |
| **AI Risk Intelligence** | 20 | ~$2M | ~$40M |
| **AI Agents Direct to Customer** | 8 | ~$1.5M | ~$12M |
| **Smart Compliance & Audit** | 15 | ~$1.2M | ~$18M |
| **Precision Campaign Automation** | 12 | ~$800k | ~$10M |
| **AI-Driven Loan Operations** | 10 | ~$1.5M | ~$15M |

**Total Portfolio**: ~$115M investment over 3 years for all 92 use cases (conservative, Phase 1 scale)

---

*Note: These are baseline estimates. Actual costs will vary based on client scale, deployment approach, and specific requirements. All values are editable in the UI for scenario planning.*


