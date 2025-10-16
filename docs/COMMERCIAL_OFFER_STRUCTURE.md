# Commercial Offer Structure - Cumulative Model

## Overview
Commercial offers are **cumulative** (not exclusive). Each tier includes all features from the previous tier plus additional capabilities.

## Offer Tiers

### Small Offer - $50M USD (Base)
- Base set of use cases
- Foundation capabilities
- Entry-level partnership

### Medium Offer - $75M USD (Small + More)
- **Includes**: All use cases from Small
- **Plus**: Additional use cases
- **Total**: Small use cases + Medium-specific use cases
- Enhanced partnership with more capabilities

### Large Offer - $250M USD (Medium + More)
- **Includes**: All use cases from Medium (which includes Small)
- **Plus**: Premium use cases
- **Total**: All Small + All Medium + Large-specific use cases
- Complete partnership with full capabilities

## Assignment Logic

When assigning a use case to an offer tier:
- **Small**: Use case included in base offering
- **Medium**: Use case included starting from medium tier (also in Large)
- **Large**: Use case only included in large tier

## Examples

### Customer Experience Platform Cluster

**Small Offering ($50M)**:
- Social Media AI bot
- (Base features)

**Medium Offering ($75M)** = Small + :
- Social Media AI bot (from Small)
- Islamic Customer Bot (added in Medium)

**Large Offering ($120M)** = Medium + :
- Social Media AI bot (from Small)
- Islamic Customer Bot (from Medium)
- Simple Customer Bot (added in Large)
- Advanced Customer Bot (added in Large)

## Value Calculation

The value is **incremental**:
- Small: Base value
- Medium: Adds $25M more value on top of Small
- Large: Adds $175M more value on top of Medium

Total customer value depends on which tier they purchase:
- Buy Small: Get $50M value
- Buy Medium: Get $75M value (includes everything from Small)
- Buy Large: Get $250M value (includes everything from Small + Medium)

## UI Implications

When viewing by Commercial Cluster:
- Filter by "Small": Shows only base use cases
- Filter by "Medium": Shows Small + Medium use cases
- Filter by "Large": Shows all use cases

The dropdown makes it clear:
- Small - $50M (Base)
- Medium - $75M (Small + more)
- Large - $120M (Medium + more)

## Implementation Notes

- Each use case can be assigned to ONE offer tier
- Users purchasing a higher tier get all lower tier use cases automatically
- This creates natural upsell opportunities
- Value calculations are cumulative per cluster


