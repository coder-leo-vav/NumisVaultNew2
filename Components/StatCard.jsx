/**
 * @file StatCard.jsx
 * @description Компонент карточки статистики для отображения метрик
 * @author Vododokhov Aleksey
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Компонент карточки статистики
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок карточки
 * @param {string|number} props.value - Основное значение
 * @param {string} [props.subtitle] - Подзаголовок
 * @param {React.Component} [props.icon] - Иконка (Lucide React)
 * @param {string} [props.trend] - Направление тренда ('up' или 'down')
 * @param {string} [props.trendValue] - Значение тренда
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Карточка статистики
 */
export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue,
  className 
}) {
  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50",
      "transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#86868B]">{title}</p>
          <p className="text-3xl font-semibold text-[#1D1D1F] tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-[#86868B]">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-[#F5F5F7] flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#1D1D1F]" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium",
            trend === 'up' ? 'text-green-600' : 'text-red-500'
          )}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-sm text-[#86868B]">за месяц</span>
        </div>
      )}
    </div>
  );
}