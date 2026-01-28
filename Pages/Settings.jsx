/**
 * @file Settings.jsx
 * @description Страница настроек приложения (валюта, тема, управление тегами)
 * @author Vododokhov Aleksey
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useAppSettings } from '@/components/hooks/useAppSettings';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Palette, 
  Tag, 
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const currencies = [
  { value: 'RUB', symbol: '₽', label: 'Российский рубль' },
  { value: 'USD', symbol: '$', label: 'Доллар США' },
  { value: 'EUR', symbol: '€', label: 'Евро' },
  { value: 'GBP', symbol: '£', label: 'Фунт стерлингов' },
  { value: 'CNY', symbol: '¥', label: 'Китайский юань' },
  { value: 'JPY', symbol: '¥', label: 'Японская иена' },
];

const themes = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
  { value: 'system', label: 'Системная' },
];

const tagColors = [
  '#0071E3', '#34C759', '#FF9500', '#FF3B30', 
  '#AF52DE', '#5856D6', '#FF2D55', '#00C7BE'
];

/**
 * Страница настроек
 * @returns {JSX.Element} Страница с настройками валюты, темы и управлением тегами
 */
export default function SettingsPage() {
  const { settings, updateSettings, isUpdating } = useAppSettings();
  const [saved, setSaved] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagForm, setTagForm] = useState({ name: '', color: '#0071E3' });

  const queryClient = useQueryClient();

  const { data: tags = [], isLoading: tagsLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => base44.entities.Tag.list(),
  });

  const createTagMutation = useMutation({
    mutationFn: (data) => base44.entities.Tag.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      resetTagForm();
    }
  });

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Tag.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      resetTagForm();
    }
  });

  const deleteTagMutation = useMutation({
    mutationFn: (id) => base44.entities.Tag.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    }
  });

  const resetTagForm = () => {
    setTagForm({ name: '', color: '#0071E3' });
    setEditingTag(null);
    setTagDialogOpen(false);
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setTagForm({ name: tag.name, color: tag.color || '#0071E3' });
    setTagDialogOpen(true);
  };

  const handleSaveTag = () => {
    if (editingTag) {
      updateTagMutation.mutate({ id: editingTag.id, data: tagForm });
    } else {
      createTagMutation.mutate(tagForm);
    }
  };

  const handleCurrencyChange = (value) => {
    const currency = currencies.find(c => c.value === value);
    updateSettings({ 
      currency: value, 
      currency_symbol: currency?.symbol || value 
    });
    showSaved();
  };

  const handleThemeChange = (value) => {
    updateSettings({ theme: value });
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
            Настройки
          </h1>
          <p className="text-[#86868B] mt-1">
            Настройте приложение под себя
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Сохранено</span>
          </div>
        )}
      </div>

      {/* Currency Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Валюта</CardTitle>
              <CardDescription>Выберите валюту для отображения цен</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Select 
            value={settings.currency} 
            onValueChange={handleCurrencyChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{c.symbol}</span>
                    {c.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Тема оформления</CardTitle>
              <CardDescription>Выберите внешний вид приложения</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={cn(
                  "flex-1 p-4 rounded-xl border-2 transition-all",
                  settings.theme === theme.value
                    ? "border-[#0071E3] bg-[#0071E3]/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <p className="font-medium text-[#1D1D1F]">{theme.label}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Теги</CardTitle>
                <CardDescription>Управление тегами для классификации</CardDescription>
              </div>
            </div>
            <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full"
                  onClick={() => { setEditingTag(null); setTagForm({ name: '', color: '#0071E3' }); }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingTag ? 'Редактировать тег' : 'Новый тег'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tagName">Название</Label>
                    <Input
                      id="tagName"
                      value={tagForm.name}
                      onChange={(e) => setTagForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Название тега"
                    />
                  </div>
                  <div>
                    <Label>Цвет</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tagColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setTagForm(prev => ({ ...prev, color }))}
                          className={cn(
                            "w-8 h-8 rounded-full transition-all",
                            tagForm.color === color && "ring-2 ring-offset-2 ring-[#0071E3]"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={resetTagForm}>
                      Отмена
                    </Button>
                    <Button 
                      onClick={handleSaveTag}
                      disabled={!tagForm.name}
                      className="bg-[#0071E3] hover:bg-[#0077ED] text-white"
                    >
                      {editingTag ? 'Сохранить' : 'Создать'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <p className="text-center text-[#86868B] py-8">
              Теги не созданы
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тег</TableHead>
                  <TableHead className="w-[100px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: tag.color || '#0071E3' }}
                        />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTag(tag)}
                          className="h-8 w-8"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTagMutation.mutate(tag.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}