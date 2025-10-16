'use client';

import { useState } from 'react';
import { useMasterData } from '@/hooks/use-master-data';
import { UseCaseRecord } from '@/lib/csv-parser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, RefreshCw, Save, Building2, Target, Package } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ManageUseCasesPage() {
  const { useCases, isLoading, error, addUseCase, updateUseCase, deleteUseCase, refresh, lastUpdated } = useMasterData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUseCase, setEditingUseCase] = useState<UseCaseRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state for new/edit use case
  const [formData, setFormData] = useState<Partial<UseCaseRecord>>({
    group: '',
    subCategory: '',
    useCase: '',
    departments: [],
    kpis: [],
    microsoftProducts: [],
  });

  const handleSubmit = async () => {
    try {
      if (editingUseCase) {
        await updateUseCase(editingUseCase.id, formData);
        setSuccessMessage(`Use case "${formData.useCase}" updated successfully!`);
      } else {
        await addUseCase(formData as Omit<UseCaseRecord, 'id'>);
        setSuccessMessage(`Use case "${formData.useCase}" added successfully!`);
      }
      
      // Reset form
      setFormData({
        group: '',
        subCategory: '',
        useCase: '',
        departments: [],
        kpis: [],
        microsoftProducts: [],
      });
      setIsAddDialogOpen(false);
      setEditingUseCase(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error saving use case:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteUseCase(id);
        setSuccessMessage(`Use case "${name}" deleted successfully!`);
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (err) {
        console.error('Error deleting use case:', err);
      }
    }
  };

  const handleEdit = (useCase: UseCaseRecord) => {
    setEditingUseCase(useCase);
    setFormData(useCase);
    setIsAddDialogOpen(true);
  };

  const filteredUseCases = useCases.filter(uc =>
    uc.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uc.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uc.subCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parseCommaSeparated = (value: string): string[] => {
    return value.split(',').map(v => v.trim()).filter(v => v);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Use Cases</h1>
          <p className="text-muted-foreground mt-2">
            Two-way sync with master CSV file - changes here update the CSV immediately
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh from CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingUseCase(null); setFormData({ group: '', subCategory: '', useCase: '', departments: [], kpis: [], microsoftProducts: [] }); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Use Case
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingUseCase ? 'Edit Use Case' : 'Add New Use Case'}</DialogTitle>
                <DialogDescription>
                  {editingUseCase ? 'Update the use case details below.' : 'Enter the details for the new use case. Changes will be saved to the master CSV.'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="group">Group</Label>
                  <Input
                    id="group"
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    placeholder="e.g., 0. Everyday AI Productivity"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subCategory">Sub-Category</Label>
                  <Input
                    id="subCategory"
                    value={formData.subCategory}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    placeholder="e.g., 0.A Knowledge & Document Co-Pilots"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useCase">Use Case Name *</Label>
                  <Input
                    id="useCase"
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    placeholder="e.g., Copilot Studio for most office workers"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departments">Departments (comma-separated)</Label>
                  <Textarea
                    id="departments"
                    value={formData.departments?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, departments: parseCommaSeparated(e.target.value) })}
                    placeholder="e.g., IT/CTO & Engineering, Data & Analytics (CDO), HR / L&D"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kpis">Primary KPIs (comma-separated)</Label>
                  <Textarea
                    id="kpis"
                    value={formData.kpis?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, kpis: parseCommaSeparated(e.target.value) })}
                    placeholder="e.g., Time saved per user/day, Search-to-answer success rate"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="products">Microsoft Products (comma-separated)</Label>
                  <Textarea
                    id="products"
                    value={formData.microsoftProducts?.join(', ')}
                    onChange={(e) => setFormData({ ...formData, microsoftProducts: parseCommaSeparated(e.target.value) })}
                    placeholder="e.g., Microsoft 365 Copilot, Azure AI Search"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); setEditingUseCase(null); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={!formData.useCase}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingUseCase ? 'Update' : 'Add'} Use Case
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Use Cases</CardTitle>
          <CardDescription>Filter use cases by name, group, or sub-category</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search use cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Use Cases List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading use cases...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUseCases.map((useCase) => (
            <Card key={useCase.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{useCase.useCase}</CardTitle>
                    <CardDescription className="mt-2">
                      {useCase.group} → {useCase.subCategory}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(useCase)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(useCase.id, useCase.useCase)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Departments */}
                  {useCase.departments.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Departments</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {useCase.departments.map((dept, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KPIs */}
                  {useCase.kpis.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Primary KPIs</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {useCase.kpis.map((kpi, idx) => (
                          <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {kpi}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Microsoft Products */}
                  {useCase.microsoftProducts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <Package className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Microsoft Products</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {useCase.microsoftProducts.slice(0, 5).map((product, idx) => (
                          <span key={idx} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                            {product}
                          </span>
                        ))}
                        {useCase.microsoftProducts.length > 5 && (
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                            +{useCase.microsoftProducts.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUseCases.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No use cases found. {searchQuery ? 'Try a different search.' : 'Add your first use case!'}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Stats Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">{useCases.length}</div>
              <div className="text-sm text-muted-foreground">Total Use Cases</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {new Set(useCases.flatMap(uc => uc.departments)).size}
              </div>
              <div className="text-sm text-muted-foreground">Unique Departments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(useCases.flatMap(uc => uc.microsoftProducts)).size}
              </div>
              <div className="text-sm text-muted-foreground">Microsoft Products</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




