import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileIcon as FilePresentation, Filter } from "lucide-react"
import { AIValueGantt } from "@/components/ai-value-gantt"
import { KPICards } from "@/components/kpi-cards"
import { ReadinessGates } from "@/components/readiness-gates"
import { ValueImpactChart } from "@/components/value-impact-chart"
import { TimelineView } from "@/components/timeline-view"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Value Map Dashboard</h1>
          <p className="text-muted-foreground">Track AI initiatives, dependencies, and value creation</p>
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
          <Button size="sm" className="gap-1 bg-[#FFC107] text-black hover:bg-[#FFB300]">
            <FilePresentation className="h-4 w-4" />
            Export to PPT
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <KPICards />

        <Tabs defaultValue="timeline">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="monthview">Month View</TabsTrigger>
            <TabsTrigger value="impact">Value Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>AI Implementation Timeline</CardTitle>
                <CardDescription>Gantt view of dependencies and phased rollout</CardDescription>
              </CardHeader>
              <CardContent>
                <AIValueGantt />
              </CardContent>
            </Card>

            <div className="mt-6">
              <ReadinessGates />
            </div>
          </TabsContent>

          <TabsContent value="monthview" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Month-by-Month Timeline</CardTitle>
                <CardDescription>Chronological view of AI use cases by month</CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Value Impact Analysis</CardTitle>
                <CardDescription>Financial and operational benefits by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ValueImpactChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
