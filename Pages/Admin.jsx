/**
 * @file Admin.jsx
 * @description Административная панель для управления коллекцией и категориями
 * @author Vododokhov Aleksey
 */

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Download, 
  Upload,
  Coins,
  Banknote,
  Medal,
  FolderOpen,
  Image
} from 'lucide-react';
import CollectibleForm from '@/components/collectibles/CollectibleForm';
import BulkImportDialog from '@/components/admin/BulkImportDialog';
import CategoryManager from '@/components/admin/CategoryManager';
import { useAppSettings } from '@/components/hooks/useAppSettings';
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

const typeLabels = {
  'coin': 'Монета',
  'banknote': 'Банкнота',
  'medal': 'Медаль'
};

const typeIcons = {
  'coin': Coins,
  'banknote': Banknote,
  'medal': Medal
};

const statusLabels = {
  'in_collection': 'В коллекции',
  'for_sale': 'На продажу',
  'sold': 'Продано',
  'wishlist': 'Желаемое'
};

const statusColors = {
  'in_collection': 'bg-green-100 text-green-800',
  'for_sale': 'bg-blue-100 text-blue-800',
  'sold': 'bg-gray-100 text-gray-800',
  'wishlist': 'bg-purple-100 text-purple-800'
};

/**
 * Административная страница
 * @returns {JSX.Element} Страница с таблицей предметов, массовыми операциями и управлением категориями
 */
export default function AdminPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('items');

  const { formatPrice } = useAppSettings();
  const queryClient = useQueryClient();

  const { data: collectibles = [], isLoading } = useQuery({
    queryKey: ['collectibles'],
    queryFn: () => base44.entities.Collectible.list('-created_date'),
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

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map(id => base44.entities.Collectible.delete(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectibles'] });
      setSelectedIds([]);
      setBulkDeleteOpen(false);
    }
  });

  const handleSave = (data) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredItems.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Название', 'Тип', 'Страна', 'Год', 'Номинал', 'Стоимость', 'Состояние', 'Статус'];
    const rows = filteredItems.map(item => [
      item.name,
      typeLabels[item.type],
      item.country || '',
      item.year || '',
      item.denomination || '',
      item.current_value || '',
      item.condition || '',
      statusLabels[item.status] || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `collection_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredItems = useMemo(() => {
    return collectibles.filter(item => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          item.name?.toLowerCase().includes(searchLower) ||
          item.country?.toLowerCase().includes(searchLower) ||
          item.catalog_number?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [collectibles, typeFilter, statusFilter, search]);

  const stats = {
    total: collectibles.length,
    totalValue: collectibles.reduce((sum, c) => sum + (c.current_value || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
            Администратор
          </h1>
          <p className="text-[#86868B] mt-1">
            {stats.total} предметов • {formatPrice(stats.totalValue)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setImportOpen(true)}
            className="rounded-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Импорт
          </Button>
          <Button 
            variant="outline"
            onClick={exportToCSV}
            className="rounded-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
          <Button 
            onClick={() => { setEditingItem(null); setFormOpen(true); }}
            className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#F5F5F7] p-1 rounded-xl">
          <TabsTrigger value="items" className="rounded-lg">
            Предметы
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg">
            <FolderOpen className="w-4 h-4 mr-2" />
            Категории
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4 mt-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
              <Input
                placeholder="Поиск по названию, стране, каталожному номеру..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-white border-gray-200"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40 h-12 rounded-xl">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="coin">Монеты</SelectItem>
                <SelectItem value="banknote">Банкноты</SelectItem>
                <SelectItem value="medal">Медали</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 h-12 rounded-xl">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="in_collection">В коллекции</SelectItem>
                <SelectItem value="for_sale">На продажу</SelectItem>
                <SelectItem value="sold">Продано</SelectItem>
                <SelectItem value="wishlist">Желаемое</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-[#0071E3]/5 rounded-xl">
              <span className="text-sm font-medium text-[#0071E3]">
                Выбрано: {selectedIds.length}
              </span>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => setBulkDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить выбранные
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F5F5F7]">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-16">Фото</TableHead>
                    <TableHead>Название</TableHead>
                    <TableHead className="hidden md:table-cell">Тип</TableHead>
                    <TableHead className="hidden lg:table-cell">Страна</TableHead>
                    <TableHead className="hidden lg:table-cell">Год</TableHead>
                    <TableHead>Стоимость</TableHead>
                    <TableHead className="hidden md:table-cell">Статус</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const TypeIcon = typeIcons[item.type];
                    return (
                      <TableRow 
                        key={item.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleEdit(item)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedIds.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          {item.front_image ? (
                            <img 
                              src={item.front_image} 
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#F5F5F7] flex items-center justify-center">
                              <Image className="w-5 h-5 text-[#86868B]" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-[#1D1D1F]">{item.name}</p>
                            <p className="text-sm text-[#86868B] md:hidden">
                              {typeLabels[item.type]}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <TypeIcon className="w-4 h-4 text-[#86868B]" />
                            <span>{typeLabels[item.type]}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-[#86868B]">
                          {item.country || '—'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-[#86868B]">
                          {item.year || '—'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.current_value ? formatPrice(item.current_value) : '—'}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={cn("font-normal", statusColors[item.status])}>
                            {statusLabels[item.status] || 'В коллекции'}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Редактировать
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => setDeleteItem(item)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-[#86868B]">
                        {isLoading ? 'Загрузка...' : 'Предметы не найдены'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <CategoryManager />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CollectibleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        onSave={handleSave}
      />

      <BulkImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
      />

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

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить выбранные предметы?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить {selectedIds.length} предметов? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => bulkDeleteMutation.mutate(selectedIds)}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить все
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}