"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Settings2,
  ChevronDown,
  ChevronRight,
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  BarChart3,
  Code,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

interface WorkstreamItem {
  id: string
  name: string
  area: string
  start: number
  duration: number
  status: string
  phase: string
  dependencies: string[]
  milestone: boolean
  description: string
  critical?: boolean
  indent?: number
  category?: string
  impact?: string
  effort?: string
  confidence?: string
  value?: number
  valueCategory?: string
  requirements?: string[]
  details?: {
    description: string
    businessValue: string
    technicalRequirements: string[]
    dependencies: string[]
    risks: string[]
    successMetrics: string[]
  }
  deliverables: string[]
}

interface AIUseCase {
  id: string
  name: string
  description: string
  category: string
  dependencies: string[]
  start: number
  launchDate: string
  status: string
  icon: React.ComponentType
  benefits: string
  prerequisites: string
}

type TimelineItem = WorkstreamItem | AIUseCase

export function AIValueGantt() {
  const [showDependencies, setShowDependencies] = useState<boolean>(true)
  const [editedData, setEditedData] = useState<WorkstreamItem | null>(null)
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({
    workplace: true,
    "cloud-coe": true,
    azure: true,
    cybersecurity: true,
    "use-cases": true,
  })
  const [expandedStreams, setExpandedStreams] = useState<Record<string, boolean>>({})
  const [filterText, setFilterText] = useState("")
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [selectedWorkstream, setSelectedWorkstream] = useState<WorkstreamItem | null>(null)

  // T0 date (July 1, 2025)
  const t0Date = new Date(2025, 6, 1)

  // Partnership areas from the plan
  const partnershipAreas = [
    { id: "workplace", name: "Workplace Transformation" },
    { id: "cloud-coe", name: "Cloud COE & Platform" },
    { id: "azure", name: "Azure Adoption & Innovation" },
    { id: "cybersecurity", name: "Cybersecurity" },
    { id: "use-cases", name: "AI Use Cases" },
  ]

  // Workstreams based on the image and requirements - adjusted to months with detailed deliverables
  const workstreams = [
    // Workplace Transformation
    {
      id: "foundation-readiness",
      name: "Foundation Readiness (Tenant Planning)",
      area: "workplace",
      start: 1, // Month 1
      duration: 3, // 3 months
      status: "in-progress",
      phase: "transition",
      dependencies: [],
      milestone: false,
      description: "Preparation of Microsoft tenant environment for enterprise deployment",
      deliverables: [
        "Tenant architecture design and validation",
        "Licensing strategy and procurement",
        "Security baseline configuration",
        "Network connectivity planning",
        "Identity federation requirements",
        "Governance and compliance framework"
      ]
    },
    {
      id: "hybrid-identity",
      name: "Hybrid Identity - Entra ID",
      area: "workplace",
      start: 1, // Month 1
      duration: 3, // 3 months
      status: "in-progress",
      phase: "transition",
      dependencies: [],
      milestone: false,
      description: "Implementation of hybrid identity solution with Entra ID",
      deliverables: [
        "Azure AD Connect installation and configuration",
        "Single Sign-On (SSO) implementation",
        "Multi-Factor Authentication (MFA) rollout",
        "Conditional Access policies deployment",
        "Privileged Identity Management (PIM) setup",
        "Identity governance and lifecycle management",
        "Password protection and smart lockout",
        "Identity security monitoring and alerting"
      ]
    },
    {
      id: "collaboration",
      name: "Collaboration Enablement (Mailbox, OD4B, SPO, Teams)",
      area: "workplace",
      start: 1, // Month 1
      duration: 3, // 3 months
      status: "in-progress",
      phase: "transition",
      dependencies: ["hybrid-identity"],
      milestone: false,
      description: "Deployment of collaboration tools across the organization",
      deliverables: [
        "Exchange Online migration and configuration",
        "OneDrive for Business deployment and sync setup",
        "SharePoint Online site collections and governance",
        "Microsoft Teams deployment and phone system",
        "Teams meeting rooms and device configuration",
        "Outlook and calendar integration",
        "File sharing and collaboration policies",
        "Teams governance and compliance setup",
        "User training and adoption programs"
      ]
    },
    {
      id: "endpoint-management",
      name: "Endpoint & App Management (Intune + MCEM)",
      area: "workplace",
      start: 1, // Month 1
      duration: 3, // 3 months
      status: "in-progress",
      phase: "transition",
      dependencies: ["hybrid-identity"],
      milestone: false,
      description: "Implementation of endpoint management solutions",
      deliverables: [
        "Microsoft Intune enrollment and configuration",
        "Device compliance policies and conditional access",
        "Application packaging and deployment",
        "Mobile Device Management (MDM) for iOS/Android",
        "Windows Autopilot deployment service",
        "Endpoint security baseline configuration",
        "App protection policies for mobile devices",
        "Device encryption and BitLocker management",
        "Endpoint analytics and reporting dashboard"
      ]
    },
    {
      id: "m365-copilot",
      name: "M365 Copilot",
      area: "workplace",
      start: 4, // Month 4
      duration: 2, // 2 months
      status: "planned",
      phase: "transition",
      dependencies: ["hybrid-identity", "collaboration"],
      milestone: true,
      description: "Deployment of AI assistant across Microsoft 365 applications",
      deliverables: [
        "Copilot licensing and user assignment",
        "Data governance and sensitivity labeling",
        "Copilot in Word, Excel, PowerPoint integration",
        "Copilot in Teams and Outlook deployment",
        "Copilot in SharePoint and OneDrive setup",
        "Security and compliance configuration",
        "User training and change management",
        "Usage analytics and ROI measurement",
        "Feedback collection and optimization"
      ]
    },
    {
      id: "data-security",
      name: "Data Security & Compliance (Purview, DLP, Classification, Retention, Audit)",
      area: "workplace",
      start: 1, // Month 1
      duration: 3, // 3 months
      status: "in-progress",
      phase: "transition",
      dependencies: ["hybrid-identity"],
      milestone: false,
      description: "Implementation of data governance and security controls",
      deliverables: [
        "Microsoft Purview deployment and configuration",
        "Data Loss Prevention (DLP) policies",
        "Sensitivity labels and classification",
        "Retention policies and records management",
        "Audit logging and compliance monitoring",
        "eDiscovery and legal hold capabilities",
        "Insider risk management setup",
        "Information barriers configuration",
        "Compliance dashboard and reporting"
      ]
    },
    {
      id: "adoption-management",
      name: "Adoption, Change & Service Management",
      area: "workplace",
      start: 1, // Month 1
      duration: 6, // 6 months
      status: "in-progress",
      phase: "transition",
      dependencies: [],
      milestone: false,
      description: "Organizational change management and adoption strategies",
      deliverables: [
        "Change management strategy and communication plan",
        "User training materials and learning paths",
        "Champions network establishment",
        "Adoption metrics and success criteria",
        "Service desk setup and knowledge base",
        "User feedback collection and analysis",
        "Continuous improvement processes",
        "Executive dashboards and reporting",
        "Post-deployment support and optimization"
      ]
    },

    // Cloud COE & Platform
    {
      id: "cloud-coe",
      name: "Cloud Center of Excellence (CCoE)",
      area: "cloud-coe",
      start: 1, // Month 1 (T0 - July 1)
      duration: 2, // 2 months (45-day window)
      status: "in-progress",
      phase: "transition",
      dependencies: ["foundation-readiness"],
      milestone: true,
      critical: true,
      description: "Establishment of Cloud Center of Excellence team and processes",
      deliverables: [
        "CCoE governance framework and operating model",
        "Cloud adoption strategy and roadmap",
        "Azure subscription management and hierarchy",
        "Cost management and optimization processes",
        "Security and compliance standards",
        "Architecture review board establishment",
        "Skills development and training programs",
        "Vendor management and partnerships",
        "Innovation lab and proof-of-concept framework"
      ]
    },
    {
      id: "azure-foundation",
      name: "Azure Foundation Landing Zone and Security Controls",
      area: "cloud-coe",
      start: 3, // Month 3
      duration: 2, // 2 months
      status: "planned",
      phase: "transition",
      dependencies: ["foundation-readiness", "cloud-coe"],
      milestone: false,
      description: "Implementation of Azure landing zone and security framework",
      deliverables: [
        "Azure landing zone architecture deployment",
        "Network segmentation and connectivity",
        "Azure Policy and governance implementation",
        "Resource tagging and naming conventions",
        "Azure Security Center and Sentinel setup",
        "Key Vault and secrets management",
        "Backup and disaster recovery framework",
        "Monitoring and alerting configuration",
        "Infrastructure as Code (IaC) templates"
      ]
    },

    // Azure Adoption & Innovation
    {
      id: "app-migration",
      name: "Application Migration & Modernization",
      area: "azure",
      start: 5, // Month 5
      duration: 6, // 6 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation"],
      milestone: false,
      description: "Migration and modernization of applications to Azure",
      deliverables: [
        "Application portfolio assessment and prioritization",
        "Migration strategy and wave planning",
        "Azure App Service and container deployment",
        "Database migration to Azure SQL and CosmosDB",
        "API management and microservices architecture",
        "DevOps pipeline and CI/CD implementation",
        "Performance testing and optimization",
        "Security scanning and vulnerability management",
        "Go-live support and cutover procedures"
      ]
    },
    {
      id: "vm-migration",
      name: "VM Migration (VMware or others)",
      area: "azure",
      start: 5, // Month 5
      duration: 4, // 4 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation"],
      milestone: false,
      indent: 1,
      description: "Migration of virtual machines to Azure",
      deliverables: [
        "VM discovery and dependency mapping",
        "Azure Migrate assessment and planning",
        "Network and storage configuration",
        "VM replication and testing",
        "Cutover planning and execution",
        "Post-migration optimization",
        "Disaster recovery setup",
        "Monitoring and alerting configuration"
      ]
    },
    {
      id: "productivity-tools",
      name: "Productivity & System Tools (Nagios, ITSM)",
      area: "azure",
      start: 5, // Month 5
      duration: 3, // 3 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation"],
      milestone: false,
      indent: 1,
      description: "Implementation of productivity and system management tools",
      deliverables: [
        "Azure Monitor and Application Insights setup",
        "Log Analytics workspace configuration",
        "Custom dashboards and alerting rules",
        "ServiceNow or similar ITSM integration",
        "Automation runbooks and workflows",
        "Capacity planning and resource optimization",
        "Performance baselines and SLA monitoring",
        "Self-service portal development"
      ]
    },
    {
      id: "common-components",
      name: "Application - Common Components",
      area: "azure",
      start: 5, // Month 5
      duration: 4, // 4 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation"],
      milestone: false,
      indent: 1,
      description: "Development of common application components",
      deliverables: [
        "Shared authentication and authorization services",
        "Common logging and monitoring framework",
        "Notification and messaging services",
        "File storage and content management",
        "Configuration management system",
        "API gateway and service mesh",
        "Caching and session management",
        "Security scanning and compliance tools"
      ]
    },
    {
      id: "data-analytics",
      name: "Data Analytics Estate Modernization",
      area: "azure",
      start: 5, // Month 5
      duration: 6, // 6 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation", "data-security"],
      milestone: false,
      description: "Modernization of data analytics infrastructure and capabilities",
      deliverables: [
        "Data lake and lakehouse architecture deployment",
        "Data integration and ETL processes",
        "Real-time data streaming and processing",
        "Advanced analytics and machine learning",
        "Data visualization and BI tools",
        "Data governance and compliance frameworks",
        "Data security and encryption",
        "Data quality and consistency management"
      ]
    },
    {
      id: "ai-genai",
      name: "AI / GenAI (GenAI Foundations + Implementation of 2-3 AI use cases)",
      area: "azure",
      start: 6, // Month 6
      duration: 3, // 3 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation", "data-analytics", "data-security", "cloud-coe"],
      milestone: true,
      description: "Implementation of AI/GenAI foundation and initial use cases",
      deliverables: [
        "AI/GenAI platform deployment and integration",
        "AI model training and development",
        "AI-powered applications and tools",
        "Data integration and pipeline setup",
        "AI governance and compliance",
        "AI ethics and fairness",
        "AI security and risk management",
        "AI innovation and experimentation"
      ]
    },
    {
      id: "mgcc-chatbot",
      name: "MGCC Contact Center Chatbot (External)",
      area: "azure",
      start: 9, // Month 9
      duration: 3, // 3 months
      status: "planned",
      phase: "maybank",
      dependencies: ["ai-genai"],
      milestone: true,
      description: "Implementation of customer-facing chatbot for contact center",
      deliverables: [
        "Chatbot platform deployment and integration",
        "Natural language processing and intent recognition",
        "Dialog flow and conversation management",
        "Knowledge base and content management",
        "Voice and text analytics",
        "Customer segmentation and personalization",
        "AI-powered call routing and transfer",
        "Agent assistance and productivity tools",
        "Customer satisfaction and feedback collection"
      ]
    },
    {
      id: "developer-velocity",
      name: "Developer Velocity & Experience (GitHub Copilot)",
      area: "azure",
      start: 5, // Month 5
      duration: 2, // 2 months
      status: "planned",
      phase: "transition",
      dependencies: ["cloud-coe"],
      milestone: true,
      description: "Implementation of developer productivity tools and AI assistance",
      deliverables: [
        "GitHub Copilot platform deployment and integration",
        "Code completion and suggestion tools",
        "AI-powered code review and refactoring",
        "Developer productivity metrics and analytics",
        "AI-powered code snippets and templates",
        "Developer feedback and collaboration",
        "AI-powered code documentation and comments",
        "AI-powered code testing and validation",
        "AI-powered code security and compliance"
      ]
    },
    {
      id: "devsecops",
      name: "DevSecOps & E2E Testing On-Demand Environment",
      area: "azure",
      start: 7, // Month 7
      duration: 3, // 3 months
      status: "planned",
      phase: "transition",
      dependencies: ["developer-velocity", "cloud-coe"],
      milestone: false,
      description: "Implementation of DevSecOps practices and testing environments",
      deliverables: [
        "DevSecOps platform deployment and integration",
        "Security scanning and vulnerability management",
        "Continuous integration and delivery",
        "Automated testing and validation",
        "Security compliance and governance",
        "DevSecOps metrics and analytics",
        "DevSecOps culture and mindset",
        "DevSecOps tools and frameworks",
        "DevSecOps governance and compliance"
      ]
    },
    {
      id: "vdi",
      name: "VDI Implementation",
      area: "azure",
      start: 8, // Month 8
      duration: 3, // 3 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation"],
      milestone: false,
      description: "Implementation of Virtual Desktop Infrastructure",
      deliverables: [
        "VDI platform deployment and integration",
        "Desktop virtualization and management",
        "Remote access and connectivity",
        "VDI performance and optimization",
        "VDI security and compliance",
        "VDI governance and management",
        "VDI metrics and analytics",
        "VDI user experience and satisfaction",
        "VDI cost and resource optimization"
      ]
    },

    // Cybersecurity
    {
      id: "cloud-security",
      name: "Cloud Security Foundation (Sentinel, CNAPP, Server EDR, Security Copilot)",
      area: "cybersecurity",
      start: 5, // Month 5
      duration: 2, // 2 months
      status: "planned",
      phase: "transition",
      dependencies: ["azure-foundation"],
      milestone: true,
      description: "Implementation of cloud security tools and monitoring",
      deliverables: [
        "Cloud security platform deployment and integration",
        "Security monitoring and alerting",
        "Threat detection and response",
        "Data protection and encryption",
        "Compliance and governance",
        "Security metrics and analytics",
        "Security operations and incident management",
        "Security automation and orchestration",
        "Security culture and mindset"
      ]
    },
    {
      id: "identity-security",
      name: "Identity Security Modernization",
      area: "cybersecurity",
      start: 2, // Month 2
      duration: 2, // 2 months
      status: "in-progress",
      phase: "microsoft",
      dependencies: ["hybrid-identity"],
      milestone: false,
      description: "Modernization of identity security controls and processes",
      deliverables: [
        "Identity platform deployment and integration",
        "Identity governance and access management",
        "Identity authentication and authorization",
        "Identity compliance and compliance",
        "Identity metrics and analytics",
        "Identity risk and vulnerability management",
        "Identity innovation and experimentation",
        "Identity security and compliance",
        "Identity culture and mindset"
      ]
    },
    {
      id: "defender-xdr",
      name: "Defender XDR - Threat Protection (Endpoint, Email, Identity, CASB)",
      area: "cybersecurity",
      start: 6, // Month 6
      duration: 2, // 2 months
      status: "planned",
      phase: "transition",
      dependencies: ["identity-security", "cloud-security"],
      milestone: false,
      description: "Implementation of extended detection and response capabilities",
      deliverables: [
        "XDR platform deployment and integration",
        "Threat detection and analysis",
        "Incident response and remediation",
        "Data protection and encryption",
        "Compliance and governance",
        "Metrics and analytics",
        "Security operations and incident management",
        "Security automation and orchestration",
        "Security culture and mindset"
      ]
    },
  ]

  // AI Use Cases as milestones - expanded per requirements with clear timing
  const aiUseCases = [
    // Personal Productivity Use Cases - M365 Copilot
    {
      id: "copilot-m365-email",
      name: "M365 Copilot - Email Assistant",
      description: "AI-powered email drafting and summarization",
      category: "personal-productivity",
      dependencies: ["m365-copilot", "adoption-management"],
      start: 6, // Month 6 (2 months after M365 Copilot starts)
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
      dependencies: ["m365-copilot", "adoption-management"],
      start: 6, // Month 6
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
      dependencies: ["m365-copilot", "adoption-management"],
      start: 7, // Month 7
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
      dependencies: ["m365-copilot", "adoption-management"],
      start: 7, // Month 7
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
      dependencies: ["m365-copilot", "adoption-management"],
      start: 6, // Month 6
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
      dependencies: ["ai-genai", "data-analytics"],
      start: 10, // Month 10
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
      dependencies: ["ai-genai", "data-analytics"],
      start: 11, // Month 11
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
      dependencies: ["ai-genai", "data-analytics"],
      start: 12, // Month 12
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
      dependencies: ["ai-genai", "data-analytics", "data-security"],
      start: 13, // Month 13
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
      dependencies: ["ai-genai", "data-analytics"],
      start: 14, // Month 14
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
      dependencies: ["cloud-security", "defender-xdr"],
      start: 8, // Month 8
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
      dependencies: ["mgcc-chatbot", "ai-genai"],
      start: 12, // Month 12
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
      dependencies: ["developer-velocity", "devsecops"],
      start: 9, // Month 9
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
      dependencies: ["ai-genai", "data-analytics", "data-security"],
      start: 15, // Month 15
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
      dependencies: ["ai-genai", "data-analytics", "data-security"],
      start: 16, // Month 16
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
      dependencies: ["ai-genai", "data-analytics", "data-security"],
      start: 18, // Month 18
      launchDate: "Month 18 (Dec 2026)",
      status: "planned",
      icon: FileText,
      benefits: "70% faster loan processing, improved approval accuracy",
      prerequisites: "Loan data, credit scoring models, document processing capabilities",
    },
  ]

  const toggleAreaExpansion = (areaId: string) => {
    setExpandedAreas({
      ...expandedAreas,
      [areaId]: !expandedAreas[areaId],
    })
  }

  const toggleStreamExpansion = (streamId: string) => {
    setExpandedStreams({
      ...expandedStreams,
      [streamId]: !expandedStreams[streamId],
    })
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

  const getPhaseColor = (phase: string, isMilestone = false, isCritical = false) => {
    if (isCritical) {
      return "bg-[#FFECB3] border-[#FFA000] border-2"
    }

    if (isMilestone) {
      return "bg-[#FFC107] border-[#FFA000] text-black"
    }

    switch (phase) {
      case "microsoft":
        return "bg-[#E3F2FD] border-[#1565C0]"
      case "transition":
        return "bg-[#FFF9C4] border-[#FBC02D]"
      case "maybank":
        return "bg-[#FFF3E0] border-[#FF9800]"
      default:
        return "bg-gray-100 border-gray-400"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "personal-productivity":
        return "bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32]"
      case "business-productivity":
        return "bg-[#E3F2FD] border-[#1565C0] text-[#1565C0]"
      case "complex":
        return "bg-[#EDE7F6] border-[#5E35B1] text-[#5E35B1]"
      default:
        return "bg-gray-100 border-gray-400"
    }
  }

  const renderDependencyLines = (item: TimelineItem) => {
    if (!showDependencies || !item.dependencies || item.dependencies.length === 0) return null

    return item.dependencies.map((depId: string) => {
      const dependency = [...workstreams, ...aiUseCases].find((ws) => ws.id === depId)
      if (!dependency) return null

      // For workstreams
      if ("phase" in dependency) {
        const startX = (dependency.start + dependency.duration) * 20
        const startY = 12
        const endX = item.start * 20
        const endY = 12

        return (
          <svg
            key={`${item.id}-${depId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <path
              d={`M ${startX} ${startY} C ${startX + 20} ${startY}, ${endX - 20} ${endY}, ${endX} ${endY}`}
              stroke="#FFA000"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4"
            />
          </svg>
        )
      }
      // For AI use cases
      else {
        const startX = dependency.start * 20
        const startY = 12
        const endX = item.start * 20
        const endY = 12

        return (
          <svg
            key={`${item.id}-${depId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <path
              d={`M ${startX} ${startY} C ${startX + 20} ${startY}, ${endX - 20} ${endY}, ${endX} ${endY}`}
              stroke="#FFA000"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4"
            />
          </svg>
        )
      }
    })
  }

  const handleSaveEdit = () => {
    // In a real app, this would update the data source
    console.log("Saving edited data:", editedData)
    setEditedData(null)
  }

  const filteredWorkstreams = workstreams.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(filterText.toLowerCase())),
  )

  const filteredUseCases = aiUseCases.filter(
    (item) =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.description.toLowerCase().includes(filterText.toLowerCase()),
  )

  const getMonthLabel = (monthNum: number) => {
    const date = new Date(t0Date)
    date.setMonth(date.getMonth() + (monthNum - 1))
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const openUseCaseDetails = (useCaseId: string) => {
    setSelectedUseCase(useCaseId)
  }

  const openWorkstreamDetails = (workstream: WorkstreamItem) => {
    setSelectedWorkstream(workstream)
  }

  const formatDeliverableStatus = (deliverable: string) => {
    // Mock status for demo - in real app this would come from data
    const statuses = ["Completed", "In Progress", "Planned", "Not Started"]
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#E3F2FD] border border-[#1565C0]" />
            <span className="text-xs">Microsoft-led</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FFF9C4] border border-[#FBC02D]" />
            <span className="text-xs">Transition Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FFF3E0] border border-[#FF9800]" />
            <span className="text-xs">Maybank-led</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FFC107] border border-[#FFA000]" />
            <span className="text-xs">Milestone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FFECB3] border-2 border-[#FFA000]" />
            <span className="text-xs">Critical Path</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter workstreams..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="show-dependencies" checked={showDependencies} onCheckedChange={setShowDependencies} />
            <Label htmlFor="show-dependencies">Dependencies</Label>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Configure AI Value Map</DialogTitle>
                <DialogDescription>Edit workstreams, dependencies, and milestones</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="workstreams">
                <TabsList className="mb-4">
                  <TabsTrigger value="workstreams">Workstreams</TabsTrigger>
                  <TabsTrigger value="milestones">AI Use Cases</TabsTrigger>
                  <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                </TabsList>

                <TabsContent value="workstreams" className="max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    {workstreams.map((item) => (
                      <div key={item.id} className="grid grid-cols-5 gap-4 p-2 border rounded-md">
                        <div className="col-span-2">
                          <Label htmlFor={`name-${item.id}`}>Name</Label>
                          <Input id={`name-${item.id}`} defaultValue={item.name} />
                        </div>
                        <div>
                          <Label htmlFor={`start-${item.id}`}>Start Month</Label>
                          <Input id={`start-${item.id}`} type="number" defaultValue={item.start} />
                        </div>
                        <div>
                          <Label htmlFor={`duration-${item.id}`}>Duration (months)</Label>
                          <Input id={`duration-${item.id}`} type="number" defaultValue={item.duration} />
                        </div>
                        <div>
                          <Label htmlFor={`status-${item.id}`}>Status</Label>
                          <Select defaultValue={item.status}>
                            <SelectTrigger id={`status-${item.id}`}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="milestones" className="max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    {aiUseCases.map((item) => (
                      <div key={item.id} className="grid grid-cols-4 gap-4 p-2 border rounded-md">
                        <div className="col-span-2">
                          <Label htmlFor={`name-${item.id}`}>Name</Label>
                          <Input id={`name-${item.id}`} defaultValue={item.name} />
                        </div>
                        <div>
                          <Label htmlFor={`start-${item.id}`}>Start Month</Label>
                          <Input id={`start-${item.id}`} type="number" defaultValue={item.start} />
                        </div>
                        <div>
                          <Label htmlFor={`status-${item.id}`}>Status</Label>
                          <Select defaultValue={item.status}>
                            <SelectTrigger id={`status-${item.id}`}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planned">Planned</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="complete">Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="dependencies" className="max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    {[...workstreams, ...aiUseCases].map((item) => (
                      <div key={item.id} className="p-2 border rounded-md">
                        <Label className="font-medium">{item.name}</Label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {workstreams
                            .filter((ws) => ws.id !== item.id)
                            .map((ws) => (
                              <div key={`${item.id}-${ws.id}`} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`dep-${item.id}-${ws.id}`}
                                  defaultChecked={item.dependencies?.includes(ws.id)}
                                />
                                <Label htmlFor={`dep-${item.id}-${ws.id}`} className="text-sm font-normal">
                                  {ws.name}
                                </Label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditedData(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Use Case Details Dialog */}
      <Dialog open={!!selectedUseCase} onOpenChange={(open) => !open && setSelectedUseCase(null)}>
        <DialogContent className="max-w-3xl">
          {selectedUseCase &&
            (() => {
              const useCase = aiUseCases.find((uc) => uc.id === selectedUseCase)
              if (!useCase) return null

              return (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2">
                      <div className={`rounded-full p-2 ${getCategoryColor(useCase.category)}`}>
                        <useCase.icon className="h-5 w-5" />
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
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2">Dependencies</h4>
                      <ul className="space-y-1">
                        {useCase.dependencies.map((depId) => {
                          const dep = [...workstreams, ...aiUseCases].find((item) => item.id === depId)
                          return dep ? (
                            <li key={depId} className="flex items-center gap-2 text-sm">
                              <div className="h-2 w-2 rounded-full bg-amber-500" />
                              {dep.name}
                            </li>
                          ) : null
                        })}
                      </ul>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Prerequisites</h4>
                      <p className="text-sm">{useCase.prerequisites}</p>

                      <h4 className="text-sm font-semibold mt-4 mb-2">Category</h4>
                      <Badge className={getCategoryColor(useCase.category)}>
                        {useCase.category === "personal-productivity"
                          ? "Personal Productivity"
                          : useCase.category === "business-productivity"
                            ? "Business Productivity"
                            : "Complex / Data-Intensive"}
                      </Badge>
                    </div>
                  </div>
                </>
              )
            })()}
        </DialogContent>
      </Dialog>

      <TooltipProvider>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Timeline header */}
            <div className="flex mb-2 sticky top-0 bg-white z-10 pb-2 border-b">
              <div className="w-1/4 pr-4 font-medium">Workstream</div>
              <div className="w-3/4 flex">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="w-5 text-center text-xs text-muted-foreground">
                    <div className="whitespace-nowrap">{i + 1}</div>
                    {(i + 1) % 3 === 0 && (
                      <div className="text-[10px] text-muted-foreground whitespace-nowrap">{getMonthLabel(i + 1)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Render workstreams grouped by partnership area */}
            {partnershipAreas.map((area) => (
              <div key={area.id} className="mb-6">
                <div
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-muted"
                  onClick={() => toggleAreaExpansion(area.id)}
                >
                  {expandedAreas[area.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <h3 className="text-sm font-semibold">{area.name}</h3>
                </div>

                {expandedAreas[area.id] && area.id !== "use-cases" && (
                  <div className="pl-4 space-y-2 mt-2">
                    {filteredWorkstreams
                      .filter((item) => item.area === area.id)
                      .map((item) => (
                        <Card
                          key={item.id}
                          className="overflow-hidden border-l-4"
                          style={{ borderLeftColor: item.critical ? "#FFA000" : "#e2e8f0" }}
                        >
                          <CardContent className="p-0">
                            <div
                              className="flex items-center p-2 cursor-pointer hover:bg-muted"
                              onClick={() => toggleStreamExpansion(item.id)}
                            >
                              {expandedStreams[item.id] ? (
                                <ChevronDown className="h-4 w-4 mr-2" />
                              ) : (
                                <ChevronRight className="h-4 w-4 mr-2" />
                              )}
                              <div className="flex items-center gap-2 flex-1">
                                {getStatusIcon(item.status)}
                                <span
                                  className={`text-sm ${item.milestone ? "font-semibold" : ""} ${item.indent ? "ml-" + (item.indent * 4) : ""}`}
                                >
                                  {item.name}
                                </span>
                              </div>
                              {item.critical && (
                                <Badge variant="outline" className="bg-[#FFECB3] text-[#FF6F00] border-[#FFA000]">
                                  Critical Path
                                </Badge>
                              )}
                              {item.milestone && (
                                <Badge variant="outline" className="bg-[#FFF8E1] text-[#FF8F00] border-[#FFC107]">
                                  Milestone
                                </Badge>
                              )}
                              <Badge variant="outline" className="ml-2">
                                Month {item.start}-{item.start + item.duration - 1}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openWorkstreamDetails(item)
                                }}
                              >
                                Details
                              </Button>
                            </div>

                            {expandedStreams[item.id] && (
                              <div className="p-2 pt-0">
                                <div className="text-xs text-muted-foreground mt-2 mb-2">{item.description}</div>

                                <div className="relative h-6 mt-4">
                                  <div className="absolute left-0 right-0 h-px bg-gray-200 top-1/2"></div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={`absolute h-full rounded border ${getPhaseColor(item.phase, item.milestone, item.critical)}`}
                                        style={{
                                          left: `${(item.start - 1) * 20}px`,
                                          width: `${item.duration * 20}px`,
                                        }}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      <div className="w-64 p-2">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                                          <div>
                                            <p className="font-medium">Start:</p>
                                            <p>
                                              Month {item.start} ({getMonthLabel(item.start)})
                                            </p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Duration:</p>
                                            <p>{item.duration} months</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Status:</p>
                                            <p className="capitalize">{item.status}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Phase:</p>
                                            <p className="capitalize">{item.phase}</p>
                                          </div>
                                        </div>
                                        {item.dependencies && item.dependencies.length > 0 && (
                                          <div className="mt-2">
                                            <p className="font-medium text-xs">Dependencies:</p>
                                            <ul className="text-xs list-disc pl-4">
                                              {item.dependencies.map((depId: string) => {
                                                const dep = workstreams.find((ws) => ws.id === depId)
                                                return dep ? <li key={depId}>{dep.name}</li> : null
                                              })}
                                            </ul>
                                          </div>
                                        )}
                                        {item.deliverables && item.deliverables.length > 0 && (
                                          <div className="mt-2">
                                            <p className="font-medium text-xs">Key Deliverables:</p>
                                            <ul className="text-xs list-disc pl-4 max-h-32 overflow-y-auto">
                                              {item.deliverables.slice(0, 5).map((deliverable: string, index: number) => (
                                                <li key={index}>{deliverable}</li>
                                              ))}
                                              {item.deliverables.length > 5 && (
                                                <li className="text-muted-foreground">+{item.deliverables.length - 5} more deliverables</li>
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                  {renderDependencyLines(item)}
                                </div>

                                {/* Related AI Use Cases */}
                                {aiUseCases.filter((uc) => uc.dependencies.includes(item.id)).length > 0 && (
                                  <div className="mt-4">
                                    <p className="text-xs font-medium mb-2">Related AI Use Cases:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {aiUseCases
                                        .filter((uc) => uc.dependencies.includes(item.id))
                                        .map((uc) => (
                                          <Badge
                                            key={uc.id}
                                            variant="outline"
                                            className={`${getCategoryColor(uc.category)} cursor-pointer`}
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              openUseCaseDetails(uc.id)
                                            }}
                                          >
                                            {uc.name} (Month {uc.start})
                                          </Badge>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}

                {expandedAreas[area.id] && area.id === "use-cases" && (
                  <div className="pl-4 space-y-4 mt-2">
                    {/* Personal Productivity Use Cases */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Personal Productivity</h4>
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUseCases
                          .filter((item) => item.category === "personal-productivity")
                          .map((item) => (
                            <Card
                              key={item.id}
                              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => openUseCaseDetails(item.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full bg-[#E8F5E9] p-1.5">
                                    <item.icon className="h-3.5 w-3.5 text-[#2E7D32]" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.launchDate}</p>
                                  </div>
                                  {getStatusIcon(item.status)}
                                </div>

                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                                </div>

                                <div className="mt-2">
                                  <p className="text-xs font-medium">Key Dependencies:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.dependencies.map((depId) => {
                                      const dep = workstreams.find((ws) => ws.id === depId)
                                      return dep ? (
                                        <span
                                          key={depId}
                                          className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded"
                                        >
                                          {dep.name}
                                        </span>
                                      ) : null
                                    })}
                                  </div>
                                </div>

                                <div className="relative h-6 mt-3">
                                  <div className="absolute left-0 right-0 h-px bg-gray-200 top-1/2"></div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="absolute h-6 w-6 rounded-full bg-[#E8F5E9] border border-[#2E7D32] flex items-center justify-center"
                                        style={{
                                          left: `${(item.start - 1) * 20}px`,
                                        }}

                                      >
                                        <div className="h-2 w-2 rounded-full bg-[#2E7D32]" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      <div className="w-64 p-2">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div>
                                            <p className="font-medium">Launch:</p>
                                            <p>{item.launchDate}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Status:</p>
                                            <p className="capitalize">{item.status}</p>
                                          </div>
                                        </div>
                                        {item.dependencies && item.dependencies.length > 0 && (
                                          <div className="mt-2">
                                            <p className="font-medium text-xs">Dependencies:</p>
                                            <ul className="text-xs list-disc pl-4">
                                              {item.dependencies.map((depId: string) => {
                                                const dep = [...workstreams, ...aiUseCases].find(
                                                  (ws) => ws.id === depId,
                                                )
                                                return dep ? <li key={depId}>{dep.name}</li> : null
                                              })}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                  {renderDependencyLines(item)}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    {/* Business Productivity Use Cases */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Business Productivity</h4>
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUseCases
                          .filter((item) => item.category === "business-productivity")
                          .map((item) => (
                            <Card
                              key={item.id}
                              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => openUseCaseDetails(item.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full bg-[#E3F2FD] p-1.5">
                                    <item.icon className="h-3.5 w-3.5 text-[#1565C0]" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.launchDate}</p>
                                  </div>
                                  {getStatusIcon(item.status)}
                                </div>

                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                                </div>

                                <div className="mt-2">
                                  <p className="text-xs font-medium">Key Dependencies:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.dependencies.map((depId) => {
                                      const dep = workstreams.find((ws) => ws.id === depId)
                                      return dep ? (
                                        <span
                                          key={depId}
                                          className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded"
                                        >
                                          {dep.name}
                                        </span>
                                      ) : null
                                    })}
                                  </div>
                                </div>

                                <div className="relative h-6 mt-3">
                                  <div className="absolute left-0 right-0 h-px bg-gray-200 top-1/2"></div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="absolute h-6 w-6 rounded-full bg-[#E3F2FD] border border-[#1565C0] flex items-center justify-center"
                                        style={{
                                          left: `${(item.start - 1) * 20}px`,
                                        }}
                                        onMouseEnter={() => {
                                          setHoveredItem(item.id)
                                          setShowDependencies(true)
                                        }}
                                        onMouseLeave={() => {
                                          setHoveredItem(null)
                                        }}
                                      >
                                        <div className="h-2 w-2 rounded-full bg-[#1565C0]" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      <div className="w-64 p-2">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div>
                                            <p className="font-medium">Launch:</p>
                                            <p>{item.launchDate}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Status:</p>
                                            <p className="capitalize">{item.status}</p>
                                          </div>
                                        </div>
                                        {item.dependencies && item.dependencies.length > 0 && (
                                          <div className="mt-2">
                                            <p className="font-medium text-xs">Dependencies:</p>
                                            <ul className="text-xs list-disc pl-4">
                                              {item.dependencies.map((depId: string) => {
                                                const dep = [...workstreams, ...aiUseCases].find(
                                                  (ws) => ws.id === depId,
                                                )
                                                return dep ? <li key={depId}>{dep.name}</li> : null
                                              })}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                  {renderDependencyLines(item)}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    {/* Complex Use Cases */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Complex / Data-Intensive Use Cases</h4>
                      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                        {filteredUseCases
                          .filter((item) => item.category === "complex")
                          .map((item) => (
                            <Card
                              key={item.id}
                              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                              onClick={() => openUseCaseDetails(item.id)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full bg-[#EDE7F6] p-1.5">
                                    <item.icon className="h-3.5 w-3.5 text-[#5E35B1]" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.launchDate}</p>
                                  </div>
                                  {getStatusIcon(item.status)}
                                </div>

                                <div className="mt-2">
                                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                                </div>

                                <div className="mt-2">
                                  <p className="text-xs font-medium">Key Dependencies:</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.dependencies.map((depId) => {
                                      const dep = workstreams.find((ws) => ws.id === depId)
                                      return dep ? (
                                        <span
                                          key={depId}
                                          className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded"
                                        >
                                          {dep.name}
                                        </span>
                                      ) : null
                                    })}
                                  </div>
                                </div>

                                <div className="relative h-6 mt-3">
                                  <div className="absolute left-0 right-0 h-px bg-gray-200 top-1/2"></div>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="absolute h-6 w-6 rounded-full bg-[#EDE7F6] border border-[#5E35B1] flex items-center justify-center"
                                        style={{
                                          left: `${(item.start - 1) * 20}px`,
                                        }}
                                        onMouseEnter={() => {
                                          setHoveredItem(item.id)
                                          setShowDependencies(true)
                                        }}
                                        onMouseLeave={() => {
                                          setHoveredItem(null)
                                        }}
                                      >
                                        <div className="h-2 w-2 rounded-full bg-[#5E35B1]" />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      <div className="w-64 p-2">
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                          <div>
                                            <p className="font-medium">Launch:</p>
                                            <p>{item.launchDate}</p>
                                          </div>
                                          <div>
                                            <p className="font-medium">Status:</p>
                                            <p className="capitalize">{item.status}</p>
                                          </div>
                                        </div>
                                        {item.dependencies && item.dependencies.length > 0 && (
                                          <div className="mt-2">
                                            <p className="font-medium text-xs">Dependencies:</p>
                                            <ul className="text-xs list-disc pl-4">
                                              {item.dependencies.map((depId: string) => {
                                                const dep = [...workstreams, ...aiUseCases].find(
                                                  (ws) => ws.id === depId,
                                                )
                                                return dep ? <li key={depId}>{dep.name}</li> : null
                                              })}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                  {renderDependencyLines(item)}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* Workstream Details Modal */}
      {selectedWorkstream && (
        <Dialog open={!!selectedWorkstream} onOpenChange={() => setSelectedWorkstream(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className={`h-4 w-4 rounded ${getPhaseColor(selectedWorkstream.phase, selectedWorkstream.milestone, selectedWorkstream.critical)}`} />
                {selectedWorkstream.name}
                {selectedWorkstream.milestone && <Badge className="bg-[#FFC107] text-black">Milestone</Badge>}
                {selectedWorkstream.critical && <Badge variant="destructive">Critical Path</Badge>}
              </DialogTitle>
              <DialogDescription>{selectedWorkstream.description}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 mt-6">
              {/* Executive Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Timeline</h4>
                  <p className="text-sm text-blue-700">
                    Month {selectedWorkstream.start} - {selectedWorkstream.start + selectedWorkstream.duration - 1}
                  </p>
                  <p className="text-xs text-blue-600">
                    {getMonthLabel(selectedWorkstream.start)} - {getMonthLabel(selectedWorkstream.start + selectedWorkstream.duration - 1)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Duration</h4>
                  <p className="text-sm text-green-700">{selectedWorkstream.duration} Months</p>
                  <p className="text-xs text-green-600">~{selectedWorkstream.duration * 4} weeks</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900">Status</h4>
                  <p className="text-sm text-orange-700 capitalize">{selectedWorkstream.status}</p>
                  <p className="text-xs text-orange-600">
                    {selectedWorkstream.status === 'in-progress' ? 'Active workstream' : 'Planned execution'}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Phase</h4>
                  <p className="text-sm text-purple-700 capitalize">{selectedWorkstream.phase}</p>
                  <p className="text-xs text-purple-600">
                    {selectedWorkstream.phase === 'microsoft' ? 'Microsoft-led' : 
                     selectedWorkstream.phase === 'transition' ? 'Joint delivery' : 'Maybank-led'}
                  </p>
                </div>
              </div>

              {/* Key Deliverables */}
              {selectedWorkstream.deliverables && selectedWorkstream.deliverables.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Executive Deliverables Summary</h3>
                  <div className="grid gap-3">
                    {selectedWorkstream.deliverables.map((deliverable, index) => {
                      const status = formatDeliverableStatus(deliverable)
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {status === "Completed" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                            {status === "In Progress" && <Clock className="h-4 w-4 text-blue-600" />}
                            {status === "Planned" && <AlertCircle className="h-4 w-4 text-orange-600" />}
                            {status === "Not Started" && <div className="h-4 w-4 border-2 border-gray-400 rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{deliverable}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={
                                  status === "Completed" ? "text-green-700 border-green-300" :
                                  status === "In Progress" ? "text-blue-700 border-blue-300" :
                                  status === "Planned" ? "text-orange-700 border-orange-300" :
                                  "text-gray-700 border-gray-300"
                                }
                              >
                                {status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Deliverable #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {selectedWorkstream.dependencies && selectedWorkstream.dependencies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dependencies & Prerequisites</h3>
                  <div className="grid gap-2">
                    {selectedWorkstream.dependencies.map((depId) => {
                      const dep = workstreams.find((ws) => ws.id === depId)
                      return dep ? (
                        <div key={depId} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                          <div className="h-2 w-2 rounded-full bg-amber-600" />
                          <div className="flex-1">
                            <p className="font-medium">{dep.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Must complete before {selectedWorkstream.name} can begin
                            </p>
                          </div>
                          <Badge variant="outline" className="text-amber-700 border-amber-300">
                            Required
                          </Badge>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Success Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Success Metrics & KPIs</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Completion Metrics</h4>
                    <ul className="mt-2 space-y-1 text-sm text-blue-700">
                      <li>• 100% deliverable completion rate</li>
                      <li>• On-time delivery within planned duration</li>
                      <li>• Zero critical defects in production</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Business Value</h4>
                    <ul className="mt-2 space-y-1 text-sm text-green-700">
                      <li>• User adoption rate ≥ 80%</li>
                      <li>• Performance improvement ≥ 25%</li>
                      <li>• Compliance requirements met</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-yellow-900">Executive Action Items</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-600" />
                    <p className="text-sm">Ensure resource allocation and team availability</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-600" />
                    <p className="text-sm">Review and approve technical architecture decisions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-600" />
                    <p className="text-sm">Monitor progress against planned milestones</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
