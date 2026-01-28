/**
 * @file Coins.jsx
 * @description Страница галереи монет с поиском, фильтрами и управлением
 * @author Vododokhov Aleksey
 */

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Grid, List } from 'lucide-react';
import CollectibleCard from '@/components/collectibles/CollectibleCard';
import CollectibleForm from '@/components/collectibles/CollectibleForm';
import EmptyState from '@/components/collectibles/EmptyState';
import AdvancedFilters from '@/components/filters/AdvancedFilters';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

/**
 * Страница галереи монет
 * @returns {JSX.Element} Страница с коллекцией монет
 */
export default function CoinsPage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [filters, setFilters] = useState({});

  const queryClient = useQueryClient();

  const { data: collectibles = [], isLoading } = useQuery({
    queryKey: ['collectibles', 'coin'],
    queryFn: () => base44.entities.Collectible.filter({ type: 'coin' }, '-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Collectible.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectibles'] });
      setFormOpen(false);
      setEditingItem(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Collectible.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectibles'] });
      setFormOpen(false);
      setEditingItem(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Collectible.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectibles'] });
      setDeleteItem(null);
    }
  });

  const handleSave = (data) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate({ ...data, type: 'coin' });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleToggleFavorite = (item) => {
    updateMutation.mutate({ 
      id: item.id, 
      data: { is_favorite: !item.is_favorite } 
    });
  };

  const filteredItems = useMemo(() => {
    return collectibles.filter(item => {
      // Search
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch = 
          item.name?.toLowerCase().includes(searchLower) ||
          item.country?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Year filter
      if (filters.yearFrom && item.year < parseInt(filters.yearFrom)) return false;
      if (filters.yearTo && item.year > parseInt(filters.yearTo)) return false;

      // Price filter
      if (filters.priceFrom && (item.current_value || 0) < parseFloat(filters.priceFrom)) return false;
      if (filters.priceTo && (item.current_value || 0) > parseFloat(filters.priceTo)) return false;

      // Country filter
      if (filters.country && !item.country?.toLowerCase().includes(filters.country.toLowerCase())) return false;

      // Category filter
      if (filters.categoryId && item.category_id !== filters.categoryId) return false;

      // Condition filter
      if (filters.conditions?.length > 0 && !filters.conditions.includes(item.condition)) return false;

      // Status filter
      if (filters.statuses?.length > 0 && !filters.statuses.includes(item.status)) return false;

      // Has images filter
      if (filters.hasImages === true && !item.front_image && !item.back_image) return false;
      if (filters.hasImages === false && (item.front_image || item.back_image)) return false;

      return true;
    });
  }, [collectibles, search, filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
            Монеты
          </h1>
          <p className="text-[#86868B] mt-1">
            {collectibles.length} {collectibles.length === 1 ? 'монета' : 'монет'} в коллекции
          </p>
        </div>
        <Button 
          onClick={() => { setEditingItem(null); setFormOpen(true); }}
          className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full h-11 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Добавить монету
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
          <Input
            placeholder="Поиск по названию, стране..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-xl bg-white border-gray-200"
          />
        </div>
        <div className="flex gap-2">
          <AdvancedFilters 
            filters={filters} 
            onFiltersChange={setFilters}
            type="coin"
            storageKey="coinsFilters"
          />
          <div className="flex bg-white rounded-xl border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'grid' ? "bg-[#F5F5F7]" : "hover:bg-gray-50"
              )}
            >
              <Grid className="w-5 h-5 text-[#1D1D1F]" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'list' ? "bg-[#F5F5F7]" : "hover:bg-gray-50"
              )}
            >
              <List className="w-5 h-5 text-[#1D1D1F]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState type="coin" onAdd={() => { setEditingItem(null); setFormOpen(true); }} />
      ) : (
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' 
            ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {filteredItems.map((item) => (
            <CollectibleCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={setDeleteItem}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <CollectibleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        onSave={handleSave}
        defaultType="coin"
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить предмет?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить "{deleteItem?.name}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate(deleteItem.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}