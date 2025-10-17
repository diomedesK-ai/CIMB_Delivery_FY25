// Comprehensive ROI Audit Script
// Validates all 168 use cases against TEI formulas

const fs = require('fs');
const path = require('path');

// TEI Formula Library (JavaScript version)
const TEI_FORMULAS = {
  PRODUCTIVITY_COPILOT: {
    name: 'M365 Copilot Productivity',
    productivityWeight: 0.70,
    costAvoidanceWeight: 0.20,
    revenueWeight: 0.10,
    baseProductivity: 5.2,
    baseCostAvoidance: 3.5,
    baseRevenueImpact: 1.5,
    baseAdoption: 60,
    licenseMultiplier: 1.0,
    servicesMultiplier: 0.8
  },
  CUSTOMER_SERVICE_AI: {
    name: 'AI Contact Center',
    productivityWeight: 0.30,
    costAvoidanceWeight: 0.50,
    revenueWeight: 0.20,
    baseProductivity: 4,
    baseCostAvoidance: 12,
    baseRevenueImpact: 5,
    baseAdoption: 60,
    licenseMultiplier: 1.2,
    servicesMultiplier: 1.3
  },
  DOCUMENT_INTELLIGENCE: {
    name: 'Document Intelligence',
    productivityWeight: 0.50,
    costAvoidanceWeight: 0.40,
    revenueWeight: 0.10,
    baseProductivity: 8,
    baseCostAvoidance: 8,
    baseRevenueImpact: 2,
    baseAdoption: 50,
    licenseMultiplier: 0.9,
    servicesMultiplier: 1.2
  },
  RISK_COMPLIANCE: {
    name: 'Risk & Compliance AI',
    productivityWeight: 0.25,
    costAvoidanceWeight: 0.65,
    revenueWeight: 0.10,
    baseProductivity: 3,
    baseCostAvoidance: 15,
    baseRevenueImpact: 1,
    baseAdoption: 45,
    licenseMultiplier: 1.1,
    servicesMultiplier: 1.4
  },
  SALES_ENABLEMENT: {
    name: 'Sales & RM AI',
    productivityWeight: 0.30,
    costAvoidanceWeight: 0.20,
    revenueWeight: 0.50,
    baseProductivity: 5,
    baseCostAvoidance: 4,
    baseRevenueImpact: 8,
    baseAdoption: 55,
    licenseMultiplier: 1.0,
    servicesMultiplier: 1.1
  },
  OPERATIONS_AUTOMATION: {
    name: 'Operations Automation',
    productivityWeight: 0.45,
    costAvoidanceWeight: 0.45,
    revenueWeight: 0.10,
    baseProductivity: 5,
    baseCostAvoidance: 10,
    baseRevenueImpact: 2,
    baseAdoption: 50,
    licenseMultiplier: 0.8,
    servicesMultiplier: 1.0
  },
  DATA_ANALYTICS: {
    name: 'Data Analytics & AI',
    productivityWeight: 0.40,
    costAvoidanceWeight: 0.35,
    revenueWeight: 0.25,
    baseProductivity: 6,
    baseCostAvoidance: 6,
    baseRevenueImpact: 4,
    baseAdoption: 45,
    licenseMultiplier: 1.3,
    servicesMultiplier: 1.5
  },
  GENERIC_AI: {
    name: 'Generic AI Solution',
    productivityWeight: 0.50,
    costAvoidanceWeight: 0.35,
    revenueWeight: 0.15,
    baseProductivity: 5,
    baseCostAvoidance: 6,
    baseRevenueImpact: 3,
    baseAdoption: 50,
    licenseMultiplier: 1.0,
    servicesMultiplier: 1.0
  }
};

