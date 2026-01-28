/**
 * @file AdvancedFilters.jsx
 * @description Компонент расширенных фильтров для коллекции с сохранением настроек
 * @author Vododokhov Aleksey
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const conditions = [
  { value: 'PR', label: 'Proof' },
  { value: 'UNC', label: 'Uncirculated' },
  { value: 'AU', label: 'About Uncirculated' },
  { value: 'XF', label: 'Extremely Fine' },
  { value: 'VF', label: 'Very Fine' },
  { value: 'F', label: 'Fine' },
  { value: 'VG', label: 'Very Good' },
  { value: 'G', label: 'Good' },
];

const statuses = [
  { value: 'in_collection', label: 'В коллекции' },
  { value: 'for_sale', label: 'На продажу' },
  { value: 'sold', label: 'Продано' },
  { value: 'wishlist', label: 'Желаемое' },
];

const defaultFilters = {
  yearFrom: '',
  yearTo: '',
  conditions: [],
  statuses: [],
  hasImages: null,
  categoryId: '',
  country: '',
  priceFrom: '',
  priceTo: '',
};

/**
 * Компонент расширенных фильтров
 * @param {Object} props - Свойства компонента
 * @param {Object} props.filters - Текущие фильтры
 * @param {Function} props.onFiltersChange - Обработчик изменения фильтров
 * @param {string} [props.type] - Тип предметов для фильтрации категорий
 * @param {string} [props.storageKey='collectionFilters'] - Ключ для localStorage
 * @returns {JSX.Element} Боковая панель с фильтрами
 */
export default function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  type,
  storageKey = 'collectionFilters'
}) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(defaultFilters);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setLocalFilters(parsed);
      onFiltersChange(parsed);
    }
  }, [storageKey]);

  const saveFilters = (newFilters) => {
    localStorage.setItem(storageKey, JSON.stringify(newFilters));
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const applyFilters = () => {
    saveFilters(localFilters);
    setOpen(false);
  };

  const resetFilters = () => {
    saveFilters(defaultFilters);
    setOpen(false);
  };

  const toggleCondition = (condition) => {
    setLocalFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const toggleStatus = (status) => {
    setLocalFilters(prev => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter(s => s !== status)
        : [...prev.statuses, status]
    }));
  };

  const activeFiltersCount = Object.values(filters || {}).filter(v => 
    v !== '' && v !== null && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const filteredCategories = categories.filter(
    c => c.type === 'all' || c.type === type
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Фильтры
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0071E3] text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-[#1D1D1F]">
            Расширенные фильтры
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Year Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1D1D1F]">Год выпуска</Label>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="От"
                value={localFilters.yearFrom}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, yearFrom: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="До"
                value={localFilters.yearTo}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, yearTo: e.target.value }))}
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1D1D1F]">Стоимость</Label>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="От"
                value={localFilters.priceFrom}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priceFrom: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="До"
                value={localFilters.priceTo}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, priceTo: e.target.value }))}
              />
            </div>
          </div>

          {/* Country */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1D1D1F]">Страна</Label>
            <Input
              placeholder="Введите страну"
              value={localFilters.country}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, country: e.target.value }))}
            />
          </div>

          {/* Category */}
          {filteredCategories.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[#1D1D1F]">Категория</Label>
              <Select
                value={localFilters.categoryId}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Все категории</SelectItem>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Condition */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1D1D1F]">Состояние</Label>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <button
                  key={c.value}
                  onClick={() => toggleCondition(c.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-colors",
                    localFilters.conditions.includes(c.value)
                      ? "bg-[#0071E3] text-white"
                      : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-gray-200"
                  )}
                >
                  {c.value}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1D1D1F]">Статус</Label>
            <div className="space-y-2">
              {statuses.map((s) => (
                <div key={s.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={s.value}
                    checked={localFilters.statuses.includes(s.value)}
                    onCheckedChange={() => toggleStatus(s.value)}
                  />
                  <label htmlFor={s.value} className="text-sm text-[#1D1D1F] cursor-pointer">
                    {s.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Has Images */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1D1D1F]">Фотографии</Label>
            <Select
              value={localFilters.hasImages === null ? '' : localFilters.hasImages.toString()}
              onValueChange={(value) => setLocalFilters(prev => ({ 
                ...prev, 
                hasImages: value === '' ? null : value === 'true' 
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Все</SelectItem>
                <SelectItem value="true">С фото</SelectItem>
                <SelectItem value="false">Без фото</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={resetFilters}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Сбросить
          </Button>
          <Button 
            className="flex-1 bg-[#0071E3] hover:bg-[#0077ED] text-white"
            onClick={applyFilters}
          >
            Применить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}