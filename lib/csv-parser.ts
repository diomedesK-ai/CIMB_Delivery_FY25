/**
 * CSV Parser Utility for Master Use Cases Data
 * This is the single source of truth for all use case data
 */

export interface UseCaseRecord {
  id: string;
  group: string;
  subCategory: string;
  useCase: string;
  departments: string[];
  kpis: string[];
  microsoftProducts: string[];
  commercialCluster?: string; // commercial cluster assignment
  clusterValueSize?: 'Small' | 'Medium' | 'Large'; // Small (50M USD), Medium (75M USD), Large (120M USD)
  roi?: number; // Return on Investment percentage (e.g., 150 = 150% ROI)
  costModel?: 'License' | 'ACR' | 'Hybrid'; // License, Azure Consumption, or both
  licenseCount?: number; // Number of licenses needed
  licenseCostPerUser?: number; // Cost per user per month (USD)
  acrMonthlySpend?: number; // Azure Consumption monthly spend (USD)
  implementationCost?: number; // One-time implementation cost (USD)
  implementationCostBucket?: string; // S (<100K), M (100K-1M), L (1M-3M)
  costEstimation?: string; // 5-year TCO: S ($1M-$5M), M ($5M-$15M), L ($15M-$50M)
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  owner?: string;
  contributionType?: string[]; // workflow, GenAI Ops, automation, etc.
  prerequisites?: string[]; // technical prerequisites
  tags?: string[]; // for classification and filtering
}

// Helper to remove numeric prefixes (0., 1., 2., etc.)
export function removeNumericPrefix(text: string): string {
  return text.replace(/^\d+\.\s*/, '').trim();
}

/**
 * Parse CSV data into structured use case records
 */
export function parseCSV(csvText: string): UseCaseRecord[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    // Handle CSV parsing with quoted fields
    const fields: string[] = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField); // Push the last field
    
    // Generate a unique ID based on the use case name
    const useCaseName = fields[2] || `use-case-${index + 1}`;
    const id = useCaseName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Determine contribution type and prerequisites based on use case characteristics
    const contributionTypes = determineContributionType(fields[2] || '', fields[5] || '');
    const prerequisites = determinePrerequisites(fields[2] || '', fields[3] || '', fields[5] || '');
    const tags = generateTags(fields[0] || '', fields[1] || '', fields[2] || '');

    return {
      id,
      group: removeNumericPrefix(fields[0] || ''),
      subCategory: removeNumericPrefix(fields[1] || ''),
      useCase: fields[2] || '',
      departments: fields[3] ? fields[3].split(';').map(d => d.trim()).filter(d => d) : [],
      kpis: fields[4] ? fields[4].split(';').map(k => k.trim()).filter(k => k) : [],
      microsoftProducts: fields[5] ? fields[5].split(';').map(p => p.trim()).filter(p => p) : [],
      commercialCluster: fields[6] || undefined,
      clusterValueSize: (fields[7] as 'Small' | 'Medium' | 'Large') || undefined,
      roi: fields[8] ? parseFloat(fields[8]) : undefined,
      contributionType: contributionTypes,
      prerequisites,
      tags,
    };
  });
}

/**
 * Load and parse the master CSV file
 */
export async function loadMasterUseCases(): Promise<UseCaseRecord[]> {
  try {
    const response = await fetch('/data/master-use-cases.csv');
    if (!response.ok) {
      throw new Error('Failed to load master use cases CSV');
    }
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading master use cases:', error);
    return [];
  }
}

/**
 * Get use cases by group
 */
export function getUseCasesByGroup(useCases: UseCaseRecord[], group: string): UseCaseRecord[] {
  return useCases.filter(uc => uc.group === group);
}

/**
 * Get use cases by department
 */
export function getUseCasesByDepartment(useCases: UseCaseRecord[], department: string): UseCaseRecord[] {
  return useCases.filter(uc => 
    uc.departments.some(d => d.toLowerCase().includes(department.toLowerCase()))
  );
}

/**
 * Get all unique departments
 */
export function getAllDepartments(useCases: UseCaseRecord[]): string[] {
  const departments = new Set<string>();
  useCases.forEach(uc => {
    uc.departments.forEach(d => departments.add(d));
  });
  return Array.from(departments).sort();
}

