'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Filter, TrendingUp, Target, Package, Building2, ChevronDown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useMasterData } from '@/hooks/use-master-data';
import { CommercialClusterManager } from '@/components/commercial-cluster-manager';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScenario } from '@/contexts/scenario-context';
import { ScenarioToggle } from '@/components/scenario-toggle';
import { 
  determineCostModel, 
  getDefaultLicenseCost, 
  getDefaultLicenseCount, 
  getDefaultACRSpend,
  calculateUseCaseInvestment,
  getImplementationCostBucket 
} from '@/lib/csv-parser';

// NEW use cases: All Collections + 10 recently added Loan Operations
const newUseCaseNames = new Set([
  // Collections (8 use cases)
  'AI Predictive Collections Segmentation',
  'AI Collections Outreach Orchestration',
  'AI Dynamic Payment Plan Optimizer',
  'AI Collections Sentiment & Compliance Monitor',
  'AI Collections Performance Analytics',
  'AI Fraud Detection in Collections',
  'AI Conversational Collections Assistant',
  'AI Early Warning & Proactive Collections',
  // Recently added Loan Operations (10 use cases)
  'AI Alternative Credit Scoring Engine',
  'Real-Time Loan Decision Engine',
  'AI Loan Application Fraud Detection',
  'Autonomous Pre-Approval & Instant Offers',
  'AI Loan Portfolio Risk Optimizer',
  'Personalized Loan Product Recommender',
  'AI Dynamic Interest Rate & Pricing Engine',
  'AI Loan Servicing & Lifecycle Automation',
  'Cross-Sell Intelligence for Loan Products',
  'AI Loan Assistant & Onboarding Copilot'
]);

// Value sizes for ROI calculations
const VALUE_SIZES = {
  Small: 50_000_000,
  Medium: 75_000_000,
  Large: 250_000_000,
};

