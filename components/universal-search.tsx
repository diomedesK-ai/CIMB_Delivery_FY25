'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, X, TrendingUp, Package, Users, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMasterData } from '@/hooks/use-master-data';
import { UseCaseRecord } from '@/lib/csv-parser';
import { useRouter } from 'next/navigation';

export function UniversalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const { useCases } = useMasterData();
  const router = useRouter();

  interface SearchResult {
    type: 'use-case' | 'category' | 'department' | 'product';
    title: string;
    subtitle: string;
    category?: string;
    roi?: number;
    link: string;
    useCase?: UseCaseRecord;
    isNew?: boolean;
  }
  
  // Helper to check if a use case is newly added
  const isNewUseCase = (group: string): boolean => {
    return group === 'AI Collections & Recovery Hub' || group === 'AI Intelligent Loan Operations Hub';
  };

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const searchUseCases = useCallback((searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const queryWords = lowerQuery.split(' ').filter(w => w.length > 0);
    const foundResults: SearchResult[] = [];
    const seenTitles = new Set<string>(); // Deduplicate results

    // Helper function for better matching (supports partial word matching)
    const matchScore = (text: string | undefined | null): number => {
      if (!text) return 0; // Safety check for undefined/null
      const lowerText = text.toLowerCase();
      if (lowerText === lowerQuery) return 100; // Exact match
      if (lowerText.startsWith(lowerQuery)) return 90; // Starts with
      if (lowerText.includes(lowerQuery)) return 80; // Contains phrase
      
      // Check if all query words are present
      const allWordsMatch = queryWords.every(word => lowerText.includes(word));
      if (allWordsMatch) return 70;
      
      // Check if some query words are present
      const matchingWords = queryWords.filter(word => lowerText.includes(word));
      if (matchingWords.length > 0) return 50 + (matchingWords.length / queryWords.length) * 20;
      
      return 0;
    };

    // Search in use cases with scoring
    const useCaseResults: Array<SearchResult & { score: number }> = [];
    useCases.forEach((uc) => {
      const nameScore = matchScore(uc.useCase);
      const categoryScore = matchScore(uc.group) * 0.8;
      const subCategoryScore = matchScore(uc.subCategory) * 0.6;
      const deptScore = Math.max(...(uc.departments?.map(d => matchScore(d)) || [0])) * 0.4;
      const productScore = Math.max(...(uc.microsoftProducts?.map(p => matchScore(p)) || [0])) * 0.5;

      const maxScore = Math.max(nameScore, categoryScore, subCategoryScore, deptScore, productScore);

      if (maxScore > 40) {
        const key = `use-case:${uc.useCase}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          useCaseResults.push({
            type: 'use-case',
            title: uc.useCase,
            subtitle: uc.group,
            category: uc.group,
            roi: uc.roi,
            link: '/use-cases',
            useCase: uc,
            isNew: isNewUseCase(uc.group),
            score: maxScore
          });
        }
      }
    });

    // Sort use cases by score and add to results
    useCaseResults.sort((a, b) => b.score - a.score);
    foundResults.push(...useCaseResults.slice(0, 20));

    // Search in categories (unique)
    const categories = new Set(useCases.map(uc => uc.group));
    const categoryResults: Array<SearchResult & { score: number }> = [];
    categories.forEach(cat => {
      const score = matchScore(cat);
      if (score > 40) {
        const key = `category:${cat}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          const categoryUseCases = useCases.filter(uc => uc.group === cat);
          categoryResults.push({
            type: 'category',
            title: cat,
            subtitle: `${categoryUseCases.length} use cases`,
            link: '/microsoft',
            category: cat,
            isNew: isNewUseCase(cat),
            score
          });
        }
      }
    });
    categoryResults.sort((a, b) => b.score - a.score);
    foundResults.push(...categoryResults.slice(0, 5));

    // Search in departments
    const departments = new Set<string>();
    useCases.forEach(uc => {
      uc.departments?.forEach(d => departments.add(d));
    });
    const deptResults: Array<SearchResult & { score: number }> = [];
    departments.forEach(dept => {
      const score = matchScore(dept);
      if (score > 40) {
        const key = `department:${dept}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          const deptUseCases = useCases.filter(uc => uc.departments?.includes(dept));
          deptResults.push({
            type: 'department',
            title: dept,
            subtitle: `${deptUseCases.length} use cases`,
            link: '/use-cases',
            score
          });
        }
      }
    });
    deptResults.sort((a, b) => b.score - a.score);
    foundResults.push(...deptResults.slice(0, 10));

    // Search in products
    const products = new Set<string>();
    useCases.forEach(uc => {
      uc.microsoftProducts?.forEach(p => products.add(p));
    });
    const productResults: Array<SearchResult & { score: number }> = [];
    products.forEach(product => {
      const score = matchScore(product);
      if (score > 40) {
        const key = `product:${product}`;
        if (!seenTitles.has(key)) {
          seenTitles.add(key);
          const productUseCases = useCases.filter(uc => uc.microsoftProducts?.includes(product));
          productResults.push({
            type: 'product',
            title: product,
            subtitle: `${productUseCases.length} use cases`,
            link: '/use-cases',
            score
          });
        }
      }
    });
    productResults.sort((a, b) => b.score - a.score);
    foundResults.push(...productResults.slice(0, 10));

    // Limit total results to 50
    setResults(foundResults.slice(0, 50));
  }, [useCases]);

  useEffect(() => {
    searchUseCases(query);
  }, [query, searchUseCases]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.link);
    setOpen(false);
    setQuery('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'use-case':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'category':
        return <Layers className="h-4 w-4 text-purple-600" />;
      case 'department':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'product':
        return <Package className="h-4 w-4 text-orange-600" />;
      default:
        return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'use-case': 'bg-blue-50 text-blue-700 border-blue-200',
      'category': 'bg-purple-50 text-purple-700 border-purple-200',
      'department': 'bg-green-50 text-green-700 border-green-200',
      'product': 'bg-orange-50 text-orange-700 border-orange-200'
    };

    const labels = {
      'use-case': 'Use Case',
      'category': 'Category',
      'department': 'Department',
      'product': 'Product'
    };

    return (
      <Badge variant="outline" className={`text-xs ${colors[type as keyof typeof colors]}`}>
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md min-w-[320px]"
      >
        <Search className="h-5 w-5 text-gray-400" />
        <span className="flex-1 text-left text-gray-500">Search use cases, categories...</span>
        <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 bg-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Search AI Use Cases</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[600px]">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search use cases, categories, departments, products..."
                className="flex-1 border-0 focus-visible:ring-0 text-base"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Results */}
            <ScrollArea className="flex-1 p-2">
              {query.length < 2 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Search className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500">
                    Type at least 2 characters to search
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Search across use cases, categories, departments, and products
                  </p>
                </div>
              )}

              {query.length >= 2 && results.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Search className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500">
                    No results found for "{query}"
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Try different keywords or check spelling
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-1">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left border border-transparent hover:border-gray-200"
                    >
                      <div className="mt-1">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          {result.isNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-amber-900 border border-amber-600 shrink-0">
                              NEW
                            </span>
                          )}
                          {result.roi && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs shrink-0">
                              {result.roi}% ROI
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {result.subtitle}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {getTypeBadge(result.type)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">↵</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded">esc</kbd>
                  <span>Close</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {results.length > 0 && `${results.length} result${results.length !== 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

