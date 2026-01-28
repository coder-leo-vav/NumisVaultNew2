/**
 * @file CollectibleForm.jsx
 * @description Форма создания и редактирования коллекционных предметов с AI-ассистентом
 * @author Vododokhov Aleksey
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Sparkles, Loader2, Wand2, Languages, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const conditions = [
  { value: 'PR', label: 'Proof (PR)' },
  { value: 'UNC', label: 'Uncirculated (UNC)' },
  { value: 'AU', label: 'About Uncirculated (AU)' },
  { value: 'XF', label: 'Extremely Fine (XF)' },
  { value: 'VF', label: 'Very Fine (VF)' },
  { value: 'F', label: 'Fine (F)' },
  { value: 'VG', label: 'Very Good (VG)' },
  { value: 'G', label: 'Good (G)' },
  { value: 'AG', label: 'About Good (AG)' },
  { value: 'FR', label: 'Fair (FR)' },
  { value: 'PO', label: 'Poor (PO)' },
];

const statuses = [
  { value: 'in_collection', label: 'В коллекции' },
  { value: 'for_sale', label: 'На продажу' },
  { value: 'sold', label: 'Продано' },
  { value: 'wishlist', label: 'Желаемое' },
];

const types = [
  { value: 'coin', label: 'Монета' },
  { value: 'banknote', label: 'Банкнота' },
  { value: 'medal', label: 'Медаль' },
];

/**
 * Форма создания/редактирования коллекционного предмета
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.open - Флаг открытия диалога
 * @param {Function} props.onOpenChange - Обработчик изменения состояния диалога
 * @param {Object} [props.item] - Редактируемый предмет (если null - создание нового)
 * @param {Function} props.onSave - Обработчик сохранения
 * @param {string} [props.defaultType] - Тип предмета по умолчанию
 * @returns {JSX.Element} Диалог с формой
 */
