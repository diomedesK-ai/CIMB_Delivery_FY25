'use client';

import { UseCaseRecord } from '@/lib/csv-parser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { CategoryFlashCardsModal } from './category-flash-cards-modal';

interface CommercialClusterManagerProps {
  useCases: UseCaseRecord[];
  onUpdateCluster?: (useCaseId: string, cluster: string) => void;
  onUpdateValueSize?: (useCaseId: string, valueSize: 'Small' | 'Medium' | 'Large' | 'Option A' | 'Option B' | 'Both') => void;
}

interface ClusterMetrics {
  name: string;
  useCases: UseCaseRecord[];
  totalUseCases: number;
  departments: string[];
  kpis: string[];
  microsoftProducts: string[];
  totalValue: number; // in USD
  valueSizes: {
    small: number;
    medium: number;
    large: number;
  };
}

const VALUE_SIZES = {
  Small: 50_000_000, // 50M USD (legacy)
  Medium: 75_000_000, // 75M USD (legacy)
  Large: 120_000_000, // 120M USD (legacy)
  'Option A': 75_000_000, // 75M USD
  'Option B': 200_000_000, // 200M USD
  'Both': 275_000_000, // Combined (75M + 200M)
};

// Helper function to format currency
const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export function CommercialClusterManager({ useCases, onUpdateCluster, onUpdateValueSize }: CommercialClusterManagerProps) {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Group use cases by commercial cluster
  const clusterMap = useCases.reduce((acc, useCase) => {
    const cluster = useCase.commercialCluster || 'Unassigned';
    if (!acc[cluster]) {
      acc[cluster] = [];
    }
    acc[cluster].push(useCase);
    return acc;
  }, {} as Record<string, UseCaseRecord[]>);

  // Calculate metrics for each cluster
  const clusterMetrics: ClusterMetrics[] = Object.entries(clusterMap).map(([name, cases]) => {
    const allDepartments = new Set<string>();
    const allKpis = new Set<string>();
    const allProducts = new Set<string>();
    let totalValue = 0;
    const valueSizes = { small: 0, medium: 0, large: 0 };

    cases.forEach(uc => {
      uc.departments.forEach(d => allDepartments.add(d));
      uc.kpis.forEach(k => allKpis.add(k));
      uc.microsoftProducts.forEach(p => allProducts.add(p));
      
      // Calculate value
      if (uc.clusterValueSize) {
        totalValue += VALUE_SIZES[uc.clusterValueSize] || 0;
        if (uc.clusterValueSize === 'Small' || uc.clusterValueSize === 'Option A') valueSizes.small++;
        if (uc.clusterValueSize === 'Medium' || uc.clusterValueSize === 'Option B') valueSizes.medium++;
        if (uc.clusterValueSize === 'Large' || uc.clusterValueSize === 'Both') valueSizes.large++;
      }
    });

    return {
      name,
      useCases: cases,
      totalUseCases: cases.length,
      departments: Array.from(allDepartments).sort(),
      kpis: Array.from(allKpis).sort(),
      microsoftProducts: Array.from(allProducts).sort(),
      totalValue,
      valueSizes,
    };
  }).sort((a, b) => {
    // Sort unassigned last, then by value
    if (a.name === 'Unassigned') return 1;
    if (b.name === 'Unassigned') return -1;
    return b.totalValue - a.totalValue;
  });

  const handleClusterClick = (clusterName: string) => {
    setSelectedCluster(clusterName);
    setModalOpen(true);
  };

  const selectedClusterUseCases = selectedCluster 
    ? clusterMap[selectedCluster] || []
    : [];

  // Get all available clusters for the modal
  const availableClusters = clusterMetrics
    .filter(cm => cm.name !== 'Unassigned')
    .map(cm => cm.name);

  return (
    <>
      <div className="space-y-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Commercial Clusters</h2>
          <p className="text-sm text-gray-500">
            Organize and analyze use cases by commercial offering clusters
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clusterMetrics.map((cluster) => (
            <Card 
              key={cluster.name}
              className={`cursor-pointer transition-all hover:shadow-md border ${
                cluster.name === 'Unassigned' 
                  ? 'border-gray-300 bg-gray-50' 
                  : 'border-gray-200 bg-white hover:border-red-300'
              }`}
              onClick={() => handleClusterClick(cluster.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {cluster.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {cluster.totalUseCases} use case{cluster.totalUseCases !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  {cluster.totalValue > 0 && (
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-700">
                        {formatCurrency(cluster.totalValue)}
                      </div>
                      <div className="text-xs text-gray-500">Est. Value</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Value Breakdown */}
                {(cluster.valueSizes.small > 0 || cluster.valueSizes.medium > 0 || cluster.valueSizes.large > 0) && (
                  <div className="bg-green-50 rounded p-2">
                    <div className="text-xs font-medium text-green-800 mb-1">Value Breakdown</div>
                    <div className="flex gap-2 text-xs">
                      {cluster.valueSizes.small > 0 && (
                        <span className="text-green-700">{cluster.valueSizes.small} Opt A/Small</span>
                      )}
                      {cluster.valueSizes.medium > 0 && (
                        <span className="text-green-700">{cluster.valueSizes.medium} Opt B/Medium</span>
                      )}
                      {cluster.valueSizes.large > 0 && (
                        <span className="text-green-700">{cluster.valueSizes.large} Both/Large</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 rounded p-2">
                    <div className="text-lg font-bold text-blue-700">{cluster.departments.length}</div>
                    <div className="text-xs text-blue-600">Departments</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-lg font-bold text-gray-700">{cluster.kpis.length}</div>
                    <div className="text-xs text-gray-600">KPIs</div>
                  </div>
                  <div className="bg-purple-50 rounded p-2">
                    <div className="text-lg font-bold text-purple-700">{cluster.microsoftProducts.length}</div>
                    <div className="text-xs text-purple-600">Products</div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Top Departments */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Key Departments</p>
                  <div className="flex flex-wrap gap-1">
                    {cluster.departments.slice(0, 3).map((dept, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs border-gray-300 text-gray-600 bg-white"
                      >
                        {dept.length > 20 ? dept.substring(0, 20) + '...' : dept}
                      </Badge>
                    ))}
                    {cluster.departments.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
                        +{cluster.departments.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Top KPIs */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Primary KPIs</p>
                  <div className="space-y-1">
                    {cluster.kpis.slice(0, 2).map((kpi, idx) => (
                      <p key={idx} className="text-xs text-gray-700 truncate">
                        {kpi}
                      </p>
                    ))}
                    {cluster.kpis.length > 2 && (
                      <p className="text-xs text-gray-500 italic">
                        +{cluster.kpis.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Statistics */}
        <Card className="mt-6 border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Cluster Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-900">
                  {clusterMetrics.filter(c => c.name !== 'Unassigned').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Active Clusters</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-700">
                  {clusterMetrics
                    .filter(c => c.name !== 'Unassigned')
                    .reduce((sum, c) => sum + c.totalUseCases, 0)}
                </div>
                <div className="text-sm text-blue-600 mt-1">Assigned Use Cases</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(
                    clusterMetrics
                      .filter(c => c.name !== 'Unassigned')
                      .reduce((sum, c) => sum + c.totalValue, 0)
                  )}
                </div>
                <div className="text-sm text-green-600 mt-1">Total Value</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-gray-600">
                  {clusterMap['Unassigned']?.length || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Unassigned</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(
                    (clusterMetrics
                      .filter(c => c.name !== 'Unassigned')
                      .reduce((sum, c) => sum + c.totalUseCases, 0) / 
                      useCases.length) * 100
                  )}%
                </div>
                <div className="text-sm text-blue-600 mt-1">Assignment Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cluster Detail Modal */}
      <CategoryFlashCardsModal
        category={selectedCluster || ''}
        useCases={selectedClusterUseCases}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdateCluster={onUpdateCluster}
        onUpdateValueSize={onUpdateValueSize}
        availableClusters={availableClusters}
      />
    </>
  );
}

