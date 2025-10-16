'use client';

import { UseCaseRecord } from '@/lib/csv-parser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface UseCaseDetailDialogProps {
  useCase: UseCaseRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCluster?: (useCaseId: string, cluster: string) => void;
  onUpdateValueSize?: (useCaseId: string, valueSize: 'Small' | 'Medium' | 'Large') => void;
  availableClusters?: string[];
}

export function UseCaseDetailDialog({ 
  useCase, 
  open, 
  onOpenChange,
  onUpdateCluster,
  onUpdateValueSize,
  availableClusters = []
}: UseCaseDetailDialogProps) {
  const [selectedCluster, setSelectedCluster] = useState<string | undefined>(useCase?.commercialCluster);
  const [selectedValueSize, setSelectedValueSize] = useState<string | undefined>(useCase?.clusterValueSize);

  if (!useCase) return null;

  const handleClusterChange = (value: string) => {
    setSelectedCluster(value);
    if (onUpdateCluster) {
      onUpdateCluster(useCase.id, value);
    }
  };

  const handleValueSizeChange = (value: string) => {
    setSelectedValueSize(value);
    if (onUpdateValueSize && (value === 'Small' || value === 'Medium' || value === 'Large')) {
      onUpdateValueSize(useCase.id, value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {useCase.useCase}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 bg-gray-50">
              {useCase.group}
            </Badge>
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600 bg-gray-50">
              {useCase.subCategory}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <div className="space-y-5 py-2">
            {/* Commercial Cluster Assignment */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Commercial Cluster</h3>
              <Select 
                value={selectedCluster || ''} 
                onValueChange={handleClusterChange}
              >
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Assign to commercial cluster..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {availableClusters.map((cluster) => (
                    <SelectItem key={cluster} value={cluster}>
                      {cluster}
                    </SelectItem>
                  ))}
                  <Separator className="my-1" />
                  <SelectItem value="new-cluster">+ Create New Cluster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Value Size Selection */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Value Size</h3>
              <Select 
                value={selectedValueSize || ''} 
                onValueChange={handleValueSizeChange}
              >
                <SelectTrigger className="w-full border-gray-200">
                  <SelectValue placeholder="Select value size..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small ($50M USD)</SelectItem>
                  <SelectItem value="Medium">Medium ($75M USD)</SelectItem>
                  <SelectItem value="Large">Large ($120M USD)</SelectItem>
                </SelectContent>
              </Select>
              {selectedValueSize && (
                <p className="text-xs text-gray-500">
                  {selectedValueSize === 'Small' && 'Estimated value: $50M USD'}
                  {selectedValueSize === 'Medium' && 'Estimated value: $75M USD'}
                  {selectedValueSize === 'Large' && 'Estimated value: $120M USD'}
                </p>
              )}
            </div>

            <Separator className="bg-gray-200" />

            {/* Departments */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Departments Involved</h3>
              <div className="pl-4 space-y-1.5">
                {useCase.departments.map((dept, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="text-gray-400 mr-2 text-xs">•</span>
                    <span className="text-sm text-gray-700">{dept}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* KPIs */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Primary KPIs</h3>
              <div className="pl-4 space-y-1.5">
                {useCase.kpis.map((kpi, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="text-gray-400 mr-2 text-xs">•</span>
                    <span className="text-sm text-gray-700">{kpi}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-200" />

            {/* Microsoft Products */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Microsoft & Partner Products</h3>
              <div className="pl-4 space-y-1.5">
                {useCase.microsoftProducts.map((product, idx) => (
                  <div key={idx} className="flex items-start">
                    <span className="text-gray-400 mr-2 text-xs">•</span>
                    <span className="text-sm text-gray-700">{product}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            {useCase.prerequisites && useCase.prerequisites.length > 0 && (
              <>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Prerequisites</h3>
                  <div className="pl-4 space-y-2">
                    {useCase.prerequisites.map((prereq, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-start">
                          <span className="text-gray-400 mr-2 text-xs">{idx + 1}.</span>
                          <span className="text-sm text-gray-700">{prereq}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Contribution Types */}
            {useCase.contributionType && useCase.contributionType.length > 0 && (
              <>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Contribution Types</h3>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {useCase.contributionType.map((type, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="text-xs border-blue-200 bg-blue-50 text-blue-700"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Tags */}
            {useCase.tags && useCase.tags.length > 0 && (
              <>
                <Separator className="bg-gray-200" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {useCase.tags.map((tag, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-600 bg-gray-50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

