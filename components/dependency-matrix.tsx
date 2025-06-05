"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DependencyMatrix() {
  // Define AI use cases
  const useCases = [
    { id: "email-outlook-copilot", name: "Email / Outlook Copilot", tier: "Tier 1" },
    { id: "meeting-notes-copilot", name: "Meeting Notes & Follow-Up Copilot", tier: "Tier 1" },
    { id: "document-drafting-copilot", name: "Document Drafting Copilot (Word)", tier: "Tier 1" },
    { id: "presentation-designer-copilot", name: "Presentation Designer Copilot (PPT)", tier: "Tier 1" },
    { id: "spreadsheet-insights-copilot", name: "Spreadsheet Insights Copilot (Excel)", tier: "Tier 1" },
    { id: "teams-collaboration-copilot", name: "Teams Collaboration Copilot", tier: "Tier 1" },
    { id: "board-pack-generator", name: "Board-Pack Generator (cross-app)", tier: "Tier 1" },
    { id: "askhr-conversational-assistant", name: "AskHR Conversational Assistant", tier: "Tier 2" },
    { id: "askcompliance-advisor", name: "AskCompliance Advisor", tier: "Tier 2" },
    { id: "askprocurement-bot", name: "AskProcurement Bot", tier: "Tier 2" },
    { id: "developer-copilot", name: "Developer Copilot (GitHub)", tier: "Tier 2" },
    { id: "document-intelligence", name: "Document Intelligence (forms & OCR)", tier: "Tier 2" },
    { id: "enterprise-rag-knowledge-search", name: "Enterprise RAG Knowledge Search", tier: "Tier 2" },
    { id: "contact-centre-ai-chatbot", name: "Contact-Centre AI Chatbot", tier: "Tier 2" },
    { id: "security-copilot", name: "Security Copilot (SOC uplift)", tier: "Tier 3" },
    { id: "fraud-detection", name: "Fraud, Waste & Abuse Detection", tier: "Tier 3" },
    { id: "risk-modeling", name: "Advanced Risk Modelling", tier: "Tier 3" },
    { id: "loan-automation", name: "Loan Processing Automation", tier: "Tier 3" },
    { id: "esg-reporting", name: "ESG Reporting & Analytics", tier: "Tier 3" },
    { id: "personalized-customer-engagement", name: "Personalised Customer Engagement AI", tier: "Tier 3" },
  ]

  // Define dependency categories
  const dependencies = [
    { id: "identity", name: "Identity & Access", description: "AAD, MFA, CA" },
    { id: "m365", name: "M365 Enablement", description: "Licenses, configuration, and change management" },
    { id: "cloud", name: "Cloud Landing Zone", description: "Azure guard-rails" },
    { id: "data-foundation", name: "Data Foundation", description: "Lake / marts" },
    { id: "data-capabilities", name: "Data Capabilities", description: "Quality, classification" },
    { id: "ops", name: "Ops / COE Gate", description: "People, runbooks" },
  ]

  // Define dependency matrix
  const matrix = {
    "email-outlook-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "meeting-notes-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "document-drafting-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "presentation-designer-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "spreadsheet-insights-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "teams-collaboration-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "board-pack-generator": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "askhr-conversational-assistant": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "askcompliance-advisor": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "askprocurement-bot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "required", details: "✓" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "developer-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "not-required", details: "—" },
      "data-foundation": { status: "not-required", details: "—" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "document-intelligence": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "not-required", details: "—" },
      ops: { status: "required", details: "✓" },
    },
    "enterprise-rag-knowledge-search": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
    "contact-centre-ai-chatbot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
    "security-copilot": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
    "fraud-detection": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
    "risk-modeling": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
    "loan-automation": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
    "esg-reporting": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
    "personalized-customer-engagement": {
      identity: { status: "required", details: "✓" },
      m365: { status: "not-required", details: "—" },
      cloud: { status: "required", details: "✓" },
      "data-foundation": { status: "required", details: "✓" },
      "data-capabilities": { status: "required", details: "✓" },
      ops: { status: "required", details: "✓" },
    },
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "required":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "partial":
        return <HelpCircle className="h-4 w-4 text-amber-500" />
      case "not-required":
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Use Case Dependency Matrix</CardTitle>
        <CardDescription>Comprehensive view of dependencies required for each AI use case</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left text-xs font-medium text-muted-foreground border">AI Use Case (Tier)</th>
                {dependencies.map((dep) => (
                  <th key={dep.id} className="p-2 text-left text-xs font-medium text-muted-foreground border">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left font-medium hover:underline cursor-help">
                          {dep.name}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{dep.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {useCases.map((useCase) => (
                <tr key={useCase.id} className="hover:bg-muted/50">
                  <td className="p-2 border text-sm font-medium">
                    {useCase.name}
                    <div className="text-xs text-muted-foreground">{useCase.tier}</div>
                  </td>
                  {dependencies.map((dep) => {
                    const cell =
                      matrix[useCase.id as keyof typeof matrix][dep.id as keyof (typeof matrix)[keyof typeof matrix]]
                    return (
                      <td key={`${useCase.id}-${dep.id}`} className="p-2 border">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger
                              className={`flex items-center gap-1.5 ${cell.status === "not-required" ? "text-gray-400" : ""}`}
                            >
                              {getStatusIcon(cell.status)}
                              <span className="text-sm">{cell.details}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="capitalize font-medium">{cell.status}</p>
                              {cell.details !== "✓" && cell.details !== "—" && (
                                <p className="text-xs">{cell.details}</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-amber-500" />
            <span>Partial requirement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-gray-400" />
            <span>Not required</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
