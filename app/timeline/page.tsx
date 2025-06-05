import { TimelineView } from "@/components/timeline-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Implementation Timeline</h1>
        <p className="text-muted-foreground">Chronological view of AI use cases and their deployment schedule</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Month-by-Month Timeline</CardTitle>
          <CardDescription>Expand each month to see the AI use cases scheduled for deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <TimelineView />
        </CardContent>
      </Card>
    </div>
  )
}
