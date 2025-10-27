'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

// Type Definitions
interface KPI {
  name: string;
  manualValue: string;
  aiValue: string;
  improvement: string;
  unit: string;
  description: string;
}

interface ProcessStep {
  title: string;
  technology: string[];
  description: string;
  detailedDescription: string;
  manualTime: number; // minutes
  aiTime: number; // minutes
  accuracy: { manual: number; ai: number };
  errorRate: { manual: number; ai: number }; // percentage
  reworkRate: { manual: number; ai: number }; // percentage
  kpis: KPI[];
}

interface AzureCostBreakdown {
  openAI: number; // Azure OpenAI token costs (USD/month)
  copilotStudio: number; // Copilot Studio sessions (USD/month)
  powerApps: number; // Power Apps licenses (USD/month)
  storage: number; // Blob storage (USD/month)
  database: number; // Azure SQL/Cosmos DB (USD/month)
  aks: number; // AKS hosting (USD/month)
  other: number; // Other services (USD/month)
}

interface CostStructure {
  azureCosts: AzureCostBreakdown;
  cimbMarkup: number; // % markup (default 30%)
  totalAzureCostUSD: number; // USD/month
  totalCIMBCostUSD: number; // USD/month (markup amount)
  totalMonthlyCostUSD: number; // USD/month (Azure + CIMB)
  volumeTier: 'Small' | 'Medium' | 'Large'; // T-shirt size
}

interface ClusterParameters {
  volume: number; // monthly volume for this cluster
  hourlyRate: number;
  errorCostPerIncident: number;
  reworkCostMultiplier: number;
  // Process-specific parameters
  deflectionRate?: number; // % - Contact Center: calls deflected to self-service
  containmentRate?: number; // % - Contact Center: issues resolved by automation
  recoveryRate?: number; // % - Collections: successful debt recovery
  rightPartyContactRate?: number; // % - Collections: reaching correct person
  automationRate?: number; // % - Contact Center/Collections: automated handling
  avgHandleTime?: number; // minutes - Contact Center: average call duration
  // Azure consumption costs
  azureCostStructure?: CostStructure;
}

interface ProcessCluster {
  id: string;
  title: string;
  description: string;
  businessValue: string;
  complexity: 'Low' | 'Medium' | 'High';
  riskLevel: 'Low' | 'Medium' | 'High';
  steps: ProcessStep[];
  defaultParams: ClusterParameters;
}

