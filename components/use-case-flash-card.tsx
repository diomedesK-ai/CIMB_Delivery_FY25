'use client';

import { UseCaseRecord } from '@/lib/csv-parser';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UseCaseFlashCardProps {
  useCase: UseCaseRecord;
  onClick?: () => void;
}

export function UseCaseFlashCard({ useCase, onClick }: UseCaseFlashCardProps) {
  // Summarize products - take first 2
  const topProducts = useCase.microsoftProducts.slice(0, 2);
  const moreProductsCount = useCase.microsoftProducts.length - 2;

  // Summarize departments - take first 3
  const topDepartments = useCase.departments.slice(0, 3);
  const moreDepartmentsCount = useCase.departments.length - 3;

  // Summarize KPIs - take first 3
  const topKpis = useCase.kpis.slice(0, 3);

  // Shorten product names
  const summarizeProduct = (product: string) => {
    if (product.length > 35) {
      return product.substring(0, 35) + '...';
    }
    return product;
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:border-gray-300 bg-white border border-gray-200"
      onClick={onClick}
    >
      <CardHeader className="pb-3 pt-4 px-5">
        <div className="space-y-2">
          <h3 className="text-base font-medium text-gray-900 leading-tight">
            {useCase.useCase}
          </h3>
          <Badge 
            variant="outline" 
            className="text-xs font-normal border-gray-300 text-gray-600 bg-gray-50"
          >
            {useCase.subCategory}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-5 space-y-3">
        {/* KPIs */}
        {topKpis.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Primary KPIs</p>
            <div className="space-y-1">
              {topKpis.map((kpi, idx) => (
                <p key={idx} className="text-xs text-gray-700 leading-relaxed">
                  {kpi}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Departments */}
        {topDepartments.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Departments</p>
            <div className="flex flex-wrap gap-1">
              {topDepartments.map((dept, idx) => (
                <span 
                  key={idx} 
                  className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                >
                  {dept}
                </span>
              ))}
              {moreDepartmentsCount > 0 && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  +{moreDepartmentsCount} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Microsoft Products */}
        {topProducts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Solutions</p>
            <div className="space-y-1">
              {topProducts.map((product, idx) => (
                <p key={idx} className="text-xs text-gray-600 leading-relaxed">
                  {summarizeProduct(product)}
                </p>
              ))}
              {moreProductsCount > 0 && (
                <p className="text-xs text-gray-500 italic">
                  +{moreProductsCount} more solution{moreProductsCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