export default function CollectibleForm({ 
  open, 
  onOpenChange, 
  item, 
  onSave,
  defaultType 
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: defaultType || 'coin',
    country: '',
    year: '',
    denomination: '',
    currency: '',
    condition: '',
    purchase_price: '',
    current_value: '',
    purchase_date: '',
    front_image: '',
    back_image: '',
    description: '',
    description_en: '',
    notes: '',
    tags: [],
    category_id: '',
    material: '',
    weight: '',
    diameter: '',
    mint: '',
    catalog_number: '',
    status: 'in_collection'
  });
  
  const [uploading, setUploading] = useState({ front: false, back: false });
  const [aiLoading, setAiLoading] = useState({
    description: false,
    tags: false,
    translate: false,
    all: false
  });
  const [tagInput, setTagInput] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const { data: existingTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: () => base44.entities.Tag.list(),
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        year: item.year?.toString() || '',
        purchase_price: item.purchase_price?.toString() || '',
        current_value: item.current_value?.toString() || '',
        weight: item.weight?.toString() || '',
        diameter: item.diameter?.toString() || '',
        tags: item.tags || []
      });
    } else {
      setFormData(prev => ({
        ...prev,
        type: defaultType || 'coin',
        name: '',
        country: '',
        year: '',
        denomination: '',
        currency: '',
        condition: '',
        purchase_price: '',
        current_value: '',
        purchase_date: '',
        front_image: '',
        back_image: '',
        description: '',
        description_en: '',
        notes: '',
        tags: [],
        category_id: '',
        material: '',
        weight: '',
        diameter: '',
        mint: '',
        catalog_number: '',
        status: 'in_collection'
      }));
    }
  }, [item, defaultType, open]);

  const handleImageUpload = async (e, side) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [side]: true }));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        [side === 'front' ? 'front_image' : 'back_image']: file_url
      }));
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(prev => ({ ...prev, [side]: false }));
    }
  };

  const generateDescription = async () => {
    setAiLoading(prev => ({ ...prev, description: true }));
    try {
      const prompt = `Создай профессиональное описание для коллекционного предмета на русском языке:
Тип: ${formData.type === 'coin' ? 'Монета' : formData.type === 'banknote' ? 'Банкнота' : 'Медаль'}
Название: ${formData.name}
Страна: ${formData.country || 'не указана'}
Год: ${formData.year || 'не указан'}
Номинал: ${formData.denomination || 'не указан'}
Материал: ${formData.material || 'не указан'}
Состояние: ${formData.condition || 'не указано'}

Опиши историческую значимость, особенности и интересные факты. 2-3 предложения.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [formData.front_image, formData.back_image].filter(Boolean),
        response_json_schema: {
          type: 'object',
          properties: {
            description: { type: 'string' }
          }
        }
      });
      
      setFormData(prev => ({ ...prev, description: response.description }));
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, description: false }));
    }
  };

  const generateTags = async () => {
    setAiLoading(prev => ({ ...prev, tags: true }));
    try {
      const prompt = `Предложи 3-5 коротких тегов на русском языке для коллекционного предмета:
Тип: ${formData.type === 'coin' ? 'Монета' : formData.type === 'banknote' ? 'Банкнота' : 'Медаль'}
Название: ${formData.name}
Страна: ${formData.country || 'не указана'}
Год: ${formData.year || 'не указан'}
Описание: ${formData.description || 'нет'}

Верни массив тегов.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      });
      
      setFormData(prev => ({ ...prev, tags: [...new Set([...prev.tags, ...response.tags])] }));
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, tags: false }));
    }
  };

  const translateDescription = async () => {
    if (!formData.description) return;
    
    setAiLoading(prev => ({ ...prev, translate: true }));
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Переведи на английский язык: ${formData.description}`,
        response_json_schema: {
          type: 'object',
          properties: {
            translation: { type: 'string' }
          }
        }
      });
      
      setFormData(prev => ({ ...prev, description_en: response.translation }));
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, translate: false }));
    }
  };

  const fillAll = async () => {
    setAiLoading(prev => ({ ...prev, all: true }));
    try {
      const prompt = `Проанализируй изображения коллекционного предмета и заполни данные.
Тип предмета: ${formData.type === 'coin' ? 'Монета' : formData.type === 'banknote' ? 'Банкнота' : 'Медаль'}
${formData.name ? `Название: ${formData.name}` : ''}

Определи и верни JSON с полями:
- name (название на русском)
- country (страна)
- year (год как число)
- denomination (номинал)
- currency (валюта номинала)
- material (материал)
- condition (состояние: PR, UNC, AU, XF, VF, F, VG, G, AG, FR, PO)
- description (описание на русском, 2-3 предложения)
- tags (массив тегов на русском, 3-5 штук)`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [formData.front_image, formData.back_image].filter(Boolean),
        response_json_schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            country: { type: 'string' },
            year: { type: 'number' },
            denomination: { type: 'string' },
            currency: { type: 'string' },
            material: { type: 'string' },
            condition: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      setFormData(prev => ({
        ...prev,
        name: response.name || prev.name,
        country: response.country || prev.country,
        year: response.year?.toString() || prev.year,
        denomination: response.denomination || prev.denomination,
        currency: response.currency || prev.currency,
        material: response.material || prev.material,
        condition: response.condition || prev.condition,
        description: response.description || prev.description,
        tags: response.tags?.length ? [...new Set([...prev.tags, ...response.tags])] : prev.tags
      }));
    } catch (error) {
      console.error('AI error:', error);
    } finally {
      setAiLoading(prev => ({ ...prev, all: false }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : null,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
      current_value: formData.current_value ? parseFloat(formData.current_value) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      diameter: formData.diameter ? parseFloat(formData.diameter) : null,
    };
    onSave(data);
  };

  const filteredCategories = categories.filter(
    c => c.type === 'all' || c.type === formData.type
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1D1D1F]">
            {item ? 'Редактирование' : 'Новый предмет'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* AI Assistant Bar */}
          <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-[#F5F5F7] to-blue-50 rounded-xl">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillAll}
              disabled={aiLoading.all || (!formData.front_image && !formData.back_image)}
              className="bg-white"
            >
              {aiLoading.all ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Заполнить всё
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateDescription}
              disabled={aiLoading.description}
              className="bg-white"
            >
              {aiLoading.description ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Описание
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateTags}
              disabled={aiLoading.tags}
              className="bg-white"
            >
              {aiLoading.tags ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Tag className="w-4 h-4 mr-2" />
              )}
              Теги
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={translateDescription}
              disabled={aiLoading.translate || !formData.description}
              className="bg-white"
            >
              {aiLoading.translate ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Languages className="w-4 h-4 mr-2" />
              )}
              Перевести
            </Button>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {['front', 'back'].map((side) => (
              <div key={side}>
                <Label className="text-sm text-[#86868B] mb-2 block">
                  {side === 'front' ? 'Аверс' : 'Реверс'}
                </Label>
                <div className={cn(
                  "relative aspect-square rounded-xl border-2 border-dashed transition-all",
                  "hover:border-[#0071E3] hover:bg-blue-50/50",
                  formData[`${side}_image`] ? "border-transparent" : "border-gray-200"
                )}>
                  {formData[`${side}_image`] ? (
                    <>
                      <img 
                        src={formData[`${side}_image`]} 
                        alt={side}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, [`${side}_image`]: '' }))}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                      {uploading[side] ? (
                        <Loader2 className="w-8 h-8 text-[#86868B] animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-[#86868B] mb-2" />
                          <span className="text-sm text-[#86868B]">Загрузить фото</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, side)}
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-full bg-[#F5F5F7] p-1 rounded-xl">
              <TabsTrigger value="basic" className="flex-1 rounded-lg">Основное</TabsTrigger>
              <TabsTrigger value="details" className="flex-1 rounded-lg">Детали</TabsTrigger>
              <TabsTrigger value="description" className="flex-1 rounded-lg">Описание</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Название *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Введите название"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Тип *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">Страна</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Россия"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Год</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Состояние</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="denomination">Номинал</Label>
                  <Input
                    id="denomination"
                    value={formData.denomination}
                    onChange={(e) => setFormData(prev => ({ ...prev, denomination: e.target.value }))}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Валюта номинала</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    placeholder="рублей"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchase_price">Цена покупки</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="current_value">Текущая стоимость</Label>
                  <Input
                    id="current_value"
                    type="number"
                    step="0.01"
                    value={formData.current_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_value: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="purchase_date">Дата покупки</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="material">Материал</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                    placeholder="Серебро"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Вес (г)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="diameter">Диаметр (мм)</Label>
                  <Input
                    id="diameter"
                    type="number"
                    step="0.01"
                    value={formData.diameter}
                    onChange={(e) => setFormData(prev => ({ ...prev, diameter: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="mint">Монетный двор</Label>
                  <Input
                    id="mint"
                    value={formData.mint}
                    onChange={(e) => setFormData(prev => ({ ...prev, mint: e.target.value }))}
                    placeholder="ММД"
                  />
                </div>
                <div>
                  <Label htmlFor="catalog_number">Каталожный номер</Label>
                  <Input
                    id="catalog_number"
                    value={formData.catalog_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, catalog_number: e.target.value }))}
                    placeholder="Y# 000"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="description" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Описание предмета..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="description_en">Описание (English)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                  placeholder="Description in English..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="notes">Заметки</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Личные заметки..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Теги</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Добавить тег"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Добавить
                  </Button>
                </div>
                {existingTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {existingTags.filter(t => !formData.tags.includes(t.name)).slice(0, 10).map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tags: [...prev.tags, tag.name] }))}
                        className="px-2 py-0.5 bg-[#F5F5F7] rounded-full text-xs text-[#86868B] hover:bg-[#0071E3] hover:text-white transition-colors"
                      >
                        + {tag.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#0071E3]/10 text-[#0071E3] rounded-full text-sm"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              className="bg-[#0071E3] hover:bg-[#0077ED] text-white"
            >
              {item ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}