// Loan Application Process Data - COMPLETE VERSION
const loanApplicationClusters: ProcessCluster[] = [
  {
    id: '1',
    title: 'Application Intake',
    description: 'Customer-facing application submission and initial data capture',
    businessValue: 'First impression and customer experience driver. Reduces abandonment by 65%.',
    complexity: 'Low',
    riskLevel: 'Low',
    defaultParams: {
      volume: 1000,
      hourlyRate: 18, // RM 18/hr (~$4/hr) - Junior officer, RM 3,200/month
      errorCostPerIncident: 450, // RM 450 (~$100) - Customer service recovery
      reworkCostMultiplier: 1.5,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30, // % markup
        azureCosts: {
          openAI: 1650, // GPT-4o: 50K input ($1.25) + 10K output ($0.40) = $1.65/app × 1K apps/month
          copilotStudio: 2200, // Base $200 + 1K sessions × $2/session
          powerApps: 1000, // 50 loan officers × $20/user/month (optional)
          storage: 180, // 10GB/app × 1K apps = 10TB hot + archive storage
          database: 149, // Azure SQL Standard S2 (50 DTUs) - realistic pricing
          aks: 140, // 2 Standard D2s v3 nodes for AKS cluster
          other: 150 // Monitoring, networking, App Insights, API Management
        },
        totalAzureCostUSD: 5469, // Total Azure services in USD
        totalCIMBCostUSD: 1640.70, // 30% markup
        totalMonthlyCostUSD: 7109.70 // USD total (Azure + CIMB)
      }
    },
    steps: [
      {
        title: 'Intelligent Form Submission',
        technology: ['Copilot Studio', 'Power Apps', 'Azure OpenAI'],
        description: 'AI-powered form with real-time validation and auto-completion',
        detailedDescription: 'Copilot Studio provides conversational guidance, pre-filling fields from existing customer data, real-time validation against business rules, and smart suggestions based on customer profile. Power Apps delivers responsive UI across devices. Azure OpenAI understands natural language inputs and corrects common errors.',
        manualTime: 25,
        aiTime: 8,
        accuracy: { manual: 85, ai: 98 },
        errorRate: { manual: 15, ai: 2 },
        reworkRate: { manual: 22, ai: 3 },
        kpis: [
          { name: 'Completion Time', manualValue: '25', aiValue: '8', improvement: '68%', unit: 'min', description: 'Time from start to submission' },
          { name: 'Error Rate', manualValue: '15%', aiValue: '2%', improvement: '87%', unit: 'reduction', description: 'Field-level validation errors' },
          { name: 'Customer Satisfaction', manualValue: '3.2', aiValue: '4.6', improvement: '44%', unit: '/5', description: 'Post-application CSAT score' },
          { name: 'Dropout Rate', manualValue: '18%', aiValue: '5%', improvement: '72%', unit: 'reduction', description: 'Applications started vs completed' },
          { name: 'Mobile Completion', manualValue: '45%', aiValue: '82%', improvement: '37%', unit: 'increase', description: 'Successfully completed on mobile' }
        ]
      },
      {
        title: 'Identity Verification',
        technology: ['Azure AI Vision', 'Azure Document Intelligence', 'Face API'],
        description: 'Automated ID scanning, OCR, and biometric verification',
        detailedDescription: 'Azure AI Vision extracts text from ID documents with 99.2% accuracy. Document Intelligence validates document authenticity, checks security features, and cross-references data. Face API performs liveness detection and facial matching against ID photo, preventing fraud while maintaining UX.',
        manualTime: 15,
        aiTime: 2,
        accuracy: { manual: 92, ai: 99.2 },
        errorRate: { manual: 8, ai: 0.8 },
        reworkRate: { manual: 12, ai: 1 },
        kpis: [
          { name: 'Verification Time', manualValue: '15', aiValue: '2', improvement: '87%', unit: 'min', description: 'Full ID verification process' },
          { name: 'Accuracy', manualValue: '92%', aiValue: '99.2%', improvement: '7.2%', unit: 'increase', description: 'Correct ID validation' },
          { name: 'Fraud Detection', manualValue: '75%', aiValue: '94%', improvement: '19%', unit: 'increase', description: 'Synthetic ID and fraud catch rate' },
          { name: 'False Positive Rate', manualValue: '8%', aiValue: '1.2%', improvement: '85%', unit: 'reduction', description: 'Valid applications rejected' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Document Collection',
    description: 'Multi-channel document gathering with intelligent validation and extraction',
    businessValue: 'Eliminates 90% of manual data entry. Critical path reduction from 3 days to 4 hours.',
    complexity: 'Medium',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 1000,
      hourlyRate: 23, // RM 23/hr (~$5/hr) - Mid-level officer, RM 4,000/month
      errorCostPerIncident: 680, // RM 680 (~$150) - Document reprocessing
      reworkCostMultiplier: 2.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 825, // GPT-4o: 25K input + 5K output per document set × 1K apps
          copilotStudio: 0, // Not needed for document processing
          powerApps: 800, // 40 document processors × $20/user/month
          storage: 380, // 20GB/app × 1K apps = 20TB (documents, images, scans)
          database: 75, // Azure SQL Standard S1 for document metadata
          aks: 100, // 2 Standard D2s v3 nodes for document processing services
          other: 280 // Document Intelligence ($210), Form Recognizer ($70)
        },
        totalAzureCostUSD: 2460,
        totalCIMBCostUSD: 738,
        totalMonthlyCostUSD: 3198
      }
    },
    steps: [
      {
        title: 'Document Upload & Classification',
        technology: ['Azure Document Intelligence', 'Azure OpenAI', 'Blob Storage'],
        description: 'Automated document type detection and intelligent routing',
        detailedDescription: 'System accepts documents via web, mobile, email, or API. Azure Document Intelligence analyzes document structure and classifies into 25+ document types (pay slips, bank statements, tax returns, etc.). Azure OpenAI handles edge cases and unstructured documents. Documents are auto-routed to appropriate processing queues with confidence scores.',
        manualTime: 30,
        aiTime: 3,
        accuracy: { manual: 88, ai: 97 },
        errorRate: { manual: 12, ai: 3 },
        reworkRate: { manual: 18, ai: 4 },
        kpis: [
          { name: 'Processing Time', manualValue: '30', aiValue: '3', improvement: '90%', unit: 'min', description: 'Upload to classification' },
          { name: 'Classification Accuracy', manualValue: '88%', aiValue: '97%', improvement: '9%', unit: 'increase', description: 'Correct document type identification' },
          { name: 'Documents Processed', manualValue: '8', aiValue: '50', improvement: '525%', unit: 'per hour', description: 'Throughput per FTE' },
          { name: 'Multi-Channel Support', manualValue: '2', aiValue: '6', improvement: '200%', unit: 'channels', description: 'Intake channels supported' }
        ]
      },
      {
        title: 'Intelligent Data Extraction',
        technology: ['Form Recognizer', 'Azure ML', 'Custom AI Models'],
        description: 'Field-level data extraction with validation and confidence scoring',
        detailedDescription: 'Form Recognizer uses pre-built and custom models to extract structured data from documents. Azure ML models trained on 100K+ documents recognize patterns across various formats. System extracts 50-200 fields per document depending on type, calculates confidence scores, flags low-confidence extractions for human review, and cross-validates data across multiple documents.',
        manualTime: 45,
        aiTime: 5,
        accuracy: { manual: 85, ai: 96 },
        errorRate: { manual: 15, ai: 4 },
        reworkRate: { manual: 28, ai: 5 },
        kpis: [
          { name: 'Extraction Time', manualValue: '45', aiValue: '5', improvement: '89%', unit: 'min', description: 'Per document data extraction' },
          { name: 'Field Accuracy', manualValue: '85%', aiValue: '96%', improvement: '11%', unit: 'increase', description: 'Correctly extracted fields' },
          { name: 'Manual Corrections', manualValue: '35%', aiValue: '4%', improvement: '89%', unit: 'reduction', description: 'Fields requiring human correction' },
          { name: 'STP Rate', manualValue: '22%', aiValue: '78%', improvement: '56%', unit: 'increase', description: 'Straight-through processing rate' }
        ]
      },
      {
        title: 'Document Completeness & Validation',
        technology: ['Azure OpenAI', 'Business Rules Engine', 'Power Automate'],
        description: 'Cross-document validation and missing document detection',
        detailedDescription: 'Azure OpenAI analyzes document sets for completeness based on loan type and amount. System checks for required documents, validates consistency across documents (e.g., address matching), identifies suspicious patterns, calculates income from multiple sources, and auto-requests missing documents via personalized messages.',
        manualTime: 20,
        aiTime: 3,
        accuracy: { manual: 90, ai: 98 },
        errorRate: { manual: 10, ai: 2 },
        reworkRate: { manual: 15, ai: 3 },
        kpis: [
          { name: 'Validation Time', manualValue: '20', aiValue: '3', improvement: '85%', unit: 'min', description: 'Full document set validation' },
          { name: 'Completeness Check', manualValue: '90%', aiValue: '98%', improvement: '8%', unit: 'increase', description: 'Catching missing documents' },
          { name: 'Cross-Doc Accuracy', manualValue: '82%', aiValue: '95%', improvement: '13%', unit: 'increase', description: 'Data consistency validation' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Validation & Verification',
    description: 'Intelligent data consistency checks and third-party verification',
    businessValue: 'Prevents 94% of fraudulent applications from reaching underwriting. Saves $2.3M annually.',
    complexity: 'Medium',
    riskLevel: 'High',
    defaultParams: {
      volume: 1000,
      hourlyRate: 28, // RM 28/hr (~$6/hr) - Senior officer, RM 5,000/month
      errorCostPerIncident: 2250, // RM 2,250 (~$500) - External verification rework
      reworkCostMultiplier: 3.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 950, // GPT-4o: 30K input + 8K output for fraud detection per app
          copilotStudio: 0, // Not needed
          powerApps: 600, // 30 verification officers × $20/user/month
          storage: 50, // Minimal storage, mostly API responses and logs
          database: 99, // Azure SQL Standard S1 (20 DTUs) for verification history
          aks: 120, // 2 nodes for verification services
          other: 450 // Azure ML models ($250), API Management ($150), Logic Apps ($50)
        },
        totalAzureCostUSD: 2269,
        totalCIMBCostUSD: 680.70,
        totalMonthlyCostUSD: 2949.70
      }
    },
    steps: [
      {
        title: 'Data Consistency & Anomaly Detection',
        technology: ['Azure OpenAI', 'Azure ML', 'Business Rules Engine'],
        description: 'Cross-field validation and intelligent anomaly detection',
        detailedDescription: 'AI analyzes 200+ data points for consistency. Checks: income vs. expenses alignment, address history consistency, employment tenure validation, credit history patterns, debt-to-income ratios, and behavioral anomalies. ML models trained on 500K applications detect subtle fraud patterns. System flags high-risk applications for enhanced review.',
        manualTime: 25,
        aiTime: 3,
        accuracy: { manual: 87, ai: 96 },
        errorRate: { manual: 13, ai: 4 },
        reworkRate: { manual: 19, ai: 5 },
        kpis: [
          { name: 'Check Time', manualValue: '25', aiValue: '3', improvement: '88%', unit: 'min', description: 'Full consistency validation' },
          { name: 'Error Detection', manualValue: '87%', aiValue: '96%', improvement: '9%', unit: 'increase', description: 'Inconsistencies caught' },
          { name: 'False Positives', manualValue: '22%', aiValue: '6%', improvement: '73%', unit: 'reduction', description: 'Valid apps flagged as errors' },
          { name: 'Fraud Detection', manualValue: '68%', aiValue: '89%', improvement: '21%', unit: 'increase', description: 'Fraudulent patterns identified' }
        ]
      },
      {
        title: 'Third-Party Verification',
        technology: ['API Integration', 'Azure Functions', 'Logic Apps'],
        description: 'Automated credit bureau, employment, and income verification',
        detailedDescription: 'Parallel API calls to: credit bureaus (Experian, TransUnion), employment verification services, income validation platforms, address verification, and government databases. Azure Functions orchestrates API calls, handles rate limiting, manages retries, consolidates responses, and reconciles data discrepancies. Real-time decisioning based on verified data.',
        manualTime: 35,
        aiTime: 5,
        accuracy: { manual: 95, ai: 99 },
        errorRate: { manual: 5, ai: 1 },
        reworkRate: { manual: 8, ai: 1 },
        kpis: [
          { name: 'Verification Time', manualValue: '35', aiValue: '5', improvement: '86%', unit: 'min', description: 'All third-party checks' },
          { name: 'Data Accuracy', manualValue: '95%', aiValue: '99%', improvement: '4%', unit: 'increase', description: 'Verified data correctness' },
          { name: 'API Success Rate', manualValue: '92%', aiValue: '99.5%', improvement: '7.5%', unit: 'increase', description: 'Successful API calls' },
          { name: 'Cost per Check', manualValue: '$8.50', aiValue: '$5.20', improvement: '39%', unit: 'reduction', description: 'Third-party API costs' }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Underwriting & Risk Assessment',
    description: 'AI-powered credit decisioning with advanced machine learning',
    businessValue: 'Improves default prediction by 12%. Enables $45M additional lending with same risk appetite.',
    complexity: 'High',
    riskLevel: 'High',
    defaultParams: {
      volume: 1000,
      hourlyRate: 45, // RM 45/hr (~$10/hr) - Credit analyst/specialist, RM 8,000/month
      errorCostPerIncident: 45000, // RM 45,000 (~$10,000) - Bad loan default cost
      reworkCostMultiplier: 5.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 1400, // GPT-4o: 40K input + 12K output for decision explanations per app
          copilotStudio: 0, // Not needed
          powerApps: 400, // 20 underwriters × $20/user/month
          storage: 120, // Model data, training sets, historical decisions
          database: 199, // Azure SQL Standard S3 (100 DTUs) for risk scoring database
          aks: 180, // 3 nodes for ML model serving and API layer
          other: 1850 // Azure ML ($800), Databricks ($600), Synapse Analytics ($350), Purview ($100)
        },
        totalAzureCostUSD: 4149,
        totalCIMBCostUSD: 1244.70,
        totalMonthlyCostUSD: 5393.70
      }
    },
    steps: [
      {
        title: 'Advanced Credit Scoring & Risk Assessment',
        technology: ['Azure ML', 'Azure Databricks', 'Azure OpenAI', 'Synapse Analytics'],
        description: 'ML-based credit scoring with alternative data and explainable AI',
        detailedDescription: 'Ensemble ML models (XGBoost, Neural Networks, Random Forest) trained on 2M+ loan outcomes. Incorporates traditional credit data, alternative data (payment history, transaction patterns, behavioral signals), and open banking data. Models generate credit scores, probability of default, loss-given-default estimates, and exposure-at-default. Azure OpenAI provides natural language explanations for decisions, ensuring transparency and regulatory compliance.',
        manualTime: 60,
        aiTime: 8,
        accuracy: { manual: 82, ai: 94 },
        errorRate: { manual: 18, ai: 6 },
        reworkRate: { manual: 25, ai: 7 },
        kpis: [
          { name: 'Scoring Time', manualValue: '60', aiValue: '8', improvement: '87%', unit: 'min', description: 'Complete risk assessment' },
          { name: 'Default Prediction', manualValue: '82%', aiValue: '94%', improvement: '12%', unit: 'increase', description: 'Accuracy of default forecasting' },
          { name: 'Risk Assessment', manualValue: '78%', aiValue: '91%', improvement: '13%', unit: 'increase', description: 'Risk stratification accuracy' },
          { name: 'Approval Rate', manualValue: '65%', aiValue: '73%', improvement: '8%', unit: 'increase', description: 'Safe lending expansion' },
          { name: 'Default Rate', manualValue: '3.2%', aiValue: '2.1%', improvement: '34%', unit: 'reduction', description: 'Portfolio default rate' }
        ]
      },
      {
        title: 'Policy Compliance & Regulatory Check',
        technology: ['Azure OpenAI', 'Microsoft Purview', 'Compliance Engine'],
        description: 'Automated policy validation and regulatory compliance verification',
        detailedDescription: 'System validates against 150+ policy rules and regulatory requirements. Checks: lending limits, LTV ratios, debt service ratios, fair lending compliance, responsible lending criteria, anti-money laundering rules, and sector-specific restrictions. Microsoft Purview ensures data governance. Azure OpenAI interprets complex policies and provides context-aware compliance assessments.',
        manualTime: 30,
        aiTime: 5,
        accuracy: { manual: 90, ai: 98 },
        errorRate: { manual: 10, ai: 2 },
        reworkRate: { manual: 15, ai: 3 },
        kpis: [
          { name: 'Compliance Check', manualValue: '30', aiValue: '5', improvement: '83%', unit: 'min', description: 'Full policy validation' },
          { name: 'Policy Accuracy', manualValue: '90%', aiValue: '98%', improvement: '8%', unit: 'increase', description: 'Correct policy application' },
          { name: 'Regulatory Violations', manualValue: '8', aiValue: '0.5', improvement: '94%', unit: 'per year', description: 'Compliance breaches' }
        ]
      },
      {
        title: 'Decision Recommendation & Explanation',
        technology: ['Azure OpenAI', 'Azure ML', 'Responsible AI Dashboard'],
        description: 'AI-generated approval recommendations with transparent explanations',
        detailedDescription: 'System generates approve/decline/refer recommendations with confidence scores using Azure ML models. Azure OpenAI creates human-readable explanations citing specific factors. Responsible AI Dashboard (with SHAP/LIME) shows feature importance and model interpretability. System suggests conditions (e.g., lower amount, add co-borrower, require additional collateral). Recommendations align with risk appetite and strategic priorities. Underwriters can override with documented reasons.',
        manualTime: 25,
        aiTime: 3,
        accuracy: { manual: 88, ai: 95 },
        errorRate: { manual: 12, ai: 5 },
        reworkRate: { manual: 18, ai: 6 },
        kpis: [
          { name: 'Decision Time', manualValue: '25', aiValue: '3', improvement: '88%', unit: 'min', description: 'Recommendation generation' },
          { name: 'Recommendation Accuracy', manualValue: '88%', aiValue: '95%', improvement: '7%', unit: 'increase', description: 'AI vs final decision alignment' },
          { name: 'Override Rate', manualValue: '22%', aiValue: '8%', improvement: '64%', unit: 'reduction', description: 'Human overrides of AI decision' }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Decisioning & Pricing',
    description: 'Dynamic risk-based pricing and automated approval routing',
    businessValue: 'Optimizes interest margins by $8.2M annually while maintaining competitiveness.',
    complexity: 'Medium',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 1000,
      hourlyRate: 38, // RM 38/hr (~$8.50/hr) - Pricing specialist, RM 6,700/month
      errorCostPerIncident: 9000, // RM 9,000 (~$2,000) - Pricing error impact
      reworkCostMultiplier: 2.5,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 660, // GPT-4o: 20K input + 5K output for pricing logic per app
          copilotStudio: 0, // Not needed
          powerApps: 300, // 15 pricing specialists × $20/user/month
          storage: 40, // Minimal - pricing models and market data
          database: 99, // Azure SQL Standard S1 for pricing history and audit
          aks: 100, // 2 nodes for pricing engine
          other: 350 // Azure ML models ($200), Power Automate ($100), Dynamics 365 ($50)
        },
        totalAzureCostUSD: 1549,
        totalCIMBCostUSD: 464.70,
        totalMonthlyCostUSD: 2013.70
      }
    },
    steps: [
      {
        title: 'Dynamic Interest Rate Calculation',
        technology: ['Azure ML', 'Pricing Engine', 'Market Data Integration'],
        description: 'Risk-based pricing with market intelligence and competitive analysis',
        detailedDescription: 'ML models optimize pricing based on: customer risk profile, loan characteristics, market rates, competitor pricing, customer relationship value, cross-sell potential, and strategic priorities. Real-time market data integration ensures competitive positioning. System calculates optimal rate maximizing NPV while maintaining approval probability above threshold. Includes sensitivity analysis and what-if scenarios.',
        manualTime: 20,
        aiTime: 2,
        accuracy: { manual: 92, ai: 97 },
        errorRate: { manual: 8, ai: 3 },
        reworkRate: { manual: 12, ai: 4 },
        kpis: [
          { name: 'Pricing Time', manualValue: '20', aiValue: '2', improvement: '90%', unit: 'min', description: 'Rate calculation and approval' },
          { name: 'Pricing Accuracy', manualValue: '92%', aiValue: '97%', improvement: '5%', unit: 'increase', description: 'Optimal rate achievement' },
          { name: 'Competitive Position', manualValue: '75%', aiValue: '89%', improvement: '14%', unit: 'increase', description: 'Win rate vs competitors' },
          { name: 'Margin Optimization', manualValue: '$850', aiValue: '$1,240', improvement: '46%', unit: 'per loan', description: 'Net interest margin gained' }
        ]
      },
      {
        title: 'Approval Authority Routing & Workflow',
        technology: ['Power Automate', 'Business Rules', 'Dynamics 365'],
        description: 'Intelligent routing based on risk, amount, and organizational hierarchy',
        detailedDescription: 'System auto-routes applications based on 50+ criteria: loan amount tiers, risk ratings, exception types, product complexity, customer segment, and branch/region. Power Automate orchestrates workflows across systems. Tracks SLAs, sends reminders, escalates delays, and maintains audit trails. Supports parallel approvals for complex cases.',
        manualTime: 15,
        aiTime: 1,
        accuracy: { manual: 95, ai: 99 },
        errorRate: { manual: 5, ai: 1 },
        reworkRate: { manual: 8, ai: 1 },
        kpis: [
          { name: 'Routing Time', manualValue: '15', aiValue: '1', improvement: '93%', unit: 'min', description: 'Approval routing execution' },
          { name: 'Routing Accuracy', manualValue: '95%', aiValue: '99%', improvement: '4%', unit: 'increase', description: 'Correct authority routing' },
          { name: 'SLA Compliance', manualValue: '82%', aiValue: '96%', improvement: '14%', unit: 'increase', description: 'Meeting approval timelines' }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Documentation & Approval',
    description: 'Automated contract generation and digital signing workflow',
    businessValue: 'Reduces legal review time by 83%. Achieves 95% e-signature adoption.',
    complexity: 'Low',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 1000,
      hourlyRate: 32, // RM 32/hr (~$7/hr) - Documentation officer, RM 5,600/month
      errorCostPerIncident: 13500, // RM 13,500 (~$3,000) - Legal/compliance rework
      reworkCostMultiplier: 3.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 1100, // GPT-4o: 35K input + 15K output for contract generation per app
          copilotStudio: 0, // Not needed
          powerApps: 400, // 20 doc officers × $20/user/month
          storage: 280, // Contracts, templates, signed documents (PDF/DOCX)
          database: 99, // Azure SQL Standard S1 for document tracking
          aks: 80, // 2 nodes for document services
          other: 450 // Document Assembly ($200), SharePoint ($150), e-Sign API ($100)
        },
        totalAzureCostUSD: 2409,
        totalCIMBCostUSD: 722.70,
        totalMonthlyCostUSD: 3131.70
      }
    },
    steps: [
      {
        title: 'Intelligent Contract Generation',
        technology: ['Azure OpenAI', 'Document Assembly', 'SharePoint'],
        description: 'Auto-generated loan agreements with smart clauses and compliance',
        detailedDescription: 'Azure OpenAI generates contracts from 200+ templates based on loan type, amount, terms, collateral, and customer profile. Inserts appropriate clauses, disclaimers, and regulatory disclosures. Adapts language complexity to customer sophistication. Highlights key terms. Generates supporting documents (amortization schedules, disclosure statements, etc.). Validates against legal repository. Tracks versions and changes.',
        manualTime: 40,
        aiTime: 5,
        accuracy: { manual: 90, ai: 98 },
        errorRate: { manual: 10, ai: 2 },
        reworkRate: { manual: 15, ai: 3 },
        kpis: [
          { name: 'Generation Time', manualValue: '40', aiValue: '5', improvement: '88%', unit: 'min', description: 'Complete contract creation' },
          { name: 'Document Accuracy', manualValue: '90%', aiValue: '98%', improvement: '8%', unit: 'increase', description: 'Error-free contracts' },
          { name: 'Legal Review Time', manualValue: '120', aiValue: '20', improvement: '83%', unit: 'min', description: 'Lawyer review time' },
          { name: 'Template Coverage', manualValue: '70%', aiValue: '95%', improvement: '25%', unit: 'increase', description: 'Automated contract types' }
        ]
      },
      {
        title: 'Digital Signature & Verification',
        technology: ['DocuSign', 'Azure AD', 'Power Apps'],
        description: 'Seamless multi-party e-signature with authentication',
        detailedDescription: 'Integrated DocuSign workflow with biometric authentication. Supports: single/multiple signatories, sequential/parallel signing, in-person signing, SMS/email notifications, signing reminders, and signature verification. Azure AD provides identity assurance. Mobile-optimized signing experience. Real-time status tracking. Automatic storage in document repository. Blockchain timestamping for audit trail.',
        manualTime: 30,
        aiTime: 5,
        accuracy: { manual: 98, ai: 100 },
        errorRate: { manual: 2, ai: 0 },
        reworkRate: { manual: 5, ai: 0.5 },
        kpis: [
          { name: 'Signing Time', manualValue: '30', aiValue: '5', improvement: '83%', unit: 'min', description: 'Customer signing process' },
          { name: 'Completion Rate', manualValue: '78%', aiValue: '95%', improvement: '17%', unit: 'increase', description: 'Signed vs sent rate' },
          { name: 'Mobile Signing', manualValue: '35%', aiValue: '78%', improvement: '43%', unit: 'increase', description: 'Signed on mobile device' },
          { name: 'Same-Day Execution', manualValue: '42%', aiValue: '87%', improvement: '45%', unit: 'increase', description: 'Contracts signed same day' }
        ]
      }
    ]
  },
  {
    id: '7',
    title: 'Account Setup & Disbursement',
    description: 'Automated account creation, fund transfer, and customer notification',
    businessValue: 'Achieves 98% same-day funding. Improves NPS by 23 points.',
    complexity: 'Medium',
    riskLevel: 'Low',
    defaultParams: {
      volume: 1000,
      hourlyRate: 28, // RM 28/hr (~$6/hr) - Operations officer, RM 5,000/month
      errorCostPerIncident: 4500, // RM 4,500 (~$1,000) - Disbursement error recovery
      reworkCostMultiplier: 2.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 440, // GPT-4o: 15K input + 3K output for notification generation per app
          copilotStudio: 1500, // Chatbot for post-disbursement customer service (1K sessions × $1.50)
          powerApps: 400, // 20 ops officers × $20/user/month
          storage: 30, // Transaction logs, confirmation receipts
          database: 149, // Azure SQL Standard S2 for disbursement tracking
          aks: 120, // 2 nodes for payment gateway integration
          other: 400 // Azure Functions ($150), Power Automate ($150), Payment API ($100)
        },
        totalAzureCostUSD: 3039,
        totalCIMBCostUSD: 911.70,
        totalMonthlyCostUSD: 3950.70
      }
    },
    steps: [
      {
        title: 'Automated Account Creation',
        technology: ['Core Banking API', 'Power Automate', 'Azure Functions'],
        description: 'Straight-through account setup with configuration and activation',
        detailedDescription: 'Azure Functions orchestrate core banking API calls to create loan accounts, set up repayment schedules, configure interest calculations, link to customer accounts, set up standing instructions, and activate services. Validates account creation, handles errors with retry logic, reconciles data across systems, and generates account numbers using intelligent sequencing.',
        manualTime: 25,
        aiTime: 3,
        accuracy: { manual: 95, ai: 99 },
        errorRate: { manual: 5, ai: 1 },
        reworkRate: { manual: 8, ai: 1 },
        kpis: [
          { name: 'Setup Time', manualValue: '25', aiValue: '3', improvement: '88%', unit: 'min', description: 'Account creation to activation' },
          { name: 'Configuration Errors', manualValue: '5%', aiValue: '1%', improvement: '80%', unit: 'reduction', description: 'Setup mistakes' },
          { name: 'System Integration', manualValue: '4', aiValue: '12', improvement: '200%', unit: 'systems', description: 'Connected systems' }
        ]
      },
      {
        title: 'Instant Funds Disbursement',
        technology: ['Payment Gateway', 'Azure Functions', 'Real-Time Payments'],
        description: 'Real-time fund transfer with compliance checks and reconciliation',
        detailedDescription: 'Integrated payment gateway supporting multiple rails: instant payments, ACH, wire transfers, and mobile money. Pre-disbursement checks: AML screening, sanctions list checking, beneficiary validation, and available balance confirmation. Real-time funds transfer with immediate confirmation. Automatic reconciliation and accounting entries. Handles failures with intelligent retry and fallback to alternative channels.',
        manualTime: 20,
        aiTime: 2,
        accuracy: { manual: 99, ai: 100 },
        errorRate: { manual: 1, ai: 0 },
        reworkRate: { manual: 2, ai: 0.2 },
        kpis: [
          { name: 'Disbursement Time', manualValue: '20', aiValue: '2', improvement: '90%', unit: 'min', description: 'Approval to funds in account' },
          { name: 'Same-Day Funding', manualValue: '45%', aiValue: '98%', improvement: '53%', unit: 'increase', description: 'Funded within 24 hours' },
          { name: 'Failed Payments', manualValue: '3%', aiValue: '0.2%', improvement: '93%', unit: 'reduction', description: 'Payment failures' },
          { name: 'Reconciliation Time', manualValue: '60', aiValue: '5', improvement: '92%', unit: 'min', description: 'Payment reconciliation' }
        ]
      },
      {
        title: 'Multi-Channel Customer Notification',
        technology: ['Azure Communication Services', 'Copilot Studio', 'Twilio'],
        description: 'Personalized notifications across SMS, email, app, and voice',
        detailedDescription: 'Azure Communication Services delivers notifications across all channels based on customer preference. Copilot Studio generates personalized messages with loan details, repayment schedules, and next steps. Includes: SMS confirmation, email with documents, in-app notification, voice call option, and WhatsApp message. Tracks delivery, opens, and engagement. Provides 24/7 AI assistant for post-disbursement questions.',
        manualTime: 10,
        aiTime: 1,
        accuracy: { manual: 92, ai: 99 },
        errorRate: { manual: 8, ai: 1 },
        reworkRate: { manual: 12, ai: 2 },
        kpis: [
          { name: 'Notification Time', manualValue: '10', aiValue: '1', improvement: '90%', unit: 'min', description: 'Disbursement to notification' },
          { name: 'Delivery Success', manualValue: '92%', aiValue: '99%', improvement: '7%', unit: 'increase', description: 'Successfully delivered' },
          { name: 'Customer Engagement', manualValue: '45%', aiValue: '78%', improvement: '33%', unit: 'increase', description: 'Opened and read' },
          { name: 'Support Calls', manualValue: '28%', aiValue: '8%', improvement: '71%', unit: 'reduction', description: 'Post-disbursement calls' }
        ]
      }
    ]
  }
];

// Collections Process Data - COMPLETE VERSION (Malaysian Banking Context)
const collectionsProcessClusters: ProcessCluster[] = [
  {
    id: 'col-1',
    title: 'Early Delinquency Detection',
    description: 'AI-powered early warning system for payment defaults',
    businessValue: 'Reduces bad debt write-offs by RM 18M annually through early intervention.',
    complexity: 'Medium',
    riskLevel: 'Low',
    defaultParams: {
      volume: 2500,
      hourlyRate: 18, // RM 18/hr (~$4/hr) - Junior collector, RM 3,200/month
      errorCostPerIncident: 1350, // RM 1,350 (~$300) - Incorrect collections action
      reworkCostMultiplier: 2.0,
      recoveryRate: 67, // % - AI-driven recovery rate (up from 52% manual)
      rightPartyContactRate: 82, // % - Early detection rate before default
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 1250, // GPT-4o: 30K input + 10K output for risk analysis × 2.5K accounts
          copilotStudio: 0, // Not needed for early detection
          powerApps: 600, // 30 collectors × $20/user/month
          storage: 80, // Payment history, transaction data, behavioral logs
          database: 149, // Azure SQL Standard S2 for collections database
          aks: 140, // 2 nodes for ML model serving
          other: 950 // Azure ML ($400), Synapse Analytics ($350), Power BI ($150), Customer Insights ($50)
        },
        totalAzureCostUSD: 3169,
        totalCIMBCostUSD: 950.70,
        totalMonthlyCostUSD: 4119.70
      }
    },
    steps: [
      {
        title: 'Predictive Default Risk Scoring',
        technology: ['Azure ML', 'Azure Synapse Analytics', 'Power BI'],
        description: 'ML models predict payment default probability 30 days in advance',
        detailedDescription: 'Machine learning models analyze payment patterns, transaction behavior, account activity, and external data sources to identify customers at risk of default. Synapse Analytics processes data from core banking, payment gateways, and alternative data sources. Models trained on 5 years of Malaysian banking data achieve 87% prediction accuracy. Power BI dashboards alert collectors to high-risk accounts.',
        manualTime: 45,
        aiTime: 3,
        accuracy: { manual: 68, ai: 87 },
        errorRate: { manual: 32, ai: 13 },
        reworkRate: { manual: 28, ai: 8 },
        kpis: [
          { name: 'Risk Identification Time', manualValue: '45', aiValue: '3', improvement: '93%', unit: 'min', description: 'Per account risk assessment' },
          { name: 'Prediction Accuracy', manualValue: '68%', aiValue: '87%', improvement: '19%', unit: 'increase', description: 'Default prediction accuracy' },
          { name: 'Early Detection Rate', manualValue: '45%', aiValue: '82%', improvement: '37%', unit: 'increase', description: 'Accounts flagged before default' },
          { name: 'False Positives', manualValue: '38%', aiValue: '15%', improvement: '23%', unit: 'reduction', description: 'Unnecessary collections contact' }
        ]
      },
      {
        title: 'Automated Account Segmentation',
        technology: ['Azure ML', 'Customer Insights', 'Dynamics 365'],
        description: 'Intelligent customer segmentation based on payment behavior and capacity',
        detailedDescription: 'AI segments delinquent accounts into treatment strategies: self-cure potential, payment arrangement candidates, hardship cases, dispute/fraud, skip tracing required, and legal action recommended. Considers: debt amount, days past due, payment history, customer lifetime value, financial capacity indicators, and behavioral signals. Dynamics 365 integrates customer data for holistic view.',
        manualTime: 20,
        aiTime: 2,
        accuracy: { manual: 75, ai: 91 },
        errorRate: { manual: 25, ai: 9 },
        reworkRate: { manual: 22, ai: 6 },
        kpis: [
          { name: 'Segmentation Time', manualValue: '20', aiValue: '2', improvement: '90%', unit: 'min', description: 'Account classification' },
          { name: 'Strategy Accuracy', manualValue: '75%', aiValue: '91%', improvement: '16%', unit: 'increase', description: 'Optimal treatment assignment' },
          { name: 'Recovery Rate', manualValue: '52%', aiValue: '67%', improvement: '15%', unit: 'increase', description: 'Successful debt recovery' }
        ]
      }
    ]
  },
  {
    id: 'col-2',
    title: 'Customer Contact & Outreach',
    description: 'AI-driven multi-channel contact strategy optimization',
    businessValue: 'Improves contact rate by 43% while reducing operational costs by RM 6.2M.',
    complexity: 'Medium',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 3000,
      hourlyRate: 16, // RM 16/hr (~$3.50/hr) - Collections agent, RM 2,800/month
      errorCostPerIncident: 630, // RM 630 (~$140) - Customer complaint cost
      reworkCostMultiplier: 1.8,
      rightPartyContactRate: 78, // % - Successfully reaching correct customer
      automationRate: 68, // % - AI bot handling initial contact
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 1800, // GPT-4o: 40K input + 12K output for conversation AI × 3K contacts
          copilotStudio: 4500, // 3K bot sessions × $1.50/session (voice + chat)
          powerApps: 800, // 40 agents × $20/user/month
          storage: 50, // Call recordings, chat logs, interaction history
          database: 149, // Azure SQL Standard S2 for contact management
          aks: 120, // 2 nodes for bot services
          other: 450 // Azure Speech Services ($250), Power Automate ($150), Communication Services ($50)
        },
        totalAzureCostUSD: 7869,
        totalCIMBCostUSD: 2360.70,
        totalMonthlyCostUSD: 10229.70
      }
    },
    steps: [
      {
        title: 'Optimal Contact Time Prediction',
        technology: ['Azure ML', 'Power Automate', 'Copilot Studio'],
        description: 'AI predicts best time and channel to reach each customer',
        detailedDescription: 'ML models analyze historical contact data, call patterns, customer behavior, and response rates to determine optimal contact windows. Considers Malaysian work hours, prayer times, and cultural factors. Power Automate schedules outreach across voice, SMS, WhatsApp, and email. Adapts strategy based on response patterns. Achieves 2.3x higher contact rate than manual scheduling.',
        manualTime: 12,
        aiTime: 1,
        accuracy: { manual: 62, ai: 88 },
        errorRate: { manual: 38, ai: 12 },
        reworkRate: { manual: 45, ai: 15 },
        kpis: [
          { name: 'Contact Rate', manualValue: '34%', aiValue: '78%', improvement: '44%', unit: 'increase', description: 'Successful customer contact' },
          { name: 'Right Party Contact', manualValue: '62%', aiValue: '88%', improvement: '26%', unit: 'increase', description: 'Reaching correct person' },
          { name: 'Attempts per Contact', manualValue: '4.2', aiValue: '1.8', improvement: '57%', unit: 'reduction', description: 'Efficiency of outreach' }
        ]
      },
      {
        title: 'Conversational AI for Collections',
        technology: ['Copilot Studio', 'Azure OpenAI', 'Azure Speech Services'],
        description: 'AI-powered voice and chat bots for initial collection contact',
        detailedDescription: 'Copilot Studio bots handle initial contact in Bahasa Malaysia and English with natural conversation flow. Azure Speech Services provides text-to-speech and speech recognition with Malaysian accent support. Azure OpenAI understands intent, offers payment options, and escalates to humans when needed. Handles 68% of initial contacts autonomously. Compliant with Bank Negara Malaysia guidelines.',
        manualTime: 8,
        aiTime: 2,
        accuracy: { manual: 85, ai: 92 },
        errorRate: { manual: 15, ai: 8 },
        reworkRate: { manual: 18, ai: 5 },
        kpis: [
          { name: 'Automation Rate', manualValue: '0%', aiValue: '68%', improvement: '68%', unit: 'increase', description: 'Bot-handled interactions' },
          { name: 'Resolution Time', manualValue: '8', aiValue: '2', improvement: '75%', unit: 'min', description: 'Average handling time' },
          { name: 'Customer Satisfaction', manualValue: '6.2', aiValue: '7.8', improvement: '1.6', unit: 'points', description: 'CSAT score out of 10' },
          { name: 'Agent Escalation Rate', manualValue: '100%', aiValue: '32%', improvement: '68%', unit: 'reduction', description: 'Cases needing human agent' }
        ]
      }
    ]
  },
  {
    id: 'col-3',
    title: 'Payment Arrangement & Negotiation',
    description: 'AI-recommended payment plans with affordability assessment',
    businessValue: 'Increases kept payment promises by 38%. Reduces broken arrangements by RM 12M.',
    complexity: 'High',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 1800,
      hourlyRate: 22, // RM 22/hr (~$5/hr) - Senior collector, RM 3,900/month
      errorCostPerIncident: 4500, // RM 4,500 (~$1,000) - Broken arrangement cost
      reworkCostMultiplier: 3.0,
      recoveryRate: 82, // % - Payment plans kept to completion
      automationRate: 65, // % - Automated payment plan generation
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 1350, // GPT-4o: 35K input + 10K output for negotiation AI × 1.8K cases
          copilotStudio: 2700, // 1.8K negotiation sessions × $1.50/session
          powerApps: 440, // 22 senior collectors × $20/user/month
          storage: 40, // Payment plans, negotiation history
          database: 149, // Azure SQL Standard S2 for payment tracking
          aks: 100, // 2 nodes for payment services
          other: 600 // Azure ML affordability models ($350), Power BI ($150), Payment Gateway API ($100)
        },
        totalAzureCostUSD: 5379,
        totalCIMBCostUSD: 1613.70,
        totalMonthlyCostUSD: 6992.70
      }
    },
    steps: [
      {
        title: 'Affordability Analysis & Payment Plan Design',
        technology: ['Azure ML', 'Azure OpenAI', 'Open Banking APIs'],
        description: 'AI assesses customer financial capacity and proposes realistic payment plans',
        detailedDescription: 'System analyzes income, expenses, existing commitments, and payment patterns using open banking data (with customer consent). Azure ML models predict payment sustainability. Azure OpenAI generates personalized payment proposals considering Malaysian cost of living, zakat obligations, and family commitments. Suggests plan structures: lump sum settlement, extended terms, reduced installments, or principal forbearance. Compliant with AKPK (Credit Counselling Agency) guidelines.',
        manualTime: 35,
        aiTime: 4,
        accuracy: { manual: 71, ai: 89 },
        errorRate: { manual: 29, ai: 11 },
        reworkRate: { manual: 35, ai: 12 },
        kpis: [
          { name: 'Plan Design Time', manualValue: '35', aiValue: '4', improvement: '89%', unit: 'min', description: 'Payment plan creation' },
          { name: 'Plan Success Rate', manualValue: '58%', aiValue: '82%', improvement: '24%', unit: 'increase', description: 'Plans kept to completion' },
          { name: 'Customer Acceptance', manualValue: '71%', aiValue: '89%', improvement: '18%', unit: 'increase', description: 'Customers accepting plans' },
          { name: 'Broken Arrangements', manualValue: '42%', aiValue: '18%', improvement: '24%', unit: 'reduction', description: 'Failed payment plans' }
        ]
      },
      {
        title: 'Automated Agreement Generation & Tracking',
        technology: ['Power Automate', 'Dynamics 365', 'Azure Form Recognizer'],
        description: 'Digital payment agreement workflow with automated monitoring',
        detailedDescription: 'Power Automate generates payment agreements in required formats, routes for e-signature, and sets up automated payment schedules. Integrates with FPX (Financial Process Exchange) for Malaysian online banking. Tracks payment due dates, sends reminders via WhatsApp/SMS 3 days before due date. Azure Form Recognizer processes signed agreements. Dynamics 365 maintains agreement history and triggers alerts on missed payments.',
        manualTime: 18,
        aiTime: 2,
        accuracy: { manual: 88, ai: 97 },
        errorRate: { manual: 12, ai: 3 },
        reworkRate: { manual: 15, ai: 4 },
        kpis: [
          { name: 'Agreement Processing', manualValue: '18', aiValue: '2', improvement: '89%', unit: 'min', description: 'From approval to signed' },
          { name: 'Payment Tracking', manualValue: '45%', aiValue: '98%', improvement: '53%', unit: 'increase', description: 'Automated monitoring' },
          { name: 'Reminder Effectiveness', manualValue: '34%', aiValue: '67%', improvement: '33%', unit: 'increase', description: 'Payments made on reminder' }
        ]
      }
    ]
  },
  {
    id: 'col-4',
    title: 'Dispute & Complaint Management',
    description: 'AI-powered dispute resolution and fraud detection',
    businessValue: 'Resolves disputes 75% faster. Prevents RM 4.8M in erroneous collections.',
    complexity: 'Medium',
    riskLevel: 'High',
    defaultParams: {
      volume: 800,
      hourlyRate: 24, // RM 24/hr (~$5.50/hr) - Dispute specialist, RM 4,200/month
      errorCostPerIncident: 6300, // RM 6,300 (~$1,400) - Erroneous collections cost
      reworkCostMultiplier: 4.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 1100, // GPT-4o: 40K input + 15K output for dispute analysis × 800 cases
          copilotStudio: 0, // Not needed
          powerApps: 480, // 24 dispute specialists × $20/user/month
          storage: 120, // Evidence documents, call recordings, investigation files
          database: 149, // Azure SQL Standard S2 for dispute tracking
          aks: 100, // 2 nodes for investigation services
          other: 850 // Azure ML models ($300), Synapse Analytics ($300), Cognitive Services ($150), Purview ($100)
        },
        totalAzureCostUSD: 2799,
        totalCIMBCostUSD: 839.70,
        totalMonthlyCostUSD: 3638.70
      }
    },
    steps: [
      {
        title: 'Intelligent Dispute Classification',
        technology: ['Azure OpenAI', 'Azure Cognitive Services', 'Microsoft Purview'],
        description: 'AI categorizes disputes and identifies potential fraud or errors',
        detailedDescription: 'Azure OpenAI analyzes customer complaints submitted via phone, email, chat, or branch. Classifies into categories: billing errors, unauthorized charges, service issues, fraud claims, identity theft, or process complaints. Cognitive Services extracts key entities and sentiment. Microsoft Purview ensures data governance. System flags high-risk cases requiring immediate attention and routes to appropriate teams. Compliant with Bank Negara Malaysia Ombudsman requirements.',
        manualTime: 25,
        aiTime: 3,
        accuracy: { manual: 76, ai: 93 },
        errorRate: { manual: 24, ai: 7 },
        reworkRate: { manual: 30, ai: 8 },
        kpis: [
          { name: 'Classification Time', manualValue: '25', aiValue: '3', improvement: '88%', unit: 'min', description: 'Dispute categorization' },
          { name: 'Classification Accuracy', manualValue: '76%', aiValue: '93%', improvement: '17%', unit: 'increase', description: 'Correct routing' },
          { name: 'Fraud Detection Rate', manualValue: '64%', aiValue: '91%', improvement: '27%', unit: 'increase', description: 'Identifying fraud attempts' },
          { name: 'False Fraud Flags', manualValue: '28%', aiValue: '9%', improvement: '19%', unit: 'reduction', description: 'Incorrect fraud alerts' }
        ]
      },
      {
        title: 'Automated Dispute Investigation',
        technology: ['Azure ML', 'Azure Synapse Analytics', 'Power BI'],
        description: 'AI-driven evidence gathering and resolution recommendation',
        detailedDescription: 'System automatically retrieves relevant transaction records, call recordings, account history, and supporting documents. Azure ML analyzes patterns to validate claims. Synapse Analytics correlates data across systems. Power BI presents evidence timeline. Azure OpenAI generates investigation summary and resolution recommendations. Reduces investigation time from days to hours. Maintains audit trail for regulatory compliance.',
        manualTime: 90,
        aiTime: 12,
        accuracy: { manual: 82, ai: 94 },
        errorRate: { manual: 18, ai: 6 },
        reworkRate: { manual: 22, ai: 7 },
        kpis: [
          { name: 'Investigation Time', manualValue: '90', aiValue: '12', improvement: '87%', unit: 'min', description: 'Complete investigation' },
          { name: 'Resolution Accuracy', manualValue: '82%', aiValue: '94%', improvement: '12%', unit: 'increase', description: 'Correct outcomes' },
          { name: 'Customer Satisfaction', manualValue: '5.8', aiValue: '8.1', improvement: '2.3', unit: 'points', description: 'Dispute resolution CSAT' },
          { name: 'Escalation Rate', manualValue: '35%', aiValue: '12%', improvement: '23%', unit: 'reduction', description: 'Cases escalated to manager' }
        ]
      }
    ]
  },
  {
    id: 'col-5',
    title: 'Legal & Recovery Actions',
    description: 'AI-optimized legal action recommendation and case management',
    businessValue: 'Improves legal recovery rate by 28%. Reduces legal costs by RM 3.5M annually.',
    complexity: 'High',
    riskLevel: 'High',
    defaultParams: {
      volume: 500,
      hourlyRate: 38, // RM 38/hr (~$8.50/hr) - Legal officer, RM 6,700/month
      errorCostPerIncident: 14400, // RM 14,400 (~$3,200) - Unsuccessful legal action cost
      reworkCostMultiplier: 5.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 2200, // GPT-4o: 60K input + 20K output for legal docs × 500 cases
          copilotStudio: 0, // Not needed
          powerApps: 760, // 38 legal officers × $20/user/month
          storage: 200, // Legal documents, court filings, case evidence
          database: 99, // Azure SQL Standard S1 for case tracking
          aks: 80, // 2 nodes for document services
          other: 600 // Microsoft 365 Copilot ($300), Power Automate ($200), SharePoint ($100)
        },
        totalAzureCostUSD: 3939,
        totalCIMBCostUSD: 1181.70,
        totalMonthlyCostUSD: 5120.70
      }
    },
    steps: [
      {
        title: 'Legal Action Viability Assessment',
        technology: ['Azure ML', 'Azure OpenAI', 'Microsoft 365 Copilot'],
        description: 'AI evaluates cost-benefit of legal proceedings and recovery probability',
        detailedDescription: 'ML models assess legal action viability considering: outstanding balance, customer assets, employment status, historical court outcomes, legal costs, expected recovery, and timeline. Analyzes Malaysian civil court data and success rates. Azure OpenAI generates recommendations citing legal precedents and Syariah compliance considerations where applicable. Microsoft 365 Copilot assists legal teams with case preparation. Optimizes decision between: legal notice, civil suit, bankruptcy proceedings, or write-off.',
        manualTime: 120,
        aiTime: 15,
        accuracy: { manual: 68, ai: 86 },
        errorRate: { manual: 32, ai: 14 },
        reworkRate: { manual: 28, ai: 10 },
        kpis: [
          { name: 'Assessment Time', manualValue: '120', aiValue: '15', improvement: '88%', unit: 'min', description: 'Legal viability analysis' },
          { name: 'Recovery Prediction', manualValue: '68%', aiValue: '86%', improvement: '18%', unit: 'increase', description: 'Accurate recovery forecasting' },
          { name: 'Legal ROI', manualValue: '1.8', aiValue: '3.2', improvement: '78%', unit: 'ratio', description: 'Recovery vs legal costs' },
          { name: 'Successful Recoveries', manualValue: '45%', aiValue: '63%', improvement: '18%', unit: 'increase', description: 'Cases with positive outcome' }
        ]
      },
      {
        title: 'Automated Legal Document Generation',
        technology: ['Azure OpenAI', 'Power Automate', 'SharePoint'],
        description: 'AI-powered legal notice and court document preparation',
        detailedDescription: 'Azure OpenAI generates legal documents compliant with Malaysian law: letters of demand, notice of legal action, bankruptcy notices, and court filing documents. Templates align with Malaysian Civil Procedure Rules and High Court requirements. Power Automate routes documents for legal review and approval. SharePoint maintains document repository. System tracks statutory deadlines and notice periods. Supports both English and Bahasa Malaysia documentation.',
        manualTime: 60,
        aiTime: 8,
        accuracy: { manual: 88, ai: 96 },
        errorRate: { manual: 12, ai: 4 },
        reworkRate: { manual: 18, ai: 5 },
        kpis: [
          { name: 'Document Preparation', manualValue: '60', aiValue: '8', improvement: '87%', unit: 'min', description: 'Legal document creation' },
          { name: 'Compliance Accuracy', manualValue: '88%', aiValue: '96%', improvement: '8%', unit: 'increase', description: 'Legal format compliance' },
          { name: 'Revision Cycles', manualValue: '2.8', aiValue: '1.1', improvement: '61%', unit: 'reduction', description: 'Document iterations needed' }
        ]
      }
    ]
  },
  {
    id: 'col-6',
    title: 'Performance & Analytics',
    description: 'Real-time collections performance monitoring and strategy optimization',
    businessValue: 'Increases portfolio recovery rate by 22%. Provides actionable insights worth RM 8M.',
    complexity: 'Medium',
    riskLevel: 'Low',
    defaultParams: {
      volume: 5000,
      hourlyRate: 28, // RM 28/hr (~$6/hr) - Analytics specialist, RM 5,000/month
      errorCostPerIncident: 2160, // RM 2,160 (~$480) - Incorrect strategy adjustment
      reworkCostMultiplier: 2.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 550, // GPT-4o: 15K input + 5K output for insights generation
          copilotStudio: 0, // Not needed
          powerApps: 560, // 28 analytics specialists × $20/user/month
          storage: 150, // Historical data, performance metrics, reports
          database: 199, // Azure SQL Standard S3 for analytics database
          aks: 120, // 2 nodes for analytics services
          other: 1400 // Power BI Premium ($800), Azure ML ($350), Synapse Analytics ($250)
        },
        totalAzureCostUSD: 2979,
        totalCIMBCostUSD: 893.70,
        totalMonthlyCostUSD: 3872.70
      }
    },
    steps: [
      {
        title: 'Real-Time Collections Dashboard',
        technology: ['Power BI', 'Azure Synapse Analytics', 'Fabric'],
        description: 'Unified dashboard with portfolio health, team performance, and recovery trends',
        detailedDescription: 'Power BI dashboards integrate data from core banking, collections systems, payment gateways, and external sources. Real-time metrics: collections rate, roll rates, promise-to-pay kept rate, right party contact rate, and recovery by vintage. Segmented by product type, collector, region, and customer segment. Azure Synapse Analytics processes data pipeline. Microsoft Fabric ensures data integration across sources. Alerts trigger on deteriorating metrics.',
        manualTime: 180,
        aiTime: 5,
        accuracy: { manual: 72, ai: 96 },
        errorRate: { manual: 28, ai: 4 },
        reworkRate: { manual: 35, ai: 6 },
        kpis: [
          { name: 'Report Generation', manualValue: '180', aiValue: '5', improvement: '97%', unit: 'min', description: 'Complete performance report' },
          { name: 'Data Accuracy', manualValue: '72%', aiValue: '96%', improvement: '24%', unit: 'increase', description: 'Reporting accuracy' },
          { name: 'Insight Actionability', manualValue: '45%', aiValue: '83%', improvement: '38%', unit: 'increase', description: 'Insights leading to action' },
          { name: 'Decision Speed', manualValue: '3', aiValue: '0.5', improvement: '83%', unit: 'days', description: 'Strategy adjustment time' }
        ]
      },
      {
        title: 'Predictive Strategy Optimization',
        technology: ['Azure ML', 'Azure OpenAI', 'Copilot for M365'],
        description: 'AI recommends collections strategy adjustments based on performance trends',
        detailedDescription: 'ML models identify underperforming segments, channels, or strategies. Azure OpenAI analyzes patterns and generates recommendations: adjust contact frequency, revise payment plan terms, reallocate resources, or modify treatment strategies. Copilot for M365 assists managers with action plans and change management. System simulates impact of strategy changes before implementation. Continuous learning from outcomes improves future recommendations.',
        manualTime: 240,
        aiTime: 20,
        accuracy: { manual: 64, ai: 84 },
        errorRate: { manual: 36, ai: 16 },
        reworkRate: { manual: 40, ai: 12 },
        kpis: [
          { name: 'Strategy Analysis', manualValue: '240', aiValue: '20', improvement: '92%', unit: 'min', description: 'Complete strategy review' },
          { name: 'Recommendation Accuracy', manualValue: '64%', aiValue: '84%', improvement: '20%', unit: 'increase', description: 'Successful strategy changes' },
          { name: 'Portfolio Performance', manualValue: '61%', aiValue: '78%', improvement: '17%', unit: 'increase', description: 'Overall recovery rate' },
          { name: 'Operational Efficiency', manualValue: '58%', aiValue: '82%', improvement: '24%', unit: 'increase', description: 'Cost per RM recovered' }
        ]
      }
    ]
  }
];

