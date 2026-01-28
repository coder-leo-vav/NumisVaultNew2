/**
 * @file ActivityHistory.jsx
 * @description Страница журнала истории изменений в коллекции
 * @author Vododokhov Aleksey
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  Download,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const actionIcons = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  import: Upload,
  export: Download
};

const actionLabels = {
  create: 'Создание',
  update: 'Изменение',
  delete: 'Удаление',
  import: 'Импорт',
  export: 'Экспорт'
};

const actionColors = {
  create: 'bg-green-100 text-green-600',
  update: 'bg-blue-100 text-blue-600',
  delete: 'bg-red-100 text-red-600',
  import: 'bg-purple-100 text-purple-600',
  export: 'bg-orange-100 text-orange-600'
};

/**
 * Страница истории изменений
 * @returns {JSX.Element} Страница с временной лентой всех действий с коллекцией
 */
export default function ActivityHistoryPage() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: () => base44.entities.ActivityLog.list('-created_date', 100),
  });

  // Group by date
  const groupedLogs = logs.reduce((acc, log) => {
    const date = format(new Date(log.created_date), 'd MMMM yyyy', { locale: ru });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight">
          История изменений
        </h1>
        <p className="text-[#86868B] mt-1">
          Журнал всех действий с коллекцией
        </p>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-[#86868B]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-2">
            История пуста
          </h3>
          <p className="text-[#86868B]">
            Здесь будут отображаться все действия с вашей коллекцией
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-[#86868B] mb-4 sticky top-0 bg-[#F5F5F7] py-2">
                {date}
              </h3>
              <div className="space-y-3">
                {dateLogs.map((log) => {
                  const Icon = actionIcons[log.action] || Clock;
                  return (
                    <div 
                      key={log.id}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        actionColors[log.action]
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-medium text-[#1D1D1F]">
                              {actionLabels[log.action]} {log.entity_type}
                            </p>
                            {log.entity_name && (
                              <p className="text-[#86868B] text-sm">
                                {log.entity_name}
                              </p>
                            )}
                            {log.details && (
                              <p className="text-[#86868B] text-sm mt-1">
                                {log.details}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-[#86868B] shrink-0">
                            {format(new Date(log.created_date), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}