'use client';

import { SimpleGanttView } from "@/components/simple-gantt-view"
import { TimelineView } from "@/components/timeline-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMasterData } from '@/hooks/use-master-data';

export default function TimelinePage() {
  const { useCases, isLoading } = useMasterData();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Implementation Timeline</h1>
        <p className="text-muted-foreground">Chronological view of AI use cases and their deployment schedule</p>
      </div>

      <Tabs defaultValue="gantt">
        <TabsList>
          <TabsTrigger value="gantt">Gantt View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="gantt" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading timeline...</p>
              </div>
            </div>
          ) : (
            <SimpleGanttView useCases={useCases} />
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading use cases...</p>
              </div>
            </div>
          ) : (
            <TimelineView />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
