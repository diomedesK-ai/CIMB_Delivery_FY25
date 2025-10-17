'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, Users, Target, DollarSign, Zap } from 'lucide-react';
import { useMasterData } from '@/hooks/use-master-data';
import { UseCaseRecord, calculateUseCaseInvestment, getImplementationCostBucket } from '@/lib/csv-parser';
import { useScenario } from '@/contexts/scenario-context';
import { ScenarioToggle } from '@/components/scenario-toggle';
import { UseCaseDetailDialog } from '@/components/use-case-detail-dialog';
import { calculateUseCaseROI } from '@/lib/roi-calculator';

interface FunctionGroup {
  id: number;
  name: string;
  description: string;
  color: string;
  useCases: UseCaseRecord[];
  weightedROI: number;
  totalInvestment: number;
  totalReturn: number;
  totalValue: number;
  totalImplementationCost: number;
  useCaseCount: number;
}

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

export default function FunctionsPage() {
  const { useCases, loading, updateUseCase } = useMasterData();
  const { getAdjustedROI, scenarioLabel } = useScenario();
  const [functions, setFunctions] = useState<FunctionGroup[]>([]);
  const [selectedFunction, setSelectedFunction] = useState<FunctionGroup | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseRecord | null>(null);
  const [useCaseDialogOpen, setUseCaseDialogOpen] = useState(false);
  const [editingFunctionROI, setEditingFunctionROI] = useState(false);
  const [functionROIInput, setFunctionROIInput] = useState<string>('');
  const [manualROIOverrides, setManualROIOverrides] = useState<{ [functionName: string]: number }>({});

  // Get available clusters from master data
  const availableClusters = useMemo(() => {
    const clusters = new Set<string>([
      'Enterprise Productivity Suite',
      'Document Intelligence Suite',
      'Customer Experience Platform',
      'Risk & Compliance Suite',
      'Advanced Analytics Suite',
      'AI Agent Suite',
      'Business Operations Suite',
      'Developer & Security Tools'
    ]);
    
    useCases.forEach(uc => {
      if (uc.commercialCluster && uc.commercialCluster.trim()) {
        clusters.add(uc.commercialCluster);
      }
    });
    
    return Array.from(clusters).sort();
  }, [useCases]);

  const handleUseCaseClick = (uc: UseCaseRecord) => {
    setSelectedUseCase(uc);
    setUseCaseDialogOpen(true);
  };

  const handleEditFunctionROI = () => {
    if (selectedFunction) {
      setFunctionROIInput(selectedFunction.weightedROI.toString());
      setEditingFunctionROI(true);
    }
  };

  const saveFunctionROI = async () => {
    const newROI = parseInt(functionROIInput);
    if (!isNaN(newROI) && newROI > 0 && selectedFunction) {
      // Store the override
      setManualROIOverrides(prev => ({
        ...prev,
        [selectedFunction.name]: newROI
      }));
      
      // Calculate the scaling factor
      const currentROI = selectedFunction.weightedROI;
      const scalingFactor = newROI / currentROI;
      
      // Propagate to all use cases in this function
      const updatePromises = selectedFunction.useCases.map(async (uc) => {
        const currentUseCaseROI = uc.roi || 300;
        const newUseCaseROI = Math.round(currentUseCaseROI * scalingFactor);
        if (updateUseCase) {
          await updateUseCase(uc.id, { roi: newUseCaseROI });
        }
      });
      
      await Promise.all(updatePromises);
      setEditingFunctionROI(false);
      
      // Force re-calculation by triggering useEffect
      setSelectedFunction(null);
      setTimeout(() => {
        const updatedFunction = functions.find(f => f.name === selectedFunction.name);
        if (updatedFunction) {
          setSelectedFunction(updatedFunction);
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (useCases.length > 0) {
      // Define strategic functions mapping to categories
      // Only include the 9 core strategic functions (0-8), exclude "Other" categories and In-flight
      const functionMapping: { [key: string]: { id: number; name: string; description: string; color: string } } = {
        'Everyday AI Productivity': {
          id: 0,
          name: 'Everyday AI Prod. Toolkit for Staff',
          description: 'Productivity automation tools for daily operations',
          color: 'bg-blue-500'
        },
        'AI Agents Direct to Customer': {
          id: 1,
          name: 'AI-Operated Customer Services',
          description: 'Customer-facing AI agents and chatbots',
          color: 'bg-blue-500'
        },
        'Self‑Service Banking Hub': {
          id: 2,
          name: 'Intelligent Self-Service Banking Hub',
          description: 'Self-service banking for retail, SME, and wholesale',
          color: 'bg-blue-500'
        },
        'AI‑Empowered RMs': {
          id: 3,
          name: 'AI-Empowered Relationship Managers',
          description: 'Sales enablement and RM productivity tools',
          color: 'bg-blue-500'
        },
        'Precision Campaign Automation': {
          id: 4,
          name: 'Precision Campaign Automations',
          description: 'Marketing automation and campaign optimization',
          color: 'bg-blue-500'
        },
        'AI‑Driven Loan Operations': {
          id: 5,
          name: 'AI Loan Banking Operations',
          description: 'Loan processing and underwriting automation',
          color: 'bg-blue-500'
        },
        'AI Risk Intelligence': {
          id: 6,
          name: 'AI Risk Intelligence',
          description: 'Fraud detection, risk modeling, and analytics',
          color: 'bg-blue-500'
        },
        'Autonomous Finance & Procurement': {
          id: 7,
          name: 'Autonomous Finance & Procurement',
          description: 'Finance automation and procurement optimization',
          color: 'bg-blue-500'
        },
        'Smart Compliance & Audit Hub': {
          id: 8,
          name: 'Smart Compliance & Audit Hub',
          description: 'Compliance automation and audit efficiency',
          color: 'bg-blue-500'
        }
      };

      // Group use cases by function
      const grouped = useCases.reduce((acc, uc) => {
        const mapping = functionMapping[uc.group];
        if (!mapping) return acc;

        if (!acc[uc.group]) {
          acc[uc.group] = {
            ...mapping,
            useCases: [],
            weightedROI: 0,
            totalInvestment: 0,
            totalReturn: 0,
            totalValue: 0,
            totalImplementationCost: 0,
            useCaseCount: 0
          };
        }
        acc[uc.group].useCases.push(uc);
        return acc;
      }, {} as { [key: string]: FunctionGroup });

      // Calculate aggregated metrics using TEI methodology
      const functionsArray = Object.values(grouped).map(func => {
        let totalInvestment = 0;
        let totalBenefit = 0;
        let totalImplementationCost = 0;

        func.useCases.forEach(uc => {
          // Use TEI calculator for accurate ROI
          const roiResult = calculateUseCaseROI(uc);
          const implBucket = getImplementationCostBucket(uc);

          totalInvestment += roiResult.investment;
          totalBenefit += roiResult.fiveYearBenefit;
          totalImplementationCost += implBucket.cost;
        });

        // Weighted ROI: (Total Net Benefit / Total Investment) * 100
        const totalNetBenefit = totalBenefit - totalInvestment;
        const weightedROI = totalInvestment > 0 ? (totalNetBenefit / totalInvestment) * 100 : 0;
        const totalValue = totalNetBenefit;

        return {
          ...func,
          weightedROI,
          totalInvestment,
          totalReturn: totalBenefit,
          totalValue,
          totalImplementationCost,
          useCaseCount: func.useCases.length
        };
      });

      // Sort by ID
      functionsArray.sort((a, b) => a.id - b.id);
      setFunctions(functionsArray);
    }
  }, [useCases, getAdjustedROI]);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}k`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading strategic functions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Scenario Toggle */}
        <ScenarioToggle />

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">AI First Banking</h1>
          <p className="text-gray-600 mt-2">
            Strategic view of AI capabilities grouped by function with aggregated ROI and KPIs ({scenarioLabel} Scenario)
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">{functions.length} Functions</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">
                {functions.reduce((sum, f) => sum + f.useCaseCount, 0)} Use Cases
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(functions.reduce((sum, f) => sum + f.totalValue, 0))} Total Value
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">
                {formatCurrency(functions.reduce((sum, f) => sum + f.totalImplementationCost, 0))} Services Cost
              </span>
            </div>
          </div>
        </div>

        {/* Function Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {functions.map((func) => (
            <Card
              key={func.id}
              className="cursor-pointer hover:shadow-xl transition-all border-2 border-gray-200 hover:border-blue-400"
              onClick={() => setSelectedFunction(func)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                      {func.id}
                    </div>
                    {func.weightedROI > 0 && (
                      <Badge className="bg-blue-500 text-white">
                        {Math.round(func.weightedROI)}% ROI
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl text-blue-600 mt-3">
                  {func.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {func.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600">Use Cases</p>
                    <p className="text-lg font-bold text-gray-900">{func.useCaseCount}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <p className="text-xs text-purple-600">Weighted ROI</p>
                    <p className="text-lg font-bold text-purple-700">{Math.round(func.weightedROI)}%</p>
                  </div>
                </div>

                {/* Financial Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Investment:</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(func.totalInvestment)}</span>
                  </div>
                  
                  {/* Services Cost - More Prominent */}
                  <div className="bg-orange-50 rounded px-2 py-1.5 border border-orange-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-orange-700">Services Cost:</span>
                      <span className="text-sm font-bold text-orange-700">{formatCurrency(func.totalImplementationCost)}</span>
                    </div>
                    <p className="text-[10px] text-orange-600 mt-0.5">
                      (included in investment)
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Economic Benefits:</span>
                    <span className="text-sm font-semibold text-green-700">{formatCurrency(func.totalReturn)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-bold text-gray-900">Total Value:</span>
                    <span className="text-sm font-bold text-purple-700">{formatCurrency(func.totalValue)}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2" size="sm">
                  View {func.useCaseCount} Use Cases
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedFunction && (
        <Dialog open={!!selectedFunction} onOpenChange={(open) => {
          if (!open) {
            setSelectedFunction(null);
            setEditingFunctionROI(false);
            setFunctionROIInput('');
          }
        }}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-xl">
                  {selectedFunction.id}
                </div>
                <div>
                  <DialogTitle className="text-2xl">{selectedFunction.name}</DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">{selectedFunction.description}</p>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Aggregated Metrics */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Aggregated Function Metrics</CardTitle>
                    {manualROIOverrides[selectedFunction.name] && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-400">
                        Manually Adjusted
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      {editingFunctionROI ? (
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={functionROIInput}
                            onChange={(e) => setFunctionROIInput(e.target.value)}
                            className="w-20 p-1 text-center text-xl font-bold border border-purple-300 rounded"
                            min="0"
                          />
                          <p className="text-xs text-gray-600">%</p>
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={saveFunctionROI}
                              className="px-2 py-0.5 text-[10px] bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setFunctionROIInput('');
                                setEditingFunctionROI(false);
                              }}
                              className="px-2 py-0.5 text-[10px] bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-purple-700">{Math.round(selectedFunction.weightedROI)}%</p>
                          <p className="text-sm text-gray-600 mt-1">Weighted ROI</p>
                          <button
                            onClick={handleEditFunctionROI}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium mt-1"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedFunction.totalInvestment)}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Investment</p>
                      <p className="text-xs text-orange-600 mt-1">
                        (incl. {formatCurrency(selectedFunction.totalImplementationCost)} services)
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-700">{formatCurrency(selectedFunction.totalReturn)}</p>
                      <p className="text-sm text-gray-600 mt-1">Economic Benefits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-700">{formatCurrency(selectedFunction.totalValue)}</p>
                      <p className="text-sm text-gray-600 mt-1">Total Value</p>
                    </div>
                  </div>
                  
                  {/* Investment Breakdown */}
                  <div className="mt-4 pt-4 border-t border-purple-300">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Investment Breakdown:</p>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white rounded p-2">
                        <p className="text-xs text-gray-600">Licenses + ACR</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(selectedFunction.totalInvestment - selectedFunction.totalImplementationCost)}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2">
                        <p className="text-xs text-orange-600">Services Cost</p>
                        <p className="text-sm font-bold text-orange-700">
                          {formatCurrency(selectedFunction.totalImplementationCost)}
                        </p>
                      </div>
                      <div className="bg-white rounded p-2">
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatCurrency(selectedFunction.totalInvestment)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Use Cases List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Connected Use Cases ({selectedFunction.useCaseCount})
                </h3>
                <div className="space-y-3">
                  {selectedFunction.useCases.map((uc, idx) => {
                    // Calculate ROI dynamically using TEI methodology
                    const roiResult = calculateUseCaseROI(uc);
                    const roi = getAdjustedROI(roiResult.roi);
                    const investment = roiResult.investment;
                    const netValue = investment * (roi / 100);

                    return (
                      <Card 
                        key={idx} 
                        className="border border-gray-200 hover:border-blue-400 transition-all cursor-pointer"
                        onClick={() => handleUseCaseClick(uc)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">{uc.useCase}</h4>
                                {newUseCaseNames.has(uc.useCase) && (
                                  <span className="inline-flex items-center px-3.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-800 border-2 border-amber-500 shrink-0">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{uc.subCategory}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {uc.departments.slice(0, 3).map((dept, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-white border-gray-300">
                                    {dept}
                                  </Badge>
                                ))}
                                {uc.departments.length > 3 && (
                                  <Badge variant="outline" className="text-xs bg-white border-gray-300">
                                    +{uc.departments.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <Badge className="bg-purple-600 text-white mb-2">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                {roi}% ROI
                              </Badge>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-4">
                                  <span className="text-gray-600">Investment:</span>
                                  <span className="font-semibold text-gray-900">{formatCurrency(investment)}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-gray-600">Value:</span>
                                  <span className="font-semibold text-purple-700">{formatCurrency(netValue)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Use Case Detail Dialog */}
      <UseCaseDetailDialog
        useCase={selectedUseCase}
        open={useCaseDialogOpen}
        onOpenChange={(isOpen) => {
          setUseCaseDialogOpen(isOpen);
          if (!isOpen) {
            setSelectedUseCase(null);
          }
        }}
        onUpdateUseCase={updateUseCase}
        availableClusters={availableClusters}
      />
    </div>
  );
}

