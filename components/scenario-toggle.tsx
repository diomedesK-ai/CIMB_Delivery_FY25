'use client';

import { useScenario, Scenario } from '@/contexts/scenario-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function ScenarioToggle() {
  const { scenario, setScenario, scenarioLabel, scenarioDescription } = useScenario();

  return (
    <Card className="border-2 border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">ROI Scenario</h3>
            <p className="text-xs text-gray-600">{scenarioDescription}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setScenario('conservative')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                ${scenario === 'conservative'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }
              `}
            >
              <TrendingDown className="h-4 w-4" />
              <span className="font-semibold text-sm">Conservative</span>
            </button>
            <button
              onClick={() => setScenario('bestcase')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all
                ${scenario === 'bestcase'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                }
              `}
            >
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold text-sm">Best Case</span>
            </button>
          </div>
        </div>
        
        {scenario === 'bestcase' && (
          <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
            <p className="text-xs text-green-800">
              <strong>Best Case:</strong> Based on Forrester TEI benchmarks and industry high-end performance. 
              ROI values increased by 20-90% to reflect proven optimal outcomes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


