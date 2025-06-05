"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartPie,
  ChartBar,
  ChartLine,
} from "@/components/ui/chart"

export function ValueImpactChart() {
  const financialData = [
    { name: "Productivity Gains", value: 1.8, color: "#4CAF50" },
    { name: "Cost Avoidance", value: 1.2, color: "#2196F3" },
    { name: "Risk Mitigation", value: 0.8, color: "#9C27B0" },
    { name: "Revenue Impact", value: 0.4, color: "#FF9800" },
  ]

  const adoptionData = [
    { month: "May", "Quick Wins": 65, Moderate: 0, "High Complexity": 0 },
    { month: "Jun", "Quick Wins": 72, Moderate: 0, "High Complexity": 0 },
    { month: "Jul", "Quick Wins": 78, Moderate: 35, "High Complexity": 0 },
    { month: "Aug", "Quick Wins": 82, Moderate: 48, "High Complexity": 0 },
    { month: "Sep", "Quick Wins": 85, Moderate: 60, "High Complexity": 65 },
    { month: "Oct", "Quick Wins": 88, Moderate: 68, "High Complexity": 78 },
  ]

  const timeToValueData = [
    { category: "Quick Wins", value: 7 },
    { category: "Moderate Complexity", value: 24 },
    { category: "High Complexity", value: 52 },
  ]

  return (
    <Tabs defaultValue="financial">
      <TabsList className="mb-4">
        <TabsTrigger value="financial">Financial Impact</TabsTrigger>
        <TabsTrigger value="adoption">Adoption Rate</TabsTrigger>
        <TabsTrigger value="timeToValue">Time-to-Value</TabsTrigger>
      </TabsList>

      <TabsContent value="financial" className="mt-0">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <ChartContainer className="h-80">
                <Chart>
                  <ChartPie
                    data={financialData}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `RM ${value}M`}
                    colors={financialData.map((item) => item.color)}
                  />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                  <ChartLegend />
                </Chart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Financial Breakdown</h3>
              <div className="space-y-4">
                {financialData.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="font-semibold">RM {item.value}M</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.value / 4.2) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Impact</span>
                    <span className="font-bold">RM {financialData.reduce((sum, item) => sum + item.value, 0)}M</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="adoption" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <ChartContainer className="h-80">
              <Chart>
                <ChartLine
                  data={adoptionData}
                  index="month"
                  categories={["Quick Wins", "Moderate", "High Complexity"]}
                  colors={["#4CAF50", "#2196F3", "#9C27B0"]}
                  valueFormatter={(value) => `${value}%`}
                  yAxisWidth={40}
                />
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
                <ChartLegend />
              </Chart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeToValue" className="mt-0">
        <Card>
          <CardContent className="p-6">
            <ChartContainer className="h-80">
              <Chart>
                <ChartBar
                  data={timeToValueData}
                  index="category"
                  categories={["value"]}
                  colors={["#FFC107"]}
                  valueFormatter={(value) => `${value} days`}
                  yAxisWidth={40}
                />
                <ChartTooltip>
                  <ChartTooltipContent />
                </ChartTooltip>
              </Chart>
            </ChartContainer>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