// Contact Center Process Data - COMPLETE VERSION (Malaysian Banking Context)
const contactCenterClusters: ProcessCluster[] = [
  {
    id: 'cc-1',
    title: 'Customer Inquiry & Routing',
    description: 'AI-powered intent recognition and intelligent call routing',
    businessValue: 'Reduces average handle time by 42%. Improves first-call resolution by 35%.',
    complexity: 'Medium',
    riskLevel: 'Low',
    defaultParams: {
      volume: 8000,
      hourlyRate: 14, // RM 14/hr (~$3/hr) - Call center agent, RM 2,500/month
      errorCostPerIncident: 315, // RM 315 (~$70) - Misrouted call cost
      reworkCostMultiplier: 1.5,
      containmentRate: 72, // % - IVR containment (inquiries resolved without agent)
      deflectionRate: 37, // % - Calls deflected from voice to digital
      avgHandleTime: 1.8, // minutes - Average wait time (down from 4.2)
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 2400, // GPT-4o: 20K input + 8K output for IVR conversations × 8K calls
          copilotStudio: 12000, // 8K voice bot sessions × $1.50/session
          powerApps: 1120, // 56 agents × $20/user/month
          storage: 180, // Call recordings, transcripts, interaction history
          database: 199, // Azure SQL Standard S3 for call center database
          aks: 180, // 3 nodes for high-availability voice services
          other: 950 // Azure Speech Services ($500), Communication Services ($250), Power BI ($200)
        },
        totalAzureCostUSD: 17029,
        totalCIMBCostUSD: 5108.70,
        totalMonthlyCostUSD: 22137.70
      }
    },
    steps: [
      {
        title: 'Conversational IVR with Intent Recognition',
        technology: ['Copilot Studio', 'Azure Speech Services', 'Azure OpenAI'],
        description: 'Natural language IVR understands customer intent in Bahasa and English',
        detailedDescription: 'Copilot Studio powers conversational IVR that understands natural speech in Bahasa Malaysia, English, and basic Mandarin/Tamil. Azure Speech Services provides speech-to-text with Malaysian accent recognition. Azure OpenAI identifies customer intent from free-form speech. Handles common inquiries autonomously: balance checks, transaction history, branch locations, product information. Reduces IVR abandonment rate from 35% to 8%. Escalates complex issues to appropriate specialist.',
        manualTime: 3,
        aiTime: 0.5,
        accuracy: { manual: 78, ai: 94 },
        errorRate: { manual: 22, ai: 6 },
        reworkRate: { manual: 28, ai: 8 },
        kpis: [
          { name: 'IVR Containment', manualValue: '35%', aiValue: '72%', improvement: '37%', unit: 'increase', description: 'Inquiries resolved by IVR' },
          { name: 'Intent Accuracy', manualValue: '78%', aiValue: '94%', improvement: '16%', unit: 'increase', description: 'Correct intent recognition' },
          { name: 'Customer Satisfaction', manualValue: '6.4', aiValue: '8.2', improvement: '1.8', unit: 'points', description: 'IVR experience rating' },
          { name: 'Abandonment Rate', manualValue: '35%', aiValue: '8%', improvement: '27%', unit: 'reduction', description: 'Customers hanging up' }
        ]
      },
      {
        title: 'Skills-Based Routing with AI',
        technology: ['Dynamics 365', 'Azure ML', 'Omnichannel for Customer Service'],
        description: 'AI matches customer needs with best-available agent based on expertise and capacity',
        detailedDescription: 'Azure ML predicts call complexity, required expertise, and expected handle time. Dynamics 365 Omnichannel routes to agents with matching skills: Islamic banking, investment products, loan services, credit cards, or technical support. Considers agent proficiency, current workload, language preferences, and customer value. Supports voice, chat, WhatsApp, email, and social media. Reduces call transfers by 58% and improves FCR by 35%.',
        manualTime: 2,
        aiTime: 0.3,
        accuracy: { manual: 72, ai: 91 },
        errorRate: { manual: 28, ai: 9 },
        reworkRate: { manual: 32, ai: 10 },
        kpis: [
          { name: 'Routing Accuracy', manualValue: '72%', aiValue: '91%', improvement: '19%', unit: 'increase', description: 'Right agent first time' },
          { name: 'Call Transfers', manualValue: '42%', aiValue: '18%', improvement: '24%', unit: 'reduction', description: 'Calls transferred' },
          { name: 'First Call Resolution', manualValue: '58%', aiValue: '81%', improvement: '23%', unit: 'increase', description: 'Issues resolved first call' },
          { name: 'Average Wait Time', manualValue: '4.2', aiValue: '1.8', improvement: '57%', unit: 'min', description: 'Customer queue time' }
        ]
      }
    ]
  },
  {
    id: 'cc-2',
    title: 'Agent Assistance & Productivity',
    description: 'Real-time AI copilot provides agents with answers, suggestions, and next best actions',
    businessValue: 'Increases agent productivity by 38%. Reduces training time by 55%.',
    complexity: 'High',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 6000,
      hourlyRate: 16, // RM 16/hr (~$3.50/hr) - Senior agent, RM 2,800/month
      errorCostPerIncident: 495, // RM 495 (~$110) - Incorrect information cost
      reworkCostMultiplier: 2.0,
      avgHandleTime: 4.5, // minutes - Average call duration (down from 8.0)
      automationRate: 89, // % - After-call work automation
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 3600, // GPT-4o: 40K input + 15K output for real-time copilot × 6K calls
          copilotStudio: 0, // Not needed (using M365 Copilot)
          powerApps: 960, // 48 agents × $20/user/month
          storage: 100, // Call transcripts, summaries, knowledge articles
          database: 149, // Azure SQL Standard S2 for knowledge base
          aks: 140, // 2 nodes for copilot services
          other: 2400 // Microsoft 365 Copilot ($1800 for 60 users), Dynamics 365 ($400), Power Automate ($200)
        },
        totalAzureCostUSD: 7349,
        totalCIMBCostUSD: 2204.70,
        totalMonthlyCostUSD: 9553.70
      }
    },
    steps: [
      {
        title: 'Real-Time Agent Copilot',
        technology: ['Microsoft 365 Copilot', 'Azure OpenAI', 'Dynamics 365'],
        description: 'AI assistant provides answers, scripts, and guidance during customer conversations',
        detailedDescription: 'Microsoft 365 Copilot listens to customer conversation in real-time and surfaces relevant information from knowledge base, policies, product documentation, and customer history. Azure OpenAI generates suggested responses aligned with bank tone and compliance. Highlights key information from customer profile. Provides step-by-step guidance for complex processes. Supports agents in handling unfamiliar product inquiries. Bilingual support for Bahasa and English. Reduces average handle time by 38%.',
        manualTime: 8,
        aiTime: 4.5,
        accuracy: { manual: 82, ai: 94 },
        errorRate: { manual: 18, ai: 6 },
        reworkRate: { manual: 22, ai: 7 },
        kpis: [
          { name: 'Handle Time', manualValue: '8.0', aiValue: '4.5', improvement: '44%', unit: 'min', description: 'Average call duration' },
          { name: 'Answer Accuracy', manualValue: '82%', aiValue: '94%', improvement: '12%', unit: 'increase', description: 'Correct information provided' },
          { name: 'Agent Confidence', manualValue: '6.8', aiValue: '8.6', improvement: '1.8', unit: 'points', description: 'Agent self-rated confidence' },
          { name: 'Knowledge Search Time', manualValue: '90', aiValue: '5', improvement: '94%', unit: 'seconds', description: 'Time finding answers' }
        ]
      },
      {
        title: 'Automated After-Call Work',
        technology: ['Azure OpenAI', 'Power Automate', 'Dynamics 365'],
        description: 'AI auto-generates call summaries, updates CRM, and creates follow-up tasks',
        detailedDescription: 'Azure OpenAI listens to call recordings and automatically generates structured call summaries, captures customer intent, identifies action items, and updates Dynamics 365 CRM. Power Automate creates follow-up tasks, sends confirmation emails/SMS to customers, and triggers workflows. Agent reviews and approves summaries with one click. Reduces after-call work from 90 seconds to 10 seconds. Improves data quality and eliminates manual data entry errors.',
        manualTime: 1.5,
        aiTime: 0.17,
        accuracy: { manual: 76, ai: 93 },
        errorRate: { manual: 24, ai: 7 },
        reworkRate: { manual: 28, ai: 8 },
        kpis: [
          { name: 'ACW Time', manualValue: '90', aiValue: '10', improvement: '89%', unit: 'seconds', description: 'After-call work duration' },
          { name: 'Data Accuracy', manualValue: '76%', aiValue: '93%', improvement: '17%', unit: 'increase', description: 'CRM data completeness' },
          { name: 'Agent Availability', manualValue: '68%', aiValue: '82%', improvement: '14%', unit: 'increase', description: 'Time available for calls' },
          { name: 'Follow-up Task Creation', manualValue: '45%', aiValue: '95%', improvement: '50%', unit: 'increase', description: 'Required tasks documented' }
        ]
      }
    ]
  },
  {
    id: 'cc-3',
    title: 'Self-Service & Chatbots',
    description: 'AI-powered chatbots and virtual assistants for 24/7 customer service',
    businessValue: 'Deflects 65% of calls to digital channels. Saves RM 14M in operational costs.',
    complexity: 'Medium',
    riskLevel: 'Low',
    defaultParams: {
      volume: 12000,
      hourlyRate: 12, // RM 12/hr (~$2.70/hr) - Minimal human touch, RM 2,100/month
      errorCostPerIncident: 225, // RM 225 (~$50) - Failed self-service escalation
      reworkCostMultiplier: 1.5,
      containmentRate: 65, // % - Inquiries fully resolved by chatbot
      deflectionRate: 65, // % - Calls deflected to digital channels
      automationRate: 90, // % - Transactions completed without human intervention
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 4800, // GPT-4o: 30K input + 10K output for chatbot conversations × 12K sessions
          copilotStudio: 18000, // 12K chatbot sessions × $1.50/session (multi-channel)
          powerApps: 240, // 12 support staff × $20/user/month
          storage: 80, // Chat logs, transaction history
          database: 149, // Azure SQL Standard S2 for chatbot data
          aks: 180, // 3 nodes for high-availability chatbot services
          other: 750 // Power Virtual Agents ($300), API Management ($250), Azure Functions ($200)
        },
        totalAzureCostUSD: 24199,
        totalCIMBCostUSD: 7259.70,
        totalMonthlyCostUSD: 31458.70
      }
    },
    steps: [
      {
        title: 'Intelligent Virtual Assistant',
        technology: ['Copilot Studio', 'Azure OpenAI', 'Power Virtual Agents'],
        description: '24/7 chatbot handles account inquiries, transactions, and service requests',
        detailedDescription: 'Copilot Studio powers intelligent chatbot on mobile app, website, WhatsApp, and Facebook Messenger. Handles: account balance, transaction history, fund transfers, bill payments, card activation, PIN reset, branch locator, and product inquiries. Azure OpenAI provides natural conversation in Bahasa Malaysia, English, Mandarin, and Tamil. Integrated with core banking for real-time data. Secure authentication with biometrics or OTP. Escalates to human agent seamlessly when needed. Available 24/7 including weekends and public holidays.',
        manualTime: 6,
        aiTime: 1.2,
        accuracy: { manual: 88, ai: 95 },
        errorRate: { manual: 12, ai: 5 },
        reworkRate: { manual: 15, ai: 6 },
        kpis: [
          { name: 'Containment Rate', manualValue: '0%', aiValue: '65%', improvement: '65%', unit: 'increase', description: 'Inquiries resolved by bot' },
          { name: 'Resolution Time', manualValue: '6.0', aiValue: '1.2', improvement: '80%', unit: 'min', description: 'Time to resolve inquiry' },
          { name: 'Customer Satisfaction', manualValue: '7.2', aiValue: '8.4', improvement: '1.2', unit: 'points', description: 'Chatbot experience rating' },
          { name: 'Availability', manualValue: '8', aiValue: '24', improvement: '200%', unit: 'hours', description: 'Service hours per day' }
        ]
      },
      {
        title: 'Transaction Automation',
        technology: ['Power Automate', 'Azure Functions', 'API Management'],
        description: 'Self-service transactions with AI-powered verification and fraud detection',
        detailedDescription: 'Customers complete transactions through chatbot or mobile app: fund transfers, bill payments, loan applications, card services, account updates. Power Automate orchestrates workflows across systems. Azure Functions handle business logic and validations. Azure ML performs real-time fraud detection. API Management secures integrations. Supports FPX, DuitNow, and RENTAS payment rails. Biometric authentication ensures security. Transactions processed in seconds with full audit trail.',
        manualTime: 5,
        aiTime: 0.5,
        accuracy: { manual: 92, ai: 98 },
        errorRate: { manual: 8, ai: 2 },
        reworkRate: { manual: 10, ai: 3 },
        kpis: [
          { name: 'Transaction Time', manualValue: '5.0', aiValue: '0.5', improvement: '90%', unit: 'min', description: 'End-to-end processing' },
          { name: 'Success Rate', manualValue: '92%', aiValue: '98%', improvement: '6%', unit: 'increase', description: 'Completed transactions' },
          { name: 'Fraud Detection', manualValue: '78%', aiValue: '96%', improvement: '18%', unit: 'increase', description: 'Fraudulent transactions blocked' },
          { name: 'Customer Effort', manualValue: '7.2', aiValue: '2.4', improvement: '67%', unit: 'clicks', description: 'Steps to complete' }
        ]
      }
    ]
  },
  {
    id: 'cc-4',
    title: 'Complaint Management',
    description: 'AI-powered complaint intake, categorization, and resolution tracking',
    businessValue: 'Reduces complaint resolution time by 68%. Improves customer retention by 24%.',
    complexity: 'Medium',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 1200,
      hourlyRate: 20, // RM 20/hr (~$4.50/hr) - Complaint specialist, RM 3,500/month
      errorCostPerIncident: 1530, // RM 1,530 (~$340) - Escalated complaint cost
      reworkCostMultiplier: 2.5,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 1440, // GPT-4o: 40K input + 20K output for complaint analysis × 1.2K cases
          copilotStudio: 0, // Not needed
          powerApps: 400, // 20 complaint specialists × $20/user/month
          storage: 120, // Complaint evidence, resolution documents
          database: 149, // Azure SQL Standard S2 for complaint tracking
          aks: 100, // 2 nodes for complaint services
          other: 650 // Cognitive Services ($250), Dynamics 365 ($300), Power BI ($100)
        },
        totalAzureCostUSD: 2859,
        totalCIMBCostUSD: 857.70,
        totalMonthlyCostUSD: 3716.70
      }
    },
    steps: [
      {
        title: 'Automated Complaint Intake & Classification',
        technology: ['Azure OpenAI', 'Azure Cognitive Services', 'Dynamics 365'],
        description: 'AI captures complaint details and routes to appropriate resolution team',
        detailedDescription: 'Azure OpenAI analyzes complaint submitted via call, email, chat, social media, or branch. Extracts key details: complaint type, severity, customer impact, and resolution expectations. Cognitive Services performs sentiment analysis and emotion detection. Classifies into categories: service quality, billing disputes, product issues, fraud claims, or staff conduct. Dynamics 365 creates case with full context. Routes to appropriate team based on complexity and urgency. Compliant with Bank Negara Malaysia complaint handling standards (28-day resolution timeline).',
        manualTime: 12,
        aiTime: 2,
        accuracy: { manual: 74, ai: 91 },
        errorRate: { manual: 26, ai: 9 },
        reworkRate: { manual: 30, ai: 10 },
        kpis: [
          { name: 'Intake Time', manualValue: '12', aiValue: '2', improvement: '83%', unit: 'min', description: 'Complaint documentation' },
          { name: 'Classification Accuracy', manualValue: '74%', aiValue: '91%', improvement: '17%', unit: 'increase', description: 'Correct categorization' },
          { name: 'Routing Accuracy', manualValue: '68%', aiValue: '89%', improvement: '21%', unit: 'increase', description: 'Right team first time' },
          { name: 'Customer Sentiment', manualValue: '3.2', aiValue: '6.8', improvement: '3.6', unit: 'points', description: 'Sentiment score improvement' }
        ]
      },
      {
        title: 'Complaint Resolution & Root Cause Analysis',
        technology: ['Azure ML', 'Power BI', 'Microsoft 365 Copilot'],
        description: 'AI assists investigation and identifies systemic issues',
        detailedDescription: 'Microsoft 365 Copilot helps agents investigate complaints by retrieving relevant records, policies, and precedents. Azure ML analyzes complaint patterns to identify root causes: process gaps, system issues, training needs, or policy problems. Power BI dashboards highlight complaint trends by product, channel, branch, and type. Azure OpenAI generates investigation summaries and resolution recommendations. System tracks resolution against Bank Negara Malaysia requirements. Triggers preventive actions for recurring issues.',
        manualTime: 45,
        aiTime: 8,
        accuracy: { manual: 76, ai: 92 },
        errorRate: { manual: 24, ai: 8 },
        reworkRate: { manual: 28, ai: 9 },
        kpis: [
          { name: 'Resolution Time', manualValue: '18', aiValue: '5.5', improvement: '69%', unit: 'days', description: 'Average days to resolve' },
          { name: 'Resolution Accuracy', manualValue: '76%', aiValue: '92%', improvement: '16%', unit: 'increase', description: 'Customer accepting resolution' },
          { name: 'Repeat Complaints', manualValue: '22%', aiValue: '7%', improvement: '15%', unit: 'reduction', description: 'Same issue recurring' },
          { name: 'NPS Impact', manualValue: '-35', aiValue: '+12', improvement: '47', unit: 'points', description: 'NPS after complaint resolution' }
        ]
      }
    ]
  },
  {
    id: 'cc-5',
    title: 'Quality Assurance & Compliance',
    description: 'AI-powered call monitoring and compliance verification',
    businessValue: 'Increases QA coverage from 2% to 100%. Reduces compliance breaches by 82%.',
    complexity: 'High',
    riskLevel: 'High',
    defaultParams: {
      volume: 8000,
      hourlyRate: 22, // RM 22/hr (~$5/hr) - QA specialist, RM 3,900/month
      errorCostPerIncident: 2700, // RM 2,700 (~$600) - Compliance breach cost
      reworkCostMultiplier: 3.0,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 2400, // GPT-4o: 20K input + 8K output for QA analysis × 8K calls
          copilotStudio: 0, // Not needed
          powerApps: 440, // 22 QA specialists × $20/user/month
          storage: 350, // All call recordings for 100% coverage (compressed audio)
          database: 199, // Azure SQL Standard S3 for QA database
          aks: 140, // 2 nodes for speech analytics services
          other: 1200 // Azure Speech Analytics ($600), Microsoft Purview ($300), Cognitive Services ($200), Customer Insights ($100)
        },
        totalAzureCostUSD: 4729,
        totalCIMBCostUSD: 1418.70,
        totalMonthlyCostUSD: 6147.70
      }
    },
    steps: [
      {
        title: 'Automated Call Quality Monitoring',
        technology: ['Azure Speech Analytics', 'Azure OpenAI', 'Microsoft Purview'],
        description: 'AI evaluates 100% of calls for quality, compliance, and coaching opportunities',
        detailedDescription: 'Azure Speech Analytics transcribes and analyzes every call for quality metrics: greeting used, empathy demonstrated, active listening, solution provided, call wrap-up. Azure OpenAI evaluates conversation quality and identifies coaching moments. Microsoft Purview ensures compliance with Bank Negara Malaysia regulations: proper disclosure, data privacy, complaint handling, and fair treatment. Flags calls mentioning: illegal activities, customer distress, threats, or regulatory risks. Generates agent scorecards and personalized coaching plans.',
        manualTime: 15,
        aiTime: 0.5,
        accuracy: { manual: 72, ai: 94 },
        errorRate: { manual: 28, ai: 6 },
        reworkRate: { manual: 35, ai: 8 },
        kpis: [
          { name: 'QA Coverage', manualValue: '2%', aiValue: '100%', improvement: '98%', unit: 'increase', description: 'Calls monitored' },
          { name: 'Compliance Detection', manualValue: '68%', aiValue: '96%', improvement: '28%', unit: 'increase', description: 'Violations identified' },
          { name: 'Agent Performance', manualValue: '74%', aiValue: '88%', improvement: '14%', unit: 'increase', description: 'Overall QA score' },
          { name: 'Coaching Effectiveness', manualValue: '45%', aiValue: '82%', improvement: '37%', unit: 'increase', description: 'Performance improvement' }
        ]
      },
      {
        title: 'Sentiment & Customer Experience Analysis',
        technology: ['Azure Cognitive Services', 'Power BI', 'Customer Insights'],
        description: 'Real-time sentiment tracking and experience improvement recommendations',
        detailedDescription: 'Azure Cognitive Services analyzes customer sentiment throughout conversation: frustration, satisfaction, confusion, urgency. Power BI dashboards show sentiment trends by product, process, time of day, and agent. Customer Insights correlates sentiment with customer journey touchpoints. Azure ML identifies experience pain points and improvement opportunities. Real-time alerts notify supervisors of negative sentiment calls for immediate intervention. Tracks Net Promoter Score (NPS) and Customer Effort Score (CES).',
        manualTime: 120,
        aiTime: 5,
        accuracy: { manual: 65, ai: 89 },
        errorRate: { manual: 35, ai: 11 },
        reworkRate: { manual: 40, ai: 12 },
        kpis: [
          { name: 'Sentiment Analysis', manualValue: '120', aiValue: '5', improvement: '96%', unit: 'min', description: 'Analysis time per report' },
          { name: 'Sentiment Accuracy', manualValue: '65%', aiValue: '89%', improvement: '24%', unit: 'increase', description: 'Correct sentiment detection' },
          { name: 'Experience Score', manualValue: '6.8', aiValue: '8.3', improvement: '1.5', unit: 'points', description: 'Customer experience rating' },
          { name: 'Issue Detection', manualValue: '42%', aiValue: '88%', improvement: '46%', unit: 'increase', description: 'Experience issues identified' }
        ]
      }
    ]
  },
  {
    id: 'cc-6',
    title: 'Workforce Management',
    description: 'AI-driven demand forecasting and optimal agent scheduling',
    businessValue: 'Reduces overstaffing costs by RM 8.5M. Improves service level from 72% to 91%.',
    complexity: 'High',
    riskLevel: 'Medium',
    defaultParams: {
      volume: 350,
      hourlyRate: 28, // RM 28/hr (~$6/hr) - WFM manager, RM 5,000/month
      errorCostPerIncident: 6300, // RM 6,300 (~$1,400) - Staffing error cost
      reworkCostMultiplier: 2.5,
      azureCostStructure: {
        volumeTier: 'Medium',
        cimbMarkup: 30,
        azureCosts: {
          openAI: 175, // GPT-4o: 15K input + 5K output for schedule optimization
          copilotStudio: 0, // Not needed
          powerApps: 560, // 28 WFM managers × $20/user/month
          storage: 60, // Historical demand data, schedules, agent availability
          database: 149, // Azure SQL Standard S2 for workforce data
          aks: 100, // 2 nodes for WFM services
          other: 1150 // Azure ML forecasting models ($500), Power BI Premium ($400), Power Automate ($250)
        },
        totalAzureCostUSD: 2194,
        totalCIMBCostUSD: 658.20,
        totalMonthlyCostUSD: 2852.20
      }
    },
    steps: [
      {
        title: 'AI-Powered Demand Forecasting',
        technology: ['Azure ML', 'Azure Synapse Analytics', 'Power BI'],
        description: 'Predicts call volume by channel, time, and day with 95% accuracy',
        detailedDescription: 'Azure ML models forecast contact center demand considering: historical patterns, seasonality, product launches, marketing campaigns, public holidays (Malaysian calendar), month-end effects, Ramadan patterns, and external events. Synapse Analytics processes multi-year historical data. Predicts volume by 30-minute intervals for voice, chat, WhatsApp, and email. Power BI visualizes forecasts and capacity plans. Achieves 95% forecasting accuracy vs 68% with manual methods. Updates forecasts daily based on actual demand.',
        manualTime: 180,
        aiTime: 15,
        accuracy: { manual: 68, ai: 95 },
        errorRate: { manual: 32, ai: 5 },
        reworkRate: { manual: 38, ai: 7 },
        kpis: [
          { name: 'Forecast Accuracy', manualValue: '68%', aiValue: '95%', improvement: '27%', unit: 'increase', description: 'Prediction accuracy' },
          { name: 'Planning Time', manualValue: '180', aiValue: '15', improvement: '92%', unit: 'min', description: 'Weekly schedule creation' },
          { name: 'Service Level', manualValue: '72%', aiValue: '91%', improvement: '19%', unit: 'increase', description: 'Calls answered within SLA' },
          { name: 'Staffing Efficiency', manualValue: '64%', aiValue: '87%', improvement: '23%', unit: 'increase', description: 'Agent utilization rate' }
        ]
      },
      {
        title: 'Optimal Schedule Generation',
        technology: ['Azure ML', 'Power Automate', 'Shifts (Microsoft Teams)'],
        description: 'AI creates agent schedules balancing service level, agent preferences, and costs',
        detailedDescription: 'Azure ML optimization engine generates optimal schedules considering: forecasted demand, agent skills, shift preferences, labor laws (Malaysian Employment Act), break requirements, training needs, and budget constraints. Power Automate integrates with HR systems and publishes schedules to Microsoft Teams Shifts. Agents can swap shifts, request time off, and view schedules on mobile. System ensures compliance with Malaysian labor regulations: maximum working hours, overtime limits, and rest days. Reduces schedule creation time from 2 days to 15 minutes.',
        manualTime: 960,
        aiTime: 15,
        accuracy: { manual: 74, ai: 92 },
        errorRate: { manual: 26, ai: 8 },
        reworkRate: { manual: 35, ai: 10 },
        kpis: [
          { name: 'Scheduling Time', manualValue: '960', aiValue: '15', improvement: '98%', unit: 'min', description: 'Time to create schedule' },
          { name: 'Schedule Adherence', manualValue: '74%', aiValue: '92%', improvement: '18%', unit: 'increase', description: 'Agents following schedule' },
          { name: 'Agent Satisfaction', manualValue: '6.2', aiValue: '8.4', improvement: '2.2', unit: 'points', description: 'Schedule satisfaction score' },
          { name: 'Labor Cost', manualValue: '100%', aiValue: '76%', improvement: '24%', unit: 'reduction', description: 'Overtime and overstaffing' }
        ]
      }
    ]
  }
];

