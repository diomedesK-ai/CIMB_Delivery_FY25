'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Type Definitions
interface KPI {
  name: string;
  manualValue: string;
  aiValue: string;
  improvement: string;
  unit: string;
}

interface ProcessStep {
  title: string;
  technology: string[];
  description: string;
  manualTime: number; // minutes
  aiTime: number; // minutes
  accuracy: { manual: number; ai: number };
  kpis: KPI[];
}

interface ProcessCluster {
  id: string;
  title: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
  steps: ProcessStep[];
}

// Loan Application Process Data
const loanApplicationClusters: ProcessCluster[] = [
  {
    id: '1',
    title: 'Application Intake',
    description: 'Customer-facing application submission and initial data capture',
    complexity: 'Low',
    steps: [
      {
        title: 'Form Submission',
        technology: ['Copilot Studio', 'Power Apps'],
        description: 'Intelligent form auto-completion with real-time validation',
        manualTime: 25,
        aiTime: 8,
        accuracy: { manual: 85, ai: 98 },
        kpis: [
          { name: 'Completion Time', manualValue: '25', aiValue: '8', improvement: '68%', unit: 'min' },
          { name: 'Error Rate', manualValue: '15%', aiValue: '2%', improvement: '87%', unit: 'reduction' },
          { name: 'Customer Satisfaction', manualValue: '3.2', aiValue: '4.6', improvement: '44%', unit: '/5' },
          { name: 'Dropout Rate', manualValue: '18%', aiValue: '5%', improvement: '72%', unit: 'reduction' }
        ]
      },
      {
        title: 'Identity Verification',
        technology: ['Azure AI Vision', 'Azure Document Intelligence'],
        description: 'Automated ID document scanning and verification',
        manualTime: 15,
        aiTime: 2,
        accuracy: { manual: 92, ai: 99 },
        kpis: [
          { name: 'Verification Time', manualValue: '15', aiValue: '2', improvement: '87%', unit: 'min' },
          { name: 'Accuracy', manualValue: '92%', aiValue: '99%', improvement: '7%', unit: 'increase' },
          { name: 'Fraud Detection', manualValue: '75%', aiValue: '94%', improvement: '19%', unit: 'increase' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Document Collection',
    description: 'Multi-channel document gathering with intelligent validation',
    complexity: 'Medium',
    steps: [
      {
        title: 'Document Upload & Classification',
        technology: ['Azure Document Intelligence', 'Azure OpenAI'],
        description: 'Automated document type detection and classification',
        manualTime: 30,
        aiTime: 3,
        accuracy: { manual: 88, ai: 97 },
        kpis: [
          { name: 'Processing Time', manualValue: '30', aiValue: '3', improvement: '90%', unit: 'min' },
          { name: 'Classification Accuracy', manualValue: '88%', aiValue: '97%', improvement: '9%', unit: 'increase' },
          { name: 'Documents Processed', manualValue: '8', aiValue: '50', improvement: '525%', unit: 'per hour' }
        ]
      },
      {
        title: 'Data Extraction',
        technology: ['Form Recognizer', 'Azure Machine Learning'],
        description: 'Intelligent extraction of key fields from documents',
        manualTime: 45,
        aiTime: 5,
        accuracy: { manual: 85, ai: 96 },
        kpis: [
          { name: 'Extraction Time', manualValue: '45', aiValue: '5', improvement: '89%', unit: 'min' },
          { name: 'Field Accuracy', manualValue: '85%', aiValue: '96%', improvement: '11%', unit: 'increase' },
          { name: 'Manual Corrections', manualValue: '35%', aiValue: '4%', improvement: '89%', unit: 'reduction' }
        ]
      },
      {
        title: 'Document Validation',
        technology: ['Azure OpenAI', 'Power Automate'],
        description: 'Cross-reference and completeness checks',
        manualTime: 20,
        aiTime: 3,
        accuracy: { manual: 90, ai: 98 },
        kpis: [
          { name: 'Validation Time', manualValue: '20', aiValue: '3', improvement: '85%', unit: 'min' },
          { name: 'Completeness Check', manualValue: '90%', aiValue: '98%', improvement: '8%', unit: 'increase' }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Validation & Verification',
    description: 'Intelligent checking and cross-validation of application data',
    complexity: 'Medium',
    steps: [
      {
        title: 'Data Consistency Check',
        technology: ['Azure OpenAI', 'Business Rules Engine'],
        description: 'Automated cross-field validation and anomaly detection',
        manualTime: 25,
        aiTime: 3,
        accuracy: { manual: 87, ai: 96 },
        kpis: [
          { name: 'Check Time', manualValue: '25', aiValue: '3', improvement: '88%', unit: 'min' },
          { name: 'Error Detection', manualValue: '87%', aiValue: '96%', improvement: '9%', unit: 'increase' },
          { name: 'False Positives', manualValue: '22%', aiValue: '6%', improvement: '73%', unit: 'reduction' }
        ]
      },
      {
        title: 'Third-Party Verification',
        technology: ['API Integration', 'Azure Functions'],
        description: 'Automated credit bureau and employment verification',
        manualTime: 35,
        aiTime: 5,
        accuracy: { manual: 95, ai: 99 },
        kpis: [
          { name: 'Verification Time', manualValue: '35', aiValue: '5', improvement: '86%', unit: 'min' },
          { name: 'Data Accuracy', manualValue: '95%', aiValue: '99%', improvement: '4%', unit: 'increase' }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Underwriting & Risk Assessment',
    description: 'AI-powered credit decisioning with machine learning models',
    complexity: 'High',
    steps: [
      {
        title: 'Credit Scoring',
        technology: ['Azure Machine Learning', 'Azure Databricks'],
        description: 'ML-based credit risk assessment with alternative data',
        manualTime: 60,
        aiTime: 8,
        accuracy: { manual: 82, ai: 94 },
        kpis: [
          { name: 'Scoring Time', manualValue: '60', aiValue: '8', improvement: '87%', unit: 'min' },
          { name: 'Default Prediction', manualValue: '82%', aiValue: '94%', improvement: '12%', unit: 'increase' },
          { name: 'Risk Assessment', manualValue: '78%', aiValue: '91%', improvement: '13%', unit: 'increase' }
        ]
      },
      {
        title: 'Policy Compliance Check',
        technology: ['Azure OpenAI', 'Microsoft Purview'],
        description: 'Automated policy and regulatory compliance verification',
        manualTime: 30,
        aiTime: 5,
        accuracy: { manual: 90, ai: 98 },
        kpis: [
          { name: 'Compliance Check', manualValue: '30', aiValue: '5', improvement: '83%', unit: 'min' },
          { name: 'Policy Accuracy', manualValue: '90%', aiValue: '98%', improvement: '8%', unit: 'increase' }
        ]
      },
      {
        title: 'Decision Recommendation',
        technology: ['Azure OpenAI', 'Decision Intelligence'],
        description: 'AI-generated approval recommendations with explanations',
        manualTime: 25,
        aiTime: 3,
        accuracy: { manual: 88, ai: 95 },
        kpis: [
          { name: 'Decision Time', manualValue: '25', aiValue: '3', improvement: '88%', unit: 'min' },
          { name: 'Recommendation Accuracy', manualValue: '88%', aiValue: '95%', improvement: '7%', unit: 'increase' }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Decisioning & Pricing',
    description: 'Dynamic pricing and final approval decision',
    complexity: 'Medium',
    steps: [
      {
        title: 'Interest Rate Calculation',
        technology: ['Azure Machine Learning', 'Pricing Engine'],
        description: 'Risk-based dynamic pricing with market intelligence',
        manualTime: 20,
        aiTime: 2,
        accuracy: { manual: 92, ai: 97 },
        kpis: [
          { name: 'Pricing Time', manualValue: '20', aiValue: '2', improvement: '90%', unit: 'min' },
          { name: 'Pricing Accuracy', manualValue: '92%', aiValue: '97%', improvement: '5%', unit: 'increase' },
          { name: 'Competitive Position', manualValue: '75%', aiValue: '89%', improvement: '14%', unit: 'increase' }
        ]
      },
      {
        title: 'Approval Authority Routing',
        technology: ['Power Automate', 'Business Rules'],
        description: 'Automated routing based on risk and amount',
        manualTime: 15,
        aiTime: 1,
        accuracy: { manual: 95, ai: 99 },
        kpis: [
          { name: 'Routing Time', manualValue: '15', aiValue: '1', improvement: '93%', unit: 'min' },
          { name: 'Routing Accuracy', manualValue: '95%', aiValue: '99%', improvement: '4%', unit: 'increase' }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Documentation & Approval',
    description: 'Automated contract generation and digital signing',
    complexity: 'Low',
    steps: [
      {
        title: 'Contract Generation',
        technology: ['Azure OpenAI', 'Document Assembly'],
        description: 'Auto-generated loan agreements with intelligent clauses',
        manualTime: 40,
        aiTime: 5,
        accuracy: { manual: 90, ai: 98 },
        kpis: [
          { name: 'Generation Time', manualValue: '40', aiValue: '5', improvement: '88%', unit: 'min' },
          { name: 'Document Accuracy', manualValue: '90%', aiValue: '98%', improvement: '8%', unit: 'increase' },
          { name: 'Legal Review Time', manualValue: '120', aiValue: '20', improvement: '83%', unit: 'min' }
        ]
      },
      {
        title: 'Digital Signature',
        technology: ['Azure Sign', 'Power Apps'],
        description: 'Seamless e-signature workflow',
        manualTime: 30,
        aiTime: 5,
        accuracy: { manual: 98, ai: 100 },
        kpis: [
          { name: 'Signing Time', manualValue: '30', aiValue: '5', improvement: '83%', unit: 'min' },
          { name: 'Completion Rate', manualValue: '78%', aiValue: '95%', improvement: '17%', unit: 'increase' }
        ]
      }
    ]
  },
  {
    id: '7',
    title: 'Account Setup & Disbursement',
    description: 'Automated account creation and fund transfer',
    complexity: 'Medium',
    steps: [
      {
        title: 'Account Creation',
        technology: ['Core Banking API', 'Power Automate'],
        description: 'Automated loan account setup and configuration',
        manualTime: 25,
        aiTime: 3,
        accuracy: { manual: 95, ai: 99 },
        kpis: [
          { name: 'Setup Time', manualValue: '25', aiValue: '3', improvement: '88%', unit: 'min' },
          { name: 'Configuration Errors', manualValue: '5%', aiValue: '1%', improvement: '80%', unit: 'reduction' }
        ]
      },
      {
        title: 'Funds Disbursement',
        technology: ['Payment Gateway', 'Azure Functions'],
        description: 'Instant fund transfer with compliance checks',
        manualTime: 20,
        aiTime: 2,
        accuracy: { manual: 99, ai: 100 },
        kpis: [
          { name: 'Disbursement Time', manualValue: '20', aiValue: '2', improvement: '90%', unit: 'min' },
          { name: 'Same-Day Funding', manualValue: '45%', aiValue: '98%', improvement: '53%', unit: 'increase' }
        ]
      },
      {
        title: 'Customer Notification',
        technology: ['Azure Communication Services', 'Copilot Studio'],
        description: 'Multi-channel automated notifications',
        manualTime: 10,
        aiTime: 1,
        accuracy: { manual: 92, ai: 99 },
        kpis: [
          { name: 'Notification Time', manualValue: '10', aiValue: '1', improvement: '90%', unit: 'min' },
          { name: 'Delivery Success', manualValue: '92%', aiValue: '99%', improvement: '7%', unit: 'increase' }
        ]
      }
    ]
  }
];

// Calculate totals for a cluster
const calculateClusterMetrics = (cluster: ProcessCluster) => {
  const totalManualTime = cluster.steps.reduce((sum, step) => sum + step.manualTime, 0);
  const totalAITime = cluster.steps.reduce((sum, step) => sum + step.aiTime, 0);
  const timeReduction = ((totalManualTime - totalAITime) / totalManualTime * 100).toFixed(0);
  
  return {
    totalManualTime,
    totalAITime,
    timeReduction,
    stepCount: cluster.steps.length
  };
};

export default function ROICalculatorV2Page() {
  const [mode, setMode] = useState<'total' | 'process'>('process');
  const [selectedProcess, setSelectedProcess] = useState<'loan' | 'collections' | 'contact-center'>('loan');
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  
  // Interactive Parameters
  const [monthlyVolume, setMonthlyVolume] = useState(1000);
  const [hourlyRate, setHourlyRate] = useState(35);
  const [implementationCost, setImplementationCost] = useState(1200000);
  const [errorCostPerIncident, setErrorCostPerIncident] = useState(500);

  // Get current process data
  const currentClusters = selectedProcess === 'loan' ? loanApplicationClusters : [];

  // Calculate overall metrics
  const calculateOverallMetrics = () => {
    const totalManualMinutes = currentClusters.reduce((sum, cluster) => {
      return sum + cluster.steps.reduce((stepSum, step) => stepSum + step.manualTime, 0);
    }, 0);
    
    const totalAIMinutes = currentClusters.reduce((sum, cluster) => {
      return sum + cluster.steps.reduce((stepSum, step) => stepSum + step.aiTime, 0);
    }, 0);

    const manualCostPerTransaction = (totalManualMinutes / 60) * hourlyRate;
    const aiCostPerTransaction = (totalAIMinutes / 60) * hourlyRate;
    const savingsPerTransaction = manualCostPerTransaction - aiCostPerTransaction;
    
    const monthlySavings = savingsPerTransaction * monthlyVolume;
    const annualSavings = monthlySavings * 12;
    const paybackMonths = implementationCost / monthlySavings;
    const roi = ((annualSavings * 3 - implementationCost) / implementationCost * 100).toFixed(0);

    return {
      totalManualMinutes,
      totalAIMinutes,
      timeReduction: ((totalManualMinutes - totalAIMinutes) / totalManualMinutes * 100).toFixed(0),
      manualCostPerTransaction,
      aiCostPerTransaction,
      savingsPerTransaction,
      monthlySavings,
      annualSavings,
      paybackMonths: paybackMonths.toFixed(1),
      roi
    };
  };

  const metrics = calculateOverallMetrics();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ROI Calculator</h1>
          <p className="text-gray-600 mt-1">Interactive ROI analysis for AI-powered banking processes</p>
        </div>
      </div>

      {/* Mode Selector */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="process">Process ROI</TabsTrigger>
          <TabsTrigger value="total">Total Portfolio ROI</TabsTrigger>
        </TabsList>

        {/* Process-Specific ROI */}
        <TabsContent value="process" className="space-y-6">
          {/* Process Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedProcess('loan')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedProcess === 'loan'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">Loan Applications</h3>
                  <p className="text-xs text-gray-600 mt-1">End-to-end loan processing</p>
                </button>
                <button
                  onClick={() => setSelectedProcess('collections')}
                  disabled
                  className="p-4 rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed"
                >
                  <h3 className="font-semibold text-gray-900">Collections</h3>
                  <p className="text-xs text-gray-600 mt-1">Coming soon</p>
                </button>
                <button
                  onClick={() => setSelectedProcess('contact-center')}
                  disabled
                  className="p-4 rounded-lg border-2 border-gray-200 opacity-50 cursor-not-allowed"
                >
                  <h3 className="font-semibold text-gray-900">Contact Center</h3>
                  <p className="text-xs text-gray-600 mt-1">Coming soon</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Monthly Volume: {monthlyVolume.toLocaleString()} applications</Label>
                  <Slider
                    value={[monthlyVolume]}
                    onValueChange={([v]) => setMonthlyVolume(v)}
                    min={100}
                    max={5000}
                    step={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hourly Rate: ${hourlyRate}/hour</Label>
                  <Slider
                    value={[hourlyRate]}
                    onValueChange={([v]) => setHourlyRate(v)}
                    min={20}
                    max={100}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Implementation Cost: {formatCurrency(implementationCost)}</Label>
                  <Slider
                    value={[implementationCost]}
                    onValueChange={([v]) => setImplementationCost(v)}
                    min={500000}
                    max={3000000}
                    step={100000}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Error Cost: ${errorCostPerIncident}/incident</Label>
                  <Slider
                    value={[errorCostPerIncident]}
                    onValueChange={([v]) => setErrorCostPerIncident(v)}
                    min={100}
                    max={2000}
                    step={100}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Time Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">{metrics.timeReduction}%</div>
                <p className="text-xs text-gray-600 mt-1">
                  {formatTime(metrics.totalManualMinutes)} → {formatTime(metrics.totalAIMinutes)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Annual Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">{formatCurrency(metrics.annualSavings)}</div>
                <p className="text-xs text-gray-600 mt-1">{formatCurrency(metrics.monthlySavings)}/month</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">ROI (3-Year)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">{metrics.roi}%</div>
                <p className="text-xs text-gray-600 mt-1">Payback: {metrics.paybackMonths} months</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Cost per Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-700">{formatCurrency(metrics.savingsPerTransaction)}</div>
                <p className="text-xs text-gray-600 mt-1">saved per application</p>
              </CardContent>
            </Card>
          </div>

          {/* Process Clusters - Level 1 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Process Workflow</h2>
            <div className="grid grid-cols-1 gap-4">
              {currentClusters.map((cluster, index) => {
                const clusterMetrics = calculateClusterMetrics(cluster);
                const isExpanded = expandedCluster === cluster.id;

                return (
                  <Card 
                    key={cluster.id}
                    className={`transition-all cursor-pointer hover:shadow-md ${
                      isExpanded ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setExpandedCluster(isExpanded ? null : cluster.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{cluster.title}</CardTitle>
                              <Badge className={`text-xs ${getComplexityColor(cluster.complexity)}`}>
                                {cluster.complexity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{cluster.description}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1 shrink-0 ml-4">
                          <div className="text-2xl font-bold text-gray-900">{clusterMetrics.timeReduction}%</div>
                          <div className="text-xs text-gray-500">time reduction</div>
                          <div className="text-xs text-gray-600">
                            {formatTime(clusterMetrics.totalManualTime)} → {formatTime(clusterMetrics.totalAITime)}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400 ml-2 shrink-0" />
                        )}
                      </div>
                    </CardHeader>

                    {/* Level 2: Steps */}
                    {isExpanded && (
                      <CardContent className="pt-0 space-y-3">
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Process Steps ({cluster.steps.length})</h4>
                          <div className="space-y-2">
                            {cluster.steps.map((step, stepIndex) => {
                              const stepKey = `${cluster.id}-${stepIndex}`;
                              const isStepExpanded = expandedStep === stepKey;
                              const stepReduction = ((step.manualTime - step.aiTime) / step.manualTime * 100).toFixed(0);

                              return (
                                <div 
                                  key={stepIndex}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    isStepExpanded ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedStep(isStepExpanded ? null : stepKey);
                                  }}
                                >
                                  <div className="flex items-start justify-between cursor-pointer">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-gray-900">{step.title}</span>
                                        <span className="text-xs text-green-700 font-semibold">{stepReduction}% faster</span>
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
                                      <div className="text-sm font-bold text-gray-900">
                                        {step.manualTime}m → {step.aiTime}m
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {step.accuracy.manual}% → {step.accuracy.ai}%
                                      </div>
                                    </div>
                                  </div>

                                  {/* Level 3: KPIs */}
                                  {isStepExpanded && (
                                    <div className="mt-3 pt-3 border-t border-gray-300">
                                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Key Performance Indicators</h5>
                                      <div className="grid grid-cols-2 gap-2">
                                        {step.kpis.map((kpi, kpiIndex) => (
                                          <div key={kpiIndex} className="p-2 rounded bg-white border border-gray-200">
                                            <div className="text-xs font-medium text-gray-700 mb-1">{kpi.name}</div>
                                            <div className="flex items-center justify-between">
                                              <div className="text-xs text-gray-600">
                                                {kpi.manualValue} → {kpi.aiValue}
                                              </div>
                                              <div className="text-xs font-semibold text-green-700">
                                                {kpi.improvement}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Total Portfolio ROI */}
        <TabsContent value="total">
          <Card>
            <CardHeader>
              <CardTitle>Total Portfolio ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Coming soon - Full portfolio calculator with all use cases</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


