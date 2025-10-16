'use client';

import { UseCaseRecord } from '@/lib/csv-parser';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UseCaseFlashCard } from './use-case-flash-card';
import { UseCaseDetailDialog } from './use-case-detail-dialog';
import { useState } from 'react';

interface CategoryFlashCardsModalProps {
  category: string;
  useCases: UseCaseRecord[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCluster?: (useCaseId: string, cluster: string) => void;
  onUpdateValueSize?: (useCaseId: string, valueSize: 'Small' | 'Medium' | 'Large') => void;
  availableClusters?: string[];
}

export function CategoryFlashCardsModal({
  category,
  useCases,
  open,
  onOpenChange,
  onUpdateCluster,
  onUpdateValueSize,
  availableClusters = []
}: CategoryFlashCardsModalProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseRecord | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleCardClick = (useCase: UseCaseRecord) => {
    setSelectedUseCase(useCase);
    setDetailDialogOpen(true);
  };

  const handleDetailDialogClose = (open: boolean) => {
    setDetailDialogOpen(open);
    if (!open) {
      // Small delay before clearing to allow animation
      setTimeout(() => setSelectedUseCase(null), 200);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {category}
            </DialogTitle>
            <p className="text-sm text-gray-500 pt-1">
              {useCases.length} use case{useCases.length !== 1 ? 's' : ''}
            </p>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              {useCases.map((useCase) => (
                <UseCaseFlashCard
                  key={useCase.id}
                  useCase={useCase}
                  onClick={() => handleCardClick(useCase)}
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <UseCaseDetailDialog
        useCase={selectedUseCase}
        open={detailDialogOpen}
        onOpenChange={handleDetailDialogClose}
        onUpdateCluster={onUpdateCluster}
        onUpdateValueSize={onUpdateValueSize}
        availableClusters={availableClusters}
      />
    </>
  );
}