export default function ROICalculatorV2Page() {
  const [mode, setMode] = useState<'process' | 'total'>('process');
  const [selectedProcess, setSelectedProcess] = useState<'loan' | 'collections' | 'contact-center'>('loan');
  const [selectedCluster, setSelectedCluster] = useState<ProcessCluster | null>(loanApplicationClusters[0]);
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  
  // Initialize cluster params for all processes
  const allClusters = [...loanApplicationClusters, ...collectionsProcessClusters, ...contactCenterClusters];
  const [clusterParams, setClusterParams] = useState<Record<string, ClusterParameters>>(
    allClusters.reduce((acc, cluster) => ({
      ...acc,
      [cluster.id]: cluster.defaultParams
    }), {})
  );

  // Global parameters (MYR amounts, ~4.5 MYR per USD)
  const [implementationCost, setImplementationCost] = useState(8100000); // RM 8.1M (~$1.8M USD)

  const currentClusters = selectedProcess === 'loan' 
    ? loanApplicationClusters 
    : selectedProcess === 'collections' 
    ? collectionsProcessClusters 
    : contactCenterClusters;
    
  const currentParams = selectedCluster ? clusterParams[selectedCluster.id] : currentClusters[0]?.defaultParams;

  // Sophisticated ROI Calculations
  const calculateClusterROI = (cluster: ProcessCluster, params: ClusterParameters) => {
    const totalManualMinutes = cluster.steps.reduce((sum, step) => sum + step.manualTime, 0);
    const totalAIMinutes = cluster.steps.reduce((sum, step) => sum + step.aiTime, 0);
    
    // Time savings
    const timeSavedPerTransaction = totalManualMinutes - totalAIMinutes;
    const timeReductionPercent = ((timeSavedPerTransaction / totalManualMinutes) * 100).toFixed(1);
    
    // Cost calculations
    const manualCostPerTransaction = (totalManualMinutes / 60) * params.hourlyRate;
    const aiCostPerTransaction = (totalAIMinutes / 60) * params.hourlyRate;
    
    // Error cost calculations
    const avgManualErrorRate = cluster.steps.reduce((sum, step) => sum + step.errorRate.manual, 0) / cluster.steps.length;
    const avgAIErrorRate = cluster.steps.reduce((sum, step) => sum + step.errorRate.ai, 0) / cluster.steps.length;
    
    const manualErrorCost = (avgManualErrorRate / 100) * params.errorCostPerIncident;
    const aiErrorCost = (avgAIErrorRate / 100) * params.errorCostPerIncident;
    
    // Rework cost calculations
    const avgManualReworkRate = cluster.steps.reduce((sum, step) => sum + step.reworkRate.manual, 0) / cluster.steps.length;
    const avgAIReworkRate = cluster.steps.reduce((sum, step) => sum + step.reworkRate.ai, 0) / cluster.steps.length;
    
    const manualReworkCost = (avgManualReworkRate / 100) * manualCostPerTransaction * params.reworkCostMultiplier;
    const aiReworkCost = (avgAIReworkRate / 100) * aiCostPerTransaction * params.reworkCostMultiplier;
    
    // Total cost per transaction
    const totalManualCost = manualCostPerTransaction + manualErrorCost + manualReworkCost;
    const totalAICost = aiCostPerTransaction + aiErrorCost + aiReworkCost;
    const savingsPerTransaction = totalManualCost - totalAICost;
    
    // Monthly and annual savings
    const monthlySavings = savingsPerTransaction * params.volume;
    const annualSavings = monthlySavings * 12;

    return {
      timeReductionPercent,
      timeSavedPerTransaction,
      manualCostPerTransaction: totalManualCost,
      aiCostPerTransaction: totalAICost,
      savingsPerTransaction,
      monthlySavings,
      annualSavings,
      avgManualErrorRate,
      avgAIErrorRate,
      avgManualReworkRate,
      avgAIReworkRate
    };
  };

  const calculateOverallROI = () => {
    let totalAnnualSavings = 0;
    let totalTimeSaved = 0;
    let totalManualTime = 0;
    
    currentClusters.forEach(cluster => {
      const params = clusterParams[cluster.id];
      const clusterROI = calculateClusterROI(cluster, params);
      totalAnnualSavings += clusterROI.annualSavings;
      
      cluster.steps.forEach(step => {
        totalTimeSaved += (step.manualTime - step.aiTime) * params.volume * 12;
        totalManualTime += step.manualTime * params.volume * 12;
      });
    });
    
    // Apply 15% risk adjustment for conservative estimates
    const adjustedAnnualSavings = totalAnnualSavings * 0.85;
    
    // 2-Year and 5-Year calculations
    const twoYearSavings = adjustedAnnualSavings * 2;
    const fiveYearSavings = adjustedAnnualSavings * 5;
    
    // Account for ramp-up: Year 1 = 60%, Year 2 = 100%, Year 3+ = 100%
    const realisticTwoYearSavings = (adjustedAnnualSavings * 0.6) + (adjustedAnnualSavings * 1.0);
    const realisticFiveYearSavings = (adjustedAnnualSavings * 0.6) + (adjustedAnnualSavings * 4.0);
    
    const roi2Year = ((realisticTwoYearSavings - implementationCost) / implementationCost * 100).toFixed(0);
    const roi5Year = ((realisticFiveYearSavings - implementationCost) / implementationCost * 100).toFixed(0);
    
    const paybackMonths = (implementationCost / (adjustedAnnualSavings / 12)).toFixed(1);
    const timeReductionPercent = ((totalTimeSaved / totalManualTime) * 100).toFixed(1);
    
    return {
      totalAnnualSavings: adjustedAnnualSavings,
      twoYearSavings: realisticTwoYearSavings,
      fiveYearSavings: realisticFiveYearSavings,
      roi2Year,
      roi5Year,
      paybackMonths,
      timeReductionPercent,
      totalTimeSaved: totalTimeSaved / 60 // convert to hours
    };
  };

  const overallMetrics = calculateOverallROI();
  const clusterMetrics = selectedCluster ? calculateClusterROI(selectedCluster, currentParams!) : null;

  const formatCurrency = (value: number, showUSD = false) => {
    const usdValue = value / 4.5; // Convert MYR to USD at 4.5 rate
    let myrFormatted: string;
    let usdFormatted: string;
    
    if (value >= 1000000) {
      myrFormatted = `RM ${(value / 1000000).toFixed(2)}M`;
      usdFormatted = `$${(usdValue / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      myrFormatted = `RM ${(value / 1000).toFixed(0)}K`;
      usdFormatted = `$${(usdValue / 1000).toFixed(0)}K`;
    } else {
      myrFormatted = `RM ${value.toFixed(0)}`;
      usdFormatted = `$${usdValue.toFixed(0)}`;
    }
    
    return showUSD ? `${myrFormatted} (${usdFormatted})` : myrFormatted;
  };

  // Format Azure costs (USD primary, then MYR equivalent)
  const formatAzureCost = (usdValue: number, showMYR = true) => {
    const myrValue = usdValue * 4.5; // Convert USD to MYR at 4.5 rate
    let usdFormatted: string;
    let myrFormatted: string;
    
    if (usdValue >= 1000000) {
      usdFormatted = `$${(usdValue / 1000000).toFixed(2)}M`;
      myrFormatted = `RM ${(myrValue / 1000000).toFixed(2)}M`;
    } else if (usdValue >= 1000) {
      usdFormatted = `$${(usdValue / 1000).toFixed(1)}K`;
      myrFormatted = `RM ${(myrValue / 1000).toFixed(1)}K`;
    } else {
      usdFormatted = `$${usdValue.toFixed(0)}`;
      myrFormatted = `RM ${myrValue.toFixed(0)}`;
    }
    
    return showMYR ? `${usdFormatted} (${myrFormatted})` : usdFormatted;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-700 bg-green-100';
      case 'Medium': return 'text-amber-700 bg-amber-100';
      case 'High': return 'text-orange-700 bg-orange-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
        <div>
              <h1 className="text-2xl font-bold text-gray-900">AI ROI Calculator</h1>
              <p className="text-sm text-gray-600 mt-1">
                {mode === 'total' ? 'Enterprise-wide ROI analysis' : 'Process-level ROI analysis with sophisticated methodology'}
              </p>
        </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setMode('total')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    mode === 'total'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Total ROI
                </button>
                <button
                  onClick={() => setMode('process')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    mode === 'process'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Process-Specific
                </button>
              </div>
                <button
                onClick={() => setShowMethodology(!showMethodology)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                {showMethodology ? 'Hide' : 'Show'} Methodology
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* Methodology Panel */}
      {showMethodology && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <h3 className="font-semibold text-gray-900 mb-3">ROI Calculation Methodology & Assumptions</h3>
            <div className="grid grid-cols-3 gap-6 text-sm mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📊 Time Savings</h4>
                <p className="text-gray-700 mb-2"><strong>Formula:</strong> (Manual Time - AI Time) × Volume × Hourly Rate × 12</p>
                <p className="text-gray-600 text-xs">Labor cost savings from process automation. Based on Malaysian banking salary benchmarks (RM 12-45/hr depending on role).</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">⚠️ Error & Rework Costs</h4>
                <p className="text-gray-700 mb-2"><strong>Formula:</strong> Error Rate × Error Cost + Rework Rate × (Transaction Cost × Multiplier)</p>
                <p className="text-gray-600 text-xs">Quality cost savings including remediation, customer service recovery, compliance penalties, and reputational impact.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">💰 2-Year & 5-Year ROI</h4>
                <p className="text-gray-700 mb-2"><strong>Formula:</strong> ((Total Savings - Implementation Cost) / Implementation Cost) × 100</p>
                <p className="text-gray-600 text-xs">2-year shows conservative near-term returns. 5-year shows full value realization. Accounts for ramp-up: Year 1 = 60%, Year 2+ = 100% of benefits. Includes 15% risk adjustment.</p>
              </div>
            </div>
            
            <div className="border-t border-blue-200 pt-4 grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎯 Process-Specific Metrics</h4>
                <div className="text-xs space-y-1">
                  <p className="text-gray-700"><strong>Loan Applications:</strong> Approval time, fraud detection rate, document accuracy, straight-through processing rate</p>
                  <p className="text-gray-700"><strong>Collections:</strong> Recovery rate, right party contact rate, promise-to-pay kept rate, early detection rate, automation rate</p>
                  <p className="text-gray-700"><strong>Contact Center:</strong> Deflection rate, containment rate, average handle time, first call resolution, customer satisfaction</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📝 Key Assumptions & Benchmarks</h4>
                <ul className="text-xs space-y-1 text-gray-700 list-disc list-inside">
                  <li>Exchange rate: RM 4.5 = USD 1.0 (Malaysian Ringgit)</li>
                  <li>Working days: 22 days/month, 264 days/year</li>
                  <li>Salary benchmarks from Malaysian banking industry (2024)</li>
                  <li>Implementation timeline: 12-18 months phased rollout</li>
                  <li>Risk adjustment: 15% buffer for conservative estimates</li>
                  <li>Ramp-up curve: 60% benefits in Year 1, 100% from Year 2 onwards</li>
                  <li><strong>Industry ROI Benchmarks:</strong> Document automation 200-350%, RPA 150-250%, Contact Center AI 180-280%, Microsoft 365 Copilot 282% (Forrester TEI)</li>
                  <li>Data sources: Forrester TEI studies + CIMB performance data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode: Total ROI */}
      {mode === 'total' && (
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">2-Year ROI</div>
                  <div className="text-4xl font-bold text-blue-700 mb-1">{overallMetrics.roi2Year}%</div>
                  <div className="text-xs text-gray-600">Conservative estimate</div>
            </CardContent>
          </Card>

              <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">5-Year ROI</div>
                  <div className="text-4xl font-bold text-green-700 mb-1">{overallMetrics.roi5Year}%</div>
                  <div className="text-xs text-gray-600">Long-term value</div>
                </CardContent>
              </Card>

              <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Total Annual Savings</div>
                  <div className="text-4xl font-bold text-green-700 mb-1">{formatCurrency(overallMetrics.totalAnnualSavings, true)}</div>
                  <div className="text-xs text-gray-600">{formatCurrency(overallMetrics.totalAnnualSavings / 12, true)}/month</div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Implementation Cost</div>
                  <div className="text-4xl font-bold text-slate-700 mb-1">{formatCurrency(implementationCost, true)}</div>
                  <div className="text-xs text-gray-600">One-time investment</div>
                </CardContent>
              </Card>

              <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Time Reduction</div>
                  <div className="text-4xl font-bold text-amber-700 mb-1">{overallMetrics.timeReductionPercent}%</div>
                  <div className="text-xs text-gray-600">{overallMetrics.totalTimeSaved.toFixed(0)}K hrs/year</div>
                </CardContent>
              </Card>
            </div>

            {/* Global Investment Lever */}
          <Card>
            <CardHeader>
                <CardTitle className="text-lg">Investment Assumptions</CardTitle>
            </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Implementation Cost</Label>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(implementationCost)}</span>
                </div>
                  <Slider
                    value={[implementationCost]}
                    onValueChange={([v]) => setImplementationCost(v)}
                      min={2250000}
                      max={22500000}
                      step={450000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>RM 2.25M ($500K)</span>
                      <span>RM 22.5M ($5M)</span>
                </div>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Process Overview Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Processes</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Click "Process-Specific" mode above to drill down into detailed analysis</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Loan Applications', clusters: 8, steps: 24, timeReduction: '92%', status: 'Available' },
                    { name: 'Collections', clusters: 6, steps: 12, timeReduction: '89%', status: 'Available' },
                    { name: 'Contact Center', clusters: 6, steps: 12, timeReduction: '85%', status: 'Available' }
                  ].map((process, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <div className="font-semibold text-gray-900">{process.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {process.clusters} clusters · {process.steps} steps
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-700">{process.timeReduction}</div>
                          <div className="text-xs text-gray-600">time reduction</div>
                        </div>
                        <Badge className={process.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                          {process.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Assumptions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-gray-900 mb-1">Time Horizon</div>
                    <div className="text-2xl font-bold text-blue-700">2 & 5 Years</div>
                    <div className="text-xs text-gray-600 mt-1">Short & long-term value</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-gray-900 mb-1">Methodology</div>
                    <div className="text-2xl font-bold text-green-700">Forrester TEI</div>
                    <div className="text-xs text-gray-600 mt-1">Industry-standard framework</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="font-medium text-gray-900 mb-1">Risk Adjustment</div>
                    <div className="text-2xl font-bold text-amber-700">15%</div>
                    <div className="text-xs text-gray-600 mt-1">Conservative buffer included</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Mode: Process-Specific ROI */}
      {mode === 'process' && (
        <div className="max-w-[1800px] mx-auto px-6 py-6">
        {/* Process Selector - Large & Prominent */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-slate-50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Select Process</h3>
              <Badge className="bg-blue-100 text-blue-700">3 Processes Available</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSelectedProcess('loan');
                  setSelectedCluster(loanApplicationClusters[0]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedProcess === 'loan'
                    ? 'border-blue-500 bg-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                }`}
              >
                <div className="text-left">
                  <div className={`text-base font-semibold mb-1 ${selectedProcess === 'loan' ? 'text-blue-700' : 'text-gray-900'}`}>
                    Loan Applications
                  </div>
                  <div className="text-xs text-gray-600">8 clusters · 24 steps</div>
                  {selectedProcess === 'loan' && (
                    <div className="mt-2 text-xs font-medium text-blue-600">● Currently Selected</div>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSelectedProcess('collections');
                  setSelectedCluster(collectionsProcessClusters[0]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedProcess === 'collections'
                    ? 'border-blue-500 bg-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                }`}
              >
                <div className="text-left">
                  <div className={`text-base font-semibold mb-1 ${selectedProcess === 'collections' ? 'text-blue-700' : 'text-gray-900'}`}>
                    Collections
                  </div>
                  <div className="text-xs text-gray-600">6 clusters · 12 steps</div>
                  {selectedProcess === 'collections' && (
                    <div className="mt-2 text-xs font-medium text-blue-600">● Currently Selected</div>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSelectedProcess('contact-center');
                  setSelectedCluster(contactCenterClusters[0]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedProcess === 'contact-center'
                    ? 'border-blue-500 bg-white shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow'
                }`}
              >
                <div className="text-left">
                  <div className={`text-base font-semibold mb-1 ${selectedProcess === 'contact-center' ? 'text-blue-700' : 'text-gray-900'}`}>
                    Contact Center
                  </div>
                  <div className="text-xs text-gray-600">6 clusters · 12 steps</div>
                  {selectedProcess === 'contact-center' && (
                    <div className="mt-2 text-xs font-medium text-blue-600">● Currently Selected</div>
                  )}
                </div>
              </button>
            </div>
              </CardContent>
            </Card>

        {/* Overall Metrics */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="border border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="mb-1">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Time Savings</span>
              </div>
              <div className="text-3xl font-bold text-green-700">{overallMetrics.timeReductionPercent}%</div>
              <p className="text-xs text-gray-600 mt-1">{overallMetrics.totalTimeSaved.toFixed(0)}K hours/year</p>
              </CardContent>
            </Card>

          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="mb-1">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Annual Savings</span>
          </div>
              <div className="text-2xl font-bold text-blue-700">{formatCurrency(overallMetrics.totalAnnualSavings, true)}</div>
              <p className="text-xs text-gray-600 mt-1">{formatCurrency(overallMetrics.totalAnnualSavings / 12, true)}/month</p>
              </CardContent>
            </Card>

          <Card className="border border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="mb-1">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">2-Yr / 5-Yr ROI</span>
          </div>
              <div className="text-3xl font-bold text-blue-700">{overallMetrics.roi2Year}% / {overallMetrics.roi5Year}%</div>
              <p className="text-xs text-gray-600 mt-1">Payback: {overallMetrics.paybackMonths} months</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-slate-50">
            <CardContent className="p-4">
              <div className="mb-1">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Investment</span>
              </div>
              <div className="text-2xl font-bold text-slate-700">{formatCurrency(implementationCost, true)}</div>
              <div className="mt-2">
                <Slider
                  value={[implementationCost]}
                  onValueChange={([v]) => setImplementationCost(v)}
                  min={2250000}
                  max={22500000}
                  step={450000}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="mb-1">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Risk Reduction</span>
              </div>
              <div className="text-3xl font-bold text-green-700">87%</div>
              <p className="text-xs text-gray-600 mt-1">Errors & rework eliminated</p>
            </CardContent>
          </Card>
        </div>

        {/* Split View: Clusters (Left) + Details (Right) */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT: Process Clusters List */}
          <div className="col-span-5 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Process Clusters ({currentClusters.length})</h2>
              {currentClusters.map((cluster, index) => {
              const params = clusterParams[cluster.id];
              const metrics = calculateClusterROI(cluster, params);
              const isSelected = selectedCluster?.id === cluster.id;

                return (
                  <Card 
                    key={cluster.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedCluster(cluster);
                    setSelectedStep(null);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm shrink-0">
                            {index + 1}
                          </div>
                      <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{cluster.title}</h3>
                          <Badge className={`text-xs ${getRiskColor(cluster.riskLevel)}`}>
                            {cluster.riskLevel} Risk
                              </Badge>
                            </div>
                        <p className="text-xs text-gray-600 mb-2">{cluster.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <div className="font-semibold text-green-700">{metrics.timeReductionPercent}%</div>
                            <div className="text-gray-500">Time saved</div>
                          </div>
                          <div>
                            <div className="font-semibold text-blue-700">{formatCurrency(metrics.annualSavings)}</div>
                            <div className="text-gray-500">Annual savings</div>
                        </div>
                          <div>
                            <div className="font-semibold text-gray-700">{cluster.steps.length}</div>
                            <div className="text-gray-500">Steps</div>
                          </div>
                        </div>
                      </div>
                      <div className={`text-2xl text-gray-400 shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`}>›</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* RIGHT: Cluster Details & Steps */}
          <div className="col-span-7">
            {selectedCluster && clusterMetrics && (
              <div className="space-y-4">
                {/* Cluster Header */}
                <Card className="border-2 border-blue-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{selectedCluster.title}</CardTitle>
                        <p className="text-sm text-gray-600 mb-2">{selectedCluster.businessValue}</p>
                        <div className="flex gap-2">
                          <Badge className="text-xs">{selectedCluster.complexity} Complexity</Badge>
                          <Badge className={`text-xs ${getRiskColor(selectedCluster.riskLevel)}`}>
                            {selectedCluster.riskLevel} Risk
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-700">{clusterMetrics.timeReductionPercent}%</div>
                        <div className="text-sm text-gray-600">time reduction</div>
                      </div>
                      </div>
                    </CardHeader>
                  <CardContent>
                    {/* Cluster Parameters */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Cluster Parameters</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">Monthly Volume: {currentParams!.volume.toLocaleString()}</Label>
                          <Slider
                            value={[currentParams!.volume]}
                            onValueChange={([v]) => setClusterParams({
                              ...clusterParams,
                              [selectedCluster.id]: { ...currentParams!, volume: v }
                            })}
                            min={100}
                            max={5000}
                            step={100}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Hourly Rate: RM {currentParams!.hourlyRate} (~${(currentParams!.hourlyRate / 4.5).toFixed(1)})</Label>
                          <Slider
                            value={[currentParams!.hourlyRate]}
                            onValueChange={([v]) => setClusterParams({
                              ...clusterParams,
                              [selectedCluster.id]: { ...currentParams!, hourlyRate: v }
                            })}
                            min={12}
                            max={60}
                            step={2}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Error Cost: RM {currentParams!.errorCostPerIncident.toLocaleString()} (~${(currentParams!.errorCostPerIncident / 4.5).toFixed(0)})</Label>
                          <Slider
                            value={[currentParams!.errorCostPerIncident]}
                            onValueChange={([v]) => setClusterParams({
                              ...clusterParams,
                              [selectedCluster.id]: { ...currentParams!, errorCostPerIncident: v }
                            })}
                            min={200}
                            max={50000}
                            step={500}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Rework Multiplier: {currentParams!.reworkCostMultiplier}x</Label>
                          <Slider
                            value={[currentParams!.reworkCostMultiplier]}
                            onValueChange={([v]) => setClusterParams({
                              ...clusterParams,
                              [selectedCluster.id]: { ...currentParams!, reworkCostMultiplier: v }
                            })}
                            min={1}
                            max={5}
                            step={0.5}
                            className="mt-2"
                          />
                        </div>
                        
                        {/* Collections-Specific Levers */}
                        {selectedProcess === 'collections' && currentParams!.recoveryRate !== undefined && (
                          <div>
                            <Label className="text-xs font-semibold text-green-700">Recovery Rate: {currentParams!.recoveryRate}%</Label>
                            <Slider
                              value={[currentParams!.recoveryRate]}
                              onValueChange={([v]) => setClusterParams({
                                ...clusterParams,
                                [selectedCluster.id]: { ...currentParams!, recoveryRate: v }
                              })}
                              min={40}
                              max={90}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        )}
                        
                        {selectedProcess === 'collections' && currentParams!.rightPartyContactRate !== undefined && (
                          <div>
                            <Label className="text-xs font-semibold text-blue-700">Right Party Contact: {currentParams!.rightPartyContactRate}%</Label>
                            <Slider
                              value={[currentParams!.rightPartyContactRate]}
                              onValueChange={([v]) => setClusterParams({
                                ...clusterParams,
                                [selectedCluster.id]: { ...currentParams!, rightPartyContactRate: v }
                              })}
                              min={50}
                              max={95}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        )}
                        
                        {/* Contact Center-Specific Levers */}
                        {selectedProcess === 'contact-center' && currentParams!.containmentRate !== undefined && (
                          <div>
                            <Label className="text-xs font-semibold text-green-700">Containment Rate: {currentParams!.containmentRate}%</Label>
                            <Slider
                              value={[currentParams!.containmentRate]}
                              onValueChange={([v]) => setClusterParams({
                                ...clusterParams,
                                [selectedCluster.id]: { ...currentParams!, containmentRate: v }
                              })}
                              min={30}
                              max={85}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        )}
                        
                        {selectedProcess === 'contact-center' && currentParams!.deflectionRate !== undefined && (
                          <div>
                            <Label className="text-xs font-semibold text-blue-700">Deflection Rate: {currentParams!.deflectionRate}%</Label>
                            <Slider
                              value={[currentParams!.deflectionRate]}
                              onValueChange={([v]) => setClusterParams({
                                ...clusterParams,
                                [selectedCluster.id]: { ...currentParams!, deflectionRate: v }
                              })}
                              min={20}
                              max={80}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        )}
                        
                        {selectedProcess === 'contact-center' && currentParams!.avgHandleTime !== undefined && (
                          <div>
                            <Label className="text-xs font-semibold text-amber-700">Avg Handle Time: {currentParams!.avgHandleTime} min</Label>
                            <Slider
                              value={[currentParams!.avgHandleTime]}
                              onValueChange={([v]) => setClusterParams({
                                ...clusterParams,
                                [selectedCluster.id]: { ...currentParams!, avgHandleTime: v }
                              })}
                              min={1}
                              max={10}
                              step={0.5}
                              className="mt-2"
                            />
                          </div>
                        )}
                        
                        {/* Automation Rate (for both Collections and Contact Center) */}
                        {(selectedProcess === 'collections' || selectedProcess === 'contact-center') && currentParams!.automationRate !== undefined && (
                          <div>
                            <Label className="text-xs font-semibold text-purple-700">Automation Rate: {currentParams!.automationRate}%</Label>
                            <Slider
                              value={[currentParams!.automationRate]}
                              onValueChange={([v]) => setClusterParams({
                                ...clusterParams,
                                [selectedCluster.id]: { ...currentParams!, automationRate: v }
                              })}
                              min={30}
                              max={95}
                              step={1}
                              className="mt-2"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="bg-green-50 rounded p-3 border border-green-200">
                        <div className="text-base font-bold text-green-700">{formatCurrency(clusterMetrics.annualSavings, true)}</div>
                        <div className="text-xs text-gray-600">Annual Savings</div>
                      </div>
                      <div className="bg-blue-50 rounded p-3 border border-blue-200">
                        <div className="text-base font-bold text-blue-700">{formatCurrency(clusterMetrics.savingsPerTransaction, true)}</div>
                        <div className="text-xs text-gray-600">Per Transaction</div>
                      </div>
                      <div className="bg-amber-50 rounded p-3 border border-amber-200">
                        <div className="text-lg font-bold text-amber-700">{clusterMetrics.avgManualErrorRate.toFixed(1)}% → {clusterMetrics.avgAIErrorRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Error Rate</div>
                      </div>
                      <div className="bg-slate-50 rounded p-3 border border-slate-200">
                        <div className="text-lg font-bold text-slate-700">{clusterMetrics.avgManualReworkRate.toFixed(1)}% → {clusterMetrics.avgAIReworkRate.toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Rework Rate</div>
                      </div>
                    </div>
                    
                    {/* Azure Consumption Costs */}
                    {currentParams!.azureCostStructure && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border-2 border-blue-300">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">💰 Azure Consumption & CIMB Costs</h4>
                        
                        {/* T-shirt Size Selector */}
                        <div className="mb-4">
                          <Label className="text-xs font-semibold text-gray-900 mb-2 block">Volume Tier</Label>
                          <div className="flex gap-2">
                            {(['Small', 'Medium', 'Large'] as const).map((tier) => (
                              <button
                                key={tier}
                                onClick={() => {
                                  const currentTier = currentParams!.azureCostStructure.volumeTier;
                                  const currentMultiplier = currentTier === 'Small' ? 0.5 : currentTier === 'Large' ? 2 : 1;
                                  const newMultiplier = tier === 'Small' ? 0.5 : tier === 'Large' ? 2 : 1;
                                  const adjustmentRatio = newMultiplier / currentMultiplier;
                                  
                                  const newCostStructure = { ...currentParams!.azureCostStructure!, volumeTier: tier };
                                  
                                  // Adjust costs based on tier change
                                  Object.keys(newCostStructure.azureCosts).forEach((key) => {
                                    const k = key as keyof AzureCostBreakdown;
                                    newCostStructure.azureCosts[k] = Math.round(newCostStructure.azureCosts[k] * adjustmentRatio * 100) / 100;
                                  });
                                  
                                  const totalAzure = Object.values(newCostStructure.azureCosts).reduce((a, b) => a + b, 0);
                                  newCostStructure.totalAzureCostUSD = totalAzure;
                                  newCostStructure.totalCIMBCostUSD = totalAzure * (newCostStructure.cimbMarkup / 100);
                                  newCostStructure.totalMonthlyCostUSD = totalAzure + newCostStructure.totalCIMBCostUSD;
                                  
                                  setClusterParams({
                                    ...clusterParams,
                                    [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                  });
                                }}
                                className={`px-6 py-2 text-xs font-medium rounded-full transition-all ${
                                  currentParams!.azureCostStructure.volumeTier === tier
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
                                }`}
                              >
                                {tier}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {/* Azure Cost Breakdown */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white/60 backdrop-blur-sm rounded p-3 border border-blue-200">
                            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              Azure OpenAI (GPT-4)
                              <div className="relative group inline-block">
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help">i</span>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] rounded shadow-xl border border-gray-700/50 z-50">
                                  50K input + 10K output tokens per application. GPT-4o: $0.025/1K input, $0.04/1K output. Total: $1.65/app
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentParams!.azureCostStructure.azureCosts.openAI}
                                onChange={(e) => {
                                  const newCostStructure = { ...currentParams!.azureCostStructure! };
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  newCostStructure.azureCosts.openAI = value;
                                  const totalAzure = Object.values(newCostStructure.azureCosts).reduce((a, b) => a + b, 0);
                                  newCostStructure.totalAzureCostUSD = totalAzure;
                                  newCostStructure.totalCIMBCostUSD = totalAzure * (newCostStructure.cimbMarkup / 100);
                                  newCostStructure.totalMonthlyCostUSD = totalAzure + newCostStructure.totalCIMBCostUSD;
                                  setClusterParams({
                                    ...clusterParams,
                                    [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                  });
                                }}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <span className="text-sm font-semibold text-blue-700">{formatAzureCost(currentParams!.azureCostStructure.azureCosts.openAI)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 backdrop-blur-sm rounded p-3 border border-blue-200">
                            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              Copilot Studio
                              <div className="relative group inline-block">
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help">i</span>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] rounded shadow-xl border border-gray-700/50 z-50">
                                  1 session per application. Base: $200/month + $2 per session
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentParams!.azureCostStructure.azureCosts.copilotStudio}
                                onChange={(e) => {
                                  const newCostStructure = { ...currentParams!.azureCostStructure! };
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  newCostStructure.azureCosts.copilotStudio = value;
                                  const totalAzure = Object.values(newCostStructure.azureCosts).reduce((a, b) => a + b, 0);
                                  newCostStructure.totalAzureCostUSD = totalAzure;
                                  newCostStructure.totalCIMBCostUSD = totalAzure * (newCostStructure.cimbMarkup / 100);
                                  newCostStructure.totalMonthlyCostUSD = totalAzure + newCostStructure.totalCIMBCostUSD;
                                  setClusterParams({
                                    ...clusterParams,
                                    [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                  });
                                }}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <span className="text-sm font-semibold text-blue-700">{formatAzureCost(currentParams!.azureCostStructure.azureCosts.copilotStudio)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 backdrop-blur-sm rounded p-3 border border-blue-200">
                            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              Power Apps <span className="text-[9px] text-gray-500">(optional)</span>
                              <div className="relative group inline-block">
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help">i</span>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] rounded shadow-xl border border-gray-700/50 z-50">
                                  50 loan officers × $20/user/month. Optional if using web interface only
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentParams!.azureCostStructure.azureCosts.powerApps}
                                onChange={(e) => {
                                  const newCostStructure = { ...currentParams!.azureCostStructure! };
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  newCostStructure.azureCosts.powerApps = value;
                                  const totalAzure = Object.values(newCostStructure.azureCosts).reduce((a, b) => a + b, 0);
                                  newCostStructure.totalAzureCostUSD = totalAzure;
                                  newCostStructure.totalCIMBCostUSD = totalAzure * (newCostStructure.cimbMarkup / 100);
                                  newCostStructure.totalMonthlyCostUSD = totalAzure + newCostStructure.totalCIMBCostUSD;
                                  setClusterParams({
                                    ...clusterParams,
                                    [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                  });
                                }}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <span className="text-sm font-semibold text-blue-700">{formatAzureCost(currentParams!.azureCostStructure.azureCosts.powerApps)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 backdrop-blur-sm rounded p-3 border border-blue-200">
                            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              Storage (Blob)
                              <div className="relative group inline-block">
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help">i</span>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] rounded shadow-xl border border-gray-700/50 z-50">
                                  10GB per application (PDFs, images, documents). 1K apps = 10TB. Mix of hot ($0.018/GB) and archive ($0.002/GB) tiers
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentParams!.azureCostStructure.azureCosts.storage}
                                onChange={(e) => {
                                  const newCostStructure = { ...currentParams!.azureCostStructure! };
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  newCostStructure.azureCosts.storage = value;
                                  const totalAzure = Object.values(newCostStructure.azureCosts).reduce((a, b) => a + b, 0);
                                  newCostStructure.totalAzureCostUSD = totalAzure;
                                  newCostStructure.totalCIMBCostUSD = totalAzure * (newCostStructure.cimbMarkup / 100);
                                  newCostStructure.totalMonthlyCostUSD = totalAzure + newCostStructure.totalCIMBCostUSD;
                                  setClusterParams({
                                    ...clusterParams,
                                    [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                  });
                                }}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <span className="text-sm font-semibold text-blue-700">{formatAzureCost(currentParams!.azureCostStructure.azureCosts.storage)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 backdrop-blur-sm rounded p-3 border border-blue-200">
                            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              Database (Azure SQL)
                              <div className="relative group inline-block">
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help">i</span>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] rounded shadow-xl border border-gray-700/50 z-50">
                                  Azure SQL Standard S2 tier (50 DTUs) - $149/month. Handles application metadata, status, history, and audit trails
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentParams!.azureCostStructure.azureCosts.database}
                                onChange={(e) => {
                                  const newCostStructure = { ...currentParams!.azureCostStructure! };
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  newCostStructure.azureCosts.database = value;
                                  const totalAzure = Object.values(newCostStructure.azureCosts).reduce((a, b) => a + b, 0);
                                  newCostStructure.totalAzureCostUSD = totalAzure;
                                  newCostStructure.totalCIMBCostUSD = totalAzure * (newCostStructure.cimbMarkup / 100);
                                  newCostStructure.totalMonthlyCostUSD = totalAzure + newCostStructure.totalCIMBCostUSD;
                                  setClusterParams({
                                    ...clusterParams,
                                    [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                  });
                                }}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <span className="text-sm font-semibold text-blue-700">{formatAzureCost(currentParams!.azureCostStructure.azureCosts.database)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 backdrop-blur-sm rounded p-3 border border-blue-200">
                            <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                              AKS Hosting
                              <div className="relative group inline-block">
                                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-gray-400 text-white text-[10px] font-bold cursor-help">i</span>
                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] rounded shadow-xl border border-gray-700/50 z-50">
                                  2 × Standard D2s v3 nodes (2 vCPU, 8GB RAM each). Hosts AI services, APIs, and web frontend
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={currentParams!.azureCostStructure.azureCosts.aks}
                                onChange={(e) => {
                                  const newCostStructure = { ...currentParams!.azureCostStructure! };
                                  const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  newCostStructure.azureCosts.aks = value;
                                  const totalAzure = Object.values(newCostStructure.azureCosts).reduce((a, b) => a + b, 0);
                                  newCostStructure.totalAzureCostUSD = totalAzure;
                                  newCostStructure.totalCIMBCostUSD = totalAzure * (newCostStructure.cimbMarkup / 100);
                                  newCostStructure.totalMonthlyCostUSD = totalAzure + newCostStructure.totalCIMBCostUSD;
                                  setClusterParams({
                                    ...clusterParams,
                                    [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                  });
                                }}
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <span className="text-sm font-semibold text-blue-700">{formatAzureCost(currentParams!.azureCostStructure.azureCosts.aks)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Cost Summary */}
                        <div className="border-t border-blue-300 pt-3 mt-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-blue-100 rounded p-3">
                              <div className="text-xs text-gray-600 mb-1">Total Azure Cost</div>
                              <div className="text-xl font-bold text-blue-700">{formatAzureCost(currentParams!.azureCostStructure.totalAzureCostUSD)}</div>
                              <div className="text-xs text-gray-600">per month</div>
                            </div>
                            
                            <div className="bg-indigo-100 rounded p-3">
                              <div className="text-xs text-gray-600 mb-1">
                                CIMB Markup (
                                <input
                                  type="number"
                                  value={currentParams!.azureCostStructure.cimbMarkup}
                                  onChange={(e) => {
                                    const newCostStructure = { ...currentParams!.azureCostStructure! };
                                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                    newCostStructure.cimbMarkup = value;
                                    newCostStructure.totalCIMBCostUSD = newCostStructure.totalAzureCostUSD * (newCostStructure.cimbMarkup / 100);
                                    newCostStructure.totalMonthlyCostUSD = newCostStructure.totalAzureCostUSD + newCostStructure.totalCIMBCostUSD;
                                    setClusterParams({
                                      ...clusterParams,
                                      [selectedCluster.id]: { ...currentParams!, azureCostStructure: newCostStructure }
                                    });
                                  }}
                                  className="w-12 px-1 text-xs border border-gray-300 rounded inline-block"
                                />%)
                              </div>
                              <div className="text-xl font-bold text-indigo-700">{formatAzureCost(currentParams!.azureCostStructure.totalCIMBCostUSD)}</div>
                              <div className="text-xs text-gray-600">per month</div>
                            </div>
                            
                            <div className="bg-green-100 rounded p-3">
                              <div className="text-xs text-gray-600 mb-1">Total Monthly Cost</div>
                              <div className="text-xl font-bold text-green-700">{formatAzureCost(currentParams!.azureCostStructure.totalMonthlyCostUSD)}</div>
                              <div className="text-xs text-gray-600">Azure + CIMB</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Process Steps */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Process Steps ({selectedCluster.steps.length})</h3>
                  {selectedCluster.steps.map((step, stepIndex) => {
                    const isStepSelected = selectedStep === step;
                              const stepReduction = ((step.manualTime - step.aiTime) / step.manualTime * 100).toFixed(0);

                              return (
                      <Card
                                  key={stepIndex}
                        className={`cursor-pointer transition-all ${
                          isStepSelected ? 'ring-2 ring-blue-400 bg-blue-50' : 'hover:border-gray-300'
                                  }`}
                        onClick={() => setSelectedStep(isStepSelected ? null : step)}
                                >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-gray-900">{step.title}</span>
                                <Badge className="text-xs bg-green-100 text-green-700">{stepReduction}% faster</Badge>
                                      </div>
                                      <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                                      <div className="flex flex-wrap gap-1">
                                        {step.technology.map((tech, i) => (
                                          <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="text-right ml-4 shrink-0">
                              <div className="text-sm font-bold text-gray-900">{step.manualTime}m → {step.aiTime}m</div>
                              <div className="text-xs text-gray-600">{step.accuracy.manual}% → {step.accuracy.ai}%</div>
                              <div className="text-xs text-amber-600">{step.errorRate.manual}% → {step.errorRate.ai}% errors</div>
                                      </div>
                                      </div>

                          {/* Expanded Step Details */}
                          {isStepSelected && (
                            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                              <div className="bg-white rounded p-3 border border-gray-200">
                                <h5 className="text-xs font-semibold text-gray-900 mb-2">Detailed Description</h5>
                                <p className="text-xs text-gray-700 leading-relaxed">{step.detailedDescription}</p>
                                  </div>

                              <div>
                                <h5 className="text-xs font-semibold text-gray-900 mb-2">Key Performance Indicators</h5>
                                      <div className="grid grid-cols-2 gap-2">
                                        {step.kpis.map((kpi, kpiIndex) => (
                                    <div key={kpiIndex} className="bg-gray-50 rounded p-2 border border-gray-200">
                                      <div className="text-xs font-medium text-gray-900 mb-1">{kpi.name}</div>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600">{kpi.manualValue} → {kpi.aiValue}</span>
                                        <span className="text-xs font-semibold text-green-700">{kpi.improvement}</span>
                                              </div>
                                      <div className="text-xs text-gray-500">{kpi.description}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                </div>
                          )}
                        </CardContent>
                      </Card>
                              );
                            })}
                          </div>
                        </div>
                    )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
