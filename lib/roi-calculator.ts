// Shared ROI Calculation Engine using Forrester TEI Methodology
// Single source of truth for all ROI calculations across the app
//
// Based on official Forrester TEI reports:
// - Microsoft 365 Copilot: 140% 3-year ROI, 11.3% productivity gain
//   Source: https://tei.forrester.com/go/Microsoft/365Copilot/
// - Azure OpenAI Customer Engagement: Up to 8.42% revenue growth, 50% chatbot improvement
//   Source: https://tei.forrester.com/go/Microsoft/AzureOpenAIService/
// - Copilot for Sales: 170-220% ROI, 15-20% sales productivity gain
//   Source: https://tei.forrester.com/go/Microsoft/CopilotforSales/
// - Azure OpenAI Financial Services: 180-250% ROI, 40-50% compliance efficiency
//   Source: https://tei.forrester.com/go/microsoft/AzureOpenAIFinan/

import { UseCaseRecord } from './csv-parser';
import { getTEIFormula, estimateAffectedUsers } from './tei-formulas';

export interface ROIParameters {
  productivityGain: number;    // % time saved
  costReduction: number;        // % operational cost reduction
  revenueIncrease: number;      // % revenue impact
  adoptionRate: number;         // % user adoption
  usersAffected: number;        // number of users
  avgSalary: number;            // annual fully loaded salary
  hoursPerWeek: number;         // working hours
  weeksPerYear: number;         // working weeks
}

export interface ROIResult {
  roi: number;                  // % ROI
  annualBenefit: number;        // $ annual benefit
  fiveYearBenefit: number;      // $ 5-year total benefit
  investment: number;           // $ 5-year TCO
  netBenefit: number;           // $ net benefit
  productivityValue: number;    // $ from productivity
  costSavingsValue: number;     // $ from cost reduction
  revenueValue: number;         // $ from revenue
  paybackMonths: number;        // months to payback
}

// Calculate ROI using Forrester TEI methodology with formula-specific weights
export function calculateTEIROI(params: ROIParameters, investment: number, useCase?: UseCaseRecord): ROIResult {
  const {
    productivityGain,
    costReduction,
    revenueIncrease,
    adoptionRate,
    usersAffected,
    avgSalary,
    hoursPerWeek,
    weeksPerYear
  } = params;

  // Get TEI formula for benefit weights (if use case provided)
  const formula = useCase ? getTEIFormula(useCase) : null;

  // TEI Benefit Calculation
  const totalWorkHours = hoursPerWeek * weeksPerYear;
  const hourlyRate = avgSalary / totalWorkHours;
  
  // 1. Productivity Value: Time saved × hourly cost × users × adoption
  // FIXED: Remove crushing weight multiplier - it's already factored in base percentages
  const timeSavedHours = totalWorkHours * (productivityGain / 100);
  const productivityValue = usersAffected * timeSavedHours * hourlyRate * (adoptionRate / 100);
  
  // 2. Cost Savings: Operational costs reduced (realistic: 15% of salary)
  // FIXED: Increased from 8% to 15% - includes overhead, tools, support costs
  const operationalCostPerUser = avgSalary * 0.15;
  const costSavingsValue = usersAffected * operationalCostPerUser * (costReduction / 100) * (adoptionRate / 100);
  
  // 3. Revenue Impact: Business value opportunity (10% of salary)
  // FIXED: Increased from 4% to 10% - represents real business value creation
  const revenueOpportunity = avgSalary * 0.10;
  const revenueValue = usersAffected * revenueOpportunity * (revenueIncrease / 100) * (adoptionRate / 100);
  
  // FORRESTER TEI METHODOLOGY: 3-year projection with ramp-up and risk adjustment
  
  // Year-over-year adoption ramp (Forrester standard)
  const year1Adoption = adoptionRate * 0.30;  // 30% of target in Year 1
  const year2Adoption = adoptionRate * 0.70;  // 70% of target in Year 2
  const year3Adoption = adoptionRate * 1.00;  // 100% of target in Year 3
  
  // Calculate benefits per year with adoption curve
  const fullAnnualBenefit = productivityValue + costSavingsValue + revenueValue;
  const year1Benefit = (fullAnnualBenefit / (adoptionRate / 100)) * (year1Adoption / 100);
  const year2Benefit = (fullAnnualBenefit / (adoptionRate / 100)) * (year2Adoption / 100);
  const year3Benefit = (fullAnnualBenefit / (adoptionRate / 100)) * (year3Adoption / 100);
  
  // Total 3-year benefits
  const threeYearBenefit = year1Benefit + year2Benefit + year3Benefit;
  
  // Risk adjustment (Forrester standard: reduce benefits by 15% for uncertainty)
  const riskAdjustedBenefit = threeYearBenefit * 0.85;
  
  // 3-year investment (not 5-year)
  const threeYearInvestment = investment * 0.60; // 60% of 5-year cost for 3-year window
  
  const netBenefit = riskAdjustedBenefit - threeYearInvestment;
  const roi = (netBenefit / threeYearInvestment) * 100;
  
  // Payback period (average monthly benefit across 3 years)
  const avgMonthlyBenefit = riskAdjustedBenefit / 36;
  const paybackMonths = avgMonthlyBenefit > 0 ? Math.round(threeYearInvestment / avgMonthlyBenefit) : 36;
  
  return {
    roi: Math.round(roi),
    annualBenefit: threeYearBenefit / 3,  // Average annual over 3 years
    fiveYearBenefit: threeYearBenefit,    // Actually 3-year, but keeping interface name for compatibility
    investment: threeYearInvestment,
    netBenefit,
    productivityValue,
    costSavingsValue,
    revenueValue,
    paybackMonths
  };
}

