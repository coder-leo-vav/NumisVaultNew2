/**
 * @file EmptyState.jsx
 * @description Компонент пустого состояния для отображения когда нет данных
 * @author Vododokhov Aleksey
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const typeEmojis = {
  'coin': '🪙',
  'banknote': '💵',
  'medal': '🏅',
  'all': '📦'
};

const typeLabels = {
  'coin': 'монет',
  'banknote': 'банкнот',
  'medal': 'медалей',
  'all': 'предметов'
};

/**
 * Компонент пустого состояния
 * @param {Object} props - Свойства компонента
 * @param {string} [props.type='all'] - Тип предметов ('coin', 'banknote', 'medal', 'all')
 * @param {Function} props.onAdd - Обработчик добавления нового предмета
 * @returns {JSX.Element} Пустое состояние с кнопкой добавления
 */
export default function EmptyState({ type = 'all', onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 rounded-full bg-[#F5F5F7] flex items-center justify-center mb-6">
        <span className="text-5xl">{typeEmojis[type]}</span>
      </div>
      <h3 className="text-xl font-semibold text-[#1D1D1F] mb-2">
        Пока нет {typeLabels[type]}
      </h3>
      <p className="text-[#86868B] text-center max-w-sm mb-6">
        Начните создавать свою коллекцию, добавив первый предмет
      </p>
      <Button 
        onClick={onAdd}
        className="bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full px-6 h-11"
      >
        <Plus className="w-5 h-5 mr-2" />
        Добавить предмет
      </Button>
    </div>
  );
}