'use client';

import { UseCaseRecord } from '@/lib/csv-parser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Building2, Target, Package, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useScenario } from '@/contexts/scenario-context';
import { 
  determineCostModel, 
  getDefaultLicenseCost, 
  getDefaultLicenseCount, 
  getDefaultACRSpend,
  calculateUseCaseInvestment,
  getImplementationCostBucket 
} from '@/lib/csv-parser';

interface CommercialClusterManagerProps {
  useCases: UseCaseRecord[];
  onUpdateCluster?: (useCaseId: string, cluster: string) => void;
  onUpdateValueSize?: (useCaseId: string, valueSize: 'Small' | 'Medium' | 'Large') => void;
  onUpdateROI?: (useCaseId: string, roi: number) => void;
  onUpdateUseCase?: (useCaseId: string, updates: Partial<UseCaseRecord>) => void;
}

interface ClusterMetrics {
  name: string;
  useCases: UseCaseRecord[];
  totalUseCases: number;
  departments: string[];
  kpis: string[];
  microsoftProducts: string[];
  totalValue: number; // in USD
  valueSizes: {
    small: number;
    medium: number;
    large: number;
  };
  averageROI: number; // average ROI across use cases
  totalROI: number; // weighted ROI
}

const VALUE_SIZES = {
  Small: 50_000_000, // 50M USD
  Medium: 75_000_000, // 75M USD
  Large: 250_000_000, // 250M USD
};

// Forrester Research Baseline ROI % (from TEI studies)
const FORRESTER_ROI_BASELINES = {
  "M365 Copilot": 282,           // Forrester TEI: Microsoft 365 Copilot (2024)
  "GitHub Copilot": 350,          // Forrester TEI: GitHub Copilot (2023)
  "Document Intelligence": 450,   // Microsoft AI Impact Studies (2024)
  "Azure OpenAI": 300,           // General Azure AI Services ROI
  "Customer Experience AI": 320,  // Contact Center AI ROI
  "Risk & Compliance AI": 420,   // Risk Analytics ROI
  "Automation": 380,             // Process Automation ROI
};