/**
 * Get all unique Microsoft products
 */
export function getAllMicrosoftProducts(useCases: UseCaseRecord[]): string[] {
  const products = new Set<string>();
  useCases.forEach(uc => {
    uc.microsoftProducts.forEach(p => products.add(p));
  });
  return Array.from(products).sort();
}

/**
 * Search use cases by text
 */
export function searchUseCases(useCases: UseCaseRecord[], query: string): UseCaseRecord[] {
  const lowerQuery = query.toLowerCase();
  return useCases.filter(uc =>
    uc.useCase.toLowerCase().includes(lowerQuery) ||
    uc.group.toLowerCase().includes(lowerQuery) ||
    uc.subCategory.toLowerCase().includes(lowerQuery) ||
    uc.departments.some(d => d.toLowerCase().includes(lowerQuery)) ||
    uc.kpis.some(k => k.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Convert use case record to CSV line
 */
export function useCaseToCSVLine(useCase: UseCaseRecord): string {
  const fields = [
    useCase.group,
    useCase.subCategory,
    useCase.useCase,
    useCase.departments.join('; '),
    useCase.kpis.join('; '),
    useCase.microsoftProducts.join('; '),
    useCase.commercialCluster || '',
    useCase.clusterValueSize || '',
    useCase.roi ? useCase.roi.toString() : ''
  ];
  
  // Quote fields that contain commas or quotes
  return fields.map(field => {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }).join(',');
}

/**
 * Convert array of use cases to CSV text
 */
export function useCasesToCSV(useCases: UseCaseRecord[]): string {
  const headers = 'Group,Sub-Category,Use Case / Scenario,Bank Departments Involved,Primary KPIs (1–2),Microsoft / Partner Products,Commercial Cluster,Cluster Value Size,ROI %';
  const lines = useCases.map(useCaseToCSVLine);
  return [headers, ...lines].join('\n');
}

/**
 * Determine contribution type based on use case name and products
 */
function determineContributionType(useCase: string, products: string): string[] {
  const types: string[] = [];
  const lowerCase = useCase.toLowerCase();
  const lowerProducts = products.toLowerCase();

  if (lowerCase.includes('copilot') || lowerCase.includes('assistant') || lowerCase.includes('chatbot') || lowerCase.includes('bot')) {
    types.push('GenAI Operations');
  }
  if (lowerCase.includes('automation') || lowerCase.includes('automated') || lowerCase.includes('auto-')) {
    types.push('Workflow Automation');
  }
  if (lowerCase.includes('analytics') || lowerCase.includes('insights') || lowerCase.includes('intelligence')) {
    types.push('Data Analytics');
  }
  if (lowerProducts.includes('power automate') || lowerCase.includes('workflow')) {
    types.push('Workflow Automation');
  }
  if (lowerCase.includes('compliance') || lowerCase.includes('risk') || lowerCase.includes('audit')) {
    types.push('Risk & Compliance');
  }
  if (lowerCase.includes('customer') || lowerCase.includes('contact center')) {
    types.push('Customer Experience');
  }

  return types.length > 0 ? types : ['Business Process Enhancement'];
}

/**
 * Determine prerequisites based on use case characteristics
 */
function determinePrerequisites(useCase: string, departments: string, products: string): string[] {
  const prereqs: string[] = [];
  const lowerCase = useCase.toLowerCase();
  const lowerProducts = products.toLowerCase();
  const lowerDepts = departments.toLowerCase();

  // GenAI Platform prerequisites
  if (lowerCase.includes('ai') || lowerCase.includes('copilot') || lowerCase.includes('genai') || 
      lowerProducts.includes('azure openai') || lowerProducts.includes('copilot')) {
    prereqs.push('GenAI Platform (Azure OpenAI, model hosting, safety filters, governance)');
  }

  // Communication channels
  if (lowerCase.includes('chatbot') || lowerCase.includes('bot') || lowerCase.includes('contact center') ||
      lowerCase.includes('customer') || lowerProducts.includes('teams')) {
    prereqs.push('Communication Channels (Teams, Web, Mobile integration)');
  }

  // Core banking integration
  if (lowerCase.includes('loan') || lowerCase.includes('credit') || lowerCase.includes('banking') ||
      lowerCase.includes('transaction') || lowerCase.includes('account') || lowerCase.includes('payment')) {
    prereqs.push('Core Banking API Layer (abstracted banking services)');
  }

  // CRM and customer data
  if (lowerCase.includes('customer') || lowerCase.includes('crm') || lowerCase.includes('relationship') ||
      lowerDepts.includes('retail banking') || lowerDepts.includes('commercial')) {
    prereqs.push('CRM System Access (customer data, interaction history)');
  }

  // Document management
  if (lowerCase.includes('document') || lowerCase.includes('idp') || lowerCase.includes('form') ||
      lowerProducts.includes('document intelligence') || lowerProducts.includes('sharepoint')) {
    prereqs.push('Document Management System (OCR, storage, versioning)');
  }

  // Data platform
  if (lowerCase.includes('analytics') || lowerCase.includes('data') || lowerCase.includes('insights') ||
      lowerProducts.includes('fabric') || lowerProducts.includes('databricks')) {
    prereqs.push('Data Platform (data lake, ETL pipelines, real-time processing)');
  }

  // Compliance and audit
  if (lowerCase.includes('compliance') || lowerCase.includes('audit') || lowerCase.includes('risk') ||
      lowerProducts.includes('purview')) {
    prereqs.push('Compliance & Audit Framework (logging, monitoring, governance)');
  }

  // Authentication and identity
  if (lowerCase.includes('authentication') || lowerCase.includes('identity') || lowerCase.includes('access')) {
    prereqs.push('Identity & Access Management (SSO, MFA, role-based access)');
  }

  // If no specific prereqs identified, add basic ones
  if (prereqs.length === 0) {
    prereqs.push('Azure Cloud Infrastructure');
    prereqs.push('Identity & Access Management (SSO, MFA, role-based access)');
  }

  return prereqs;
}

/**
 * Generate tags for classification and filtering
 */
function generateTags(group: string, subCategory: string, useCase: string): string[] {
  const tags: string[] = [];
  const lowerCase = useCase.toLowerCase();

  // Add group and subcategory as tags (without numeric prefixes)
  if (group) tags.push(removeNumericPrefix(group));
  if (subCategory) tags.push(removeNumericPrefix(subCategory));

  // Technology tags
  if (lowerCase.includes('ai') || lowerCase.includes('genai')) tags.push('AI');
  if (lowerCase.includes('copilot')) tags.push('Copilot');
  if (lowerCase.includes('automation')) tags.push('Automation');
  if (lowerCase.includes('analytics')) tags.push('Analytics');
  if (lowerCase.includes('chatbot') || lowerCase.includes('bot')) tags.push('Chatbot');

  // Department tags
  if (lowerCase.includes('customer') || lowerCase.includes('retail')) tags.push('Customer-Facing');
  if (lowerCase.includes('risk') || lowerCase.includes('compliance')) tags.push('Risk Management');
  if (lowerCase.includes('hr')) tags.push('HR');
  if (lowerCase.includes('finance')) tags.push('Finance');

  // Capability tags
  if (lowerCase.includes('document')) tags.push('Document Processing');
  if (lowerCase.includes('fraud') || lowerCase.includes('aml')) tags.push('Fraud Detection');
  if (lowerCase.includes('loan') || lowerCase.includes('credit')) tags.push('Lending');

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Determine cost model based on Microsoft products used
 */
export function determineCostModel(products: string[]): 'License' | 'ACR' | 'Hybrid' {
  const productsStr = products.join(' ').toLowerCase();
  
  const hasLicense = productsStr.includes('365 copilot') || 
                     productsStr.includes('github copilot') ||
                     productsStr.includes('security copilot') ||
                     productsStr.includes('dynamics 365');
  
  const hasACR = productsStr.includes('azure openai') ||
                 productsStr.includes('azure ai') ||
                 productsStr.includes('fabric') ||
                 productsStr.includes('databricks') ||
                 productsStr.includes('sentinel') ||
                 productsStr.includes('document intelligence');
  
  if (hasLicense && hasACR) return 'Hybrid';
  if (hasLicense) return 'License';
  return 'ACR';
}

/**
 * Get default license cost per user based on product
 */
export function getDefaultLicenseCost(products: string[]): number {
  const productsStr = products.join(' ').toLowerCase();
  
  if (productsStr.includes('365 copilot')) return 30; // $30/user/month
  if (productsStr.includes('github copilot')) return 19; // $19/user/month for Business
  if (productsStr.includes('security copilot')) return 40; // $40/user/month (estimated)
  if (productsStr.includes('dynamics 365')) return 50; // $50/user/month average
  
  return 25; // Default license cost
}

/**
 * Get default license count based on departments and use case scope
 * Conservative estimates for realistic bank deployments
 */
export function getDefaultLicenseCount(departments: string[], useCase: string): number {
  const lowerCase = useCase.toLowerCase();
  
  // Enterprise-wide use cases (M365 Copilot for most office workers)
  if (lowerCase.includes('most office workers') || lowerCase.includes('all employees')) {
    return 2000; // Phase 1: 2000 users (not all 30k+ employees immediately)
  }
  
  // Contact center (high volume)
  if (lowerCase.includes('contact center') || lowerCase.includes('agent')) return 300;
  
  // RM/Sales teams
  if (lowerCase.includes('rm') || lowerCase.includes('relationship manager') || lowerCase.includes('sales')) return 250;
  
  // IT/Developer tools
  if (lowerCase.includes('developer') || lowerCase.includes('coding') || lowerCase.includes('github')) return 200;
  
  // Compliance/Risk/Legal (smaller teams)
  if (lowerCase.includes('compliance') || lowerCase.includes('legal') || lowerCase.includes('audit')) return 80;
  
  // Department-specific (realistic team sizes)
  if (departments.length === 1) return 100; // Single department pilot
  if (departments.length === 2) return 200; // Two departments
  if (departments.length >= 3) return 350; // Multiple departments
  
  return 150; // Conservative default for productivity tools
}

/**
 * Get default ACR monthly spend based on use case complexity
 * Conservative estimates for pilot/initial deployments
 */
export function getDefaultACRSpend(products: string[], useCase: string): number {
  const productsStr = products.join(' ').toLowerCase();
  const lowerCase = useCase.toLowerCase();
  
  // High complexity (Large models, real-time analytics, enterprise-scale)
  if (productsStr.includes('fabric') && productsStr.includes('databricks')) return 80000; // $80k/month
  if (lowerCase.includes('fraud detection') || lowerCase.includes('risk model')) return 65000; // $65k/month
  if (productsStr.includes('real-time intelligence')) return 55000; // $55k/month
  
  // Medium-high complexity (Customer-facing AI, complex analytics)
  if (lowerCase.includes('customer bot') && lowerCase.includes('advanced')) return 35000; // $35k/month
  if (productsStr.includes('fabric') && productsStr.includes('azure openai')) return 30000; // $30k/month
  
  // Medium complexity (Azure OpenAI, Document Intelligence - department level)
  if (productsStr.includes('azure openai')) return 12000; // $12k/month for typical use case
  if (productsStr.includes('document intelligence')) return 8000; // $8k/month
  if (productsStr.includes('ai search')) return 5000; // $5k/month
  
  // Low complexity (Simple automation, APIs)
  if (productsStr.includes('power automate') && !productsStr.includes('azure openai')) return 3000; // $3k/month
  if (productsStr.includes('copilot studio') && !productsStr.includes('azure openai')) return 4000; // $4k/month
  
  return 8000; // Conservative default $8k/month
}

/**
 * Determine implementation cost bucket based on use case characteristics
 * Three tiers: Tier 1 (<100K), Tier 2 (100K-1M), Tier 3 (1-3M)
 * Target total: ~17-18M USD across all use cases
 */
export function getImplementationCostBucket(useCase: UseCaseRecord): {
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  cost: number;
  description: string;
} {
  const lowerCase = useCase.useCase.toLowerCase();
  const productsStr = useCase.microsoftProducts.join(' ').toLowerCase();
  const deptCount = useCase.departments.length;
  
  // Calculate complexity score
  let complexityScore = 0;
  
  // Enterprise-wide scope indicators (+40 points)
  if (lowerCase.includes('most office workers') || 
      lowerCase.includes('all employees') || 
      lowerCase.includes('enterprise-wide') ||
      lowerCase.includes('bank-wide')) {
    complexityScore += 40;
  }
  
  // High-complexity products (+5-10 points each)
  if (productsStr.includes('fabric')) complexityScore += 10;
  if (productsStr.includes('databricks')) complexityScore += 10;
  if (productsStr.includes('azure openai')) complexityScore += 5; // Reduced from 8
  if (productsStr.includes('document intelligence')) complexityScore += 6; // Reduced from 7
  if (productsStr.includes('sentinel')) complexityScore += 8;
  if (productsStr.includes('real-time intelligence')) complexityScore += 9;
  
  // Mission-critical use cases (+15 points)
  if (lowerCase.includes('fraud detection') || 
      lowerCase.includes('anti-money laundering') ||
      lowerCase.includes('aml') ||
      lowerCase.includes('risk model') ||
      lowerCase.includes('credit scoring')) {
    complexityScore += 15;
  }
  
  // Customer-facing systems (+10 points)
  if (lowerCase.includes('customer bot') || 
      lowerCase.includes('customer service') ||
      lowerCase.includes('contact center') ||
      lowerCase.includes('client portal')) {
    complexityScore += 10;
  }
  
  // Core banking integration (+12 points)
  if (lowerCase.includes('core banking') || 
      lowerCase.includes('loan processing') ||
      lowerCase.includes('payment') ||
      lowerCase.includes('transaction')) {
    complexityScore += 12;
  }
  
  // Multi-department scope (+3 points per department over 2)
  if (deptCount >= 3) {
    complexityScore += (deptCount - 2) * 3; // Reduced from 5
  }
  
  // Real-time/Advanced AI (+8 points)
  if (lowerCase.includes('real-time') || 
      lowerCase.includes('streaming') ||
      lowerCase.includes('advanced ai')) {
    complexityScore += 8;
  }
  
  // Data platform/analytics (+7 points)
  if (lowerCase.includes('data platform') || 
      lowerCase.includes('analytics platform') ||
      lowerCase.includes('data lake')) {
    complexityScore += 7;
  }
  
  // Now assign tier based on complexity score
  // Tier 3 (1-3M USD): Score >= 40
  if (complexityScore >= 40) {
    // High complexity: 1.5M - 2.8M
    let cost: number;
    if (complexityScore >= 60) {
      cost = 2800000; // Maximum complexity
    } else if (complexityScore >= 50) {
      cost = 2200000; // Very high complexity
    } else {
      cost = 1500000; // High complexity
    }
    
    return {
      tier: 'Tier 3',
      cost,
      description: 'Enterprise-scale deployment with multiple high-complexity products, extensive integration requirements, and bank-wide impact. Includes comprehensive change management, security validation, and multi-phase rollout.'
    };
  }
  
  // Tier 2 (100K-1M USD): Score >= 20 (increased threshold)
  if (complexityScore >= 20) {
    // Medium complexity: 120K - 650K (reduced upper costs)
    let cost: number;
    if (complexityScore >= 30) {
      cost = 550000; // Upper medium complexity (reduced from 750k)
    } else if (complexityScore >= 25) {
      cost = 350000; // Medium-high complexity (reduced from 450k)
    } else if (complexityScore >= 22) {
      cost = 220000; // Medium complexity (reduced from 280k)
    } else {
      cost = 140000; // Lower medium complexity (reduced from 150k)
    }
    
    return {
      tier: 'Tier 2',
      cost,
      description: 'Department or multi-department deployment with specialized AI capabilities, custom integrations, and moderate change management. Requires pilot phase and phased rollout.'
    };
  }
  
  // Tier 1 (<100K USD): Score < 20 (updated threshold)
  // Low complexity: 35K - 95K
  let cost: number;
  if (complexityScore >= 15) {
    cost = 90000; // Upper low complexity (just below Tier 2)
  } else if (complexityScore >= 10) {
    cost = 70000; // Medium-high low complexity
  } else if (complexityScore >= 5) {
    cost = 50000; // Medium low complexity
  } else {
    cost = 35000; // Basic implementation
  }
  
  return {
    tier: 'Tier 1',
    cost,
    description: 'Single department or team pilot with standard products and minimal customization. Standard training and rollout process with limited integration requirements.'
  };
}

/**
 * Calculate total investment per use case (3-year TCO)
 */
export function calculateUseCaseInvestment(useCase: UseCaseRecord): number {
  const costModel = useCase.costModel || determineCostModel(useCase.microsoftProducts);
  const months = 36; // 3-year period (matching Forrester)
  
  let licenseCost = 0;
  let acrCost = 0;
  let implementation = useCase.implementationCost || 0;
  
  if (costModel === 'License' || costModel === 'Hybrid') {
    const users = useCase.licenseCount || getDefaultLicenseCount(useCase.departments, useCase.useCase);
    const costPerUser = useCase.licenseCostPerUser || getDefaultLicenseCost(useCase.microsoftProducts);
    licenseCost = users * costPerUser * months;
  }
  
  if (costModel === 'ACR' || costModel === 'Hybrid') {
    const monthlyACR = useCase.acrMonthlySpend || getDefaultACRSpend(useCase.microsoftProducts, useCase.useCase);
    acrCost = monthlyACR * months;
  }
  
  // Calculate implementation cost using the new bucketing system
  if (!implementation) {
    const bucket = getImplementationCostBucket(useCase);
    implementation = bucket.cost;
  }
  
  return licenseCost + acrCost + implementation;
}

/**
 * Get implementation activities for a use case
 */
export function getImplementationActivities(useCase: UseCaseRecord): string[] {
  const costModel = determineCostModel(useCase.microsoftProducts);
  const productsStr = useCase.microsoftProducts.join(' ').toLowerCase();
  const activities: string[] = [];
  
  // Phase 1: Planning & Setup (Month 1)
  activities.push('Requirements gathering and stakeholder alignment');
  activities.push('Technical architecture design and approval');
  activities.push('Data governance and compliance review');
  
  // Phase 2: Infrastructure (Months 1-2)
  if (costModel === 'License' || costModel === 'Hybrid') {
    activities.push('License procurement and user assignment');
    activities.push('User identity and access management setup');
  }
  if (costModel === 'ACR' || costModel === 'Hybrid') {
    activities.push('Azure environment provisioning');
    activities.push('Network and security configuration');
    if (productsStr.includes('azure openai')) {
      activities.push('Azure OpenAI service deployment and model selection');
    }
    if (productsStr.includes('fabric')) {
      activities.push('Microsoft Fabric workspace setup and data integration');
    }
    if (productsStr.includes('document intelligence')) {
      activities.push('Document Intelligence model training and testing');
    }
  }
  
  // Phase 3: Development & Integration (Months 2-4)
  activities.push('Solution development and customization');
  activities.push('Integration with existing systems');
  activities.push('Security and compliance controls implementation');
  activities.push('Testing (UAT, performance, security)');
  
  // Phase 4: Training & Adoption (Months 3-5)
  activities.push('User training and documentation');
  activities.push('Change management and communication');
  activities.push('Champion network establishment');
  
  // Phase 5: Deployment (Month 5-6)
  activities.push('Pilot deployment to select user group');
  activities.push('Feedback collection and refinement');
  activities.push('Full production rollout');
  activities.push('Go-live support and monitoring');
  
  // Phase 6: Optimization (Ongoing)
  activities.push('Usage analytics and optimization');
  activities.push('Continuous improvement and feature enhancement');
  
  return activities;
}

/**
 * Save use cases back to CSV (for two-way sync)
 * This would be called from a server-side API endpoint
 */
export async function saveUseCasesToCSV(useCases: UseCaseRecord[]): Promise<void> {
  const csvContent = useCasesToCSV(useCases);
  
  // This would call a server-side API endpoint to write the file
  const response = await fetch('/api/save-use-cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ csvContent }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save use cases');
  }
}