function getTEIFormula(useCase) {
  const category = useCase.Group.toLowerCase();
  const subCategory = useCase['Sub-Category'].toLowerCase();
  const name = useCase['Use Case / Scenario'].toLowerCase();
  
  // Productivity / Copilot with variations
  if (category.includes('productivity') || subCategory.includes('co-pilots') || 
      name.includes('copilot') || name.includes('microsoft 365')) {
    const formula = { ...TEI_FORMULAS.PRODUCTIVITY_COPILOT };
    
    if (name.includes('coding') || name.includes('developer') || name.includes('github')) {
      formula.baseProductivity = 9.5;
      formula.baseCostAvoidance = 8;
      formula.baseRevenueImpact = 3;
      formula.baseAdoption = 50;
      formula.licenseMultiplier = 1.2;
    } else if (name.includes('search') || name.includes('knowledge') || name.includes('report') || name.includes('analyze')) {
      formula.baseProductivity = 7.5;
      formula.baseCostAvoidance = 6;
      formula.baseRevenueImpact = 2;
      formula.baseAdoption = 55;
    } else if (name.includes('interview') || name.includes('screening') || name.includes('hr')) {
      formula.baseProductivity = 6.0;
      formula.baseCostAvoidance = 5;
      formula.baseRevenueImpact = 2;
      formula.baseAdoption = 45;
    } else if (name.includes('legacy') || name.includes('generator') || name.includes('documentation')) {
      formula.baseProductivity = 5.5;
      formula.baseCostAvoidance = 4;
      formula.baseRevenueImpact = 1;
      formula.baseAdoption = 40;
    }
    return formula;
  }
  
  if (category.includes('customer') || category.includes('self-service') ||
      name.includes('chatbot') || name.includes('contact center') || name.includes('customer service')) {
    const formula = { ...TEI_FORMULAS.CUSTOMER_SERVICE_AI };
    if (name.includes('contact center') || name.includes('ccaas')) {
      formula.baseCostAvoidance = 15;
      formula.baseRevenueImpact = 6;
      formula.baseAdoption = 65;
    } else if (name.includes('chatbot') || name.includes('self-service')) {
      formula.baseCostAvoidance = 12;
      formula.baseRevenueImpact = 5;
      formula.baseAdoption = 60;
    }
    return formula;
  }
  
  if (name.includes('document') || name.includes('idp') || name.includes('ocr') || name.includes('extraction')) {
    return TEI_FORMULAS.DOCUMENT_INTELLIGENCE;
  }
  
  if (category.includes('risk') || category.includes('compliance') || category.includes('fraud') ||
      name.includes('aml') || name.includes('kyc')) {
    const formula = { ...TEI_FORMULAS.RISK_COMPLIANCE };
    if (name.includes('fraud') || name.includes('aml')) {
      formula.baseCostAvoidance = 18;
      formula.baseAdoption = 50;
    }
    return formula;
  }
  
  if (category.includes('rm') || category.includes('relationship') || name.includes('sales') || name.includes('campaign')) {
    const formula = { ...TEI_FORMULAS.SALES_ENABLEMENT };
    if (name.includes('campaign') || name.includes('lead')) {
      formula.baseRevenueImpact = 10;
      formula.baseAdoption = 60;
    }
    return formula;
  }
  
  if (category.includes('operations') || category.includes('automation') ||
      category.includes('finance') || category.includes('procurement')) {
    const formula = { ...TEI_FORMULAS.OPERATIONS_AUTOMATION };
    if (name.includes('loan') || name.includes('collection') || name.includes('underwriting')) {
      formula.baseProductivity = 7;
      formula.baseCostAvoidance = 14;
      formula.baseAdoption = 55;
    }
    return formula;
  }
  
  if (name.includes('analytics') || name.includes('fabric') || name.includes('data') || name.includes('insight')) {
    return TEI_FORMULAS.DATA_ANALYTICS;
  }
  
  return TEI_FORMULAS.GENERIC_AI;
}

