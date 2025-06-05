import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UseCaseTimeline } from "@/components/use-case-timeline"

export default function UseCasesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Use Cases</h1>
        <p className="text-muted-foreground">
          Comprehensive view of AI use cases with dependencies and implementation timeline
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Implementation Timeline</CardTitle>
          <CardDescription>
            View AI use cases by category, tier, or dependency with detailed requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UseCaseTimeline />
        </CardContent>
      </Card>
    </div>
  )
}
