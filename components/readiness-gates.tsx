"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ReadinessGates() {
  const gates = [
    {
      id: "foundation",
      name: "Foundation Readiness",
      status: "in-progress",
      progress: 80,
      description: "Tenant planning, identity, and collaboration enablement",
      completedDate: "Est. Week 14",
      criticalFor: ["M365 Copilot", "Cloud COE"],
    },
    {
      id: "hybrid-identity",
      name: "Hybrid Identity",
      status: "in-progress",
      progress: 75,
      description: "Entra ID implementation and identity modernization",
      completedDate: "Est. Week 14",
      criticalFor: ["M365 Copilot", "Identity Security", "Collaboration"],
    },
    {
      id: "cloud-coe",
      name: "Cloud COE Establishment",
      status: "in-progress",
      progress: 20,
      description: "Cloud Center of Excellence setup and operations",
      completedDate: "Est. Week 7 (45-day window from July 1)",
      criticalFor: ["AI/GenAI Foundations", "Developer Velocity", "Azure Foundation"],
      critical: true,
    },
    {
      id: "azure-foundation",
      name: "Azure Foundation",
      status: "planned",
      progress: 0,
      description: "Landing zone and security controls",
      completedDate: "Est. Week 21",
      criticalFor: ["Data Analytics", "Application Migration", "Cloud Security"],
    },
    {
      id: "data-security",
      name: "Data Security & Compliance",
      status: "in-progress",
      progress: 60,
      description: "Purview, DLP, classification, retention, and audit",
      completedDate: "Est. Week 14",
      criticalFor: ["AI/GenAI Foundations", "Data Analytics"],
    },
    {
      id: "cloud-security",
      name: "Cloud Security Foundation",
      status: "planned",
      progress: 0,
      description: "Sentinel, CNAPP, Server EDR, Security Copilot",
      completedDate: "Est. Week 17",
      criticalFor: ["Security Copilot", "Defender XDR"],
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Readiness Gates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gates.map((gate) => (
            <Card
              key={gate.id}
              className="overflow-hidden border-l-4"
              style={{ borderLeftColor: gate.critical ? "#FFA000" : "#e2e8f0" }}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{gate.name}</CardTitle>
                  {getStatusIcon(gate.status)}
                </div>
                {gate.critical && (
                  <Badge variant="outline" className="mt-1 bg-[#FFF8E1] text-[#FF8F00] border-[#FFC107]">
                    Critical Path
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Progress
                  value={gate.progress}
                  className="h-2 mb-2"
                  indicatorClassName={gate.critical ? "bg-[#FFA000]" : undefined}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{gate.progress}% Complete</span>
                  <span>{gate.completedDate}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{gate.description}</p>
                {gate.criticalFor && gate.criticalFor.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium">Dependencies:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {gate.criticalFor.map((item) => (
                        <span key={item} className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