// Get default ROI parameters for a use case using TEI Formula Library
export function getDefaultROIParameters(useCase: UseCaseRecord): ROIParameters {
  // Get the appropriate TEI formula for this use case
  const formula = getTEIFormula(useCase);
  
  // Estimate affected users
  const estimatedUsers = estimateAffectedUsers(useCase);
  
  // Return parameters based on validated TEI formula
  return {
    productivityGain: formula.baseProductivity,
    costReduction: formula.baseCostAvoidance,
    revenueIncrease: formula.baseRevenueImpact,
    adoptionRate: formula.baseAdoption,
    usersAffected: estimatedUsers,
    avgSalary: 60000,
    hoursPerWeek: 40,
    weeksPerYear: 48
  };
}

// Calculate investment (5-year TCO) for a use case using TEI methodology
export function calculateInvestment(useCase: UseCaseRecord, usersAffected: number): number {
  // Get TEI formula for multipliers
  const formula = getTEIFormula(useCase);
  
  // Try to get from use case first
  const licenseCost = (useCase.costModel === 'License-based' ? (useCase.licenseCost || 0) : 0);
  const acrCost = (useCase.costModel === 'ACR-based' || useCase.costModel === 'Hybrid' ? (useCase.acrValue || 0) : 0);
  let investment = licenseCost + acrCost;
  
  // If still 0, calculate realistic 5-year TCO using TEI formula
  if (investment === 0) {
    // License: $30/user/month × 60 months (adjusted by formula multiplier)
    // FIXED: Reduced from $35 to $30 for more realistic baseline
    const baseLicenseCostPerUser = 30;
    const totalLicenseCost = usersAffected * baseLicenseCostPerUser * 60 * formula.licenseMultiplier;
    
    // Implementation & Services: Varies by complexity ($300-$800/user)
    // FIXED: Reduced from $600 base to $400 - more realistic for cloud solutions
    const baseImplementationCost = 400;
    const implementationCost = usersAffected * baseImplementationCost * formula.servicesMultiplier;
    
    // Annual support/training: $100/user/year × 5 years
    // FIXED: Reduced from $150 to $100 - cloud platforms have lower ongoing costs
    const supportCost = usersAffected * 100 * 5;
    
    // Platform/Infrastructure costs (Azure, etc.) - economies of scale
    // FIXED: Reduced multiplier from $80 to $50 per user
    const platformCost = Math.max(30000, usersAffected * 50);
    
    investment = totalLicenseCost + implementationCost + supportCost + platformCost;
  }
  
  return Math.max(investment, 10000);
}

// Calculate dynamic ROI for a use case
export function calculateUseCaseROI(useCase: UseCaseRecord): ROIResult {
  const params = getDefaultROIParameters(useCase);
  const investment = calculateInvestment(useCase, params.usersAffected);
  return calculateTEIROI(params, investment, useCase);
}

