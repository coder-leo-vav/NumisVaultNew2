/**
 * @file CollectibleDetails.jsx
 * @description Страница детального просмотра коллекционного предмета
 * @author Vododokhov Aleksey
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Heart, 
  Pencil, 
  Share2, 
  Calendar, 
  MapPin, 
  Scale, 
  Ruler, 
  Building,
  Tag,
  FileText,
  Coins,
  Banknote,
  Medal
} from 'lucide-react';
import CollectibleForm from '@/components/collectibles/CollectibleForm';
import { useAppSettings } from '@/components/hooks/useAppSettings';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const conditionLabels = {
  'PR': 'Proof (PR)',
  'UNC': 'Uncirculated (UNC)',
  'AU': 'About Uncirculated (AU)',
  'XF': 'Extremely Fine (XF)',
  'VF': 'Very Fine (VF)',
  'F': 'Fine (F)',
  'VG': 'Very Good (VG)',
  'G': 'Good (G)',
  'AG': 'About Good (AG)',
  'FR': 'Fair (FR)',
  'PO': 'Poor (PO)'
};

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

/**
 * Страница детального просмотра предмета
 * @returns {JSX.Element} Страница с полной информацией о коллекционном предмете
 */
export default function CollectibleDetailsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [activeImage, setActiveImage] = useState('front');
  
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('id');

  const { formatPrice } = useAppSettings();
  const queryClient = useQueryClient();

  const { data: item, isLoading } = useQuery({
    queryKey: ['collectible', itemId],
    queryFn: async () => {
      const items = await base44.entities.Collectible.filter({ id: itemId });
      return items[0];
    },
    enabled: !!itemId
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Collectible.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectible', itemId] });
      queryClient.invalidateQueries({ queryKey: ['collectibles'] });
      setFormOpen(false);
    }
  });

  const handleSave = (data) => {
    updateMutation.mutate({ id: itemId, data });
  };

  const handleToggleFavorite = () => {
    updateMutation.mutate({ 
      id: itemId, 
      data: { is_favorite: !item.is_favorite } 
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-[#86868B]">Предмет не найден</p>
        <Link to={createPageUrl('Dashboard')}>
          <Button className="mt-4">Вернуться на главную</Button>
        </Link>
      </div>
    );
  }

  const TypeIcon = typeIcons[item.type];
  const category = categories.find(c => c.id === item.category_id);
  const images = [
    { key: 'front', url: item.front_image, label: 'Аверс' },
    { key: 'back', url: item.back_image, label: 'Реверс' }
  ].filter(img => img.url);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to={createPageUrl(item.type === 'coin' ? 'Coins' : item.type === 'banknote' ? 'Banknotes' : 'Medals')}
        className="inline-flex items-center gap-2 text-[#0071E3] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к списку
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            {images.length > 0 ? (
              <img 
                src={images.find(img => img.key === activeImage)?.url || images[0]?.url}
                alt={item.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F5F5F7]">
                <TypeIcon className="w-32 h-32 text-gray-300" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img) => (
                <button
                  key={img.key}
                  onClick={() => setActiveImage(img.key)}
                  className={cn(
                    "flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    activeImage === img.key 
                      ? "border-[#0071E3] shadow-lg" 
                      : "border-transparent hover:border-gray-200"
                  )}
                >
                  <img 
                    src={img.url} 
                    alt={img.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-sm text-[#0071E3] font-medium mb-2">
              <TypeIcon className="w-4 h-4" />
              {typeLabels[item.type]}
              {item.year && <span>• {item.year}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
              {item.name}
            </h1>
            {item.country && (
              <p className="text-lg text-[#86868B] mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {item.country}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={handleToggleFavorite}
              variant="outline"
              className={cn(
                "rounded-full",
                item.is_favorite && "bg-red-50 border-red-200 text-red-600"
              )}
            >
              <Heart className={cn("w-4 h-4 mr-2", item.is_favorite && "fill-current")} />
              {item.is_favorite ? 'В избранном' : 'В избранное'}
            </Button>
            <Button 
              onClick={() => setFormOpen(true)}
              className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
            <Button variant="outline" className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-br from-[#1D1D1F] to-[#2D2D2F] rounded-2xl p-6 text-white">
            <p className="text-white/60 text-sm mb-1">Текущая стоимость</p>
            <p className="text-3xl font-bold">
              {item.current_value ? formatPrice(item.current_value) : '—'}
            </p>
            {item.purchase_price && (
              <p className="text-white/60 text-sm mt-2">
                Цена покупки: {formatPrice(item.purchase_price)}
              </p>
            )}
          </div>

          {/* Status & Condition */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#F5F5F7]">
              {statusLabels[item.status] || 'В коллекции'}
            </Badge>
            {item.condition && (
              <Badge className="bg-[#0071E3]/10 text-[#0071E3] hover:bg-[#0071E3]/20">
                {conditionLabels[item.condition] || item.condition}
              </Badge>
            )}
            {category && (
              <Badge 
                className="hover:opacity-80"
                style={{ 
                  backgroundColor: `${category.color}20`, 
                  color: category.color 
                }}
              >
                {category.name}
              </Badge>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {item.denomination && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-[#86868B]">Номинал</p>
                <p className="font-semibold text-[#1D1D1F]">
                  {item.denomination} {item.currency}
                </p>
              </div>
            )}
            {item.material && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-[#86868B]">Материал</p>
                <p className="font-semibold text-[#1D1D1F]">{item.material}</p>
              </div>
            )}
            {item.weight && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-[#86868B]">
                  <Scale className="w-4 h-4" />
                  Вес
                </div>
                <p className="font-semibold text-[#1D1D1F]">{item.weight} г</p>
              </div>
            )}
            {item.diameter && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-[#86868B]">
                  <Ruler className="w-4 h-4" />
                  Диаметр
                </div>
                <p className="font-semibold text-[#1D1D1F]">{item.diameter} мм</p>
              </div>
            )}
            {item.mint && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-[#86868B]">
                  <Building className="w-4 h-4" />
                  Монетный двор
                </div>
                <p className="font-semibold text-[#1D1D1F]">{item.mint}</p>
              </div>
            )}
            {item.catalog_number && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-[#86868B]">
                  <FileText className="w-4 h-4" />
                  Каталожный номер
                </div>
                <p className="font-semibold text-[#1D1D1F]">{item.catalog_number}</p>
              </div>
            )}
            {item.purchase_date && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-[#86868B]">
                  <Calendar className="w-4 h-4" />
                  Дата покупки
                </div>
                <p className="font-semibold text-[#1D1D1F]">
                  {format(new Date(item.purchase_date), 'd MMMM yyyy', { locale: ru })}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div>
              <p className="text-sm text-[#86868B] mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Теги
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-[#F5F5F7] rounded-full text-sm text-[#1D1D1F]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-[#1D1D1F] mb-2">Описание</h3>
              <p className="text-[#86868B] whitespace-pre-wrap">{item.description}</p>
              {item.description_en && (
                <>
                  <h4 className="font-medium text-[#1D1D1F] mt-4 mb-2">English</h4>
                  <p className="text-[#86868B] whitespace-pre-wrap">{item.description_en}</p>
                </>
              )}
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
              <h3 className="font-semibold text-[#1D1D1F] mb-2">Заметки</h3>
              <p className="text-[#86868B] whitespace-pre-wrap">{item.notes}</p>
            </div>
          )}
        </div>
      </div>

      <CollectibleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={item}
        onSave={handleSave}
      />
    </div>
  );
}