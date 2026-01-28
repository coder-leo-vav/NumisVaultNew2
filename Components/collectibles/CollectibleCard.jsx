/**
 * @file CollectibleCard.jsx
 * @description Компонент карточки коллекционного предмета с превью и действиями
 * @author Vododokhov Aleksey
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, Star, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppSettings } from '../hooks/useAppSettings';

const conditionLabels = {
  'PR': 'Proof',
  'UNC': 'Uncirculated',
  'AU': 'About Uncirculated',
  'XF': 'Extremely Fine',
  'VF': 'Very Fine',
  'F': 'Fine',
  'VG': 'Very Good',
  'G': 'Good',
  'AG': 'About Good',
  'FR': 'Fair',
  'PO': 'Poor'
};

const typeLabels = {
  'coin': 'Монета',
  'banknote': 'Банкнота',
  'medal': 'Медаль'
};

/**
 * Компонент карточки коллекционного предмета
 * @param {Object} props - Свойства компонента
 * @param {Object} props.item - Данные предмета
 * @param {Function} [props.onEdit] - Обработчик редактирования
 * @param {Function} [props.onDelete] - Обработчик удаления
 * @param {Function} [props.onToggleFavorite] - Обработчик добавления/удаления из избранного
 * @param {boolean} [props.selected] - Флаг выбора предмета
 * @param {Function} [props.onSelect] - Обработчик выбора
 * @param {boolean} [props.selectionMode] - Режим множественного выбора
 * @returns {JSX.Element} Карточка предмета
 */
export default function CollectibleCard({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  selected,
  onSelect,
  selectionMode 
}) {
  const { formatPrice } = useAppSettings();

  return (
    <div className={cn(
      "group bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-300",
      "hover:shadow-lg hover:scale-[1.02]",
      selected ? "border-[#0071E3] ring-2 ring-[#0071E3]/20" : "border-gray-100/50"
    )}>
      <div className="relative aspect-square bg-[#F5F5F7]">
        {selectionMode && (
          <button
            onClick={() => onSelect(item.id)}
            className={cn(
              "absolute top-3 left-3 z-10 w-6 h-6 rounded-full border-2 transition-all",
              selected 
                ? "bg-[#0071E3] border-[#0071E3]" 
                : "bg-white/80 border-gray-300 hover:border-[#0071E3]"
            )}
          >
            {selected && (
              <svg className="w-full h-full text-white p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        )}
        
        <Link to={createPageUrl(`CollectibleDetails?id=${item.id}`)}>
          {item.front_image ? (
            <img 
              src={item.front_image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl text-gray-300">
                {item.type === 'coin' ? '🪙' : item.type === 'banknote' ? '💵' : '🏅'}
              </span>
            </div>
          )}
        </Link>

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFavorite?.(item)}
            className={cn(
              "w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
              item.is_favorite 
                ? "bg-red-500 text-white" 
                : "bg-white/80 text-gray-600 hover:bg-white"
            )}
          >
            <Heart className={cn("w-4 h-4", item.is_favorite && "fill-current")} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center hover:bg-white transition-all">
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit?.(item)}>
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(item)}
                className="text-red-600 focus:text-red-600"
              >
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {item.condition && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-xs font-medium text-[#1D1D1F]">
              {item.condition}
            </span>
          </div>
        )}
      </div>

      <Link to={createPageUrl(`CollectibleDetails?id=${item.id}`)} className="block p-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#0071E3] uppercase tracking-wide">
            {typeLabels[item.type]} {item.year && `• ${item.year}`}
          </p>
          <h3 className="font-semibold text-[#1D1D1F] line-clamp-1">{item.name}</h3>
          {item.country && (
            <p className="text-sm text-[#86868B]">{item.country}</p>
          )}
        </div>
        
        <div className="mt-3 flex items-end justify-between">
          <div>
            {item.current_value && (
              <p className="text-lg font-semibold text-[#1D1D1F]">
                {formatPrice(item.current_value)}
              </p>
            )}
            {item.denomination && (
              <p className="text-sm text-[#86868B]">
                {item.denomination} {item.currency}
              </p>
            )}
          </div>
          {item.tags?.length > 0 && (
            <div className="flex gap-1">
              {item.tags.slice(0, 2).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 bg-[#F5F5F7] rounded-full text-xs text-[#86868B]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}