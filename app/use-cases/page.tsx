'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimelineView } from "@/components/timeline-view"
import { CommercialClusterManager } from "@/components/commercial-cluster-manager"
import { useMasterData } from '@/hooks/use-master-data';

export default function UseCasesPage() {
  const { useCases, isLoading, updateUseCase } = useMasterData();

  const handleUpdateCluster = async (useCaseId: string, cluster: string) => {
    try {
      await updateUseCase(useCaseId, { 
        commercialCluster: cluster === 'unassigned' ? undefined : cluster 
      });
    } catch (error) {
      console.error('Failed to update cluster:', error);
    }
  };

  const handleUpdateValueSize = async (useCaseId: string, valueSize: 'Small' | 'Medium' | 'Large') => {
    try {
      await updateUseCase(useCaseId, { clusterValueSize: valueSize });
    } catch (error) {
      console.error('Failed to update value size:', error);
    }
  };

  const handleUpdateROI = async (useCaseId: string, roi: number) => {
    try {
      await updateUseCase(useCaseId, { roi });
    } catch (error) {
      console.error('Failed to update ROI:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Use Cases</h1>
        <p className="text-muted-foreground">
          Comprehensive view of AI use cases with dependencies and implementation timeline
        </p>
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="clusters">Commercial Clusters</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
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

        <TabsContent value="clusters" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading commercial clusters...</p>
              </div>
            </div>
          ) : (
            <CommercialClusterManager 
              useCases={useCases}
              onUpdateCluster={handleUpdateCluster}
              onUpdateValueSize={handleUpdateValueSize}
              onUpdateROI={handleUpdateROI}
              onUpdateUseCase={updateUseCase}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
