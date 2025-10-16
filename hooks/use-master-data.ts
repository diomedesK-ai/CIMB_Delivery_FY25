'use client';

import { useState, useEffect } from 'react';
import { UseCaseRecord, loadMasterUseCases, saveUseCasesToCSV } from '@/lib/csv-parser';

/**
 * Custom hook to manage master use case data
 * Provides loading, caching, and sync functionality
 */
export function useMasterData() {
  const [useCases, setUseCases] = useState<UseCaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load use cases on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadMasterUseCases();
      setUseCases(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load use cases');
      console.error('Error loading use cases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Add a new use case and save to CSV
   */
  const addUseCase = async (useCase: Omit<UseCaseRecord, 'id'>) => {
    try {
      // Generate ID
      const id = useCase.useCase.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      const newUseCase: UseCaseRecord = {
        ...useCase,
        id,
      };
      
      const updatedUseCases = [...useCases, newUseCase];
      setUseCases(updatedUseCases);
      
      // Save to CSV
      await saveUseCasesToCSV(updatedUseCases);
      setLastUpdated(new Date());
      
      return newUseCase;
    } catch (err) {
      setError('Failed to add use case');
      console.error('Error adding use case:', err);
      throw err;
    }
  };

  /**
   * Update an existing use case and save to CSV
   */
  const updateUseCase = async (id: string, updates: Partial<UseCaseRecord>) => {
    try {
      const updatedUseCases = useCases.map(uc =>
        uc.id === id ? { ...uc, ...updates } : uc
      );
      
      setUseCases(updatedUseCases);
      
      // Save to CSV
      await saveUseCasesToCSV(updatedUseCases);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to update use case');
      console.error('Error updating use case:', err);
      throw err;
    }
  };

  /**
   * Delete a use case and save to CSV
   */
  const deleteUseCase = async (id: string) => {
    try {
      const updatedUseCases = useCases.filter(uc => uc.id !== id);
      setUseCases(updatedUseCases);
      
      // Save to CSV
      await saveUseCasesToCSV(updatedUseCases);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to delete use case');
      console.error('Error deleting use case:', err);
      throw err;
    }
  };

  /**
   * Refresh data from CSV
   */
  const refresh = async () => {
    await loadData();
  };

  return {
    useCases,
    isLoading,
    error,
    lastUpdated,
    addUseCase,
    updateUseCase,
    deleteUseCase,
    refresh,
  };
}


