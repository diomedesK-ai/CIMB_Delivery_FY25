"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  Calendar,
  Users,
  FileSpreadsheet,
  Presentation,
  Layers,
  Search,
  Bot,
  FileQuestion,
  LineChart,
  UserRound,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

export function UseCaseTimeline() {
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "personal-productivity": true,
    "knowledge-centric": true,
    "data-intensive": true,
  })
  const [expandedDependencies, setExpandedDependencies] = useState<Record<string, boolean>>({})
  const [coeStartDate, setCoeStartDate] = useState<Date>(new Date(2025, 10, 1)) // November 1, 2025
  const [showSettings, setShowSettings] = useState(false)

  // Calculate COE ready date (COE start date + 45 days)
  const coeReadyDate = new Date(coeStartDate)
  coeReadyDate.setDate(coeReadyDate.getDate() + 45)

  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  // Define categories
  const categories = [
    {
      id: "personal-productivity",
      name: "M365 - Personal Productivity Flight",
      description: "High value, low complexity implementations leveraging Microsoft 365 Copilot",
    },
    {
      id: "knowledge-centric",
      name: "Moderate / Knowledge-Centric",
      description: "Medium complexity implementations with significant value",
    },
    {
      id: "data-intensive",
      name: "Complex / Data-Intensive",
      description: "High complexity implementations with transformative value",
    },
  ]

  // Define dependency categories
  const dependencyCategories = [
    { id: "identity", name: "Identity & Access", description: "AAD, MFA, CA" },
    { id: "m365", name: "M365 Enablement", description: "Licenses, configuration, and change management" },
    { id: "cloud", name: "Cloud Landing Zone", description: "Azure guard-rails" },
    { id: "data-foundation", name: "Data Foundation", description: "Lake / marts" },
    { id: "data-capabilities", name: "Data Capabilities", description: "Quality, classification" },
    { id: "ops", name: "Ops / COE Gate", description: "People, runbooks" },
  ]

  // AI Use Cases with detailed dependencies based on the matrix
  const useCases = [
    // M365 - Personal Productivity Flight (Tier 1)
    {
      id: "email-outlook-copilot",
      name: "Email / Outlook Copilot",
      description: "AI-powered email drafting, summarization, and response suggestions",
      category: "personal-productivity",
      tier: 1,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 1, 15)),
      status: "planned",
      icon: MessageSquare,
      benefits: "30% reduction in email processing time, improved communication quality",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
      features: [
        "Smart email composition with AI suggestions",
        "Email summarization for quick review",
        "Tone and style adjustments",
        "Automated response suggestions",
        "Priority inbox management",
      ],
    },
    {
      id: "meeting-notes-copilot",
      name: "Meeting Notes & Follow-Up Copilot",
      description: "AI-powered meeting notes, summaries, action items, and follow-ups",
      category: "personal-productivity",
      tier: 1,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 1, 15)),
      status: "planned",
      icon: Calendar,
      benefits: "25% reduction in meeting follow-up time, improved action tracking",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
      features: [
        "Automated meeting transcription",
        "Real-time meeting summaries",
        "Action item extraction and assignment",
        "Meeting preparation assistance",
        "Follow-up reminder generation",
      ],
    },
    {
      id: "document-drafting-copilot",
      name: "Document Drafting Copilot (Word)",
      description: "AI-assisted document creation, editing, and formatting in Word",
      category: "personal-productivity",
      tier: 1,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 1, 15)),
      status: "planned",
      icon: FileText,
      benefits: "40% faster document creation, improved content quality and consistency",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
      features: [
        "Content generation from prompts",
        "Document summarization and expansion",
        "Style and tone adjustments",
        "Grammar and readability improvements",
        "Template-based document creation",
      ],
    },
    {
      id: "presentation-designer-copilot",
      name: "Presentation Designer Copilot (PPT)",
      description: "AI-powered presentation creation, design, and enhancement in PowerPoint",
      category: "personal-productivity",
      tier: 1,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 1, 15)),
      status: "planned",
      icon: Presentation,
      benefits: "50% faster presentation creation, improved visual quality and consistency",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
      features: [
        "Slide generation from prompts",
        "Content visualization suggestions",
        "Design consistency enforcement",
        "Speaker notes generation",
        "Presentation summarization",
      ],
    },
    {
      id: "spreadsheet-insights-copilot",
      name: "Spreadsheet Insights Copilot (Excel)",
      description: "AI-powered data analysis, formula generation, and insights in Excel",
      category: "personal-productivity",
      tier: 1,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 1, 15)),
      status: "planned",
      icon: FileSpreadsheet,
      benefits: "45% faster data analysis, improved formula accuracy and insights",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
      features: [
        "Formula generation and explanation",
        "Data pattern recognition",
        "Automated chart creation",
        "Data cleaning suggestions",
        "Natural language queries for data",
      ],
    },
    {
      id: "teams-collaboration-copilot",
      name: "Teams Collaboration Copilot",
      description: "AI-powered chat and collaboration assistance in Microsoft Teams",
      category: "personal-productivity",
      tier: 1,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 1, 15)),
      status: "planned",
      icon: Users,
      benefits: "Improved team collaboration, faster information retrieval, reduced context switching",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
      features: [
        "Chat-based information retrieval",
        "Meeting summaries and catch-up",
        "Channel content summarization",
        "Task management assistance",
        "Contextual suggestions in conversations",
      ],
    },
    {
      id: "board-pack-generator",
      name: "Board-Pack Generator (cross-app)",
      description: "AI-powered creation of comprehensive board meeting materials across Office apps",
      category: "personal-productivity",
      tier: 1,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 1, 15)),
      status: "planned",
      icon: Layers,
      benefits: "60% faster board pack creation, improved consistency and completeness",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
      features: [
        "Cross-application content generation",
        "Automated financial summary creation",
        "Consistent formatting across documents",
        "Executive summary generation",
        "Integrated presentation materials",
      ],
    },

    // Moderate / Knowledge-Centric (Tier 2)
    {
      id: "askhr-conversational-assistant",
      name: "AskHR Conversational Assistant",
      description: "AI-powered HR knowledge base and query system",
      category: "knowledge-centric",
      tier: 2,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 2, 15)),
      status: "planned",
      icon: MessageSquare,
      benefits: "70% reduction in HR query response time, 24/7 employee support",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "askcompliance-advisor",
      name: "AskCompliance Advisor",
      description: "AI assistant for compliance and regulatory inquiries",
      category: "knowledge-centric",
      tier: 2,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 2, 15)),
      status: "planned",
      icon: FileQuestion,
      benefits: "80% faster compliance guidance, reduced regulatory risk",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "askprocurement-bot",
      name: "AskProcurement Bot",
      description: "AI assistant for procurement processes and inquiries",
      category: "knowledge-centric",
      tier: 2,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 2, 15)),
      status: "planned",
      icon: Bot,
      benefits: "50% faster procurement process, improved vendor management",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "required", details: "✓" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "developer-copilot",
      name: "Developer Copilot (GitHub)",
      description: "AI-assisted code development and testing",
      category: "knowledge-centric",
      tier: 2,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 2, 15)),
      status: "planned",
      icon: Code,
      benefits: "30% faster development cycles, improved code quality",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "not-required", details: "—" },
        { category: "data-foundation", name: "Data Foundation", status: "not-required", details: "—" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "document-intelligence",
      name: "Document Intelligence (forms & OCR)",
      description: "AI-powered document analysis and data extraction",
      category: "knowledge-centric",
      tier: 2,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 3, 1)),
      status: "planned",
      icon: FileText,
      benefits: "75% faster document processing, improved data extraction accuracy",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "not-required", details: "—" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "enterprise-rag-knowledge-search",
      name: "Enterprise RAG Knowledge Search",
      description: "AI-powered enterprise knowledge search with retrieval augmented generation",
      category: "knowledge-centric",
      tier: 2,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 3, 15)),
      status: "planned",
      icon: Search,
      benefits: "65% faster information retrieval, improved knowledge access",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "contact-centre-ai-chatbot",
      name: "Contact-Centre AI Chatbot",
      description: "Customer-facing AI chatbot for MGCC",
      category: "knowledge-centric",
      tier: 2,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 3, 15)),
      status: "planned",
      icon: MessageSquare,
      benefits: "40% reduction in call volume, improved customer satisfaction",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },

    // Complex / Data-Intensive (Tier 3)
    {
      id: "security-copilot",
      name: "Security Copilot (SOC uplift)",
      description: "AI-powered security operations and threat detection",
      category: "data-intensive",
      tier: 3,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 4, 1)),
      status: "planned",
      icon: Shield,
      benefits: "60% faster threat detection, improved security posture",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "fraud-detection",
      name: "Fraud, Waste & Abuse Detection",
      description: "AI-powered detection of fraudulent activities",
      category: "data-intensive",
      tier: 3,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 4, 15)),
      status: "planned",
      icon: Shield,
      benefits: "50% improvement in fraud detection, reduced financial losses",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "risk-modeling",
      name: "Advanced Risk Modelling",
      description: "AI-enhanced risk assessment and modeling",
      category: "data-intensive",
      tier: 3,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 5, 1)),
      status: "planned",
      icon: BarChart3,
      benefits: "40% more accurate risk predictions, improved decision-making",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "loan-automation",
      name: "Loan Processing Automation",
      description: "AI-powered loan application processing and decisioning",
      category: "data-intensive",
      tier: 3,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 5, 15)),
      status: "planned",
      icon: FileText,
      benefits: "70% faster loan processing, improved approval accuracy",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "esg-reporting",
      name: "ESG Reporting & Analytics",
      description: "AI-powered environmental, social, and governance reporting and analytics",
      category: "data-intensive",
      tier: 3,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 6, 1)),
      status: "planned",
      icon: LineChart,
      benefits: "55% faster ESG reporting, improved compliance and insights",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
    {
      id: "personalized-customer-engagement",
      name: "Personalised Customer Engagement AI",
      description: "AI-powered personalized customer engagement and recommendations",
      category: "data-intensive",
      tier: 3,
      launchDate: formatDate(new Date(coeReadyDate.getFullYear(), coeReadyDate.getMonth() + 6, 15)),
      status: "planned",
      icon: UserRound,
      benefits: "35% improvement in customer engagement, increased conversion rates",
      dependencies: [
        { category: "identity", name: "Identity & Access", status: "required", details: "✓" },
        { category: "m365", name: "M365 Enablement", status: "not-required", details: "—" },
        { category: "cloud", name: "Cloud Landing Zone", status: "required", details: "✓" },
        { category: "data-foundation", name: "Data Foundation", status: "required", details: "✓" },
        { category: "data-capabilities", name: "Data Capabilities", status: "required", details: "✓" },
        { category: "ops", name: "Ops / COE Gate", status: "required", details: "✓" },
      ],
    },
  ]

  // Group use cases by category
  const useCasesByCategory = categories.map((category) => {
    return {
      ...category,
      useCases: useCases.filter((useCase) => useCase.category === category.id),
    }
  })

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const toggleDependencyExpansion = (useCaseId: string) => {
    setExpandedDependencies((prev) => ({
      ...prev,
      [useCaseId]: !prev[useCaseId],
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "planned":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getDependencyStatusIcon = (status: string) => {
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

  const getTierBadge = (tier: number) => {
    switch (tier) {
      case 1:
        return <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]">Tier 1</Badge>
      case 2:
        return <Badge className="bg-[#E3F2FD] text-[#1565C0] hover:bg-[#BBDEFB]">Tier 2</Badge>
      case 3:
        return <Badge className="bg-[#EDE7F6] text-[#5E35B1] hover:bg-[#D1C4E9]">Tier 3</Badge>
      default:
        return null
    }
  }

  // Check if all required dependencies are met
  const areAllDependenciesMet = (useCase: any) => {
    return useCase.dependencies.every((dep: any) => dep.status !== "required" || dep.isComplete)
  }

  // Update COE date and recalculate launch dates
  const handleCOEDateChange = (date: Date) => {
    setCoeStartDate(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Use Cases Timeline</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? "Hide Settings" : "Timeline Settings"}
          </Button>
        </div>
      </div>

      {showSettings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Timeline Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="coe-date">AI/M365 COE Start Date</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <DatePicker date={coeStartDate} onSelect={handleCOEDateChange} />
                  <span className="text-sm text-muted-foreground">
                    COE Ready: {formatDate(coeReadyDate)} (+45 days)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Changing this date will automatically shift all dependent use cases.
                </p>
              </div>
              <div>
                <Label>Dependency Rules</Label>
                <ul className="mt-1.5 space-y-1 text-sm">
                  <li className="flex items-start gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                    <span>A use-case can only exit &ldquo;Planned&rdquo; when every ✓ column for that row is 100% complete.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                    <span>M365 Copilot scenarios do not depend on Azure Landing Zone or Data Foundations.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                    <span>&ldquo;Ops / COE Gate&rdquo; assumes the AI/M365 COE goes live on the date above + 45 days.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                    <span>
                      &ldquo;M365 Enablement&rdquo; includes licensing, configuration, and organizational change management.</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="by-category">
        <TabsList>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
          <TabsTrigger value="by-tier">By Tier</TabsTrigger>
          <TabsTrigger value="by-dependency">By Dependency</TabsTrigger>
        </TabsList>

        <TabsContent value="by-category" className="mt-6">
          <div className="space-y-8">
            {useCasesByCategory.map((categoryGroup) => (
              <div key={categoryGroup.id} className="space-y-4">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleCategoryExpansion(categoryGroup.id)}
                >
                  {expandedCategories[categoryGroup.id] ? (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                  <h2 className="text-2xl font-bold">{categoryGroup.name}</h2>
                  <Badge className="ml-2 bg-primary">{categoryGroup.useCases.length} Use Cases</Badge>
                </div>
                <p className="text-muted-foreground">{categoryGroup.description}</p>

                {expandedCategories[categoryGroup.id] && (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categoryGroup.useCases.map((useCase) => (
                      <Card key={useCase.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
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
                            {getTierBadge(useCase.tier)}
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {useCase.launchDate}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>

                          <Collapsible
                            open={expandedDependencies[useCase.id]}
                            onOpenChange={() => toggleDependencyExpansion(useCase.id)}
                            className="border rounded-md p-2"
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium">Dependencies</h4>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                                  {expandedDependencies[useCase.id] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>

                            <CollapsibleContent className="mt-2">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {useCase.dependencies.map((dep: any) => (
                                  <div
                                    key={`${useCase.id}-${dep.category}`}
                                    className={`flex items-start gap-1.5 p-1.5 rounded-md bg-muted ${
                                      dep.status === "not-required" ? "text-gray-400" : ""
                                    }`}
                                  >
                                    {getDependencyStatusIcon(dep.status)}
                                    <div>
                                      <div className="font-medium">{dep.name}</div>
                                      <div
                                        className={`${dep.status === "not-required" ? "text-gray-400" : "text-muted-foreground"}`}
                                      >
                                        {dep.details}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {useCase.features && (
                            <div className="mt-3">
                              <h4 className="text-xs font-medium mb-1">Key Features:</h4>
                              <ul className="text-xs space-y-1 pl-1">
                                {useCase.features.slice(0, 3).map((feature: string) => (
                                  <li key={feature} className="flex items-start gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                  </li>
                                ))}
                                {useCase.features && useCase.features.length > 3 && (
                                  <li className="text-xs text-muted-foreground pl-3">
                                    +{useCase.features.length - 3} more features
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
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
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-tier" className="mt-6">
          <div className="space-y-8">
            {[1, 2, 3].map((tier) => {
              const tierUseCases = useCases.filter((useCase) => useCase.tier === tier)
              const tierName =
                tier === 1 ? "Tier 1 - Quick Wins" : tier === 2 ? "Tier 2 - Moderate Complexity" : "Tier 3 - Complex"

              return (
                <div key={`tier-${tier}`} className="space-y-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {tierName}
                    <Badge className="ml-2 bg-primary">{tierUseCases.length} Use Cases</Badge>
                  </h2>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tierUseCases.map((useCase) => (
                      <Card key={useCase.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
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
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {useCase.launchDate}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>

                          <Collapsible
                            open={expandedDependencies[useCase.id]}
                            onOpenChange={() => toggleDependencyExpansion(useCase.id)}
                            className="border rounded-md p-2"
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium">Dependencies</h4>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                                  {expandedDependencies[useCase.id] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </div>

                            <CollapsibleContent className="mt-2">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {useCase.dependencies.map((dep: any) => (
                                  <div
                                    key={`${useCase.id}-${dep.category}`}
                                    className={`flex items-start gap-1.5 p-1.5 rounded-md bg-muted ${
                                      dep.status === "not-required" ? "text-gray-400" : ""
                                    }`}
                                  >
                                    {getDependencyStatusIcon(dep.status)}
                                    <div>
                                      <div className="font-medium">{dep.name}</div>
                                      <div
                                        className={`${dep.status === "not-required" ? "text-gray-400" : "text-muted-foreground"}`}
                                      >
                                        {dep.details}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {useCase.features && (
                            <div className="mt-3">
                              <h4 className="text-xs font-medium mb-1">Key Features:</h4>
                              <ul className="text-xs space-y-1 pl-1">
                                {useCase.features.slice(0, 3).map((feature: string) => (
                                  <li key={feature} className="flex items-start gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                                    <span className="text-muted-foreground">{feature}</span>
                                  </li>
                                ))}
                                {useCase.features && useCase.features.length > 3 && (
                                  <li className="text-xs text-muted-foreground pl-3">
                                    +{useCase.features.length - 3} more features
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
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
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="by-dependency" className="mt-6">
          <div className="space-y-8">
            {dependencyCategories.map((dependency) => {
              const dependentUseCases = useCases.filter((useCase) =>
                useCase.dependencies.some((dep: any) => dep.category === dependency.id && dep.status === "required"),
              )

              return (
                <div key={dependency.id} className="space-y-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {dependency.name}
                    <Badge className="ml-2 bg-primary">{dependentUseCases.length} Use Cases</Badge>
                  </h2>
                  <p className="text-muted-foreground">{dependency.description}</p>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {dependentUseCases.map((useCase) => (
                      <Card key={useCase.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
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
                            {getTierBadge(useCase.tier)}
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {useCase.launchDate}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm text-muted-foreground mb-3">{useCase.description}</p>

                          <div className="border rounded-md p-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium">Dependency Details</h4>
                            </div>
                            <div className="mt-2">
                              {useCase.dependencies
                                .filter((dep: any) => dep.category === dependency.id)
                                .map((dep: any) => (
                                  <div
                                    key={`${useCase.id}-${dep.category}`}
                                    className="flex items-start gap-1.5 p-1.5 rounded-md bg-muted"
                                  >
                                    {getDependencyStatusIcon(dep.status)}
                                    <div>
                                      <div className="font-medium">{dep.name}</div>
                                      <div className="text-muted-foreground">{dep.details}</div>
                                    </div>
                                  </div>
                                ))}
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
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Use Case Details Dialog */}
      <Dialog open={!!selectedUseCase} onOpenChange={(open) => !open && setSelectedUseCase(null)}>
        <DialogContent className="max-w-4xl">
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

                  <div className="grid grid-cols-3 gap-6 py-4">
                    <div className="col-span-1">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Launch Date:</span>
                              <span className="text-sm">{useCase.launchDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Status:</span>
                              <span className="text-sm flex items-center gap-1">
                                {getStatusIcon(useCase.status)}
                                <span className="capitalize">{useCase.status}</span>
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Tier:</span>
                              <span className="text-sm">{getTierBadge(useCase.tier)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Category:</span>
                              <span className="text-sm capitalize">{useCase.category.replace("-", " ")}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="mt-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Benefits</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{useCase.benefits}</p>
                        </CardContent>
                      </Card>

                      {useCase.features && (
                        <Card className="mt-4">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Key Features</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-1">
                              {useCase.features.map((feature: string) => (
                                <li key={feature} className="text-sm flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    <div className="col-span-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Dependencies Matrix</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr>
                                  <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b">
                                    Dependency
                                  </th>
                                  <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b">
                                    Status
                                  </th>
                                  <th className="text-left text-xs font-medium text-muted-foreground p-2 border-b">
                                    Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {useCase.dependencies.map((dep: any) => (
                                  <tr key={dep.category} className="border-b last:border-0">
                                    <td className="p-2 text-sm font-medium">{dep.name}</td>
                                    <td className="p-2">
                                      <div className="flex items-center gap-1.5">
                                        {getDependencyStatusIcon(dep.status)}
                                        <span
                                          className={`text-sm capitalize ${dep.status === "not-required" ? "text-gray-400" : ""}`}
                                        >
                                          {dep.status}
                                        </span>
                                      </div>
                                    </td>
                                    <td
                                      className={`p-2 text-sm ${dep.status === "not-required" ? "text-gray-400" : ""}`}
                                    >
                                      {dep.details}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Implementation Requirements</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>All required dependencies must be 100% complete</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Stakeholder approval and business case sign-off</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Data governance and compliance review (if applicable)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                <span>Security assessment and approval</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Success Metrics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start gap-2">
                                <BarChart3 className="h-4 w-4 text-primary mt-0.5" />
                                <span>Adoption rate across target user base</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <BarChart3 className="h-4 w-4 text-primary mt-0.5" />
                                <span>Time-to-value measurement</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <BarChart3 className="h-4 w-4 text-primary mt-0.5" />
                                <span>Productivity improvement metrics</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <BarChart3 className="h-4 w-4 text-primary mt-0.5" />
                                <span>Financial impact assessment</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
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