// Forrester Research Baseline ROI %
const FORRESTER_ROI_BASELINES = {
  "M365 Copilot": 282,
  "GitHub Copilot": 350,
  "Document Intelligence": 450,
  "Azure OpenAI": 300,
  "Customer Experience AI": 320,
  "Risk & Compliance AI": 420,
  "Automation": 380,
};

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export default function MicrosoftDashboard() {
  const { useCases, isLoading, updateUseCase } = useMasterData();
  const { getAdjustedROI, scenarioLabel } = useScenario();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({});
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({});

  const handleCategoryClick = (category: string) => {
    const isCurrentlySelected = selectedCategory === category;
    setSelectedCategory(isCurrentlySelected ? null : category);
    
    // Scroll to expanded section after a short delay
    if (!isCurrentlySelected) {
      setTimeout(() => {
        const expandedSection = document.getElementById('expanded-use-cases');
        if (expandedSection) {
          expandedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleUpdateCluster = async (useCaseId: string, cluster: string) => {
    try {
      await updateUseCase(useCaseId, { 
        commercialCluster: cluster === 'unassigned' ? undefined : cluster 
      });
    } catch (error) {
      console.error('Failed to update cluster:', error);
    }
  };

  const handleUpdateValueSize = async (useCaseId: string, valueSize: 'Small' | 'Medium' | 'Large') => {
    try {
      await updateUseCase(useCaseId, { clusterValueSize: valueSize });
    } catch (error) {
      console.error('Failed to update value size:', error);
    }
  };

  const handleUpdateROI = async (useCaseId: string, roi: number) => {
    try {
      await updateUseCase(useCaseId, { roi });
    } catch (error) {
      console.error('Failed to update ROI:', error);
    }
  };

  // Calculate KPIs from master data
  const totalUseCases = useCases.length;
  const uniqueDepartments = new Set(useCases.flatMap(uc => uc.departments)).size;
  const uniqueProducts = new Set(useCases.flatMap(uc => uc.microsoftProducts)).size;
  
  // Group by category
  const groupedByCategory = useCases.reduce((acc, uc) => {
    const group = uc.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(uc);
    return acc;
  }, {} as Record<string, typeof useCases>);

  // Get available commercial clusters
  const availableClusters = Array.from(new Set(
    useCases
      .map(uc => uc.commercialCluster)
      .filter((cluster): cluster is string => !!cluster)
  )).sort();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CIMB Microsoft Partnership</h1>
          <p className="text-muted-foreground">AI Value Map - Track initiatives, dependencies, and value creation</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden gap-1 sm:flex">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Scenario Toggle */}
      <ScenarioToggle />

      {/* KPI Cards from Master Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-red-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Use Cases</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalUseCases}</div>
            <p className="text-xs text-muted-foreground">From master data</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : uniqueDepartments}</div>
            <p className="text-xs text-muted-foreground">Cross-functional teams</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Microsoft Products</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : uniqueProducts}</div>
            <p className="text-xs text-muted-foreground">Technology solutions</p>
              </CardContent>
            </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM 85M+</div>
            <p className="text-xs text-muted-foreground">Annual ROI</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="categories">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="clusters">Commercial Clusters</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading use cases...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Summary Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(groupedByCategory)
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([category, categoryUseCases]) => {
                    const uniqueDepts = new Set(categoryUseCases.flatMap(uc => uc.departments));
                    const topDepts = Array.from(uniqueDepts).slice(0, 3);
                    const totalKpis = new Set(categoryUseCases.flatMap(uc => uc.kpis)).size;
                    const totalProducts = new Set(categoryUseCases.flatMap(uc => uc.microsoftProducts)).size;
                    const totalSystems = new Set(categoryUseCases.flatMap(uc => uc.prerequisites || [])).size;
                    const topSystems = Array.from(new Set(categoryUseCases.flatMap(uc => uc.prerequisites || []))).slice(0, 2);
                    const isSelected = selectedCategory === category;
                    
                    // Calculate aggregate ROI for this category
                    let totalInvestment = 0;
                    let totalReturn = 0;
                    let weightedROI = 0;
                    
                    categoryUseCases.forEach(uc => {
                      const investment = calculateUseCaseInvestment(uc);
                      const baseROI = uc.roi || 300;
                      const roi = getAdjustedROI(baseROI);
                      const returnValue = investment * (roi / 100);
                      
                      totalInvestment += investment;
                      totalReturn += returnValue;
                    });
                    
                    // Weighted ROI = Total Return / Total Investment × 100
                    weightedROI = totalInvestment > 0 ? ((totalReturn / totalInvestment) - 1) * 100 : 0;
                    const netProfit = totalReturn - totalInvestment;
                    
                    // Determine appropriate terminology based on category type
                    const getValueLabel = (cat: string) => {
                      const lower = cat.toLowerCase();
                      
                      // Productivity tools → Cost Savings
                      if (lower.includes('everyday ai productivity')) return 'Cost Savings';
                      
                      // Risk & Security → Risk Mitigation Value
                      if (lower.includes('risk intelligence')) return 'Risk Mitigation Value';
                      
                      // Compliance & Audit → Compliance Value
                      if (lower.includes('compliance') || lower.includes('audit')) return 'Compliance Value';
                      
                      // Customer-facing → Business Value (revenue + CX)
                      if (lower.includes('direct to customer') || lower.includes('self-service banking')) return 'Business Value';
                      
                      // Marketing/Campaign → Revenue Impact
                      if (lower.includes('campaign') || lower.includes('precision')) return 'Revenue Impact';
                      
                      // RM Tools → Revenue Enablement
                      if (lower.includes('rm') || lower.includes('relationship manager')) return 'Revenue Enablement';
                      
                      // Loan Operations → Process Efficiency Value
                      if (lower.includes('loan operations')) return 'Process Efficiency Value';
                      
                      // Finance & Procurement → Operational Value
                      if (lower.includes('finance') || lower.includes('procurement') || lower.includes('autonomous finance')) return 'Operational Value';
                      
                      // In-flight/ITPL → Delivery Value
                      if (lower.includes('in-flight') || lower.includes('itpl')) return 'Delivery Value';
                      
                      // Default
                      return 'Economic Value';
                    };
                    
                    const valueLabel = getValueLabel(category);

                    return (
                      <Card 
                        key={category} 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          isSelected ? 'border-2 border-red-600 shadow-lg' : 'border-2 border-gray-200'
                        }`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <CardHeader className="pb-5">
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
                              {category}
                            </CardTitle>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-base px-3 py-1.5 shrink-0 font-semibold">
                              {categoryUseCases.length}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Aggregate ROI Summary - Prominent Display */}
                          <div className="mb-5 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <TrendingUp className="h-6 w-6 text-purple-700" />
                                <span className="text-base font-bold text-purple-900">Weighted ROI</span>
                              </div>
                              <span className="text-5xl font-bold text-purple-700">
                                {Math.round(weightedROI)}%
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center p-3 bg-white rounded-lg border-2 border-gray-300 shadow-sm">
                                <div className="font-bold text-base text-gray-900">{formatCurrency(totalInvestment)}</div>
                                <div className="text-xs text-gray-600 mt-1.5 font-medium">Investment</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg border-2 border-green-300 shadow-sm">
                                <div className="font-bold text-base text-green-700">{formatCurrency(totalReturn)}</div>
                                <div className="text-xs text-gray-600 mt-1.5 font-medium">Economic Benefits</div>
                              </div>
                              <div className="text-center p-3 bg-white rounded-lg border-2 border-purple-300 shadow-sm">
                                <div className="font-bold text-base text-purple-700">{formatCurrency(netProfit)}</div>
                                <div className="text-xs text-gray-600 mt-1.5 font-medium">{valueLabel}</div>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-4 gap-3 text-center">
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <div className="text-2xl font-bold text-blue-700">{uniqueDepts.size}</div>
                              <div className="text-sm text-blue-600 mt-1">Depts</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                              <div className="text-2xl font-bold text-purple-700">{totalSystems}</div>
                              <div className="text-sm text-purple-600 mt-1">Systems</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <div className="text-2xl font-bold text-green-700">{totalKpis}</div>
                              <div className="text-sm text-green-600 mt-1">KPIs</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                              <div className="text-2xl font-bold text-orange-700">{totalProducts}</div>
                              <div className="text-sm text-orange-600 mt-1">Products</div>
                            </div>
                          </div>

                          {/* Top Departments Preview */}
                          {topDepts.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-gray-800 mb-2">Key Departments</p>
                              <div className="flex flex-wrap gap-2">
                                {(expandedDepts[category] ? Array.from(uniqueDepts) : topDepts).map((dept, idx) => (
                                  <span key={idx} className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-medium">
                                    {dept.length > 25 ? dept.substring(0, 25) + '...' : dept}
                                  </span>
                                ))}
                                {uniqueDepts.size > 3 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedDepts({...expandedDepts, [category]: !expandedDepts[category]});
                                    }}
                                    className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded cursor-pointer transition-colors"
                                  >
                                    {expandedDepts[category] ? (
                                      <>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                        Show less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        +{uniqueDepts.size - 3} more
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Top Systems Preview */}
                          {topSystems.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold text-gray-800 mb-2">Key Systems</p>
                              <div className="space-y-2">
                                {(expandedSystems[category] 
                                  ? Array.from(new Set(categoryUseCases.flatMap(uc => uc.prerequisites || [])))
                                  : topSystems
                                ).map((system, idx) => (
                                  <div key={idx} className="flex items-start gap-2">
                                    <span className="text-purple-600 text-sm mt-0.5">•</span>
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                      {system}
                                    </span>
                                  </div>
                                ))}
                                {totalSystems > 2 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedSystems({...expandedSystems, [category]: !expandedSystems[category]});
                                    }}
                                    className="flex items-center gap-1 text-sm text-purple-600 font-bold hover:text-purple-800 hover:bg-purple-50 px-2 py-1 rounded cursor-pointer transition-colors ml-4"
                                  >
                                    {expandedSystems[category] ? (
                                      <>
                                        <ChevronDown className="h-3.5 w-3.5" />
                                        Show less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                        +{totalSystems - 2} more
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="pt-4 text-center border-t-2 border-gray-300 mt-4">
                            <p className="text-sm text-gray-700 font-semibold">
                              {isSelected ? 'Click to collapse' : 'Click to view use cases'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>

              {/* Expanded Use Cases View */}
              {selectedCategory && (
                <div className="bg-gradient-to-r from-red-50 via-gray-50 to-red-50 p-1 rounded-lg">
                  <Card id="expanded-use-cases" className="border-0 scroll-mt-6 bg-gray-50">
                    <CardHeader className="pb-3 bg-gray-100 border-b-2 border-red-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {selectedCategory} - Detailed Breakdown
                          </CardTitle>
                          <CardDescription className="text-sm font-medium text-gray-700">
                            Showing all {groupedByCategory[selectedCategory].length} use cases with full details below
                          </CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className="bg-white hover:bg-gray-100"
                        >
                          Collapse
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-4">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedByCategory[selectedCategory].map((useCase) => (
                                <Card key={useCase.id} className="bg-white border-2 border-gray-300 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 flex-wrap flex-1">
                                      <CardTitle className="text-sm font-semibold text-gray-900 leading-tight">
                                        {useCase.useCase}
                                      </CardTitle>
                                      {newUseCaseNames.has(useCase.useCase) && (
                                        <span className="inline-flex items-center px-3 py-0.5 rounded-md text-[9px] font-bold bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-800 border-2 border-amber-500 shrink-0 ml-1">
                                          New
                                        </span>
                                      )}
                                    </div>
                                    {useCase.commercialCluster && (
                                      <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700 shrink-0">
                                        {useCase.commercialCluster}
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
                                          onValueChange={(value) => handleUpdateCluster(useCase.id, value)}
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
                                            ).map((cluster) => (
                                              <SelectItem key={cluster} value={cluster}>
                                                {cluster}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div>
                                        <label className="text-xs text-gray-600 block mb-1">Commercial Offer</label>
                                        <Select 
                                          value={useCase.clusterValueSize || ''} 
                                          onValueChange={(value) => handleUpdateValueSize(useCase.id, value as any)}
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
                                      <div className="mt-3 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg">
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
                                                    if (!isNaN(val)) updateUseCase(useCase.id, { licenseCount: val });
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
                                                    if (!isNaN(val)) updateUseCase(useCase.id, { licenseCostPerUser: val });
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
                                                  if (!isNaN(val)) updateUseCase(useCase.id, { acrMonthlySpend: val });
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
                                                onValueChange={(value) => handleUpdateROI(useCase.id, value[0])}
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
                                                  if (!isNaN(val)) handleUpdateROI(useCase.id, val);
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
                                        <span className="text-sm font-bold text-purple-900">
                                          {(() => {
                                            const cat = useCase.group.toLowerCase();
                                            if (cat.includes('everyday ai productivity')) return 'Cost Savings:';
                                            if (cat.includes('risk intelligence')) return 'Risk Mitigation Value:';
                                            if (cat.includes('compliance') || cat.includes('audit')) return 'Compliance Value:';
                                            if (cat.includes('direct to customer') || cat.includes('self-service')) return 'Business Value:';
                                            if (cat.includes('campaign') || cat.includes('precision')) return 'Revenue Impact:';
                                            if (cat.includes('rm') || cat.includes('relationship')) return 'Revenue Enablement:';
                                            if (cat.includes('loan operations')) return 'Process Efficiency Value:';
                                            if (cat.includes('finance') || cat.includes('procurement')) return 'Operational Value:';
                                            if (cat.includes('in-flight') || cat.includes('itpl')) return 'Delivery Value:';
                                            return 'Economic Value:';
                                          })()}
                                        </span>
                                        <span className="font-bold text-xl text-purple-700">
                                          {formatCurrency(netProfit)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-purple-600 mt-1">
                                        {(() => {
                                          const cat = useCase.group.toLowerCase();
                                          if (cat.includes('everyday ai productivity')) return 'Labor cost reduction + time savings';
                                          if (cat.includes('risk intelligence')) return 'Fraud prevention + risk reduction';
                                          if (cat.includes('compliance') || cat.includes('audit')) return 'Regulatory compliance + fine avoidance';
                                          if (cat.includes('direct to customer') || cat.includes('self-service')) return 'Revenue growth + service cost reduction';
                                          if (cat.includes('campaign') || cat.includes('precision')) return 'Campaign revenue + marketing efficiency';
                                          if (cat.includes('rm') || cat.includes('relationship')) return 'Sales effectiveness + revenue growth';
                                          if (cat.includes('loan operations')) return 'Process automation + cycle time reduction';
                                          if (cat.includes('finance') || cat.includes('procurement')) return 'Finance efficiency + cost control';
                                          if (cat.includes('in-flight') || cat.includes('itpl')) return 'Implementation efficiency + time to value';
                                          return 'Total economic benefits over 3 years';
                                        })()}
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
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="clusters" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading commercial clusters...</p>
              </div>
            </div>
          ) : (
            <CommercialClusterManager 
              useCases={useCases}
              onUpdateCluster={handleUpdateCluster}
              onUpdateValueSize={handleUpdateValueSize}
              onUpdateROI={handleUpdateROI}
              onUpdateUseCase={updateUseCase}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
