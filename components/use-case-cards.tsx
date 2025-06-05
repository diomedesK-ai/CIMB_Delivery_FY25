"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Code,
  Shield,
  FileText,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function UseCaseCards() {
  const [selectedArea, setSelectedArea] = useState("all")
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)

  const useCases = [
    // Personal Productivity Use Cases - M365 Copilot
    {
      id: "copilot-m365-email",
      name: "M365 Copilot - Email Assistant",
      description: "AI-powered email drafting and summarization",
      category: "personal-productivity",
      area: "workplace",
      dependencies: ["M365 Copilot", "Adoption Management"],
      launchDate: "Month 6 (Dec 2025)",
      status: "planned",
      icon: MessageSquare,
      benefits: "30% reduction in email processing time, improved communication quality",
      prerequisites: "M365 Copilot license, user training, data compliance",
      metrics: {
        timeToValue: "1 month post-deployment",
        adoption: "Est. 70% in first 3 months",
        financialImpact: "RM 0.8M annually",
        riskReduction: "15% reduction in communication errors",
      },
    },
    {
      id: "copilot-m365-meetings",
      name: "M365 Copilot - Meeting Assistant",
      description: "AI-powered meeting notes, summaries, and action items",
      category: "personal-productivity",
      area: "workplace",
      dependencies: ["M365 Copilot", "Adoption Management"],
      launchDate: "Month 6 (Dec 2025)",
      status: "planned",
      icon: Calendar,
      benefits: "25% reduction in meeting follow-up time, improved action tracking",
      prerequisites: "M365 Copilot license, Teams deployment, user training",
      metrics: {
        timeToValue: "1 month post-deployment",
        adoption: "Est. 65% in first 3 months",
        financialImpact: "RM 0.7M annually",
        riskReduction: "20% improvement in action item completion",
      },
    },
    {
      id: "copilot-m365-documents",
      name: "M365 Copilot - Document Creation",
      description: "AI-assisted document creation and editing",
      category: "personal-productivity",
      area: "workplace",
      dependencies: ["M365 Copilot", "Adoption Management"],
      launchDate: "Month 7 (Jan 2026)",
      status: "planned",
      icon: FileText,
      benefits: "40% faster document creation, improved content quality",
      prerequisites: "M365 Copilot license, OneDrive/SharePoint deployment",
      metrics: {
        timeToValue: "1 month post-deployment",
        adoption: "Est. 75% in first 3 months",
        financialImpact: "RM 1.1M annually",
        riskReduction: "25% reduction in document errors",
      },
    },
    {
      id: "copilot-m365-presentations",
      name: "M365 Copilot - Presentation Assistant",
      description: "AI-powered presentation creation and enhancement",
      category: "personal-productivity",
      area: "workplace",
      dependencies: ["M365 Copilot", "Adoption Management"],
      launchDate: "Month 7 (Jan 2026)",
      status: "planned",
      icon: BarChart3,
      benefits: "50% faster presentation creation, improved visual quality",
      prerequisites: "M365 Copilot license, PowerPoint templates, brand assets",
      metrics: {
        timeToValue: "1 month post-deployment",
        adoption: "Est. 60% in first 3 months",
        financialImpact: "RM 0.9M annually",
        riskReduction: "30% improvement in presentation quality",
      },
    },
    {
      id: "copilot-m365-teams",
      name: "M365 Copilot - Teams Assistant",
      description: "AI-powered chat and collaboration assistance",
      category: "personal-productivity",
      area: "workplace",
      dependencies: ["M365 Copilot", "Adoption Management"],
      launchDate: "Month 6 (Dec 2025)",
      status: "planned",
      icon: MessageSquare,
      benefits: "Improved team collaboration, faster information retrieval",
      prerequisites: "M365 Copilot license, Teams deployment, user training",
      metrics: {
        timeToValue: "1 month post-deployment",
        adoption: "Est. 80% in first 3 months",
        financialImpact: "RM 0.6M annually",
        riskReduction: "15% reduction in miscommunication",
      },
    },

    // Business Productivity Use Cases
    {
      id: "ask-hr",
      name: "AskHR",
      description: "AI-powered HR knowledge base and query system",
      category: "business-productivity",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics"],
      launchDate: "Month 10 (Apr 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "70% reduction in HR query response time, 24/7 employee support",
      prerequisites: "HR data integration, policy documentation, compliance review",
      metrics: {
        timeToValue: "2 months post-deployment",
        adoption: "Est. 75% of HR queries",
        financialImpact: "RM 1.2M annually",
        riskReduction: "30% reduction in policy misinterpretation",
      },
    },
    {
      id: "ask-finance",
      name: "AskFinance",
      description: "AI assistant for finance processes and inquiries",
      category: "business-productivity",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics"],
      launchDate: "Month 11 (May 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "60% reduction in finance query response time, improved compliance",
      prerequisites: "Finance data integration, process documentation, security controls",
      metrics: {
        timeToValue: "2 months post-deployment",
        adoption: "Est. 70% of finance queries",
        financialImpact: "RM 1.5M annually",
        riskReduction: "35% improvement in compliance adherence",
      },
    },
    {
      id: "ask-procurement",
      name: "AskProcurement",
      description: "AI assistant for procurement processes and inquiries",
      category: "business-productivity",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics"],
      launchDate: "Month 12 (Jun 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "50% faster procurement process, improved vendor management",
      prerequisites: "Procurement data integration, vendor database, process documentation",
      metrics: {
        timeToValue: "2 months post-deployment",
        adoption: "Est. 65% of procurement queries",
        financialImpact: "RM 1.3M annually",
        riskReduction: "25% reduction in procurement errors",
      },
    },
    {
      id: "ask-compliance",
      name: "AskCompliance",
      description: "AI assistant for compliance and regulatory inquiries",
      category: "business-productivity",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics", "Data Security"],
      launchDate: "Month 13 (Jul 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "80% faster compliance guidance, reduced regulatory risk",
      prerequisites: "Regulatory database, compliance documentation, security controls",
      metrics: {
        timeToValue: "3 months post-deployment",
        adoption: "Est. 80% of compliance queries",
        financialImpact: "RM 2.0M annually (risk avoidance)",
        riskReduction: "40% reduction in compliance incidents",
      },
    },
    {
      id: "rm-assist",
      name: "RMAssist Document Intelligence",
      description: "AI-powered document analysis for relationship managers",
      category: "business-productivity",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics"],
      launchDate: "Month 14 (Aug 2026)",
      status: "planned",
      icon: FileText,
      benefits: "75% faster document processing, improved customer service",
      prerequisites: "Document management system, OCR capabilities, data extraction models",
      metrics: {
        timeToValue: "2 months post-deployment",
        adoption: "Est. 85% of relationship managers",
        financialImpact: "RM 1.8M annually",
        riskReduction: "30% reduction in document processing errors",
      },
    },

    // Complex Use Cases
    {
      id: "security-copilot",
      name: "Security Copilot Implementation",
      description: "AI-powered security operations and threat detection",
      category: "complex",
      area: "cybersecurity",
      dependencies: ["Cloud Security Foundation", "Defender XDR"],
      launchDate: "Month 8 (Feb 2026)",
      status: "planned",
      icon: Shield,
      benefits: "60% faster threat detection, improved security posture",
      prerequisites: "Security data integration, threat intelligence feeds, SOC processes",
      metrics: {
        timeToValue: "3 months post-deployment",
        adoption: "100% of security team",
        financialImpact: "RM 2.5M annually (breach prevention)",
        riskReduction: "45% improvement in threat detection time",
      },
    },
    {
      id: "contact-center-ai",
      name: "Contact Center AI Chatbot",
      description: "Customer-facing AI chatbot for MGCC",
      category: "complex",
      area: "azure",
      dependencies: ["MGCC Contact Center Chatbot", "AI/GenAI Foundations"],
      launchDate: "Month 12 (Jun 2026)",
      status: "planned",
      icon: MessageSquare,
      benefits: "40% reduction in call volume, improved customer satisfaction",
      prerequisites: "Customer data integration, knowledge base, conversation flows",
      metrics: {
        timeToValue: "3 months post-deployment",
        adoption: "Est. 35% of customer inquiries",
        financialImpact: "RM 3.0M annually",
        riskReduction: "20% reduction in customer complaint escalations",
      },
    },
    {
      id: "dev-copilot",
      name: "Developer Copilot Rollout",
      description: "AI-assisted code development and testing",
      category: "complex",
      area: "azure",
      dependencies: ["Developer Velocity", "DevSecOps"],
      launchDate: "Month 9 (Mar 2026)",
      status: "planned",
      icon: Code,
      benefits: "30% faster development cycles, improved code quality",
      prerequisites: "GitHub Enterprise, code repositories, developer training",
      metrics: {
        timeToValue: "1 month post-deployment",
        adoption: "Est. 90% of development team",
        financialImpact: "RM 2.2M annually",
        riskReduction: "35% reduction in code defects",
      },
    },
    {
      id: "fwa-detection",
      name: "Fraud, Waste & Abuse Detection",
      description: "AI-powered detection of fraudulent activities",
      category: "complex",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics", "Data Security"],
      launchDate: "Month 15 (Sep 2026)",
      status: "planned",
      icon: Shield,
      benefits: "50% improvement in fraud detection, reduced financial losses",
      prerequisites: "Transaction data, fraud patterns, anomaly detection models",
      metrics: {
        timeToValue: "4 months post-deployment",
        adoption: "100% of fraud monitoring",
        financialImpact: "RM 4.5M annually (fraud prevention)",
        riskReduction: "55% improvement in fraud detection rate",
      },
    },
    {
      id: "risk-modeling",
      name: "Advanced Risk Modeling",
      description: "AI-enhanced risk assessment and modeling",
      category: "complex",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics", "Data Security"],
      launchDate: "Month 16 (Oct 2026)",
      status: "planned",
      icon: BarChart3,
      benefits: "40% more accurate risk predictions, improved decision-making",
      prerequisites: "Risk data integration, historical data, model validation framework",
      metrics: {
        timeToValue: "5 months post-deployment",
        adoption: "Est. 100% of risk assessment processes",
        financialImpact: "RM 3.8M annually",
        riskReduction: "40% improvement in risk prediction accuracy",
      },
    },
    {
      id: "loan-automation",
      name: "Loan Processing Automation",
      description: "AI-powered loan application processing and decisioning",
      category: "complex",
      area: "azure",
      dependencies: ["AI/GenAI Foundations", "Data Analytics", "Data Security"],
      launchDate: "Month 18 (Dec 2026)",
      status: "planned",
      icon: FileText,
      benefits: "70% faster loan processing, improved approval accuracy",
      prerequisites: "Loan data, credit scoring models, document processing capabilities",
      metrics: {
        timeToValue: "4 months post-deployment",
        adoption: "Est. 80% of eligible loan applications",
        financialImpact: "RM 5.2M annually",
        riskReduction: "30% reduction in loan defaults",
      },
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "planned":
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getAreaBadge = (area: string) => {
    switch (area) {
      case "workplace":
        return <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">Workplace</Badge>
      case "azure":
        return <Badge className="bg-[#E3F2FD] text-[#1565C0] hover:bg-[#BBDEFB]">Azure</Badge>
      case "cybersecurity":
        return <Badge className="bg-[#EDE7F6] text-[#5E35B1] hover:bg-[#D1C4E9]">Cybersecurity</Badge>
      default:
        return null
    }
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

  const filteredUseCases =
    selectedArea === "all"
      ? useCases
      : useCases.filter((useCase) => useCase.area === selectedArea || useCase.category === selectedArea)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={selectedArea} onValueChange={setSelectedArea}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Use Cases</TabsTrigger>
            <TabsTrigger value="workplace">Workplace</TabsTrigger>
            <TabsTrigger value="azure">Azure</TabsTrigger>
            <TabsTrigger value="cybersecurity">Cybersecurity</TabsTrigger>
            <TabsTrigger value="personal-productivity">Personal Productivity</TabsTrigger>
            <TabsTrigger value="business-productivity">Business Productivity</TabsTrigger>
            <TabsTrigger value="complex">Complex</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={selectedArea} className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUseCases.map((useCase) => (
              <Card key={useCase.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-[#FFC107] p-2">
                        <useCase.icon className="h-4 w-4 text-black" />
                      </div>
                      <CardTitle className="text-base">{useCase.name}</CardTitle>
                    </div>
                    {getStatusIcon(useCase.status)}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {getAreaBadge(useCase.area)}
                    <CardDescription className="text-xs">Launch: {useCase.launchDate}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>

                  <div className="mt-4">
                    <p className="text-xs font-medium mb-1">Dependencies:</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {useCase.dependencies.map((dep) => (
                        <span key={dep} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-xs font-medium">Time-to-Value</p>
                      <p className="text-sm">{useCase.metrics.timeToValue}</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-xs font-medium">Adoption</p>
                      <p className="text-sm">{useCase.metrics.adoption}</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-xs font-medium">Financial Impact</p>
                      <p className="text-sm">{useCase.metrics.financialImpact}</p>
                    </div>
                    <div className="rounded-md bg-muted p-2">
                      <p className="text-xs font-medium">Risk Reduction</p>
                      <p className="text-sm">{useCase.metrics.riskReduction}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => setSelectedUseCase(useCase.id)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
                      <div className="rounded-full bg-[#FFC107] p-2">
                        <useCase.icon className="h-5 w-5 text-black" />
                      </div>
                      <DialogTitle>{useCase.name}</DialogTitle>
                    </div>
                    <DialogDescription>{useCase.description}</DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Launch Timeline</h4>
                      <p className="text-sm">{useCase.launchDate}</p>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Status</h4>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(useCase.status)}
                        <span className="text-sm capitalize">{useCase.status}</span>
                      </div>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Benefits</h4>
                      <p className="text-sm">{useCase.benefits}</p>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Category</h4>
                      {getCategoryBadge(useCase.category)}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Dependencies</h4>
                      <ul className="space-y-1">
                        {useCase.dependencies.map((dep) => (
                          <li key={dep} className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            {dep}
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Prerequisites</h4>
                      <p className="text-sm">{useCase.prerequisites}</p>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Time-to-Value:</span>
                          <span>{useCase.metrics.timeToValue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Adoption:</span>
                          <span>{useCase.metrics.adoption}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Financial Impact:</span>
                          <span>{useCase.metrics.financialImpact}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Risk Reduction:</span>
                          <span>{useCase.metrics.riskReduction}</span>
                        </div>
                      </div>
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
