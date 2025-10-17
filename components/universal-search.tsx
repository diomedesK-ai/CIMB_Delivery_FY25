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
import { UseCaseDetailDialog } from '@/components/use-case-detail-dialog';

type FilterType = 'new' | 'high-roi' | 'medium-roi' | 'low-roi' | 'category' | 'type';

export function UniversalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allResults, setAllResults] = useState<SearchResult[]>([]); // Store unfiltered results
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
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
  // NEW use cases: All Collections + 10 recently added Loan Operations
  const newUseCaseNames = new Set([
    // Collections (8 use cases)
    'AI Predictive Collections Segmentation',
    'AI Collections Outreach Orchestration',
    'AI Dynamic Payment Plan Optimizer',
    'AI Collections Sentiment & Compliance Monitor',
    'AI Collections Performance Analytics',
    'AI Fraud Detection in Collections',
    'AI Conversational Collections Assistant',
    'AI Early Warning & Proactive Collections',
    // Recently added Loan Operations (10 use cases)
    'AI Alternative Credit Scoring Engine',
    'Real-Time Loan Decision Engine',
    'AI Loan Application Fraud Detection',
    'Autonomous Pre-Approval & Instant Offers',
    'AI Loan Portfolio Risk Optimizer',
    'Personalized Loan Product Recommender',
    'AI Dynamic Interest Rate & Pricing Engine',
    'AI Loan Servicing & Lifecycle Automation',
    'Cross-Sell Intelligence for Loan Products',
    'AI Loan Assistant & Onboarding Copilot'
  ]);

  const isNewUseCase = (useCaseName: string): boolean => {
    return newUseCaseNames.has(useCaseName);
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
            isNew: isNewUseCase(uc.useCase),
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
    setAllResults(foundResults.slice(0, 50));
  }, [useCases]);

  // Apply filters to results
  const applyFilters = useCallback(() => {
    if (activeFilters.size === 0) {
      setResults(allResults);
      return;
    }

    const filtered = allResults.filter(result => {
      // NEW filter
      if (activeFilters.has('new') && !result.isNew) {
        return false;
      }

      // ROI filters (only for use cases)
      if (result.roi !== undefined) {
        if (activeFilters.has('high-roi') && result.roi < 400) {
          return false;
        }
        if (activeFilters.has('medium-roi') && (result.roi < 300 || result.roi >= 400)) {
          return false;
        }
        if (activeFilters.has('low-roi') && result.roi >= 300) {
          return false;
        }
      }

      // Type filters
      if (activeFilters.has('use-case') && result.type !== 'use-case') {
        return false;
      }
      if (activeFilters.has('category') && result.type !== 'category') {
        return false;
      }
      if (activeFilters.has('department') && result.type !== 'department') {
        return false;
      }
      if (activeFilters.has('product') && result.type !== 'product') {
        return false;
      }

      return true;
    });

    setResults(filtered);
  }, [allResults, activeFilters]);

  useEffect(() => {
    applyFilters();
  }, [allResults, activeFilters, applyFilters]);

  useEffect(() => {
    searchUseCases(query);
  }, [query, searchUseCases]);

  const [selectedUseCaseForDialog, setSelectedUseCaseForDialog] = useState<UseCaseRecord | null>(null);

  const handleResultClick = (result: SearchResult) => {
    // If it's a use case, open the dialog instead of navigating
    if (result.type === 'use-case' && result.useCase) {
      setSelectedUseCaseForDialog(result.useCase);
      setOpen(false);
    } else {
      router.push(result.link);
      setOpen(false);
      setQuery('');
    }
  };

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
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
        className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md min-w-[550px]"
      >
        <Search className="h-5 w-5 text-gray-400" />
        <span className="flex-1 text-left text-gray-500">Search use cases, categories...</span>
        <kbd className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0 bg-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Search AI Use Cases</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[700px]">
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

            {/* Filters */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-600 mr-2">Filters:</span>
                
                {/* New Filter */}
                <button
                  onClick={() => toggleFilter('new')}
                  className={`inline-flex items-center px-4 py-1 rounded-md text-xs font-semibold transition-all ${
                    activeFilters.has('new')
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-800 border-2 border-amber-500'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-amber-400'
                  }`}
                >
                  New
                </button>

                {/* ROI Filters */}
                <button
                  onClick={() => toggleFilter('high-roi')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilters.has('high-roi')
                      ? 'bg-green-500 text-white border-2 border-green-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-green-500'
                  }`}
                >
                  High ROI (400%+)
                </button>
                <button
                  onClick={() => toggleFilter('medium-roi')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilters.has('medium-roi')
                      ? 'bg-blue-500 text-white border-2 border-blue-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  Medium ROI (300-399%)
                </button>
                <button
                  onClick={() => toggleFilter('low-roi')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilters.has('low-roi')
                      ? 'bg-gray-500 text-white border-2 border-gray-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-500'
                  }`}
                >
                  Low ROI (&lt;300%)
                </button>

                {/* Type Filters */}
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button
                  onClick={() => toggleFilter('use-case')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilters.has('use-case')
                      ? 'bg-blue-500 text-white border-2 border-blue-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-500'
                  }`}
                >
                  Use Cases
                </button>
                <button
                  onClick={() => toggleFilter('category')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilters.has('category')
                      ? 'bg-purple-500 text-white border-2 border-purple-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-500'
                  }`}
                >
                  Categories
                </button>
                <button
                  onClick={() => toggleFilter('department')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilters.has('department')
                      ? 'bg-green-500 text-white border-2 border-green-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-green-500'
                  }`}
                >
                  Departments
                </button>
                <button
                  onClick={() => toggleFilter('product')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    activeFilters.has('product')
                      ? 'bg-orange-500 text-white border-2 border-orange-600'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-orange-500'
                  }`}
                >
                  Products
                </button>

                {/* Clear Filters */}
                {activeFilters.size > 0 && (
                  <>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-300 hover:bg-red-100 transition-all"
                    >
                      <X className="h-3 w-3" />
                      Clear All
                    </button>
                  </>
                )}
              </div>
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
                <div className="space-y-2 px-2">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all text-left border-2 border-transparent hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="mt-0.5 p-2 bg-gray-100 rounded-lg">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <p className="text-base font-semibold text-gray-900">
                            {result.title}
                          </p>
                          {result.isNew && (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-800 border-2 border-amber-500 shrink-0">
                              New
                            </span>
                          )}
                          {result.roi && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-semibold shrink-0">
                              {result.roi}% ROI
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {result.subtitle}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getTypeBadge(result.type)}
                        </div>
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
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {results.length > 0 && (
                  <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                )}
                {activeFilters.size > 0 && (
                  <span className="text-amber-600 font-semibold">
                    ({activeFilters.size} filter{activeFilters.size !== 1 ? 's' : ''} active)
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Use Case Detail Dialog */}
      <UseCaseDetailDialog
        useCase={selectedUseCaseForDialog}
        open={selectedUseCaseForDialog !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedUseCaseForDialog(null);
          }
        }}
      />
    </>
  );
}