function estimateUsers(useCase) {
  const category = useCase.Group.toLowerCase();
  const name = useCase['Use Case / Scenario'].toLowerCase();
  const depts = useCase['Bank Departments Involved'] || '';
  const deptCount = depts.split(';').filter(d => d.trim()).length || 3;
  
  let baseUsers = deptCount * 100;
  
  if (name.includes('copilot studio') || name.includes('microsoft 365')) {
    baseUsers = Math.min(deptCount * 180, 1500);
  } else if (name.includes('coding') || name.includes('developer') || name.includes('github')) {
    baseUsers = Math.min(deptCount * 50, 400);
  } else if (name.includes('search') || name.includes('knowledge') || name.includes('report')) {
    baseUsers = Math.min(deptCount * 120, 900);
  } else if (name.includes('interview') || name.includes('screening')) {
    baseUsers = Math.min(deptCount * 80, 600);
  } else if (name.includes('contact center') || name.includes('customer service')) {
    baseUsers = Math.min(deptCount * 150, 1200);
  } else if (name.includes('chatbot') || name.includes('virtual assistant')) {
    baseUsers = Math.min(deptCount * 100, 700);
  } else if (name.includes('relationship') || name.includes('sales') || name.includes('campaign')) {
    baseUsers = Math.min(deptCount * 90, 650);
  } else if (name.includes('loan') || name.includes('underwriting') || name.includes('collection')) {
    baseUsers = Math.min(deptCount * 110, 800);
  } else if (name.includes('fraud') || name.includes('aml') || name.includes('compliance')) {
    baseUsers = Math.min(deptCount * 60, 450);
  } else if (name.includes('analytics') || name.includes('data') || name.includes('fabric')) {
    baseUsers = Math.min(deptCount * 70, 500);
  } else if (name.includes('document') || name.includes('idp')) {
    baseUsers = Math.min(deptCount * 100, 750);
  } else if (category.includes('productivity')) {
    baseUsers = Math.min(baseUsers * 1.4, 1100);
  } else if (category.includes('customer') || category.includes('operations')) {
    baseUsers = Math.min(baseUsers * 1.1, 750);
  } else if (category.includes('risk') || category.includes('compliance')) {
    baseUsers = Math.min(baseUsers * 0.7, 450);
  }
  
  return Math.max(Math.min(Math.round(baseUsers), 2000), 150);
}

function calculateInvestment(formula, users) {
  const baseLicenseCostPerUser = 30;  // Reduced from 35
  const totalLicenseCost = users * baseLicenseCostPerUser * 60 * formula.licenseMultiplier;
  const baseImplementationCost = 400;  // Reduced from 600
  const implementationCost = users * baseImplementationCost * formula.servicesMultiplier;
  const supportCost = users * 100 * 5;  // Reduced from 150
  const platformCost = Math.max(30000, users * 50);  // Reduced from 40k and 80
  
  return totalLicenseCost + implementationCost + supportCost + platformCost;
}

function calculateTEIROI(formula, users) {
  const avgSalary = 60000;
  const hoursPerWeek = 40;
  const weeksPerYear = 48;
  const totalWorkHours = hoursPerWeek * weeksPerYear;
  const hourlyRate = avgSalary / totalWorkHours;
  
  // Productivity - NO WEIGHT MULTIPLIER (already in base %)
  const timeSaved = totalWorkHours * (formula.baseProductivity / 100);
  const productivityValue = users * timeSaved * hourlyRate * (formula.baseAdoption / 100);
  
  // Cost Savings - Realistic 15% operational cost baseline
  const operationalCost = avgSalary * 0.15;
  const costSavingsValue = users * operationalCost * (formula.baseCostAvoidance / 100) * (formula.baseAdoption / 100);
  
  // Revenue - Realistic 10% revenue opportunity baseline
  const revenueOpp = avgSalary * 0.10;
  const revenueValue = users * revenueOpp * (formula.baseRevenueImpact / 100) * (formula.baseAdoption / 100);
  
  // FORRESTER TEI: 3-year with ramp-up and risk adjustment
  const adoption = formula.baseAdoption;
  const year1Adoption = adoption * 0.30;
  const year2Adoption = adoption * 0.70;
  const year3Adoption = adoption * 1.00;
  
  const fullAnnualBenefit = productivityValue + costSavingsValue + revenueValue;
  const year1Benefit = (fullAnnualBenefit / (adoption / 100)) * (year1Adoption / 100);
  const year2Benefit = (fullAnnualBenefit / (adoption / 100)) * (year2Adoption / 100);
  const year3Benefit = (fullAnnualBenefit / (adoption / 100)) * (year3Adoption / 100);
  
  const threeYearBenefit = year1Benefit + year2Benefit + year3Benefit;
  const riskAdjustedBenefit = threeYearBenefit * 0.85;
  
  const fullInvestment = calculateInvestment(formula, users);
  const investment = fullInvestment * 0.60; // 3-year window
  
  const netBenefit = riskAdjustedBenefit - investment;
  const roi = (netBenefit / investment) * 100;
  
  return {
    roi: Math.round(roi),
    annualBenefit: Math.round(annualBenefit),
    investment: Math.round(investment),
    users,
    formulaName: formula.name
  };
}

// Parse CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const useCases = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const useCase = {};
    headers.forEach((header, index) => {
      useCase[header.trim()] = values[index] ? values[index].trim() : '';
    });
    useCases.push(useCase);
  }
  
  return useCases;
}

