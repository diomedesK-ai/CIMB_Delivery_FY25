'use client';

import { UseCaseRecord } from '@/lib/csv-parser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { 
  determineCostModel, 
  calculateUseCaseInvestment,
  getImplementationActivities,
  getImplementationCostBucket 
} from '@/lib/csv-parser';

interface SimpleGanttViewProps {
  useCases: UseCaseRecord[];
}

export function SimpleGanttView({ useCases }: SimpleGanttViewProps) {
  const [viewMode, setViewMode] = useState<'category' | 'all'>('category');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseRecord | null>(null);
  
  // Generate 36 months (3 years) starting from current date
  const startDate = new Date();
  const months = Array.from({ length: 36 }, (_, i) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      index: i,
      quarter: Math.floor(i / 3) + 1
    };
  });

  // Group use cases by category
  const groupedByCategory = useCases.reduce((acc, uc) => {
    const group = uc.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(uc);
    return acc;
  }, {} as Record<string, UseCaseRecord[]>);

  // Assign timeline positions for demonstration (distribute across 36 months)
  const getTimelinePosition = (index: number, total: number) => {
    const monthSpan = Math.floor(36 / Math.min(total, 36));
    const startMonth = (index * monthSpan) % 36;
    const duration = Math.min(3 + (index % 4), 6); // 3-6 months duration
    return { start: startMonth, duration };
  };

  const getBarStyle = (categoryIndex: number) => {
    const styles = [
      { bg: 'bg-red-500/10', border: 'border-red-400/40', text: 'text-red-700' },
      { bg: 'bg-blue-500/10', border: 'border-blue-400/40', text: 'text-blue-700' },
      { bg: 'bg-purple-500/10', border: 'border-purple-400/40', text: 'text-purple-700' },
      { bg: 'bg-green-500/10', border: 'border-green-400/40', text: 'text-green-700' },
      { bg: 'bg-orange-500/10', border: 'border-orange-400/40', text: 'text-orange-700' },
      { bg: 'bg-teal-500/10', border: 'border-teal-400/40', text: 'text-teal-700' },
      { bg: 'bg-pink-500/10', border: 'border-pink-400/40', text: 'text-pink-700' },
      { bg: 'bg-indigo-500/10', border: 'border-indigo-400/40', text: 'text-indigo-700' },
      { bg: 'bg-amber-500/10', border: 'border-amber-400/40', text: 'text-amber-700' },
      { bg: 'bg-cyan-500/10', border: 'border-cyan-400/40', text: 'text-cyan-700' }
    ];
    return styles[categoryIndex % styles.length];
  };

  // All use cases for interactive view
  const allUseCases = viewMode === 'all' 
    ? useCases.map((uc, idx) => ({
        ...uc,
        timeline: getTimelinePosition(idx, useCases.length),
        categoryIndex: Object.keys(groupedByCategory).findIndex(cat => cat === uc.group)
      }))
    : [];

  return (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Gantt Timeline View</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            3-year deployment schedule for {useCases.length} use cases
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'category' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('category')}
            className={viewMode === 'category' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            By Category
          </Button>
          <Button 
            variant={viewMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('all')}
            className={viewMode === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            All Together
          </Button>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        {/* Month Headers - Compact */}
        <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div className="w-64 px-3 py-2 border-r border-gray-200 shrink-0">
            <p className="text-xs font-semibold text-gray-700">Use Case</p>
          </div>
          <div className="flex min-w-max">
            {months.map((month, idx) => (
              <div 
                key={idx} 
                className={`w-12 px-0.5 py-1.5 border-r border-gray-200 last:border-r-0 ${
                  idx % 12 === 0 ? 'bg-red-50' : ''
                }`}
              >
                <p className="text-xs font-medium text-gray-700 text-center">
                  {month.month}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  '{month.year.toString().slice(-2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="divide-y divide-gray-100">
          {viewMode === 'category' ? (
            // Category-grouped view
            Object.entries(groupedByCategory)
              .sort((a, b) => b[1].length - a[1].length)
              .map(([category, categoryUseCases], categoryIdx) => {
                const barStyle = getBarStyle(categoryIdx);
                return (
                  <div key={category}>
                    {/* Category Header - Compact */}
                    <div className="flex bg-gray-50/50">
                      <div className="w-64 px-3 py-2 border-r border-gray-200 shrink-0">
                        <p className="font-semibold text-xs text-gray-900">{category}</p>
                        <p className="text-xs text-gray-500">{categoryUseCases.length} cases</p>
                      </div>
                      <div className="flex-1 min-w-max"></div>
                    </div>

                    {/* Use Case Rows - Enhanced */}
                    {categoryUseCases.map((useCase, idx) => {
                      const timeline = getTimelinePosition(idx, categoryUseCases.length);
                      const costModel = determineCostModel(useCase.microsoftProducts);
                      const investment = calculateUseCaseInvestment(useCase);
                      const roi = useCase.roi || 300;
                      const formatCurrency = (val: number) => val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(1)}M` : `$${(val / 1000).toFixed(0)}k`;
                      
                      return (
                        <TooltipProvider key={useCase.id}>
                          <div className="flex hover:bg-gray-50 transition-colors group">
                            <div className="w-64 px-3 py-2 border-r border-gray-200 shrink-0">
                              <p className="text-sm text-gray-900 font-medium leading-tight line-clamp-2">
                                {useCase.useCase}
                              </p>
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {useCase.commercialCluster && (
                                  <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700 px-1.5 py-0.5">
                                    {useCase.commercialCluster}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs border-purple-200 bg-purple-50 text-purple-700 px-1.5 py-0.5">
                                  {costModel}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex-1 py-2 flex items-center relative min-w-max">
                              <div className="flex w-full items-center px-1" style={{ width: `${months.length * 48}px` }}>
                                {/* Timeline bar - Enhanced with ROI */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className={`absolute h-8 ${barStyle.bg} ${barStyle.border} border-2 rounded-full flex items-center justify-between px-3 hover:shadow-lg transition-all cursor-pointer group-hover:scale-105`}
                                      style={{
                                        left: `${(timeline.start / 36) * 100}%`,
                                        width: `${(timeline.duration / 36) * 100}%`,
                                        minWidth: '120px'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedUseCase(useCase);
                                      }}
                                    >
                                      <span className={`text-xs font-bold ${barStyle.text}`}>
                                        {timeline.duration}mo
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Badge className="bg-purple-600 text-white text-xs px-1.5 py-0.5">
                                          <TrendingUp className="h-3 w-3 inline mr-0.5" />
                                          {roi}%
                                        </Badge>
                                        <span className={`text-xs font-semibold ${barStyle.text}`}>
                                          {formatCurrency(investment)}
                                        </span>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-sm">
                                    <div className="space-y-2">
                                      <p className="font-bold text-sm">{useCase.useCase}</p>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <p className="text-gray-500">Cost Model:</p>
                                          <p className="font-semibold">{costModel}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">ROI:</p>
                                          <p className="font-semibold text-purple-600">{roi}%</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Investment:</p>
                                          <p className="font-semibold">{formatCurrency(investment)}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-500">Duration:</p>
                                          <p className="font-semibold">{timeline.duration} months</p>
                                        </div>
                                      </div>
                                      {useCase.commercialCluster && (
                                        <div>
                                          <p className="text-gray-500 text-xs">Cluster:</p>
                                          <p className="font-semibold text-xs">{useCase.commercialCluster}</p>
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                );
              })
          ) : (
            // All use cases together view
            allUseCases.map((useCase, idx) => {
              const barStyle = getBarStyle(useCase.categoryIndex);
              const costModel = determineCostModel(useCase.microsoftProducts);
              const investment = calculateUseCaseInvestment(useCase);
              const roi = useCase.roi || 300;
              const formatCurrency = (val: number) => val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(1)}M` : `$${(val / 1000).toFixed(0)}k`;
              
              return (
                <TooltipProvider key={useCase.id}>
                  <div className="flex hover:bg-gray-50 transition-colors group">
                    <div className="w-64 px-3 py-2 border-r border-gray-200 shrink-0">
                      <p className="text-sm text-gray-900 font-medium leading-tight line-clamp-2">
                        {useCase.useCase}
                      </p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs border-gray-300 bg-gray-50 text-gray-600 px-1.5 py-0.5">
                          {useCase.group}
                        </Badge>
                        {useCase.commercialCluster && (
                          <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700 px-1.5 py-0.5">
                            {useCase.commercialCluster}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs border-purple-200 bg-purple-50 text-purple-700 px-1.5 py-0.5">
                          {costModel}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1 py-2 flex items-center relative min-w-max">
                      <div className="flex w-full items-center px-1" style={{ width: `${months.length * 48}px` }}>
                        {/* Timeline bar - Enhanced with ROI */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`absolute h-8 ${barStyle.bg} ${barStyle.border} border-2 rounded-full flex items-center justify-between px-3 hover:shadow-lg transition-all cursor-pointer group-hover:scale-105`}
                              style={{
                                left: `${(useCase.timeline.start / 36) * 100}%`,
                                width: `${(useCase.timeline.duration / 36) * 100}%`,
                                minWidth: '120px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUseCase(useCase);
                              }}
                            >
                              <span className={`text-xs font-bold ${barStyle.text}`}>
                                {useCase.timeline.duration}mo
                              </span>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-purple-600 text-white text-xs px-1.5 py-0.5">
                                  <TrendingUp className="h-3 w-3 inline mr-0.5" />
                                  {roi}%
                                </Badge>
                                <span className={`text-xs font-semibold ${barStyle.text}`}>
                                  {formatCurrency(investment)}
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm">
                            <div className="space-y-2">
                              <p className="font-bold text-sm">{useCase.useCase}</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-gray-500">Category:</p>
                                  <p className="font-semibold">{useCase.group}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Cost Model:</p>
                                  <p className="font-semibold">{costModel}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">ROI:</p>
                                  <p className="font-semibold text-purple-600">{roi}%</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Investment:</p>
                                  <p className="font-semibold">{formatCurrency(investment)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Duration:</p>
                                  <p className="font-semibold">{useCase.timeline.duration} months</p>
                                </div>
                              </div>
                              {useCase.commercialCluster && (
                                <div>
                                  <p className="text-gray-500 text-xs">Cluster:</p>
                                  <p className="font-semibold text-xs">{useCase.commercialCluster}</p>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </TooltipProvider>
              );
            })
          )}
        </div>
      </div>

      {/* Legend - Enhanced */}
      <Card className="border-gray-200 bg-white">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 items-center">
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-red-500/10 border-2 border-red-400/40 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-red-700">6mo</span>
              </div>
              <span>Timeline bars show duration</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white text-purple-700 border-purple-400 text-xs px-2 py-1">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                400%
              </Badge>
              <span>ROI from Forrester studies</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-purple-400 bg-white text-purple-700 px-2 py-1">
                ACR
              </Badge>
              <span>Cost model (License/ACR/Hybrid)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">$2.5M</span>
              <span>Investment per use case</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700">•</span>
              <span><strong>Click</strong> on bars to view implementation activities</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Activities Dialog */}
      {selectedUseCase && (
        <Dialog open={!!selectedUseCase} onOpenChange={(open) => !open && setSelectedUseCase(null)}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedUseCase.useCase}</DialogTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-white text-green-700 border-green-400">
                  {selectedUseCase.commercialCluster || 'Unassigned'}
                </Badge>
                <Badge variant="outline" className="bg-white text-purple-700 border-purple-400">
                  {determineCostModel(selectedUseCase.microsoftProducts)}
                </Badge>
                <Badge variant="outline" className="bg-white text-purple-700 border-purple-400">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {selectedUseCase.roi || 300}% ROI
                </Badge>
              </div>
            </DialogHeader>

            <Tabs defaultValue="activities" className="mt-4">
              <TabsList>
                <TabsTrigger value="activities">Implementation Activities</TabsTrigger>
                <TabsTrigger value="details">Financial Details</TabsTrigger>
                <TabsTrigger value="products">Technology Stack</TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Implementation Roadmap</CardTitle>
                    <CardDescription>Key activities for successful deployment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getImplementationActivities(selectedUseCase).map((activity, idx) => {
                        // Assign phases
                        let phase = '';
                        let phaseColor = '';
                        let icon = null;
                        
                        if (idx < 3) {
                          phase = 'Phase 1: Planning';
                          phaseColor = 'bg-white text-blue-700 border-blue-400';
                          icon = <Clock className="h-4 w-4" />;
                        } else if (idx < 8) {
                          phase = 'Phase 2: Infrastructure';
                          phaseColor = 'bg-white text-orange-700 border-orange-400';
                          icon = <AlertCircle className="h-4 w-4" />;
                        } else if (idx < 12) {
                          phase = 'Phase 3: Development';
                          phaseColor = 'bg-white text-purple-700 border-purple-400';
                          icon = <Clock className="h-4 w-4" />;
                        } else if (idx < 15) {
                          phase = 'Phase 4: Training';
                          phaseColor = 'bg-white text-green-700 border-green-400';
                          icon = <Clock className="h-4 w-4" />;
                        } else if (idx < 19) {
                          phase = 'Phase 5: Deployment';
                          phaseColor = 'bg-white text-red-700 border-red-400';
                          icon = <AlertCircle className="h-4 w-4" />;
                        } else {
                          phase = 'Phase 6: Optimization';
                          phaseColor = 'bg-white text-teal-700 border-teal-400';
                          icon = <CheckCircle2 className="h-4 w-4" />;
                        }

                        const showPhaseHeader = idx === 0 || idx === 3 || idx === 8 || idx === 12 || idx === 15 || idx === 19;

                        return (
                          <div key={idx}>
                            {showPhaseHeader && (
                              <div className={`flex items-center gap-2 p-2 rounded border ${phaseColor} font-semibold text-sm mb-2 mt-2`}>
                                {icon}
                                {phase}
                              </div>
                            )}
                            <div className="flex items-start gap-3 ml-6">
                              <div className="mt-1.5 h-2 w-2 rounded-full bg-gray-400 shrink-0"></div>
                              <p className="text-sm text-gray-700 leading-relaxed">{activity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                {(() => {
                  const investment = calculateUseCaseInvestment(selectedUseCase);
                  const roi = selectedUseCase.roi || 300;
                  const returnValue = investment * (roi / 100);
                  const netValue = returnValue - investment;
                  const formatCurrency = (val: number) => val >= 1_000_000 ? `$${(val / 1_000_000).toFixed(2)}M` : `$${(val / 1000).toFixed(0)}k`;
                  const implBucket = getImplementationCostBucket(selectedUseCase);
                  
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Financial Impact Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-white rounded-lg border border-gray-300">
                            <p className="text-sm text-gray-600 mb-1">Investment (3yr TCO)</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(investment)}</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-green-400">
                            <p className="text-sm text-gray-600 mb-1">Economic Benefits</p>
                            <p className="text-2xl font-bold text-green-700">{formatCurrency(returnValue)}</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-purple-400">
                            <p className="text-sm text-gray-600 mb-1">Net Economic Value</p>
                            <p className="text-2xl font-bold text-purple-700">{formatCurrency(netValue)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                          <p className="text-sm font-semibold text-blue-900 mb-2">Benefit Breakdown (Forrester Methodology):</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span>Labor Cost Savings (40%):</span>
                              <span className="font-semibold">{formatCurrency(returnValue * 0.40)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Productivity Gains (30%):</span>
                              <span className="font-semibold">{formatCurrency(returnValue * 0.30)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Error Reduction (20%):</span>
                              <span className="font-semibold">{formatCurrency(returnValue * 0.20)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Risk/Compliance (10%):</span>
                              <span className="font-semibold">{formatCurrency(returnValue * 0.10)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-4 bg-white rounded-lg border border-orange-300">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-semibold text-orange-900">Implementation Cost:</p>
                            <Badge className={`text-[10px] px-1.5 py-0 h-4 ${
                              implBucket.tier === 'Tier 3' ? 'bg-red-100 text-red-800 border-red-300' :
                              implBucket.tier === 'Tier 2' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                              'bg-green-100 text-green-800 border-green-300'
                            }`}>
                              {implBucket.tier}
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold text-orange-900 mb-2">{formatCurrency(implBucket.cost)}</p>
                          <p className="text-xs text-gray-700 leading-relaxed italic">{implBucket.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}
              </TabsContent>

              <TabsContent value="products" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Technology Stack</CardTitle>
                    <CardDescription>Microsoft products and services required</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {selectedUseCase.microsoftProducts.map((product, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-300">
                          <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                          <span className="text-sm font-medium">{product}</span>
                        </div>
                      ))}
                    </div>
                    
                    {selectedUseCase.departments && selectedUseCase.departments.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Departments Involved:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUseCase.departments.map((dept, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white text-blue-700 border-blue-400">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

