"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  Code,
  Shield,
  Info,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UseCase {
  id: string
  name: string
  description: string
  category: string
  dependencies: string[]
  launchDate: string
  icon: React.ComponentType<{ className?: string }>
}

export function TimelineView() {
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [groupingOption, setGroupingOption] = useState<string>("month")

  // T0 date (July 1, 2025)
  const t0Date = new Date(2025, 6, 1)

  // Generate months for 30 months starting from T0
  const months = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(t0Date)
    date.setMonth(date.getMonth() + i)
    return {
      id: i + 1,
      name: date.toLocaleDateString("en-US", { month: "long" }),
      year: date.getFullYear(),
      fullLabel: `${date.toLocaleDateString("en-US", { month: "long" })} ${date.getFullYear()}`,
      shortLabel: `Month ${i + 1} (${date.toLocaleDateString("en-US", { month: "short" })} ${date.getFullYear()})`,
    }
  })

  // AI Use Cases with timing
  const useCases = [
    // Personal Productivity Use Cases - M365 Copilot
    {
      id: "copilot-m365-email",
      name: "M365 Copilot - Email Assistant",
      description: "AI-powered email drafting and summarization",
      category: "personal-productivity",
      dependencies: ["M365 Copilot", "Adoption, Change & Service Management"],
      month: 6, // Month 6
      launchDate: "Month 6 (Dec 2025)",
      status: "planned",
      icon: MessageSquare,
      benefits: "30% reduction in email processing time, improved communication quality",
      prerequisites: "M365 Copilot license, user training, data compliance",
    },
    {
      id: "copilot-m365-meetings",
      name: "M365 Copilot - Meeting Assistant",
      description: "AI-powered meeting notes, summaries, and action items",
      category: "personal-productivity",
      dependencies: ["M365 Copilot", "Adoption, Change & Service Management"],
      month: 6, // Month 6
      launchDate: "Month 6 (Dec 2025)",
      status: "planned",
      icon: Calendar,
      benefits: "25% reduction in meeting follow-up time, improved action tracking",
      prerequisites: "M365 Copilot license, Teams deployment, user training",
    },
    {
      id: "copilot-m365-documents",
      name: "M365 Copilot - Document Creation",
      description: "AI-assisted document creation and editing",
      category: "personal-productivity",
      dependencies: ["M365 Copilot", "Adoption, Change & Service Management"],
      month: 7, // Month 7
      launchDate: "Month 7 (Jan 2026)",
      status: "planned",
      icon: FileText,
      benefits: "40% faster document creation, improved content quality",
      prerequisites: "M365 Copilot license, OneDrive/SharePoint deployment",
    },
    {
      id: "copilot-m365-presentations",
      name: "M365 Copilot - Presentation Assistant",
      description: "AI-powered presentation creation and enhancement",
      category: "personal-productivity",
      dependencies: ["M365 Copilot", "Adoption, Change & Service Management"],
      month: 7, // Month 7
      launchDate: "Month 7 (Jan 2026)",
      status: "planned",
      icon: BarChart3,
      benefits: "50% faster presentation creation, improved visual quality",
      prerequisites: "M365 Copilot license, PowerPoint templates, brand assets",
    },
    {
      id: "copilot-m365-teams",
      name: "M365 Copilot - Teams Assistant",
      description: "AI-powered chat and collaboration assistance",
      category: "personal-productivity",
      dependencies: ["M365 Copilot", "Adoption, Change & Service Management"],
      month: 6, // Month 6
      launchDate: "Month 6 (Dec 2025)",
      status: "planned",
      icon: MessageSquare,
      benefits: "Improved team collaboration, faster information retrieval",
      prerequisites: "M365 Copilot license, Teams deployment, user training",
    },

    // Business Productivity Use Cases
    {
      id: "ask-hr",
      name: "AskHR",
      description: "AI-powered HR knowledge base and query system",
      category: "business-productivity",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
      ],
      month: 10, // Month 10
      launchDate: "Month 10 (Apr 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "70% reduction in HR query response time, 24/7 employee support",
      prerequisites: "HR data integration, policy documentation, compliance review",
    },
    {
      id: "ask-finance",
      name: "AskFinance",
      description: "AI assistant for finance processes and inquiries",
      category: "business-productivity",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
      ],
      month: 11, // Month 11
      launchDate: "Month 11 (May 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "60% reduction in finance query response time, improved compliance",
      prerequisites: "Finance data integration, process documentation, security controls",
    },
    {
      id: "ask-procurement",
      name: "AskProcurement",
      description: "AI assistant for procurement processes and inquiries",
      category: "business-productivity",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
      ],
      month: 12, // Month 12
      launchDate: "Month 12 (Jun 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "50% faster procurement process, improved vendor management",
      prerequisites: "Procurement data integration, vendor database, process documentation",
    },
    {
      id: "ask-compliance",
      name: "AskCompliance",
      description: "AI assistant for compliance and regulatory inquiries",
      category: "business-productivity",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
        "Data Security & Compliance (Purview, DLP, Classification, Retention, Audit)",
      ],
      month: 13, // Month 13
      launchDate: "Month 13 (Jul 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "80% faster compliance guidance, reduced regulatory risk",
      prerequisites: "Regulatory database, compliance documentation, security controls",
    },
    {
      id: "rm-assist",
      name: "RMAssist Document Intelligence",
      description: "AI-powered document analysis for relationship managers",
      category: "business-productivity",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
      ],
      month: 14, // Month 14
      launchDate: "Month 14 (Aug 2026)",
      status: "planned",
      icon: FileText,
      benefits: "75% faster document processing, improved customer service",
      prerequisites: "Document management system, OCR capabilities, data extraction models",
    },

    // Complex Use Cases
    {
      id: "security-copilot",
      name: "Security Copilot Implementation",
      description: "AI-powered security operations and threat detection",
      category: "complex",
      dependencies: [
        "Cloud Security Foundation (Sentinel, CNAPP, Server EDR, Security Copilot)",
        "Defender XDR - Threat Protection (Endpoint, Email, Identity, CASB)",
      ],
      month: 8, // Month 8
      launchDate: "Month 8 (Feb 2026)",
      status: "planned",
      icon: Shield,
      benefits: "60% faster threat detection, improved security posture",
      prerequisites: "Security data integration, threat intelligence feeds, SOC processes",
    },
    {
      id: "contact-center-ai",
      name: "Contact Center AI Chatbot",
      description: "Customer-facing AI chatbot for MGCC",
      category: "complex",
      dependencies: [
        "MGCC Contact Center Chatbot (External)",
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
      ],
      month: 12, // Month 12
      launchDate: "Month 12 (Jun 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "40% reduction in call volume, improved customer satisfaction",
      prerequisites: "Customer data integration, knowledge base, conversation flows",
    },
    {
      id: "dev-copilot",
      name: "Developer Copilot Rollout",
      description: "AI-assisted code development and testing",
      category: "complex",
      dependencies: [
        "Developer Velocity & Experience (GitHub Copilot)",
        "DevSecOps & E2E Testing On-Demand Environment",
      ],
      month: 9, // Month 9
      launchDate: "Month 9 (Mar 2026)",
      status: "planned",
      icon: Code,
      benefits: "30% faster development cycles, improved code quality",
      prerequisites: "GitHub Enterprise, code repositories, developer training",
    },
    {
      id: "fwa-detection",
      name: "Fraud, Waste & Abuse Detection",
      description: "AI-powered detection of fraudulent activities",
      category: "complex",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
        "Data Security & Compliance (Purview, DLP, Classification, Retention, Audit)",
      ],
      month: 15, // Month 15
      launchDate: "Month 15 (Sep 2026)",
      status: "planned",
      icon: Shield,
      benefits: "50% improvement in fraud detection, reduced financial losses",
      prerequisites: "Transaction data, fraud patterns, anomaly detection models",
    },
    {
      id: "risk-modeling",
      name: "Advanced Risk Modeling",
      description: "AI-enhanced risk assessment and modeling",
      category: "complex",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
        "Data Security & Compliance (Purview, DLP, Classification, Retention, Audit)",
      ],
      month: 16, // Month 16
      launchDate: "Month 16 (Oct 2026)",
      status: "planned",
      icon: BarChart3,
      benefits: "40% more accurate risk predictions, improved decision-making",
      prerequisites: "Risk data integration, historical data, model validation framework",
    },
    {
      id: "loan-automation",
      name: "Loan Processing Automation",
      description: "AI-powered loan application processing and decisioning",
      category: "complex",
      dependencies: [
        "AI/GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
        "Data Analytics Estate Modernization",
        "Data Security & Compliance (Purview, DLP, Classification, Retention, Audit)",
      ],
      month: 18, // Month 18
      launchDate: "Month 18 (Dec 2026)",
      status: "planned",
      icon: FileText,
      benefits: "70% faster loan processing, improved approval accuracy",
      prerequisites: "Loan data, credit scoring models, document processing capabilities",
    },
  ]

  // Group use cases by month
  const useCasesByMonth = months.map((month) => {
    return {
      ...month,
      useCases: useCases.filter((useCase) => useCase.month === month.id),
    }
  })

  // Group use cases by year
  const useCasesByYear = Array.from(new Set(months.map((month) => month.year))).map((year) => {
    return {
      year,
      useCases: useCases.filter((useCase) => {
        const useCase_month = months.find((m) => m.id === useCase.month)
        return useCase_month && useCase_month.year === year
      }),
    }
  })

  // Group use cases by category
  const categories = [
    { id: "personal-productivity", name: "Personal Productivity" },
    { id: "business-productivity", name: "Business Productivity" },
    { id: "complex", name: "Complex / Data-Intensive" },
  ]

  const useCasesByCategory = categories.map((category) => {
    return {
      ...category,
      useCases: useCases.filter((useCase) => useCase.category === category.id),
    }
  })

  // Only show months that have use cases
  const monthsWithUseCases = useCasesByMonth.filter((month) => month.useCases.length > 0)

  const toggleMonthExpansion = (monthId: number) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthId]: !prev[monthId],
    }))
  }

  const toggleYearExpansion = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }))
  }

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "personal-productivity":
        return <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">Personal Productivity</Badge>
      case "business-productivity":
        return <Badge className="bg-[#E3F2FD] text-[#1565C0] hover:bg-[#BBDEFB]">Business Productivity</Badge>
      case "complex":
        return <Badge className="bg-[#EDE7F6] text-[#5E35B1] hover:bg-[#D1C4E9]">Complex</Badge>
      default:
        return null
    }
  }

  const getCategoryIcon = (category: string, Icon: React.ComponentType<{ className?: string }>) => {
    switch (category) {
      case "personal-productivity":
        return (
          <div className="rounded-full bg-[#E8F5E9] p-1.5">
            <Icon className="h-3.5 w-3.5 text-[#2E7D32]" />
          </div>
        )
      case "business-productivity":
        return (
          <div className="rounded-full bg-[#E3F2FD] p-1.5">
            <Icon className="h-3.5 w-3.5 text-[#1565C0]" />
          </div>
        )
      case "complex":
        return (
          <div className="rounded-full bg-[#EDE7F6] p-1.5">
            <Icon className="h-3.5 w-3.5 text-[#5E35B1]" />
          </div>
        )
      default:
        return (
          <div className="rounded-full bg-[#FFC107] p-1.5">
            <Icon className="h-3.5 w-3.5 text-black" />
          </div>
        )
    }
  }

  const renderUseCase = (useCase: UseCase) => (
    <div key={useCase.id} className="p-4 hover:bg-muted/50">
      <div className="flex items-start gap-3">
        {getCategoryIcon(useCase.category, useCase.icon)}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{useCase.name}</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setSelectedUseCase(useCase.id)}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{useCase.description}</p>

          <div className="mt-3">
            <div className="flex flex-wrap gap-2 items-center">
              {getCategoryBadge(useCase.category)}
              <span className="text-xs text-muted-foreground">{useCase.launchDate}</span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium mb-1">Key Dependencies:</p>
            <div className="flex flex-wrap gap-1">
              {useCase.dependencies.map((dep: string, index: number) => (
                <span key={index} className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  {dep}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Use Cases Timeline</h2>
        <div className="flex items-center gap-2">
          <Select value={groupingOption} onValueChange={setGroupingOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Group by Month</SelectItem>
              <SelectItem value="year">Group by Year</SelectItem>
              <SelectItem value="category">Group by Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue={groupingOption} value={groupingOption} onValueChange={setGroupingOption}>
        <TabsList>
          <TabsTrigger value="month">By Month</TabsTrigger>
          <TabsTrigger value="year">By Year</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="mt-4">
          <div className="space-y-2">
            {monthsWithUseCases.map((month) => (
              <Card key={month.id} className="overflow-hidden">
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted ${month.useCases.length > 0 ? "border-l-4 border-l-[#FFC107]" : ""}`}
                  onClick={() => toggleMonthExpansion(month.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedMonths[month.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <h3 className="font-medium">{month.fullLabel}</h3>
                    <Badge variant="outline">{month.shortLabel}</Badge>
                  </div>
                  <Badge>{month.useCases.length} Use Cases</Badge>
                </div>

                {expandedMonths[month.id] && month.useCases.length > 0 && (
                  <CardContent className="p-0">
                    <div className="divide-y">{month.useCases.map((useCase) => renderUseCase(useCase))}</div>
                  </CardContent>
                )}
              </Card>
            ))}

            {monthsWithUseCases.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">No use cases found.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="year" className="mt-4">
          <div className="space-y-2">
            {useCasesByYear.map((yearGroup) => (
              <Card key={yearGroup.year} className="overflow-hidden">
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted ${yearGroup.useCases.length > 0 ? "border-l-4 border-l-[#FFC107]" : ""}`}
                  onClick={() => toggleYearExpansion(yearGroup.year)}
                >
                  <div className="flex items-center gap-2">
                    {expandedYears[yearGroup.year] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <h3 className="font-medium">{yearGroup.year}</h3>
                  </div>
                  <Badge>{yearGroup.useCases.length} Use Cases</Badge>
                </div>

                {expandedYears[yearGroup.year] && yearGroup.useCases.length > 0 && (
                  <CardContent className="p-0">
                    <div className="divide-y">{yearGroup.useCases.map((useCase) => renderUseCase(useCase))}</div>
                  </CardContent>
                )}
              </Card>
            ))}

            {useCasesByYear.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">No use cases found.</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="category" className="mt-4">
          <div className="space-y-2">
            {useCasesByCategory.map((categoryGroup) => (
              <Card key={categoryGroup.id} className="overflow-hidden">
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer hover:bg-muted ${categoryGroup.useCases.length > 0 ? "border-l-4 border-l-[#FFC107]" : ""}`}
                  onClick={() => toggleCategoryExpansion(categoryGroup.id)}
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories[categoryGroup.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <h3 className="font-medium">{categoryGroup.name}</h3>
                    {getCategoryBadge(categoryGroup.id)}
                  </div>
                  <Badge>{categoryGroup.useCases.length} Use Cases</Badge>
                </div>

                {expandedCategories[categoryGroup.id] && categoryGroup.useCases.length > 0 && (
                  <CardContent className="p-0">
                    <div className="divide-y">{categoryGroup.useCases.map((useCase) => renderUseCase(useCase))}</div>
                  </CardContent>
                )}
              </Card>
            ))}

            {useCasesByCategory.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">No use cases found.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Use Case Details Dialog */}
      <Dialog open={!!selectedUseCase} onOpenChange={(open) => !open && setSelectedUseCase(null)}>
        <DialogContent className="max-w-3xl">
          {selectedUseCase &&
            (() => {
              const useCase = useCases.find((uc) => uc.id === selectedUseCase)
              if (!useCase) return null

              return (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(useCase.category, useCase.icon)}
                      <DialogTitle>{useCase.name}</DialogTitle>
                    </div>
                    <DialogDescription>{useCase.description}</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Launch Timeline</h4>
                      <p className="text-sm">{useCase.launchDate}</p>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Category</h4>
                      {getCategoryBadge(useCase.category)}

                      <h4 className="text-sm font-semibold mt-4 mb-2">Benefits</h4>
                      <p className="text-sm">{useCase.benefits}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Dependencies</h4>
                      <ul className="space-y-1">
                        {useCase.dependencies.map((dep: string, index: number) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            {dep}
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Prerequisites</h4>
                      <p className="text-sm">{useCase.prerequisites}</p>
                    </div>
                  </div>
                </>
              )
            })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