// Helper function to format currency
const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export function CommercialClusterManager({ useCases, onUpdateCluster, onUpdateValueSize, onUpdateROI, onUpdateUseCase }: CommercialClusterManagerProps) {
  const { getAdjustedROI } = useScenario();
  
  // Group use cases by commercial cluster
  const clusterMap = useCases.reduce((acc, useCase) => {
    const cluster = useCase.commercialCluster || 'Unassigned';
    if (!acc[cluster]) {
      acc[cluster] = [];
    }
    acc[cluster].push(useCase);
    return acc;
  }, {} as Record<string, UseCaseRecord[]>);

  // Calculate metrics for each cluster
  const clusterMetrics: ClusterMetrics[] = Object.entries(clusterMap).map(([name, cases]) => {
    const allDepartments = new Set<string>();
    const allKpis = new Set<string>();
    const allProducts = new Set<string>();
    const valueSizes = { small: 0, medium: 0, large: 0 };

    cases.forEach(uc => {
      uc.departments.forEach(d => allDepartments.add(d));
      uc.kpis.forEach(k => allKpis.add(k));
      uc.microsoftProducts.forEach(p => allProducts.add(p));
      
      // Count use cases by tier (not value calculation)
      if (uc.clusterValueSize) {
        if (uc.clusterValueSize === 'Small') valueSizes.small++;
        if (uc.clusterValueSize === 'Medium') valueSizes.medium++;
        if (uc.clusterValueSize === 'Large') valueSizes.large++;
      }
    });

    // Calculate cluster value based on highest tier (cumulative model)
    // If there are Large tier use cases, entire cluster is Large value
    // If only Medium tier use cases, cluster is Medium value
    // If only Small tier use cases, cluster is Small value
    let totalValue = 0;
    if (valueSizes.large > 0) {
      totalValue = VALUE_SIZES.Large; // $120M includes all tiers
    } else if (valueSizes.medium > 0) {
      totalValue = VALUE_SIZES.Medium; // $75M includes Small + Medium
    } else if (valueSizes.small > 0) {
      totalValue = VALUE_SIZES.Small; // $50M base
    }

    // Calculate ROI metrics
    const useCasesWithROI = cases.filter(uc => uc.roi && uc.roi > 0);
    const averageROI = useCasesWithROI.length > 0
      ? useCasesWithROI.reduce((sum, uc) => sum + getAdjustedROI(uc.roi || 0), 0) / useCasesWithROI.length
      : 0;
    
    // Weighted ROI based on cluster value
    const totalROI = totalValue > 0 ? (averageROI / 100) * totalValue : 0;

    return {
      name,
      useCases: cases,
      totalUseCases: cases.length,
      departments: Array.from(allDepartments).sort(),
      kpis: Array.from(allKpis).sort(),
      microsoftProducts: Array.from(allProducts).sort(),
      totalValue,
      valueSizes,
      averageROI,
      totalROI,
    };
  }).sort((a, b) => {
    // Sort unassigned last, then by value
    if (a.name === 'Unassigned') return 1;
    if (b.name === 'Unassigned') return -1;
    return b.totalValue - a.totalValue;
  });

  // Get all available clusters for the modal
  const availableClusters = clusterMetrics
    .filter(cm => cm.name !== 'Unassigned')
    .map(cm => cm.name);

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Commercial Clusters</h2>
        <p className="text-sm text-gray-500">
          Organize and analyze use cases by commercial offering clusters
        </p>
      </div>

      {/* Summary Statistics */}
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Cluster Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">
                {clusterMetrics.filter(c => c.name !== 'Unassigned').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Active Clusters</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-700">
                {clusterMetrics
                  .filter(c => c.name !== 'Unassigned')
                  .reduce((sum, c) => sum + c.totalUseCases, 0)}
              </div>
              <div className="text-sm text-blue-600 mt-1">Assigned Use Cases</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(
                  clusterMetrics
                    .filter(c => c.name !== 'Unassigned')
                    .reduce((sum, c) => sum + c.totalValue, 0)
                )}
              </div>
              <div className="text-sm text-green-600 mt-1">Total Value</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-700">
                {(() => {
                  const assignedClusters = clusterMetrics.filter(c => c.name !== 'Unassigned');
                  const avgROI = assignedClusters.length > 0
                    ? assignedClusters.reduce((sum, c) => sum + c.averageROI, 0) / assignedClusters.length
                    : 0;
                  return `${Math.round(avgROI)}%`;
                })()}
              </div>
              <div className="text-sm text-purple-600 mt-1">Average ROI</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-600">
                {clusterMap['Unassigned']?.length || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Unassigned</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round(
                  (clusterMetrics
                    .filter(c => c.name !== 'Unassigned')
                    .reduce((sum, c) => sum + c.totalUseCases, 0) / 
                    useCases.length) * 100
                )}%
              </div>
              <div className="text-sm text-blue-600 mt-1">Assignment Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cluster Details */}
      <div className="space-y-3">
        {clusterMetrics.map((cluster) => (
          <Card 
            key={cluster.name}
            className={`border-l-4 ${
              cluster.name === 'Unassigned' 
                ? 'border-l-gray-400' 
                : 'border-l-green-600'
            }`}
          >
            <Accordion type="single" collapsible>
              <AccordionItem value={cluster.name} className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{cluster.name}</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {cluster.totalUseCases} use cases
                      </Badge>
                      {cluster.totalValue > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {formatCurrency(cluster.totalValue)}
                        </Badge>
                      )}
                      {cluster.averageROI > 0 && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {Math.round(cluster.averageROI)}% ROI
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  {/* Cluster Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-700">{cluster.departments.length}</div>
                      <div className="text-xs text-blue-600">Departments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-700">{cluster.kpis.length}</div>
                      <div className="text-xs text-gray-600">KPIs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-700">{cluster.microsoftProducts.length}</div>
                      <div className="text-xs text-purple-600">Products</div>
                    </div>
                  </div>

                  {/* Value Breakdown */}
                  {(cluster.valueSizes.small > 0 || cluster.valueSizes.medium > 0 || cluster.valueSizes.large > 0) && (
                    <div className="bg-green-50 rounded p-3 mb-4">
                      <div className="text-xs font-medium text-green-800 mb-2">Value Breakdown</div>
                      <div className="flex gap-4 text-xs">
                        {cluster.valueSizes.small > 0 && (
                          <span className="text-green-700">{cluster.valueSizes.small} × Small ($50M) = ${cluster.valueSizes.small * 50}M</span>
                        )}
                        {cluster.valueSizes.medium > 0 && (
                          <span className="text-green-700">{cluster.valueSizes.medium} × Medium ($75M) = ${cluster.valueSizes.medium * 75}M</span>
                        )}
                        {cluster.valueSizes.large > 0 && (
                          <span className="text-green-700">{cluster.valueSizes.large} × Large ($120M) = ${cluster.valueSizes.large * 120}M</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Use Cases List */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cluster.useCases.map((useCase) => (
                      <Card key={useCase.id} className="bg-white hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-sm font-semibold text-gray-900 leading-tight">
                              {useCase.useCase}
                            </CardTitle>
                            {useCase.clusterValueSize && (
                              <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700 shrink-0">
                                {useCase.clusterValueSize}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-xs">
                            {useCase.subCategory}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          {/* Critical KPIs */}
                          {useCase.kpis.length > 0 && (
                            <div className="bg-green-50 rounded p-2">
                              <p className="text-xs font-semibold text-green-800 mb-1.5">Critical KPIs</p>
                              <div className="space-y-1">
                                {useCase.kpis.slice(0, 2).map((kpi, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5">
                                    <span className="text-green-600 text-xs mt-0.5">•</span>
                                    <span className="text-xs text-gray-700 leading-tight">{kpi}</span>
                                  </div>
                                ))}
                                {useCase.kpis.length > 2 && (
                                  <details>
                                    <summary className="text-xs text-green-600 font-medium hover:text-green-700 underline cursor-pointer">
                                      +{useCase.kpis.length - 2} more (click)
                                    </summary>
                                    <div className="space-y-1 mt-1">
                                      {useCase.kpis.slice(2).map((kpi, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5">
                                          <span className="text-green-600 text-xs mt-0.5">•</span>
                                          <span className="text-xs text-gray-700 leading-tight">{kpi}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </details>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Departments */}
                          {useCase.departments.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                Departments
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {useCase.departments.slice(0, 3).map((dept, idx) => (
                                  <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                    {dept.length > 20 ? dept.substring(0, 20) + '...' : dept}
                                  </span>
                                ))}
                                {useCase.departments.length > 3 && (
                                  <details className="inline">
                                    <summary className="text-xs text-blue-600 font-medium hover:text-blue-700 underline cursor-pointer">
                                      +{useCase.departments.length - 3} more (click)
                                    </summary>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {useCase.departments.slice(3).map((dept, idx) => (
                                        <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                          {dept.length > 20 ? dept.substring(0, 20) + '...' : dept}
                                        </span>
                                      ))}
                                    </div>
                                  </details>
                                )}
                              </div>
                            </div>
                          )}

                          {/* System Prerequisites */}
                          {useCase.prerequisites && useCase.prerequisites.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                Prerequisites
                              </p>
                              <div className="space-y-1">
                                {useCase.prerequisites.slice(0, 2).map((prereq, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5">
                                    <span className="text-purple-600 text-xs mt-0.5">•</span>
                                    <span className="text-xs text-gray-600 leading-tight line-clamp-2">{prereq}</span>
                                  </div>
                                ))}
                                {useCase.prerequisites.length > 2 && (
                                  <details>
                                    <summary className="text-xs text-purple-600 font-medium hover:text-purple-700 underline cursor-pointer">
                                      +{useCase.prerequisites.length - 2} more (click)
                                    </summary>
                                    <div className="space-y-1 mt-1">
                                      {useCase.prerequisites.slice(2).map((prereq, idx) => (
                                        <div key={idx} className="flex items-start gap-1.5">
                                          <span className="text-purple-600 text-xs mt-0.5">•</span>
                                          <span className="text-xs text-gray-600 leading-tight">{prereq}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </details>
                                )}
                              </div>
                            </div>
                          )}

                          <Separator className="bg-gray-200" />

                          {/* Commercial Cluster Assignment */}
                          <div className="space-y-2 bg-gray-50 rounded p-2">
                            <p className="text-xs font-semibold text-gray-800">Commercial Cluster Assignment</p>
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-gray-600 block mb-1">Cluster</label>
                                <Select 
                                  value={useCase.commercialCluster || 'unassigned'} 
                                  onValueChange={(value) => onUpdateCluster && onUpdateCluster(useCase.id, value)}
                                >
                                  <SelectTrigger className="h-8 text-xs border-gray-300 w-full bg-white">
                                    <SelectValue placeholder="Select cluster..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    <SelectItem value="Enterprise Productivity Suite">Enterprise Productivity Suite</SelectItem>
                                    <SelectItem value="Document Intelligence Suite">Document Intelligence Suite</SelectItem>
                                    <SelectItem value="Developer & Security Tools">Developer & Security Tools</SelectItem>
                                    <SelectItem value="Customer Experience Platform">Customer Experience Platform</SelectItem>
                                    <SelectItem value="Risk & Compliance Hub">Risk & Compliance Hub</SelectItem>
                                    <SelectItem value="Business Operations Suite">Business Operations Suite</SelectItem>
                                    {availableClusters.filter(c => 
                                      !['Enterprise Productivity Suite', 'Document Intelligence Suite', 'Developer & Security Tools', 
                                        'Customer Experience Platform', 'Risk & Compliance Hub', 'Business Operations Suite'].includes(c)
                                    ).map((c) => (
                                      <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <label className="text-xs text-gray-600 block mb-1">Commercial Offer</label>
                                <Select 
                                  value={useCase.clusterValueSize || ''} 
                                  onValueChange={(value) => onUpdateValueSize && onUpdateValueSize(useCase.id, value as any)}
                                >
                                  <SelectTrigger className="h-8 text-xs border-gray-300 w-full bg-white">
                                    <SelectValue placeholder="Select offer..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Small">Small - $50M: Base offering</SelectItem>
                                    <SelectItem value="Medium">Medium - $75M: Small + additional features</SelectItem>
                                    <SelectItem value="Large">Large - $250M: Medium + premium features</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* ROI Configuration & Display */}
                          {(() => {
                            const costModel = useCase.costModel || determineCostModel(useCase.microsoftProducts);
                            const licenseCount = useCase.licenseCount || getDefaultLicenseCount(useCase.departments, useCase.useCase);
                            const licenseCost = useCase.licenseCostPerUser || getDefaultLicenseCost(useCase.microsoftProducts);
                            const acrSpend = useCase.acrMonthlySpend || getDefaultACRSpend(useCase.microsoftProducts, useCase.useCase);
                            const investment = calculateUseCaseInvestment(useCase);
                            const baseROI = useCase.roi || 300;
                            const roi = getAdjustedROI(baseROI);
                            const returnValue = investment * (roi / 100);
                            const netProfit = returnValue - investment;
                            
                            // Calculate benefit breakdown (based on Forrester methodology)
                            const laborSavings = returnValue * 0.40; // 40% of benefits
                            const productivityGains = returnValue * 0.30; // 30% of benefits
                            const errorReduction = returnValue * 0.20; // 20% of benefits
                            const riskCompliance = returnValue * 0.10; // 10% of benefits
                            
                            // Get implementation cost bucket
                            const implBucket = getImplementationCostBucket(useCase);

                            return (
                              <div className="mt-2 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                  <TrendingUp className="h-4 w-4 text-purple-700" />
                                  <span className="text-sm font-bold text-purple-900">Return on Investment (ROI)</span>
                                  <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">
                                    {costModel}
                                  </Badge>
                                </div>
                                
                                {/* Cost Model Controls */}
                                <div className="mb-3 space-y-2 p-3 bg-white rounded border border-gray-200">
                                  <p className="text-xs font-semibold text-gray-700 mb-2">💵 Cost Configuration (3-year TCO)</p>
                                  
                                  {(costModel === 'License' || costModel === 'Hybrid') && (
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Licenses</label>
                                        <Input
                                          type="number"
                                          value={licenseCount}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val) && onUpdateUseCase) onUpdateUseCase(useCase.id, { licenseCount: val });
                                          }}
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">$/user/month</label>
                                        <Input
                                          type="number"
                                          value={licenseCost}
                                          onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            if (!isNaN(val) && onUpdateUseCase) onUpdateUseCase(useCase.id, { licenseCostPerUser: val });
                                          }}
                                          className="h-7 text-xs"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {(costModel === 'ACR' || costModel === 'Hybrid') && (
                                    <div>
                                      <label className="text-xs text-gray-600 block mb-1">ACR Monthly Spend ($)</label>
                                      <Input
                                        type="number"
                                        value={acrSpend}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value);
                                          if (!isNaN(val) && onUpdateUseCase) onUpdateUseCase(useCase.id, { acrMonthlySpend: val });
                                        }}
                                        className="h-7 text-xs"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Current ROI Display */}
                                <div className="mb-3 p-3 bg-white rounded border border-purple-100">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Current ROI</span>
                                    <span className="text-2xl font-bold text-purple-700">{roi}%</span>
                                  </div>
                                </div>

                                {/* ROI Adjustment Controls */}
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs font-semibold text-gray-700 block mb-2">
                                      Adjust ROI % (Lever)
                                    </label>
                                    <div className="flex items-center gap-3">
                                      <Slider
                                        value={[roi]}
                                        onValueChange={(value) => {
                                          if (onUpdateROI) onUpdateROI(useCase.id, value[0]);
                                        }}
                                        min={50}
                                        max={600}
                                        step={10}
                                        className="flex-1"
                                      />
                                      <Input
                                        type="number"
                                        value={roi}
                                        onChange={(e) => {
                                          const val = parseInt(e.target.value);
                                          if (onUpdateROI && !isNaN(val)) onUpdateROI(useCase.id, val);
                                        }}
                                        className="w-20 h-8 text-sm text-center font-semibold"
                                        min={50}
                                        max={600}
                                      />
                                    </div>
                                  </div>

                                  {/* Forrester Baselines Reference */}
                                  <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
                                    <p className="font-semibold text-blue-900 mb-1">📊 Forrester TEI Baselines:</p>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-blue-800">
                                      <div className="flex justify-between">
                                        <span>M365 Copilot:</span>
                                        <span className="font-semibold">{FORRESTER_ROI_BASELINES["M365 Copilot"]}%</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>GitHub Copilot:</span>
                                        <span className="font-semibold">{FORRESTER_ROI_BASELINES["GitHub Copilot"]}%</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Doc Intelligence:</span>
                                        <span className="font-semibold">{FORRESTER_ROI_BASELINES["Document Intelligence"]}%</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Azure OpenAI:</span>
                                        <span className="font-semibold">{FORRESTER_ROI_BASELINES["Azure OpenAI"]}%</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Total Economic Impact (TEI) - PER USE CASE */}
                                  <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
                                    <p className="font-bold text-sm text-gray-900 mb-3">💰 Total Economic Impact (3-year TEI):</p>
                                    
                                    {/* Investment Section */}
                                    <div className="mb-3 pb-3 border-b border-gray-200">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-gray-700">Investment (Cash Outlay):</span>
                                        <span className="font-bold text-lg text-gray-900">
                                          {formatCurrency(investment)}
                                        </span>
                                      </div>
                                      <div className="space-y-1 text-xs text-gray-600 ml-3">
                                        {(costModel === 'License' || costModel === 'Hybrid') && (
                                          <div className="flex justify-between">
                                            <span>• Licenses: {licenseCount} users × ${licenseCost}/mo × 36mo</span>
                                            <span className="font-semibold">{formatCurrency(licenseCount * licenseCost * 36)}</span>
                                          </div>
                                        )}
                                        {(costModel === 'ACR' || costModel === 'Hybrid') && (
                                          <div className="flex justify-between">
                                            <span>• ACR: ${acrSpend.toLocaleString()}/mo × 36mo</span>
                                            <span className="font-semibold">{formatCurrency(acrSpend * 36)}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Implementation Cost with Tier Badge */}
                                      <div className="mt-3 pt-3 border-t border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-xs font-semibold text-gray-700">Implementation:</span>
                                            <Badge className={`text-[10px] px-1.5 py-0 h-4 ${
                                              implBucket.tier === 'Tier 3' ? 'bg-red-100 text-red-800 border-red-300' :
                                              implBucket.tier === 'Tier 2' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                              'bg-green-100 text-green-800 border-green-300'
                                            }`}>
                                              {implBucket.tier}
                                            </Badge>
                                          </div>
                                          <span className="font-bold text-gray-900">{formatCurrency(implBucket.cost)}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed italic">{implBucket.description}</p>
                                      </div>
                                    </div>

                                    {/* Economic Benefits Section */}
                                    <div className="mb-3 pb-3 border-b border-gray-200">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-green-700">Economic Benefits:</span>
                                        <span className="font-bold text-lg text-green-700">
                                          {formatCurrency(returnValue)}
                                        </span>
                                      </div>
                                      <div className="space-y-1 text-xs text-gray-700 ml-3">
                                        <div className="flex justify-between">
                                          <span>• Labor Cost Savings (40%):</span>
                                          <span className="font-semibold text-green-700">{formatCurrency(laborSavings)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• Productivity Gains (30%):</span>
                                          <span className="font-semibold text-green-700">{formatCurrency(productivityGains)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• Error Reduction (20%):</span>
                                          <span className="font-semibold text-green-700">{formatCurrency(errorReduction)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>• Risk/Compliance (10%):</span>
                                          <span className="font-semibold text-green-700">{formatCurrency(riskCompliance)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Net Economic Value */}
                                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-purple-900">Net Economic Value:</span>
                                        <span className="font-bold text-xl text-purple-700">
                                          {formatCurrency(netProfit)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-purple-600 mt-1">
                                        Benefits minus costs over 3 years
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Methodology Note */}
                                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">📋 Methodology Note:</p>
                                  <p className="text-xs text-blue-800 leading-relaxed">
                                    Economic benefits include: labor cost savings (redeployed FTEs), productivity gains 
                                    (faster processing, more throughput), error reduction (less rework), and risk/compliance 
                                    value. This is economic value created, not cash revenue.
                                  </p>
                                </div>

                                <p className="text-xs text-purple-600 mt-2 italic">
                                  Source: Forrester Total Economic Impact™ Studies (2023-2024)
                                </p>
                              </div>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ))}
      </div>
    </div>
  );
}
