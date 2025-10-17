"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Building2, Target, Package } from "lucide-react"
import { useMasterData } from "@/hooks/use-master-data"

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

export function TimelineView() {
  const { useCases: masterUseCases, isLoading: csvLoading } = useMasterData()

  // Group use cases by main category
  const groupedByCategory = masterUseCases.reduce((acc, uc) => {
    const group = uc.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(uc);
    return acc;
  }, {} as Record<string, typeof masterUseCases>);

  if (csvLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading use cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Use Cases Timeline</h2>
          <p className="text-sm text-gray-500 mt-1">
            {masterUseCases.length} total use cases from master data
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(groupedByCategory)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([category, categoryUseCases]) => (
            <Card key={category} className="border-l-4 border-l-red-600">
              <Accordion type="single" collapsible>
                <AccordionItem value={category} className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-gray-900">{category}</h3>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {categoryUseCases.length} use cases
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryUseCases.map((useCase) => (
                        <Card key={useCase.id} className="bg-white hover:shadow-md transition-shadow">
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
  )
}
