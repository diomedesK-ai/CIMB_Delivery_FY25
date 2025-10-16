'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Scenario = 'conservative' | 'bestcase';

interface ScenarioContextType {
  scenario: Scenario;
  setScenario: (scenario: Scenario) => void;
  getAdjustedROI: (baseROI: number) => number;
  scenarioLabel: string;
  scenarioDescription: string;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenario] = useState<Scenario>('conservative');

  const getAdjustedROI = (baseROI: number): number => {
    if (scenario === 'conservative') {
      return baseROI; // Base ROI is already conservative
    } else {
      // Best case: Use Forrester TEI baselines (typically 1.5-2x conservative)
      // More realistic industry benchmarks
      if (baseROI <= 150) return Math.round(baseROI * 1.9); // Very conservative → industry standard
      if (baseROI <= 250) return Math.round(baseROI * 1.5); // Conservative → realistic
      if (baseROI <= 350) return Math.round(baseROI * 1.3); // Mid-range → optimistic
      return Math.round(baseROI * 1.2); // Already high → slightly higher
    }
  };

  const scenarioLabel = scenario === 'conservative' ? 'Conservative' : 'Best Case';
  const scenarioDescription = scenario === 'conservative' 
    ? 'Conservative estimates with safety margins'
    : 'Best case based on Forrester TEI benchmarks';

  return (
    <ScenarioContext.Provider
      value={{
        scenario,
        setScenario,
        getAdjustedROI,
        scenarioLabel,
        scenarioDescription,
      }}
    >
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
}