// Main audit
console.log('='.repeat(80));
console.log('ROI AUDIT - Comprehensive Review of All Use Cases');
console.log('='.repeat(80));

const csvPath = path.join(__dirname, 'public/data/master-use-cases.csv');
const useCases = parseCSV(csvPath);

console.log(`\nTotal Use Cases: ${useCases.length}\n`);

const results = [];
const discrepancies = [];
const roiDistribution = { low: 0, medium: 0, high: 0, veryHigh: 0 };

useCases.forEach((uc, index) => {
  const formula = getTEIFormula(uc);
  const users = estimateUsers(uc);
  const calculated = calculateTEIROI(formula, users);
  
  const csvROI = parseInt(uc['ROI %']) || 0;
  const diff = calculated.roi - csvROI;
  const diffPercent = csvROI > 0 ? (diff / csvROI) * 100 : 0;
  
  results.push({
    name: uc['Use Case / Scenario'],
    category: uc.Group,
    csvROI,
    calculatedROI: calculated.roi,
    difference: diff,
    diffPercent: Math.round(diffPercent),
    users: users,
    investment: calculated.investment,
    annualBenefit: calculated.annualBenefit,
    formula: formula.name
  });
  
  // Track discrepancies > 20%
  if (Math.abs(diffPercent) > 20 && csvROI > 0) {
    discrepancies.push({
      ...results[results.length - 1]
    });
  }
  
  // ROI distribution
  if (calculated.roi < 100) roiDistribution.low++;
  else if (calculated.roi < 200) roiDistribution.medium++;
  else if (calculated.roi < 300) roiDistribution.high++;
  else roiDistribution.veryHigh++;
});

// Summary Statistics
console.log('SUMMARY STATISTICS:');
console.log('-'.repeat(80));
const calculatedROIs = results.map(r => r.calculatedROI);
const avgROI = Math.round(calculatedROIs.reduce((a, b) => a + b, 0) / calculatedROIs.length);
const minROI = Math.min(...calculatedROIs);
const maxROI = Math.max(...calculatedROIs);
console.log(`Average Calculated ROI: ${avgROI}%`);
console.log(`ROI Range: ${minROI}% - ${maxROI}%`);
console.log(`\nROI Distribution:`);
console.log(`  < 100%:        ${roiDistribution.low} use cases`);
console.log(`  100-200%:      ${roiDistribution.medium} use cases`);
console.log(`  200-300%:      ${roiDistribution.high} use cases`);
console.log(`  > 300%:        ${roiDistribution.veryHigh} use cases`);

console.log(`\n${'='.repeat(80)}`);
console.log(`MAJOR DISCREPANCIES (>20% difference from CSV):`);
console.log(`${'='.repeat(80)}`);
if (discrepancies.length === 0) {
  console.log('✓ No major discrepancies found!');
} else {
  console.log(`Found ${discrepancies.length} use cases with >20% variance:\n`);
  discrepancies.forEach(d => {
    console.log(`${d.name}`);
    console.log(`  Category: ${d.category}`);
    console.log(`  CSV ROI: ${d.csvROI}% | Calculated: ${d.calculatedROI}% | Diff: ${d.difference}% (${d.diffPercent}%)`);
    console.log(`  Formula: ${d.formula} | Users: ${d.users}`);
    console.log(`  Investment: $${(d.investment/1000).toFixed(0)}k | Annual Benefit: $${(d.annualBenefit/1000).toFixed(0)}k`);
    console.log('');
  });
}

console.log(`\n${'='.repeat(80)}`);
console.log('SAMPLE USE CASES BY CATEGORY:');
console.log('='.repeat(80));

// Sample 3 from each major category
const categories = [...new Set(results.map(r => r.category))];
categories.forEach(cat => {
  const catResults = results.filter(r => r.category === cat).slice(0, 3);
  console.log(`\n${cat}:`);
  catResults.forEach(r => {
    console.log(`  • ${r.name}`);
    console.log(`    CSV: ${r.csvROI}% | Calculated: ${r.calculatedROI}% | Users: ${r.users} | $${(r.investment/1000000).toFixed(1)}M investment`);
  });
});

console.log(`\n${'='.repeat(80)}`);
console.log('AUDIT COMPLETE');
console.log('='.repeat(80));

